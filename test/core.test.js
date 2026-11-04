'use strict';

// Разбор текста предмета (ядро Awakened PoE Trade) и правила PoE Price Check
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const core = require('../lib/core');
const R = require('../src/rules');

const D = path.join(__dirname, '..', 'data', 'en');
core.init(fs.readFileSync(path.join(D, 'items.ndjson'), 'utf8'), fs.readFileSync(path.join(D, 'stats.ndjson'), 'utf8'));

const OPTS = { league: 'Mirage', merchantOnly: true, collapseListings: 'api', activateStockFilter: false, searchStatRange: 10, useEn: true };
function load(name) {
  const r = core.parseClipboard(fs.readFileSync(path.join(__dirname, 'items', name), 'utf8'));
  assert.ok(r.isOk(), `${name}: ${r.error}`);
  const item = r.value;
  const preset = R.presetFor(core, item, OPTS);
  R.applyDefaults(item, preset);
  const chips = R.chipsFor(item, preset);
  const by = (re) => chips.find((c) => re.test(c.label));
  const query = () => R.finalizeRequest(core.createTradeRequest(preset.filters, preset.stats), preset, 'securable').query;
  return { item, preset, chips, by, query };
}

test('редкий доспех: важные свойства включены, сопротивления сложены (кроме хаоса), минимум 90%', () => {
  const { item, by, query } = load('rare-body.txt');
  assert.equal(item.rarity, 'Rare');
  assert.equal(item.info.refName, 'Vaal Regalia');
  const res = by(/total Elemental Resistance/);
  assert.equal(res.enabled, true);
  assert.equal(res.value, 94, 'огонь 39 + холод 25 + молния 30');
  assert.equal(res.min, Math.floor(94 * 0.9));
  assert.equal(by(/Chaos Resistance/).enabled, false, 'хаос — отдельно и выключен');
  assert.equal(by(/to Fire Resistance/).parent, res.id, 'огонь/холод/молния — в шторке под суммой');
  assert.equal(by(/to Fire Resistance/).enabled, false);
  assert.equal(by(/maximum Life/).enabled, true);
  assert.equal(by(/maximum Life/).min, 72, '90% от 81');
  assert.equal(by(/^Energy Shield/).enabled, true);
  assert.equal(by(/^Item level/).enabled, true, 'уровень предмета учитывается');
  assert.equal(by(/^Base: Vaal Regalia/).enabled, true);
  const q = query();
  assert.equal(q.status.option, 'securable', 'мгновенный выкуп');
  assert.equal(q.type, 'Vaal Regalia');
  assert.equal(q.filters.misc_filters.filters.ilvl.min, 84);
  const on = q.stats[0].filters.filter((f) => !f.disabled).map((f) => f.id);
  assert.deepEqual(on.sort(), ['pseudo.pseudo_total_elemental_resistance', 'pseudo.pseudo_total_life']);
});

test('уник: родные свойства без разброса выключены, с разбросом и чужие — включены', () => {
  const { item, by, query } = load('unique-body.txt');
  assert.equal(item.rarity, 'Unique');
  assert.equal(by(/faster start of Energy Shield/).enabled, false, 'фиксированное свойство уника');
  assert.equal(by(/faster start of Energy Shield/).min, 10, 'без разброса минимум = значение');
  assert.equal(by(/does not bypass/).enabled, false);
  assert.equal(by(/Lightning Resistance/).enabled, true, 'с разбросом 30–40');
  assert.equal(by(/Spell Damage/).enabled, true, 'импликит — не родное свойство уника');
  assert.equal(by(/Base Percentile/).enabled, false, 'дублирует щит');
  assert.equal(by(/^Linked sockets/).value, 6);
  const q = query();
  assert.equal(q.name, "Shavronne's Wrappings");
  assert.equal(q.filters.socket_filters.filters.links.min, 6);
});

test('камень: уровень, качество, corrupted', () => {
  const { by, query } = load('gem.txt');
  assert.equal(by(/^Gem level/).value, 20);
  assert.equal(by(/^Quality/).value, 20);
  assert.equal(by(/^Corrupted/).enabled, true);
  const q = query();
  assert.equal(q.type, 'Raise Spectre');
  assert.equal(q.filters.misc_filters.filters.corrupted.option, 'true');
});

