'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { decodeCode, rawUrlFor, parseBuild, stageView, importBuild, parseItem, gemColour } = require('../src/pob');
const { parseXml, child } = require('../src/xml');
const { accelFromEvent, isRisky } = require('../src/hotkeys');

const FIX = path.join(__dirname, 'fixtures');
const xml = fs.readFileSync(path.join(FIX, 'witch.xml'), 'utf8').replace(/\r\n/g, '\n');
const code = fs.readFileSync(path.join(FIX, 'witch.code'), 'utf8');

test('XML: атрибуты, текст, сущности, самозакрывающиеся теги', () => {
  const d = parseXml('<?xml version="1.0"?><A x="1 &amp; 2"><B/><C>t &lt;3</C><!-- c --></A>');
  const a = child(d, 'A');
  assert.equal(a.attrs.x, '1 & 2');
  assert.equal(a.children.length, 2);
  assert.equal(child(a, 'C').text, 't <3');
});

test('код PoB разворачивается (URL-safe base64 + zlib)', () => {
  assert.equal(decodeCode(code), xml);
  assert.equal(decodeCode(`  ${code.slice(0, 50)}\n${code.slice(50)}  `), xml);
  assert.throws(() => decodeCode('hello'), /does not look/);
});

test('ссылки переводятся в адреса с «сырым» кодом', () => {
  assert.equal(rawUrlFor('https://pobb.in/AbC123'), 'https://pobb.in/AbC123/raw');
  assert.equal(rawUrlFor('https://pastebin.com/xYz789'), 'https://pastebin.com/raw/xYz789');
  assert.equal(rawUrlFor('https://pastebin.com/raw/xYz789'), 'https://pastebin.com/raw/xYz789');
  assert.equal(rawUrlFor('https://poe.ninja/pob/1a2b'), 'https://poe.ninja/pob/raw/1a2b');
  assert.equal(rawUrlFor('https://maxroll.gg/poe/build-guides/x'), null);
});

test('этапы из вариантов дерева; камни — из выбранного набора, по умолчанию активного в PoB', () => {
  const b = parseBuild(xml);
  assert.equal(b.className, 'Witch');
  assert.deepEqual(b.stages.map((s) => s.title), ['Act 1', 'Act 2-3', 'Act 4-5', 'Act 6-10']);
  assert.equal(stageView(b, 1).skillSetTitle, 'Act 1', 'активный набор в PoB — первый');
  assert.equal(stageView(b, 3).skillSetTitle, 'Act 1', 'этап дерева набор камней не меняет');
  const v = stageView(b, 1, { skillSet: 1 });
  assert.equal(v.skillSetTitle, 'Act 2-3');
  assert.equal(v.groups[0].gems[0].name, 'Summon Raging Spirit');
  assert.equal(v.groups[0].gems[1].name, 'Minion Damage Support');
  assert.ok(v.groups[0].gems[1].support);
  assert.ok(!v.groups.some((g) => g.gems.some((x) => x.name === 'Granted')), 'умения от предметов скрыты');
  assert.deepEqual(v.uniques.map((u) => u.name), ['Lifesprig', 'Goldrim', 'Tabula Rasa', 'Wanderlust'], 'редкие перчатки не попали, порядок по слотам');
  assert.equal(v.prevNodes.length, b.stages[0].nodes.length);
});

test('ручной выбор набора камней для этапа', () => {
  const b = parseBuild(xml);
  const v = stageView(b, 0, { skillSet: 3 });
  assert.equal(v.skillSetTitle, 'Act 6-10');
});

test('старый формат: <Skill> прямо в <Skills>, без названий наборов', () => {
  const old = `<PathOfBuilding><Build className="Marauder" ascendClassName="Juggernaut" level="12"/>
    <Skills><Skill slot="Weapon 1" enabled="true"><Gem nameSpec="Ground Slam" skillId="GroundSlam" enabled="true"/><Gem nameSpec="Ruthless" skillId="SupportRuthless" enabled="true"/><Gem nameSpec="Off" skillId="SupportX" enabled="false"/></Skill>
    <Skill enabled="false"><Gem nameSpec="Hidden" skillId="Hidden"/></Skill></Skills>
    <Tree activeSpec="2"><Spec title="Early" nodes="1,2" classId="1" ascendClassId="1"/><Spec title="" nodes="1,2,3" classId="1"/></Tree>
    <Items><Item id="1">Rarity: UNIQUE&#10;Redbeak&#10;Rusted Sword</Item><Slot name="Weapon 1" itemId="1"/><Slot name="Weapon 1 Swap" itemId="1"/></Items></PathOfBuilding>`;
  const b = parseBuild(old);
  assert.deepEqual(b.stages.map((s) => s.title), ['Early', 'Tree 2']);
  const v = stageView(b, 1);
  assert.deepEqual(v.groups[0].gems.map((g) => g.name), ['Ground Slam', 'Ruthless Support']);
  assert.equal(v.groups.length, 1);
  assert.deepEqual(v.uniques, [{ slot: 'Weapon 1', name: 'Redbeak', base: 'Rusted Sword' }], 'один набор предметов — остаётся на всех этапах');
  assert.deepEqual(stageView(b, 1, { itemSet: -1 }).uniques, [], 'вручную выбрано «None»');
});

