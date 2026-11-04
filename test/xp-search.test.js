'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { safeZone, xpMultiplier, xpCard, levelWithoutPenalty, lowestFineArea } = require('../src/xp');
const S = require('../src/searches');

test('безопасная разница уровней', () => {
  assert.equal(safeZone(1), 3);
  assert.equal(safeZone(16), 4);
  assert.equal(safeZone(68), 7);
});

test('штраф опыта по формуле PoE 1', () => {
  assert.equal(xpMultiplier(20, 23), 1, 'в пределах безопасной разницы — без штрафа');
  assert.equal(xpMultiplier(20, 16), 1);
  // 30-й в зоне 20: разница 10, безопасно 4, сверх — 6 → ((35)/(35+6^2.5))^1.5
  assert.ok(Math.abs(xpMultiplier(30, 20) - (35 / (35 + 6 ** 2.5)) ** 1.5) < 1e-12);
  assert.ok(xpMultiplier(30, 20) < 0.5);
  assert.ok(xpMultiplier(12, 22) < xpMultiplier(12, 18), 'чем выше зона, тем больше штраф');
});

test('карточка: только при потере от 10%, и что делать', () => {
  assert.equal(xpCard(20, 24), null, 'разница 4 при безопасной 4');
  assert.equal(xpCard(20, 25, 0.1) === null, 1 - xpMultiplier(20, 25) < 0.1);
  const over = xpCard(40, 30);
  assert.equal(over.kind, 'xp');
  assert.match(over.title, /10 levels above this area/);
  assert.match(over.text, new RegExp(`Areas of level ${lowestFineArea(40)}\\+ give full XP`));
  const under = xpCard(10, 20);
  assert.match(under.title, /Area is 10 levels above you/);
  const need = levelWithoutPenalty(20, 10);
  assert.equal(xpMultiplier(need, 20), 1);
  assert.ok(xpMultiplier(need - 1, 20) < 1);
  assert.match(under.text, new RegExp(`No penalty from level ${need} \\(${need - 10} more\\)`));
  assert.equal(xpCard(null, 20), null, 'уровень неизвестен — молчим');
});

// Строка из программы → регулярное выражение, как его понимает поиск игры (без кавычек, без учёта регистра)
const toRe = (text) => new RegExp(text.replace(/^"|"$/g, ''), 'i');

test('одна общая строка под класс: связки, скорость, +1 к уровню на оружии класса; всё до 50 символов', () => {
  const lines = {
    link3: 'Sockets: R-G-B B',
    link2: 'Sockets: R-G B B',
    boots: '15% increased Movement Speed',
    totem: '20% increased Totem Placement speed',
    wand: '+1 to Level of all Fire Spell Skill Gems',
    staff: '+1 to Level of all Spell Skill Gems',
    sword: '+1 to Level of Socketed Melee Gems',
    bow: '+1 to Level of Socketed Bow Gems',
  };
  const all = (cls) => toRe(S.builtin(cls).find((x) => x.id === 'auto:all').text);
  const hits = (cls) => Object.keys(lines).filter((k) => all(cls).test(lines[k]));
  assert.deepEqual(hits('Witch'), ['link3', 'boots', 'wand', 'staff']);
  assert.deepEqual(hits('Ranger'), ['link3', 'boots', 'bow']);
  assert.deepEqual(hits('Marauder'), ['link3', 'boots', 'sword']);
  assert.deepEqual(hits('Templar'), ['link3', 'boots', 'wand', 'staff', 'sword']);
  assert.deepEqual(hits('Scion'), ['link3', 'boots', 'wand', 'staff', 'sword', 'bow']);
  assert.ok(!all('Witch').test(lines.totem), 'Totem Placement Speed не путается со скоростью передвижения');
  for (const c of Object.keys(S.CLASS_WEAPONS)) for (const x of S.builtin(c)) assert.ok(x.text.length <= S.MAX_LEN, `${c}: ${x.text} (${x.text.length})`);
  // Без класса — общая строка без оружия
  assert.equal(S.builtin('').find((x) => x.id === 'auto:all').text, '"-\\w-|movement sp"');
  assert.ok(!S.builtin('').some((x) => x.id === 'auto:gemlevel'));
});

test('отдельные строки: связки 3/4/5 и оружие класса', () => {
  const w = S.builtin('Witch');
  assert.deepEqual(w.map((x) => x.id), ['auto:all', 'auto:3link', 'auto:4link', 'auto:5link', 'auto:ms', 'auto:gemlevel']);
  const re4 = toRe(w[2].text);
  assert.ok(re4.test('Sockets: R-G-B-B'));
  assert.ok(!re4.test('Sockets: R-G-B B'));
  assert.ok(toRe(w[3].text).test('Sockets: R-G-B-B-B G'));
  assert.ok(!toRe(w[3].text).test('Sockets: R-G-B-B B-G'));
  assert.equal(S.builtin('Ranger').find((x) => x.id === 'auto:gemlevel').text, '"ted bow"');
});

test('свои строки: имя и не длиннее 50 символов', () => {
  assert.deepEqual(S.validate({ name: ' Rings ', text: '"life" "resist"' }), { name: 'Rings', text: '"life" "resist"' });
  assert.throws(() => S.validate({ name: '', text: 'x' }), /name/);
  assert.throws(() => S.validate({ name: 'a', text: 'x'.repeat(51) }), /up to 50/);
});