test('правки из окна: выключить свойство, поменять Min/Max, снять corrupted', () => {
  const { preset, chips, item } = load('rare-ring.txt');
  const life = chips.find((c) => /maximum Life/.test(c.label));
  const res = chips.find((c) => /total Elemental Resistance/.test(c.label));
  const dex = chips.find((c) => /Dexterity/.test(c.label));
  R.applyEdits(preset, {
    [life.id]: { enabled: false },
    [res.id]: { enabled: true, min: 50, max: 70 },
    [dex.id]: { enabled: true },
    corrupted: { enabled: false },
    itemLevel: { enabled: true, min: 75, max: 86 },
    'stat:999': { enabled: true }, // такого на предмете нет — игнорируется
  });
  const q = R.finalizeRequest(core.createTradeRequest(preset.filters, preset.stats), preset, 'available').query;
  assert.equal(q.status.option, 'available', 'выкуп и лично');
  const f = Object.fromEntries(q.stats[0].filters.map((x) => [x.id, x]));
  assert.equal(f['pseudo.pseudo_total_life'].disabled, true);
  assert.deepEqual(JSON.parse(JSON.stringify(f['pseudo.pseudo_total_elemental_resistance'].value)), { min: 50, max: 70 });
  assert.equal(f['pseudo.pseudo_total_dexterity'].disabled, false);
  assert.equal(q.filters.misc_filters.filters.corrupted, undefined, 'corrupted не учитывается');
  assert.deepEqual(q.filters.misc_filters.filters.ilvl, { min: 75, max: 86 });
  assert.equal(R.chipsFor(item, preset).length, chips.length, 'новых плашек не появилось');
});

test('пометки: влияние, Пожиратель/Экзарх, закреплённое, крафт, осквернение, импликит', () => {
  const h = load('rare-helmet-influenced.txt');
  const b = (re) => h.by(re).badges;
  assert.deepEqual(b(/^Evasion Rating/), ['Shaper']);
  assert.deepEqual(b(/total to Chaos Resistance/), ['Hunter']);
  assert.deepEqual(b(/total Elemental Resistance/), ['Exarch', 'Crafted']);
  assert.equal(h.by(/total Elemental Resistance/).value, 32, 'крафт-сопротивление входит в сумму');
  assert.equal(h.chips.filter((c) => c.crafted || c.id === 'craftedRes').length, 0, 'ни отдельной строки, ни галочки');
  assert.equal(h.chips.find((c) => /total to Cold/.test(c.label)).value, 22);
  // Холод на шлеме только крафтовый — в поиске он всё равно обычное сопротивление (pseudo), не «крафт»
  const coldChip = h.chips.find((c) => /total to Cold/.test(c.label));
  R.applyEdits(h.preset, { [coldChip.id]: { enabled: true } });
  const hq = h.query();
  const used = hq.stats.flatMap((g) => g.filters.filter((f) => !f.disabled).map((f) => f.id));
  assert.ok(used.includes('pseudo.pseudo_total_cold_resistance'), used.join(','));
  assert.ok(!used.some((id) => id.startsWith('crafted.')), 'сопротивления не ищутся как крафт');
  assert.deepEqual(b(/total maximum Life/), ['Eater', 'Fractured']);
  assert.equal(h.chips.find((c) => c.tag === 'fractured').enabled, false, 'условие «именно закреплённое» выключено');
  assert.ok(h.chips.some((c) => c.label === 'Shaper influence') && h.chips.some((c) => c.label === 'Hunter influence'));
  const r = load('corrupted-ring.txt');
  assert.deepEqual(r.by(/increased maximum Life/).badges, ['Corrupted']);
  assert.deepEqual(r.by(/total Elemental Resistance/).badges, [], 'обычный импликит в сумме не помечаем');
  assert.equal(r.by(/^Corrupted$/).enabled, true);
  assert.deepEqual(load('unique-body.txt').by(/Spell Damage/).badges, ['Implicit']);
});

test('оружие: DPS по стихиям, доп. стрелы и уровни камней в заголовке', () => {
  const { item } = load('rare-bow.txt');
  const w = R.weaponInfo(item);
  assert.equal(w.phys, 384, '(120+360)/2 × 1.6');
  assert.equal(w.ele, 124, '(30 + 47.5) × 1.6');
  assert.deepEqual(w.parts, [{ element: 'Fire', dps: 48 }, { element: 'Lightning', dps: 76 }]);
  assert.deepEqual(R.highlights(item), ['Bow Attacks fire 2 additional Arrows']);
  assert.equal(R.weaponInfo(load('rare-body.txt').item), null, 'не оружие — без DPS');
  const helm = String(load('rare-helmet-influenced.txt').item.rawText);
  assert.ok(helm);
  const amulet = { category: 'Amulet', rawText: '{ Prefix }\n+1(1-2) to Level of all Skill Gems (crafted)\n' };
  assert.deepEqual(R.highlights(amulet), ['+1 to Level of all Skill Gems']);
  assert.deepEqual(R.highlights({ category: 'Gem', rawText: 'fires 2 additional Arrows' }), [], 'описание камня — не свойство');
});

