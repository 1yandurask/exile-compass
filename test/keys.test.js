'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('events');
const { GameKeys, PS_SCRIPT } = require('../src/keys');

// Поддельный powershell: отвечает READY, на CHAT — заданным ответом
function fakeSpawn(answer, log) {
  return (cmd, args) => {
    log.push([cmd, args.slice(0, 5)]);
    const p = new EventEmitter();
    p.stdout = new EventEmitter();
    p.stdin = { write: (s) => { log.push(s.trim()); if (['CHAT', 'PASTE'].includes(s.trim())) setTimeout(() => p.stdout.emit('data', `${answer()}\r\n`), 5); }, end() {} };
    p.kill = () => {};
    setTimeout(() => p.stdout.emit('data', 'READY\r\n'), 1);
    return p;
  };
}

test('скрипт: Enter → Ctrl+V → Enter, только если впереди окно игры', () => {
  assert.match(PS_SCRIPT, /StartsWith\("PathOfExile"/);
  assert.match(PS_SCRIPT, /Chat\(\) \{[\s\S]*Tap\(0x0D\);[\s\S]*Ctrl\(0x56\);\s*Tap\(0x0D\)/, 'чат: Enter, Ctrl+V, Enter');
  assert.match(PS_SCRIPT, /Paste\(\) \{[\s\S]*Ctrl\(0x46\); Ctrl\(0x41\); Ctrl\(0x56\)/, 'поиск: Ctrl+F, Ctrl+A, Ctrl+V');
  assert.match(PS_SCRIPT, /'PASTE'/);
  assert.ok(Buffer.from(PS_SCRIPT, 'utf16le').toString('base64').length < 30000, 'влезает в командную строку');
});

test('команда уходит в постоянный процесс и возвращает ответ', async () => {
  const log = [];
  let ans = 'OK';
  const k = new GameKeys({ spawn: fakeSpawn(() => ans, log) });
  assert.equal(await k.chat(), 'OK');
  assert.equal(log[0][0], 'powershell.exe');
  assert.ok(log[0][1].includes('-NonInteractive'));
  ans = 'NOTGAME';
  assert.equal(await k.chat(), 'NOTGAME');
  assert.equal(log.filter((x) => x === 'CHAT').length, 2);
  ans = 'OK';
  assert.equal(await k.paste(), 'OK');
  assert.ok(log.includes('PASTE'));
  assert.equal(log.filter((x) => Array.isArray(x)).length, 1, 'процесс запускается один раз');
  k.stop();
});

test('один процесс на всё: копирование предмета, слежение за кликом мимо окна, фокус игре', async () => {
  assert.match(PS_SCRIPT, /Copy\(\) \{[\s\S]*Key\(0x11, true\); Key\(0x12, true\); Tap\(0x43\)/, 'Ctrl+Alt+C');
  for (const c of ["'COPY'", "'CHAT'", "'PASTE'", "'WATCH'", "'UNWATCH'", "'FOCUS'"]) assert.ok(PS_SCRIPT.includes(c), c);
  const log = [];
  const p = new EventEmitter();
  p.stdout = new EventEmitter();
  p.stdin = { write: (s) => { log.push(s.trim()); if (['COPY', 'FOCUS'].includes(s.trim())) setTimeout(() => p.stdout.emit('data', 'OK\n'), 2); }, end() {} };
  p.kill = () => {};
  const k = new GameKeys({ spawn: () => { setTimeout(() => p.stdout.emit('data', 'READY\n'), 1); return p; } });
  let outside = 0;
  k.on('outside', () => outside++);
  assert.equal(await k.copyItem(), 'OK');
  k.watch({ x: 10.4, y: 20, width: 100, height: 50 });
  assert.equal(log.at(-1), 'WATCH 10 20 110 70');
  p.stdout.emit('data', 'OUTSIDE\n');
  assert.equal(outside, 1, 'клик мимо — событие, а не ответ на команду');
  assert.equal(await k.focusGame(), 'OK');
  k.unwatch();
  assert.equal(log.at(-1), 'UNWATCH');
  k.stop();
});
