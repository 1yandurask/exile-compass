// Показ в профиле Discord (Rich Presence): класс/асценданси, уровень, текущая зона.
// Связь — локальный канал Discord-клиента \\.\pipe\discord-ipc-N, без интернета и без библиотек.
// Кадр: int32 LE опкод, int32 LE длина, JSON. 0 — рукопожатие, 1 — команда, 2 — закрыть, 3/4 — ping/pong.
'use strict';

const net = require('net');
const { execFile } = require('child_process');
const { EventEmitter } = require('events');

const OP = { HANDSHAKE: 0, FRAME: 1, CLOSE: 2, PING: 3, PONG: 4 };

function encode(op, data) {
  const json = Buffer.from(JSON.stringify(data), 'utf8');
  const head = Buffer.alloc(8);
  head.writeInt32LE(op, 0);
  head.writeInt32LE(json.length, 4);
  return Buffer.concat([head, json]);
}

// Разбирает накопленный буфер на кадры; возвращает [кадры, остаток]
function decode(buf) {
  const frames = [];
  let off = 0;
  while (buf.length - off >= 8) {
    const op = buf.readInt32LE(off);
    const len = buf.readInt32LE(off + 4);
    if (buf.length - off - 8 < len) break;
    let data = null;
    try { data = JSON.parse(buf.subarray(off + 8, off + 8 + len).toString('utf8')); } catch { /* битый кадр */ }
    frames.push({ op, data });
    off += 8 + len;
  }
  return [frames, buf.subarray(off)];
}

const pipePath = (i) => (process.platform === 'win32'
  ? `\\\\?\\pipe\\discord-ipc-${i}`
  : `${process.env.XDG_RUNTIME_DIR || process.env.TMPDIR || '/tmp'}/discord-ipc-${i}`);

const assetKey = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Что показать. classes — из data/tree.json: [{ name, asc: [...] }].
 * cls — то, что игра пишет в скобках: базовый класс или асценданси.
 */
function activityFor({ cls, level, area, act, startedAt }, classes) {
  if (!cls) return null;
  const base = classes.find((c) => c.name === cls) || classes.find((c) => c.asc.includes(cls));
  const ascended = !!base && base.name !== cls;
  const a = {
    details: `${cls}${level ? ` · Level ${level}` : ''}`,
    assets: {
      large_image: assetKey(cls),
      large_text: ascended ? `${cls} (${base.name})` : cls,
    },
    instance: false,
  };
  if (ascended) {
    a.assets.small_image = assetKey(base.name);
    a.assets.small_text = base.name;
  }
  if (area) a.state = act ? `Act ${act} · ${area}` : area;
  if (startedAt) a.timestamps = { start: Math.floor(startedAt / 1000) };
  return a;
}

// Запущена ли игра: PathOfExile.exe, PathOfExile_x64.exe, PathOfExileSteam.exe, PathOfExile_KG.exe …
function gameRunning() {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') { resolve(false); return; }
    execFile('tasklist', ['/FI', 'IMAGENAME eq PathOfExile*', '/NH', '/FO', 'CSV'], { windowsHide: true, timeout: 8000 }, (err, out) => {
      resolve(!err && /"PathOfExile[^"]*\.exe"/i.test(String(out)));
    });
  });
}

class DiscordPresence extends EventEmitter {
  /**
   * @param o { clientId, connect?: (path) => socket, isGameRunning?: () => Promise<bool> }
   */
  constructor(o) {
    super();
    this.o = o;
    this.sock = null;
    this.ready = false;
    this.buf = Buffer.alloc(0);
    this.want = null; // активность, которую нужно показать (null — ничего)
    this.sent = undefined;
    this.status = 'off'; // off | waiting (игра или Discord не запущены) | on | error
    this.timer = null;
    this.gameSince = null;
    this.connecting = false;
  }

  setStatus(s) {
    if (this.status !== s) { this.status = s; this.emit('status', s); }
  }

  start(intervalMs = 15000) {
    this.stop();
    this.setStatus('waiting');
    this.tick();
    this.timer = setInterval(() => this.tick(), intervalMs);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    this.gameSince = null;
    this.disconnect();
    this.setStatus('off');
  }

  // Новые данные о персонаже/зоне
  update(info) {
    this.info = info;
    this.push();
  }

  async tick() {
    const running = await (this.o.isGameRunning || gameRunning)();
    if (!this.timer) return;
    if (running && !this.gameSince) this.gameSince = Date.now();
    if (!running) this.gameSince = null;
    if (running && !this.sock && !this.connecting) this.connect(0);
    this.push();
  }

  push() {
    const act = this.gameSince && this.info ? activityFor({ ...this.info, startedAt: this.gameSince }, this.o.classes || []) : null;
    this.want = act;
    if (!this.ready) return;
    const key = JSON.stringify(act);
    if (key === this.sent) return;
    this.sent = key;
    this.write(OP.FRAME, { cmd: 'SET_ACTIVITY', args: { pid: process.pid, activity: act }, nonce: `${Date.now()}-${Math.random()}` });
    this.setStatus(act ? 'on' : 'waiting');
  }

  write(op, data) {
    try { this.sock?.write(encode(op, data)); } catch { this.disconnect(); }
  }

  // Discord слушает discord-ipc-0 … discord-ipc-9 (несколько копий клиента)
  connect(i) {
    if (i > 9) { this.connecting = false; return; }
    this.connecting = true;
    const sock = (this.o.connect || net.createConnection)(pipePath(i));
    let opened = false;
    sock.once('error', () => { if (!opened) this.connect(i + 1); else this.disconnect(); });
    sock.once('connect', () => {
      opened = true;
      this.connecting = false;
      this.sock = sock;
      this.buf = Buffer.alloc(0);
      this.write(OP.HANDSHAKE, { v: 1, client_id: String(this.o.clientId) });
    });
    sock.on('data', (chunk) => this.onData(chunk));
    sock.on('close', () => { if (this.sock === sock) this.disconnect(); });
  }

  onData(chunk) {
    const [frames, rest] = decode(Buffer.concat([this.buf, chunk]));
    this.buf = rest;
    for (const f of frames) {
      if (f.op === OP.PING) this.write(OP.PONG, f.data);
      else if (f.op === OP.CLOSE) { this.setStatus('error'); this.emit('error-message', f.data?.message || 'Discord closed the connection'); this.disconnect(); }
      else if (f.op === OP.FRAME && f.data?.evt === 'READY') { this.ready = true; this.sent = undefined; this.push(); }
      else if (f.op === OP.FRAME && f.data?.evt === 'ERROR') this.emit('error-message', f.data?.data?.message || 'Discord error');
    }
  }

  disconnect() {
    const s = this.sock;
    this.sock = null;
    this.ready = false;
    this.sent = undefined;
    this.connecting = false;
    if (s) { try { s.destroy(); } catch { /* уже закрыт */ } }
  }
}

module.exports = { DiscordPresence, activityFor, assetKey, encode, decode, gameRunning, OP };