test('шторка сопротивлений: каждое отдельное — под суммой, выключено', () => {
  const { chips, by } = load('rare-bow.txt');
  const total = by(/total Elemental Resistance/);
  assert.equal(total.value, 52);
  const kids = chips.filter((c) => c.parent === total.id && c.kind === 'stat');
  assert.equal(kids.length, 3, 'все три стихии, даже холод, которого нет');
  assert.deepEqual(kids.filter((c) => !c.absent).map((c) => c.value).sort(), [22, 30]);
  const cold = kids.find((c) => c.absent);
  assert.match(cold.label, /Cold/);
  assert.ok(kids.every((c) => !c.enabled));
  // Холода нет на предмете, но можно включить и задать Min/Max
  R.applyEdits(load('rare-bow.txt').preset, {});
  const bow = load('rare-bow.txt');
  const c2 = bow.chips.find((c) => /total to Cold/.test(c.label));
  R.applyEdits(bow.preset, { [c2.id]: { enabled: true, min: 30, max: 45 } });
  const bq = R.finalizeRequest(core.createTradeRequest(bow.preset.filters, bow.preset.stats), bow.preset, 'securable').query;
  assert.deepEqual(JSON.parse(JSON.stringify(bq.stats[0].filters.find((f) => f.id === 'pseudo.pseudo_total_cold_resistance').value)), { min: 30, max: 45 });
  const body = load('rare-body.txt');
  const t2 = body.by(/total Elemental Resistance/);
  assert.equal(body.chips.filter((c) => c.parent === t2.id).length, 3, 'огонь, холод, молния');
  // Включили одно сопротивление — оно в запросе
  const fire = body.chips.find((c) => c.parent === t2.id && /Fire/.test(c.label));
  R.applyEdits(body.preset, { [fire.id]: { enabled: true } });
  const q = R.finalizeRequest(core.createTradeRequest(body.preset.filters, body.preset.stats), body.preset, 'securable').query;
  assert.ok(q.stats[0].filters.some((f) => /fire_resistance/.test(f.id) && !f.disabled), JSON.stringify(q.stats));
});

test('гибридные и крафт-гибридные сопротивления прибавляются к каждой своей стихии и к хаосу', () => {
  const { chips, by } = load('rare-hybrid-ring.txt');
  assert.equal(by(/total Elemental Resistance/).value, 14 * 2 + 35 + 12, 'холод+молния считаются дважды, крафт холод+хаос — в холод');
  assert.equal(chips.find((c) => /total to Cold/.test(c.label)).value, 26);
  assert.equal(chips.find((c) => /total to Lightning/.test(c.label)).value, 49);
  assert.equal(by(/total to Chaos Resistance/).value, 12, 'крафт холод+хаос — и в хаос');
  assert.equal(chips.find((c) => c.id === 'craftedRes'), undefined);
});

test('цвета гнёзд: плашка рядом с corrupted, выключена, ищет по числу каждого цвета', () => {
  const bow = load('rare-bow.txt');
  const c = bow.chips.find((x) => x.id === 'sockets');
  assert.deepEqual(c.sockets, [['G', 'G', 'G', 'R', 'B', 'G']]);
  assert.equal(c.enabled, false);
  assert.equal(c.fields, false, 'менять нельзя');
  assert.equal(c.label, 'Socket colours: 1 red, 4 green, 1 blue');
  let q = bow.query();
  assert.equal(q.filters.socket_filters?.filters?.sockets?.g, undefined, 'выключено — в запросе нет');
  R.applyEdits(bow.preset, { sockets: { enabled: true } });
  q = bow.query();
  assert.deepEqual(q.filters.socket_filters.filters.sockets, { r: 1, g: 4, b: 1 });
  assert.equal(q.filters.socket_filters.filters.links.min, 6, 'связи остаются');
  assert.deepEqual(R.socketColors({ rawText: 'Sockets: R-G B W-W\n' }), { groups: [['R', 'G'], ['B'], ['W', 'W']], count: { r: 1, g: 1, b: 1, w: 2 } });
  assert.equal(R.socketColors({ rawText: 'Sockets: A A\n' }), null, 'только гнёзда бездны — без плашки');
  assert.equal(load('gem.txt').chips.find((x) => x.id === 'sockets'), undefined);
});