test('набор камней не переключается вместе с деревом', () => {
  const x = `<PathOfBuilding><Build className="Ranger"/>
    <Skills activeSkillSet="2"><SkillSet id="1" title="A"><Skill><Gem nameSpec="One" skillId="One"/></Skill></SkillSet><SkillSet id="2" title="B"><Skill><Gem nameSpec="Two" skillId="Two"/></Skill></SkillSet></Skills>
    <Tree><Spec title="x" nodes="1"/><Spec title="y" nodes="1"/><Spec title="z" nodes="1"/></Tree></PathOfBuilding>`;
  const b = parseBuild(x);
  assert.deepEqual([0, 1, 2].map((i) => stageView(b, i).groups[0].gems[0].name), ['Two', 'Two', 'Two'], 'на всех этапах — активный набор PoB');
  assert.equal(stageView(b, 2, { skillSet: 0 }).groups[0].gems[0].name, 'One', 'пока игрок не выберет другой');
});

test('импорт: код, XML и понятные ошибки', async () => {
  assert.equal((await importBuild(code)).build.stages.length, 4);
  assert.equal((await importBuild(xml)).source, 'xml');
  await assert.rejects(() => importBuild(''), /Paste/);
  await assert.rejects(() => importBuild('https://maxroll.gg/poe/x'), /does not share/);
});

test('импорт по ссылке pobb.in', async () => {
  const real = global.fetch;
  let asked = '';
  global.fetch = async (url) => { asked = url; return new Response(code); };
  try {
    const { build } = await importBuild('https://pobb.in/Zz9');
    assert.equal(asked, 'https://pobb.in/Zz9/raw');
    assert.equal(build.ascendClassName, 'Necromancer');
  } finally {
    global.fetch = real;
  }
});

test('предмет PoB: редкость, имя, база, свойства', () => {
  const g = parseItem('Rarity: UNIQUE\nGoldrim\nLeather Cap\n+30% to all Elemental Resistances');
  assert.equal(g.name, 'Goldrim');
  assert.equal(g.base, 'Leather Cap');
  assert.deepEqual(g.explicit, ['+30% to all Elemental Resistances']);
  assert.equal(parseItem('garbage'), null);
  const magic = parseItem('Rarity: MAGIC\nSapphire Jewel of Fire\nImplicits: 0\n10% increased Fire Damage');
  assert.equal(magic.base, '');
  assert.deepEqual(magic.explicit, ['10% increased Fire Damage']);
  const es = parseItem('Rarity: RARE\nA\nCobalt Jewel\nItem Level: 80\nImplicits: 0\nEnergy Shield Recharge starts 10% faster');
  assert.deepEqual(es.explicit, ['Energy Shield Recharge starts 10% faster'], 'свойство, похожее на служебную строку, не теряется');
});

test('самоцветы из гнёзд дерева: по этапам, вариант уникального, значения диапазонов', () => {
  const b = parseBuild(xml);
  assert.deepEqual(stageView(b, 0).jewels, []);
  const rare = stageView(b, 2).jewels[0];
  assert.equal(rare.name, 'Gale Spark');
  assert.ok(stageView(b, 2).nodes.includes(rare.nodeId), 'гнездо самоцвета взято на этом этапе');
  assert.deepEqual(rare.explicit, ['+12 to Intelligence (crafted)', '14% increased Minion Damage', 'Minions have 8% increased maximum Life']);
  const eye = stageView(b, 3).jewels[0];
  assert.equal(eye.name, "Watcher's Eye");
  assert.deepEqual(eye.explicit, ['5% increased maximum Energy Shield']);
  assert.equal(eye.corrupted, true);
});

test('цвета камней из данных Path of Building', () => {
  const v = stageView(parseBuild(xml), 1);
  const colours = Object.fromEntries(v.groups.flatMap((g) => g.gems).map((g) => [g.name, g.colour]));
  assert.equal(colours['Summon Raging Spirit'], 'B');
  assert.equal(colours['Melee Splash Support'], 'R');
  assert.equal(colours['Minion Damage Support'], 'B');
  assert.equal(gemColour({ name: 'Vaal Haste' }), 'G');
  assert.equal(gemColour({ name: 'No Such Gem' }), '');
});

test('клавиши: сочетания, запрет Esc, предупреждение об одиночной букве', () => {
  assert.equal(accelFromEvent({ code: 'F6' }).accel, 'F6');
  assert.equal(accelFromEvent({ code: 'KeyG', ctrlKey: true, altKey: true }).accel, 'Ctrl+Alt+G');
  assert.equal(accelFromEvent({ code: 'Numpad5' }).accel, 'num5');
  assert.ok(accelFromEvent({ code: 'ShiftLeft', shiftKey: true }).pending);
  assert.match(accelFromEvent({ code: 'Escape' }).error, /Esc/);
  assert.equal(isRisky('G'), true);
  assert.equal(isRisky('Ctrl+G'), false);
});

test('данные дерева: асцендант и связи на месте, blighted-узлы убраны', () => {
  const t = require('../data/tree.json');
  const necro = Object.values(t.nodes).filter((n) => n.asc === 'Necromancer');
  assert.ok(necro.length > 10);
  assert.ok(!Object.values(t.nodes).some((n) => n.name === 'Hollow Effigy'));
  const ids = new Set(Object.keys(t.nodes));
  assert.ok(t.edges.every(([a, b]) => ids.has(a) && ids.has(b)));
});

test('квесты: 23 очка за квесты + 2 за бандитов, у каждого квеста есть зона', () => {
  const q = require('../data/quests.json');
  const total = q.acts.flatMap((a) => a.quests).reduce((s, x) => s + x.points, 0);
  assert.equal(total, 25);
  assert.ok(q.acts.flatMap((a) => a.quests).every((x) => x.zones?.length));
});
