'use strict';

// Уровень из журнала, точный акт по id зоны, подсказки про соседние зоны, камни у продавцов
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildIndex, lookup, nearby, cardsFor } = require('../src/zones');
const { parseLine, lastLevel } = require('../src/clientLog');
const G = require('../src/gems');

const AREAS = require('../data/areas.json');
const index = buildIndex(require('../data/quests.json'), require('../data/labyrinth.json'), require('../data/secrets.json'), AREAS);
const idx = G.indexVendors(require('../data/gem-vendors.json'));
const idOf = (name, act) => Object.keys(AREAS).find((id) => AREAS[id].name === name && AREAS[id].act === act);

test('строка о повышении уровня', () => {
  assert.deepEqual(parseLine('2026/11/04 01:00:00 1 abc [INFO Client 7] : MyWitch (Necromancer) is now level 34'),
    { type: 'level', name: 'MyWitch', cls: 'Necromancer', level: 34 });
  assert.equal(parseLine('2026/11/04 01:00:00 1 abc [INFO Client 7] : You have entered The Coast.').type, 'entered');
  assert.equal(parseLine('2026/11/04 01:00:00 1 abc [INFO Client 7] : Something happened').type, 'message');
});

test('последний уровень своего класса из конца журнала', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lvl-')), 'Client.txt');
  fs.writeFileSync(f, [
    '[INFO Client 1] : A (Witch) is now level 10',
    '[INFO Client 1] : A (Witch) is now level 11',
    '[INFO Client 1] : B (Marauder) is now level 40',
    '[INFO Client 1] : You have entered The Coast.',
  ].join('\r\n'));
  assert.equal(lastLevel(f).level, 40);
  assert.equal(lastLevel(f, (e) => ['Witch', 'Necromancer'].includes(e.cls)).level, 11);
  assert.equal(lastLevel(path.join(os.tmpdir(), 'nope.txt')), null);
});

test('все зоны квестов и испытаний есть в карте зон', () => {
  for (const [k, entries] of index) {
    for (const e of entries) {
      if (e.kind === 'secret') continue;
      const ok = Object.values(AREAS).some((a) => a.act === e.act && a.name.toLowerCase().replace(/^the /, '') === k);
      assert.ok(ok, `${e.act} ${k}`);
    }
  }
});

test('акт по id зоны точнее уровня', () => {
  // The Lower Prison 1 акта на уровне 13 — граница актов 1 и 2, но id однозначен
  assert.deepEqual(lookup(index, 'The Lower Prison', 13, idOf('The Lower Prison', 1)).map((e) => e.act), [1]);
  assert.deepEqual(lookup(index, 'The Wetlands', null, idOf('The Wetlands', 6)).map((e) => e.quest.name), ['The Puppet Mistress']);
});

test('соседняя зона: подсказка «туда», но не обратно и не про выполненное', () => {
  const prison = idOf('The Climb', 1);
  const near = nearby(index, prison, null);
  assert.ok(near.some((e) => e.kind === 'lab' && e.near === 'The Lower Prison'));
  // Пришли из The Lower Prison — про неё не напоминаем
  assert.ok(!nearby(index, prison, idOf('The Lower Prison', 1)).some((e) => e.near === 'The Lower Prison'));
  // Испытание отмечено — молчим
  assert.ok(!nearby(index, prison, null, new Set(['1:Piercing Truth'])).some((e) => e.kind === 'lab'));
  const cards = cardsFor(near);
  const c = cards.find((x) => x.near && x.kind === 'lab');
  assert.equal(c.title, '→ The Lower Prison');
  assert.equal(c.text, 'Trial of Piercing Truth');
});

test('карточки: сначала то, что здесь, потом соседние зоны; пройденные испытания молчат', () => {
  const id = idOf('The Western Forest', 1) || idOf('The Western Forest', 2);
  const here = lookup(index, 'The Western Forest', null, id);
  const cards = cardsFor([...here, ...nearby(index, id, null)]);
  const firstNear = cards.findIndex((c) => c.near);
  assert.ok(firstNear === -1 || cards.slice(firstNear).every((c) => c.near));
  assert.deepEqual(cardsFor(lookup(index, 'The Crypt Level 1', 17), new Set(['2:Swirling Fear'])), []);
});

