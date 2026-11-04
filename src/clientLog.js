// Слежение за Client.txt — журналом, который пишет сама игра. Читается только файл
// на диске: в игру программа не вмешивается (правила GGG это разрешают).
'use strict';

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

// ... [DEBUG Client 1234] Generating level 23 area "1_2_town" with seed 1
const GEN_RE = /Generating level (\d+) area "([^"]+)"/;
// ... [INFO Client 1234] : You have entered The Western Forest.
const ENTER_RE = /\] : You have entered (.+?)\.\s*$/;
// ... [INFO Client 1234] : MyWitch (Witch) is now level 12
const LEVEL_RE = /\] : (.+?) \(([A-Za-z]+)\) is now level (\d+)\s*$/;
// Любое сообщение игры после «] : » — для настраиваемых шаблонов (например, испытания Лабиринта)
const MSG_RE = /\] : (.+?)\s*$/;

function parseLine(line) {
  let m = GEN_RE.exec(line);
  if (m) return { type: 'generating', level: Number(m[1]), areaId: m[2] };
  m = ENTER_RE.exec(line);
  if (m) return { type: 'entered', zone: m[1] };
  m = LEVEL_RE.exec(line);
  if (m) return { type: 'level', name: m[1], cls: m[2], level: Number(m[3]) };
  m = MSG_RE.exec(line);
  if (m) return { type: 'message', text: m[1] };
  return null;
}

// Последнее повышение уровня в конце файла — чтобы знать уровень сразу после запуска.
// accept(ev) решает, наш ли это персонаж (по классу билда).
function lastLevel(file, accept = () => true, bytes = 8 * 1024 * 1024) {
  let fd;
  try {
    const size = fs.statSync(file).size;
    const len = Math.min(size, bytes);
    fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, size - len);
    const lines = buf.toString('utf8').split(/\r?\n/);
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!lines[i].includes('is now level')) continue;
      const ev = parseLine(lines[i]);
      if (ev?.type === 'level' && accept(ev)) return ev;
    }
  } catch { /* файла нет — уровень неизвестен */ } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  return null;
}

function candidatePaths() {
  const roots = [];
  for (const drive of ['C', 'D', 'E', 'F', 'G']) {
    roots.push(
      `${drive}:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile`,
      `${drive}:\\Program Files\\Grinding Gear Games\\Path of Exile`,
      `${drive}:\\Grinding Gear Games\\Path of Exile`,
      `${drive}:\\Program Files (x86)\\Steam\\steamapps\\common\\Path of Exile`,
      `${drive}:\\Program Files\\Steam\\steamapps\\common\\Path of Exile`,
      `${drive}:\\Steam\\steamapps\\common\\Path of Exile`,
      `${drive}:\\SteamLibrary\\steamapps\\common\\Path of Exile`,
      `${drive}:\\Games\\Path of Exile`,
      `${drive}:\\Epic Games\\PathOfExile`,
    );
  }
  return roots.map((r) => path.win32.join(r, 'logs', 'Client.txt'));
}

function findDefaultLog() {
  return candidatePaths().find((p) => {
    try { return fs.statSync(p).isFile(); } catch { return false; }
  }) || '';
}

// События: 'zone' { zone, level, areaId, prevAreaId } при входе в зону,
// 'level' { name, cls, level } при повышении уровня, 'message' { text, areaId } — прочие сообщения.
class ClientLogWatcher extends EventEmitter {
  constructor(file) {
    super();
    this.file = file;
    this.pos = 0;
    this.buf = '';
    this.timer = null;
    this.lastLevel = null;
    this.lastAreaId = null;
    this.areaId = null; // зона, в которой игрок сейчас
  }

  start() {
    this.pos = fs.statSync(this.file).size; // только новые строки
    this.timer = setInterval(() => this.poll(), 700);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  poll() {
    let size;
    try { size = fs.statSync(this.file).size; } catch { return; }
    if (size < this.pos) this.pos = 0; // файл очистили
    if (size === this.pos) return;
    const len = Math.min(size - this.pos, 4 * 1024 * 1024);
    const fd = fs.openSync(this.file, 'r');
    try {
      const chunk = Buffer.alloc(len);
      fs.readSync(fd, chunk, 0, len, this.pos);
      this.pos += len;
      this.buf += chunk.toString('utf8');
    } finally {
      fs.closeSync(fd);
    }
    const lines = this.buf.split(/\r?\n/);
    this.buf = lines.pop();
    for (const line of lines) this.feed(line);
  }

  feed(line) {
    const ev = parseLine(line);
    if (!ev) return;
    if (ev.type === 'generating') {
      this.lastLevel = ev.level;
      this.lastAreaId = ev.areaId;
    } else if (ev.type === 'entered') {
      const prevAreaId = this.areaId;
      this.areaId = this.lastAreaId;
      this.emit('zone', { zone: ev.zone, level: this.lastLevel, areaId: this.lastAreaId, prevAreaId });
    } else if (ev.type === 'level') {
      this.emit('level', ev);
    } else {
      this.emit('message', { text: ev.text, areaId: this.areaId });
    }
  }
}

module.exports = { parseLine, lastLevel, findDefaultLog, ClientLogWatcher };
