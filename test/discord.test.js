'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const net = require('net');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { DiscordPresence, activityFor, encode, decode, OP } = require('../src/discord');

const CLASSES = require('../data/tree.json').classes;

test('что показывается: асценданси большой картинкой, класс маленькой', () => {
  const a = activityFor({ cls: 'Necromancer', level: 68, area: 'The Karui Fortress', act: 6, startedAt: 1700000000000 }, CLASSES);
  assert.equal(a.details, 'Necromancer · Level 68');
  assert.equal(a.state, 'Act 6 · The Karui Fortress');
  assert.deepEqual(a.assets, { large_image: 'necromancer', large_text: 'Necromancer (Witch)', small_image: 'witch', small_text: 'Witch' });
  assert.deepEqual(a.timestamps, { start: 1700000000 });
  const b = activityFor({ cls: 'Witch', level: 5, area: "Lioneye's Watch", act: 1 }, CLASSES);
  assert.deepEqual(b.assets, { large_image: 'witch', large_text: 'Witch' }, 'до возвышения — только класс');
  assert.equal(activityFor({ cls: '' }, CLASSES), null, 'персонаж неизвестен — ничего');
});

test('кадры протокола собираются и разбираются', () => {
  const buf = Buffer.concat([encode(1, { a: 1 }), encode(3, { b: 2 }), encode(1, { c: 3 }).subarray(0, 5)]);
  const [frames, rest] = decode(buf);
  assert.deepEqual(frames, [{ op: 1, data: { a: 1 } }, { op: 3, data: { b: 2 } }]);
  assert.equal(rest.length, 5);
});

test('связь с Discord: рукопожатие, активность, ping, игра закрыта — активность снята', async () => {
  // На Windows Node слушает только именованные каналы, на Linux/macOS — сокет-файл
  const sockPath = process.platform === 'win32'
    ? `\\\\.\\pipe\\poe-act-guide-test-${process.pid}-${Date.now()}`
    : path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'dc-')), 'ipc');
  const got = [];
  let client;
  let buf = Buffer.alloc(0);
  const server = net.createServer((c) => {
    client = c;
    c.on('data', (chunk) => {
      const [frames, rest] = decode(Buffer.concat([buf, chunk]));
      buf = rest;
      for (const f of frames) {
        got.push(f);
        if (f.op === OP.HANDSHAKE) c.write(encode(OP.FRAME, { cmd: 'DISPATCH', evt: 'READY', data: {} }));
      }
    });
  });
  await new Promise((r) => server.listen(sockPath, r));

  let running = true;
  const p = new DiscordPresence({
    clientId: '123456789012345678',
    classes: CLASSES,
    connect: () => net.createConnection(sockPath),
    isGameRunning: async () => running,
  });
  p.update({ cls: 'Necromancer', level: 68, area: 'The Coast', act: 1 });
  p.start(60);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await wait(200);
  assert.deepEqual(got[0], { op: OP.HANDSHAKE, data: { v: 1, client_id: '123456789012345678' } });
  const set = got.find((f) => f.data?.cmd === 'SET_ACTIVITY');
  assert.equal(set.data.args.activity.details, 'Necromancer · Level 68');
  assert.equal(p.status, 'on');

  // Новая зона — новая активность; одинаковая не отправляется повторно
  const n = got.length;
  p.update({ cls: 'Necromancer', level: 68, area: 'The Coast', act: 1 });
  await wait(30);
  assert.equal(got.length, n, 'без изменений — без отправки');
  p.update({ cls: 'Necromancer', level: 69, area: 'The Mud Flats', act: 1 });
  await wait(50);
  assert.equal(got.at(-1).data.args.activity.details, 'Necromancer · Level 69');

  // ping → pong
  client.write(encode(OP.PING, { x: 1 }));
  await wait(50);
  assert.ok(got.some((f) => f.op === OP.PONG && f.data.x === 1));

  // Игра закрыта — активность снимается
  running = false;
  await wait(200);
  assert.equal(got.at(-1).data.args.activity, null);
  assert.equal(p.status, 'waiting');

  p.stop();
  assert.equal(p.status, 'off');
  server.close();
});

test('Discord не запущен — ждём молча', async () => {
  const p = new DiscordPresence({
    clientId: '123456789012345678',
    classes: CLASSES,
    connect: () => net.createConnection(process.platform === 'win32' ? '\\\\.\\pipe\\no-such-discord-pipe' : path.join(os.tmpdir(), 'no-such-discord-pipe')),
    isGameRunning: async () => true,
  });
  p.update({ cls: 'Witch', level: 3 });
  p.start(1000);
  await new Promise((r) => setTimeout(r, 150));
  assert.equal(p.status, 'waiting');
  p.stop();
});
