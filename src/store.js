// Надёжное хранение настроек и билдов: запись через временный файл и переименование
// (файл не остаётся наполовину записанным, если выключили свет или программа упала),
// и запасная копия .bak — если основной файл всё-таки испорчен, читаем её.
'use strict';

const fs = require('fs');
const path = require('path');

function readJson(file, fallback) {
  for (const f of [file, `${file}.bak`]) {
    try {
      const text = fs.readFileSync(f, 'utf8');
      if (text.trim()) return JSON.parse(text);
    } catch { /* нет файла или испорчен — пробуем запасной */ }
  }
  return fallback;
}

function writeJson(file, data, pretty = false) {
  const text = JSON.stringify(data, null, pretty ? 2 : 0);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, text);
  // Прежняя целая версия — в запасную копию
  try { if (fs.statSync(file).size > 0) fs.copyFileSync(file, `${file}.bak`); } catch { /* файла ещё нет */ }
  try {
    fs.renameSync(tmp, file);
  } catch {
    // Файл держит антивирус или другой процесс — пишем напрямую
    fs.writeFileSync(file, text);
    try { fs.unlinkSync(tmp); } catch { /* уже нет */ }
  }
}

// Журнал ошибок в папке программы (не больше ~1 МБ): по нему можно понять, что пошло не так
function errorLog(dir) {
  const file = path.join(dir, 'error.log');
  return (where, err) => {
    try {
      fs.mkdirSync(dir, { recursive: true });
      try { if (fs.statSync(file).size > 1024 * 1024) fs.renameSync(file, `${file}.old`); } catch { /* нет файла */ }
      const msg = err && err.stack ? err.stack : String(err);
      fs.appendFileSync(file, `[${new Date().toISOString()}] ${where}: ${msg}\n`);
    } catch { /* записать не вышло — не страшно */ }
  };
}

// fetch с ограничением по времени: зависший сайт не должен вешать окно навсегда
function withTimeout(fetchFn, ms = 15000) {
  return async (url, init = {}) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      return await fetchFn(url, { ...init, signal: init.signal || ctrl.signal });
    } catch (e) {
      if (ctrl.signal.aborted) throw new Error('The site did not answer in time. Check your internet connection and try again.');
      throw e;
    } finally {
      clearTimeout(timer);
    }
  };
}

module.exports = { readJson, writeJson, errorLog, withTimeout };
