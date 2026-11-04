'use strict';

// Надёжность: запись настроек, испорченный файл, зависший сайт, заблокированный PowerShell, занятый журнал игры
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { EventEmitter } = require('events');
const store = require('../src/store');
const { GameKeys } = require('../src/keys');
const { ClientLogWatcher } = require('../src/clientLog');

const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'compass-robust-'));

test('настройки: запись целиком, испорченный файл — берём запасную копию', () => {
  const dir = tmpDir();
  const f = path.join(dir, 'settings.json');
  store.writeJson(f, { a: 1 });
  store.writeJson(f, { a: 2 });
  assert.deepEqual(store.readJson(f, null), { a: 2 });
  assert.ok(!fs.existsSync(`${f}.tmp`), 'временный файл не остаётся');
  fs.writeFileSync(f, '{"a": 3, обрыв'); // свет выключили на середине записи
  assert.deepEqual(store.readJson(f, null), { a: 1 }, 'прочитана запасная копия');
  fs.writeFileSync(f, '');
  assert.deepEqual(store.readJson(f, { def: true }), { a: 1 });
  assert.deepEqual(store.readJson(path.join(dir, 'нет.json'), { def: true }), { def: true });
});

test('журнал ошибок не растёт бесконечно', () => {
  const dir = tmpDir();
  const log = store.errorLog(dir);
  fs.writeFileSync(path.join(dir, 'error.log'), 'x'.repeat(1024 * 1024 + 10));
  log('test', new Error('boom'));
  assert.ok(fs.statSync(path.join(dir, 'error.log')).size < 2000);
  assert.ok(fs.existsSync(path.join(dir, 'error.log.old')));
});

test('зависший сайт: запрос обрывается по времени с понятной ошибкой', async () => {
  const hang = (_u, init) => new Promise((_r, reject) => init.signal.addEventListener('abort', () => reject(new Error('aborted'))));
  await assert.rejects(() => store.withTimeout(hang, 50)('https://x'), /did not answer in time/);
  const ok = await store.withTimeout(async () => 'fine', 50)('https://x');
  assert.equal(ok, 'fine');
});

test('PowerShell заблокирован: после трёх неудач — BLOCKED, без бесконечных перезапусков', async () => {
  let spawned = 0;
  const k = new GameKeys({
    spawn: () => {
      spawned++;
      const p = new EventEmitter();
      p.stdout = new EventEmitter();
      p.stdin = { write() {}, end() {} };
      p.kill = () => {};
      setTimeout(() => p.emit('exit', 1), 2); // сразу закрылся, не сказав READY
      return p;
    },
  });
  const r = [];
  for (let i = 0; i < 4; i++) r.push(await k.copyItem(200));
  assert.deepEqual(r.slice(-2), ['BLOCKED', 'BLOCKED']);
  assert.equal(spawned, 3, 'после третьей неудачи больше не запускаем');
  k.watch({ x: 0, y: 0, width: 1, height: 1 }); // не падает
});

test('журнал игры занят или пропал — слежение не падает', () => {
  const dir = tmpDir();
  const f = path.join(dir, 'Client.txt');
  fs.writeFileSync(f, 'start\n');
  const w = new ClientLogWatcher(f);
  w.start();
  w.stop();
  const zones = [];
  w.on('zone', (z) => zones.push(z.zone));
  fs.appendFileSync(f, '2026/11/04 10:00:00 1 abc [INFO Client 1] : You have entered Lioneye\'s Watch.\n');
  w.poll();
  assert.deepEqual(zones, ["Lioneye's Watch"]);
  fs.unlinkSync(f);
  assert.doesNotThrow(() => w.poll(), 'файла нет — тихо ждём');
  fs.writeFileSync(f, 'x'.repeat(10));
  assert.doesNotThrow(() => w.poll(), 'файл пересоздан короче — читаем с начала');
});
