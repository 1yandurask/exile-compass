'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { actsForLevel, buildIndex, lookup, cardsFor } = require('../src/zones');
const { parseLine, ClientLogWatcher } = require('../src/clientLog');

const index = buildIndex(require('../data/quests.json'), require('../data/labyrinth.json'), require('../data/secrets.json'));
const names = (list) => list.map((e) => (e.kind === 'quest' ? e.quest.name : e.kind === 'secret' ? `Secret: ${e.secret.title}` : `Trial of ${e.trial.trial}`));

test('уровень зоны → акт', () => {
  assert.deepEqual([...actsForLevel(19)], [2]);
  assert.deepEqual([...actsForLevel(48)], [6]);
  assert.deepEqual([...actsForLevel(13)].sort(), [1, 2], 'на границе подходят оба акта');
});

test('одна зона в разных актах различается по уровню', () => {
  assert.deepEqual(names(lookup(index, 'The Wetlands', 19)), ['Deal with the Bandits — kill all three']);
  assert.deepEqual(names(lookup(index, 'The Wetlands', 48)), ['The Puppet Mistress']);
  assert.deepEqual(names(lookup(index, 'The Control Blocks', 41)), ['In Service to Science']);
  assert.deepEqual(names(lookup(index, 'The Control Blocks', 66)), ["Vilenta's Vengeance"]);
  assert.deepEqual(names(lookup(index, 'The Lower Prison', 8)), ['Trial of Piercing Truth']);
  assert.equal(lookup(index, 'The Lower Prison', 47)[0].act, 6);
  assert.deepEqual(names(lookup(index, 'The Forest Encampment', 23)), [], 'город 2 акта молчит');
  assert.deepEqual(names(lookup(index, 'The Ashen Fields', 52)), ['The Master of a Million Faces']);
});

test('в зоне может быть и квест, и испытание; без уровня — только однозначные зоны', () => {
  assert.deepEqual(names(lookup(index, 'The Western Forest', 17)).sort(), ['Deal with the Bandits — kill all three', 'The Way Forward']);
  assert.deepEqual(names(lookup(index, 'The Sewers', null)), ["Victario's Secrets"]);
  assert.deepEqual(lookup(index, 'The Wetlands', null), [], 'неоднозначная зона без уровня молчит');
  assert.deepEqual(lookup(index, 'Lioneye\'s Watch', 13), []);
  assert.equal(lookup(index, "Prisoner's Gate", 47)[0].quest.name, 'The Cloven One');
});

test('карточки: жёлтая для квеста, зелёная для Лабиринта, выполненные не показываются', () => {
  const cards = cardsFor(lookup(index, 'The Crypt Level 1', 17));
  assert.deepEqual(cards.map((c) => c.kind), ['lab']);
  const w = cardsFor(lookup(index, 'The Western Forest', 17));
  assert.equal(w.length, 2);
  assert.match(w.find((c) => c.title === 'The Way Forward').label, /\+1 passive point — Act 2/);
  assert.equal(cardsFor(lookup(index, 'The Western Forest', 17), new Set(['2:The Way Forward'])).length, 1);
});

test('журнал: строки игры и уровень зоны перед входом', () => {
  assert.deepEqual(parseLine('2026/11/04 01:00:00 1 abc [DEBUG Client 7] Generating level 17 area "1_2_9" with seed 1'), { type: 'generating', level: 17, areaId: '1_2_9' });
  assert.deepEqual(parseLine('2026/11/04 01:00:01 1 abc [INFO Client 7] : You have entered The Western Forest.'), { type: 'entered', zone: 'The Western Forest' });
  assert.equal(parseLine('2026/11/04 01:00:01 1 abc [INFO Client 7] #Player: You have entered The Western Forest.'), null, 'сообщение в чате не считается');
  const w = new ClientLogWatcher('x');
  const got = [];
  w.on('zone', (z) => got.push(z));
  w.feed('[DEBUG Client 7] Generating level 48 area "2_6_5" with seed 1');
  w.feed('[INFO Client 7] : You have entered The Wetlands.');
  assert.deepEqual(got, [{ zone: 'The Wetlands', level: 48, areaId: '2_6_5', prevAreaId: null }]);
});

test('секретные комнаты: свои карточки, третьим цветом и после квестов', () => {
  assert.deepEqual(names(lookup(index, 'The Belly of the Beast Level 1', 38)), ['Secret: The Belly of the Beast Level 1']);
  const karui = cardsFor(lookup(index, 'The Karui Fortress', 46));
  assert.deepEqual(karui.map((c) => c.kind), ['quest', 'secret']);
  const tunnel = cardsFor(lookup(index, 'The Tunnel', 62));
  assert.deepEqual(tunnel.map((c) => c.kind), ['lab', 'secret']);
  assert.equal(tunnel[1].label, 'Secret room — Act 9');
  assert.deepEqual(lookup(index, 'The Belly of the Beast', 63), [], 'зона 9 акта с похожим названием — не та');
});