test('камни: город, класс, уровень, уже купленные', () => {
  const gems = [{ name: 'Frostblink', gemId: 'Metadata/Items/Gems/SkillGemFrostblink' }, { name: 'Arcane Surge Support', gemId: '' }, { name: 'Fireball', gemId: 'Metadata/Items/Gems/SkillGemFireball' }];
  const witch = G.gemsToBuy(idx, gems, { className: 'Witch', level: 10, act: 1 });
  assert.ok(witch.length > 0 && witch.every((g) => g.npc === 'Nessa'));
  assert.deepEqual(G.gemsToBuy(idx, gems, { className: 'Witch', level: 10, act: 5 }), [], 'в 5 акте продавца камней нет');
  assert.deepEqual(G.gemsToBuy(idx, gems, { className: 'Witch', level: null, act: 1 }), [], 'уровень неизвестен — молчим');
  const lilly = G.gemsToBuy(idx, gems, { className: 'Marauder', level: 60, act: 8 });
  assert.deepEqual(lilly.map((g) => [g.name, g.npc]), [['Frostblink', 'Lilly Roth'], ['Fireball', 'Lilly Roth']], 'Лилли продаёт любому классу');
  assert.deepEqual(G.gemsToBuy(idx, gems, { className: 'Marauder', level: 10, act: 1 }).map((g) => g.name), ['Frostblink', 'Fireball'], 'Nessa не продаёт Arcane Surge марадёру');
  assert.ok(G.gemsToBuy(idx, gems, { className: 'Marauder', level: 30, act: 3 }).some((g) => g.name === 'Arcane Surge Support' && g.npc === 'Siosa'));
  // Уровень камня выше уровня персонажа
  const high = Object.values(require('../data/gem-vendors.json')).find((g) => g.level >= 30);
  assert.deepEqual(G.gemsToBuy(idx, [{ name: high.name }], { className: 'Witch', level: 20, act: 6 }), []);
  assert.equal(G.gemsToBuy(idx, [{ name: high.name }], { className: 'Witch', level: high.level, act: 6 }).length, 1);
  // Купленный не предлагается
  const k = witch[0].key;
  assert.ok(!G.gemsToBuy(idx, gems, { className: 'Witch', level: 10, act: 1, shop: { [k]: { bought: true } } }).some((g) => g.key === k));
});

test('после трёх напоминаний камень считается купленным', () => {
  const list = [{ key: 'frostblink' }];
  let shop = {};
  shop = G.countShown(shop, list);
  shop = G.countShown(shop, list);
  assert.equal(shop.frostblink.bought, false);
  shop = G.countShown(shop, list);
  assert.deepEqual(shop.frostblink, { seen: 3, bought: true });
  const cards = G.gemCards([{ name: 'Frostblink', npc: 'Nessa', quest: 'Mercy Mission' }, { name: 'Holy Flame Totem', npc: 'Nessa', quest: 'Mercy Mission' }], 1);
  assert.deepEqual(cards.map((c) => [c.kind, c.title]), [['gem', 'Frostblink, Holy Flame Totem']]);
});

test('награда за квест: бесплатный камень отдельно, один камень на набор наград, остальное — купить', () => {
  const g = (name, support = false) => ({ name, gemId: '', support });
  const gems = [g('Minion Damage Support', true), g('Raise Zombie'), g('Freezing Pulse'), g('Frostblink'), g('Summon Raging Spirit'), g('Contagion')];
  const t = G.gemsForTown(idx, gems, { className: 'Witch', level: 10, act: 1 });
  const q = Object.fromEntries(t.quest.map((x) => [x.name, `${x.npc} / ${x.quest}`]));
  // Raise Zombie и Freezing Pulse — из одного набора «Enemy at the Gate»: наградой только первый
  assert.equal(q['Raise Zombie'], 'Tarkleigh / Enemy at the Gate');
  assert.ok(!q['Freezing Pulse'], 'второй камень из того же набора наград — не бесплатно');
  assert.ok(t.buy.some((x) => x.name === 'Freezing Pulse' && x.npc === 'Nessa'), '…его предлагается купить');
  assert.equal(q.Frostblink, 'Tarkleigh / Breaking Some Eggs');
  assert.equal(q['Summon Raging Spirit'], 'Tarkleigh / Breaking Some Eggs', 'другой набор того же квеста');
  assert.ok(!q.Contagion && t.buy.some((x) => x.name === 'Contagion'), 'набор SRS/Contagion уже занят');
  assert.equal(q['Minion Damage Support'], 'Nessa / The Caged Brute', 'поддержка — тоже наградой, если её набор свободен');
  // Купленные/отмеченные не показываются; уровень не дорос — тоже
  const t2 = G.gemsForTown(idx, gems, { className: 'Witch', level: 3, act: 1, shop: { 'raise zombie': { bought: true } } });
  assert.ok(!t2.quest.some((x) => x.name === 'Raise Zombie'));
  assert.ok(![...t2.quest, ...t2.buy].some((x) => x.name === 'Frostblink'), 'Frostblink с 4 уровня');
  // Награды другого акта в этом городе не предлагаются
  const t3 = G.gemsForTown(idx, gems, { className: 'Witch', level: 30, act: 3 });
  assert.deepEqual(t3.quest.filter((x) => x.name === 'Raise Zombie'), []);
  const cards = G.questGemCards(t.quest.slice(0, 1), 1);
  assert.equal(cards[0].kind, 'questgem');
  assert.match(cards[0].text, /Take it from Tarkleigh as the reward for “Enemy at the Gate”/);
});
