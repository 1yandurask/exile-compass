// Делает тестовый билд PoB на реальных узлах дерева: Witch → Necromancer,
// четыре этапа по актам. Пишет test/fixtures/witch.xml и witch.code.
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const tree = require('../data/tree.json');

const adj = new Map();
for (const [a, b] of tree.edges) {
  if (!adj.has(a)) adj.set(a, []);
  if (!adj.has(b)) adj.set(b, []);
  adj.get(a).push(b);
  adj.get(b).push(a);
}

const start = Object.entries(tree.nodes).find(([, n]) => n.t === 'S' && n.cls === 3)[0]; // Witch
const isMain = (id) => !tree.nodes[id].asc;

function pathTo(from, target) {
  const prev = new Map([[from, null]]);
  const q = [from];
  while (q.length) {
    const cur = q.shift();
    if (cur === target) break;
    for (const nb of adj.get(cur) || []) {
      if (prev.has(nb) || !isMain(nb) || tree.nodes[nb].t === 'S') continue;
      prev.set(nb, cur);
      q.push(nb);
    }
  }
  const out = [];
  for (let c = target; c && c !== from; c = prev.get(c)) out.push(c);
  return out;
}

// Ближайшие к старту ведьмы notable — цели прокачки
const sx = tree.nodes[start].x;
const sy = tree.nodes[start].y;
const targets = Object.entries(tree.nodes)
  .filter(([, n]) => n.t === 'N' && !n.asc && !n.mco)
  .sort(([, a], [, b]) => Math.hypot(a.x - sx, a.y - sy) - Math.hypot(b.x - sx, b.y - sy))
  .map(([id]) => id);

const alloc = new Set();
function growTo(count) {
  for (const t of targets) {
    if (alloc.size >= count) break;
    if (alloc.has(t)) continue;
    // Путь от ближайшего уже взятого узла (или от старта)
    let best = null;
    for (const from of [start, ...alloc]) {
      const p = pathTo(from, t);
      if (p.length && (!best || p.length < best.length)) best = p;
    }
    if (best && alloc.size + best.length <= count + 3) best.forEach((id) => alloc.add(id));
  }
}

const ascNodes = Object.entries(tree.nodes).filter(([, n]) => n.asc === 'Necromancer');
const ascStart = ascNodes.find(([, n]) => n.t === 'A')[0];
const ascNotables = ascNodes.filter(([, n]) => n.t === 'N').map(([id]) => id);

const stageSizes = [
  ['Act 1', 11, 0],
  ['Act 2-3', 24, 2],
  ['Act 4-5', 40, 4],
  ['Act 6-10', 66, 6],
];
const specs = [];
for (const [title, size, ascCount] of stageSizes) {
  growTo(size);
  const asc = [];
  if (ascCount) {
    asc.push(ascStart);
    for (const n of ascNotables.slice(0, ascCount / 2)) {
      asc.push(...pathTo.call(null, ascStart, n));
    }
  }
  specs.push({ title, nodes: [...alloc, ...new Set(asc)] });
}

// pathTo выше пропускает узлы асценданта — для асценданта отдельный обход
function ascPath(from, target) {
  const prev = new Map([[from, null]]);
  const q = [from];
  while (q.length) {
    const cur = q.shift();
    if (cur === target) break;
    for (const nb of adj.get(cur) || []) {
      if (prev.has(nb) || tree.nodes[nb].asc !== 'Necromancer') continue;
      prev.set(nb, cur);
      q.push(nb);
    }
  }
  const out = [];
  for (let c = target; c && c !== from; c = prev.get(c)) out.push(c);
  return out;
}
specs.forEach((s, i) => {
  const ascCount = stageSizes[i][2];
  const main = s.nodes.filter((id) => !tree.nodes[id].asc);
  const asc = new Set();
  if (ascCount) {
    asc.add(ascStart);
    for (const n of ascNotables.slice(0, ascCount / 2)) ascPath(ascStart, n).forEach((x) => asc.add(x));
  }
  s.nodes = [start, ...main, ...asc];
});

const jewelSockets = Object.entries(tree.nodes).filter(([, n]) => n.t === 'J' && !n.asc).map(([id]) => id);
let socketPath = null;
for (const j of jewelSockets) {
  for (const from of specs[2].nodes) {
    if (tree.nodes[from].asc) continue;
    const p = pathTo(from, j);
    if (p.length && p.at(-1) !== undefined && (!socketPath || p.length < socketPath.length) && (p.length > 1 || (adj.get(from) || []).includes(j))) socketPath = p;
  }
}
const socketId = socketPath[0];
for (const s of [specs[2], specs[3]]) for (const id of socketPath) if (!s.nodes.includes(id)) s.nodes.push(id);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const gem = (nameSpec, skillId, level = 1) => `<Gem nameSpec="${esc(nameSpec)}" skillId="${skillId}" gemId="Metadata/Items/Gems/${/^Support/.test(skillId) ? 'SupportGem' : 'SkillGem'}${skillId.replace(/^Support/, '')}" level="${level}" quality="0" enabled="true"/>`;

const skillSets = [
  ['Act 1', [
    ['Body Armour', [gem('Summon Raging Spirit', 'SummonRagingSpirit'), gem('Minion Damage', 'SupportMinionDamage'), gem('Melee Splash', 'SupportMeleeSplash')]],
    ['Helmet', [gem('Raise Zombie', 'RaiseZombie')]],
  ]],
  ['Act 2-3', [
    ['Body Armour', [gem('Summon Raging Spirit', 'SummonRagingSpirit'), gem('Minion Damage', 'SupportMinionDamage'), gem('Melee Splash', 'SupportMeleeSplash'), gem('Elemental Damage with Attacks', 'SupportElementalDamageWithAttacks')]],
    ['Helmet', [gem('Raise Zombie', 'RaiseZombie'), gem('Minion Life', 'SupportMinionLife')]],
    ['Gloves', [gem('Flame Dash', 'FlameDash'), gem('Clarity', 'Clarity')]],
  ]],
  ['Act 4-5', [
    ['Body Armour', [gem('Raise Spectre', 'RaiseSpectre'), gem('Minion Damage', 'SupportMinionDamage'), gem('Spell Echo', 'SupportSpellEcho'), gem('Elemental Focus', 'SupportElementalFocus')]],
    ['Helmet', [gem('Raise Zombie', 'RaiseZombie'), gem('Minion Life', 'SupportMinionLife'), gem('Melee Physical Damage', 'SupportMeleePhysicalDamage')]],
    ['Gloves', [gem('Flesh Offering', 'FleshOffering'), gem('Desecrate', 'Desecrate')]],
  ]],
  ['Act 6-10', [
    ['Body Armour', [gem('Raise Spectre', 'RaiseSpectre'), gem('Minion Damage', 'SupportMinionDamage'), gem('Spell Echo', 'SupportSpellEcho'), gem('Elemental Focus', 'SupportElementalFocus'), gem('Predator', 'SupportPredator'), gem('Spell Cascade', 'SupportSpellCascade')]],
    ['Helmet', [gem('Raise Zombie', 'RaiseZombie'), gem('Minion Life', 'SupportMinionLife'), gem('Melee Physical Damage', 'SupportMeleePhysicalDamage'), gem('Multistrike', 'SupportMultistrike')]],
    ['Gloves', [gem('Flesh Offering', 'FleshOffering'), gem('Desecrate', 'Desecrate'), gem('Faster Casting', 'SupportFasterCast')]],
    ['Boots', [gem('Vaal Haste', 'VaalHaste'), gem('Flame Dash', 'FlameDash')]],
  ]],
];

const itemsXml = `
<Item id="1">Rarity: UNIQUE
Tabula Rasa
Simple Robe
Sockets: W-W-W-W-W-W</Item>
<Item id="2">Rarity: UNIQUE
Goldrim
Leather Cap
+30% to all Elemental Resistances</Item>
<Item id="3">Rarity: UNIQUE
Wanderlust
Wool Shoes</Item>
<Item id="4">Rarity: RARE
Doom Grip
Rawhide Gloves</Item>
<Item id="5">Rarity: UNIQUE
Lifesprig
Driftwood Wand</Item>
<Item id="6">Rarity: UNIQUE
Seven-League Step
Rawhide Boots</Item>
<Item id="7">Rarity: RARE
Gale Spark
Cobalt Jewel
Unique ID: 1
Item Level: 70
Implicits: 0
{crafted}+12 to Intelligence
14% increased Minion Damage
Minions have 8% increased maximum Life</Item>
<Item id="8">Rarity: UNIQUE
Watcher's Eye
Prismatic Jewel
Variant: Old
Variant: Current
Selected Variant: 2
Limited to: 1
Implicits: 0
{variant:1}Old line
{variant:2}{range:0.5}(4-6)% increased maximum Energy Shield
Corrupted</Item>`;

const itemSets = [
  ['Act 1', [['Weapon 1', 5], ['Body Armour', 1]]],
  ['Act 2-3', [['Weapon 1', 5], ['Body Armour', 1], ['Helmet', 2], ['Boots', 3], ['Gloves', 4]]],
  ['Act 4-5', [['Body Armour', 1], ['Helmet', 2], ['Boots', 3], ['Gloves', 4]]],
  ['Act 6-10', [['Helmet', 2], ['Boots', 6], ['Gloves', 4]]],
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<PathOfBuilding>
  <Build level="70" targetVersion="3_0" className="Witch" ascendClassName="Necromancer" mainSocketGroup="1" viewMode="TREE"/>
  <Skills activeSkillSet="1" defaultGemLevel="normalMaximum">
${skillSets.map(([t, groups], i) => `    <SkillSet id="${i + 1}" title="${t}">
${groups.map(([slot, gems]) => `      <Skill slot="${slot}" enabled="true" mainActiveSkill="1">${gems.join('')}</Skill>`).join('\n')}
      <Skill enabled="true" source="Item:5:Lifesprig"><Gem nameSpec="Granted" skillId="X" enabled="true"/></Skill>
    </SkillSet>`).join('\n')}
  </Skills>
  <Tree activeSpec="1">
${specs.map((s, i) => `    <Spec title="${s.title}" treeVersion="3_29" classId="3" ascendClassId="3" nodes="${s.nodes.join(',')}" masteryEffects="">
      <URL>https://www.pathofexile.com/passive-skill-tree/AAAA</URL>
      <Sockets>${i >= 2 ? `<Socket nodeId="${socketId}" itemId="${i === 2 ? 7 : 8}"/>` : ''}</Sockets>
    </Spec>`).join('\n')}
  </Tree>
  <Notes>Leveling notes &amp; tips</Notes>
  <Items activeItemSet="1">${itemsXml}
${itemSets.map(([t, slots], i) => `    <ItemSet id="${i + 1}" title="${t}">${slots.map(([n, id]) => `<Slot name="${n}" itemId="${id}"/>`).join('')}</ItemSet>`).join('\n')}
  </Items>
</PathOfBuilding>`;

const dir = path.join(__dirname, 'fixtures');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'witch.xml'), xml);
const code = zlib.deflateSync(Buffer.from(xml)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
fs.writeFileSync(path.join(dir, 'witch.code'), code);
console.log(specs.map((s) => `${s.title}: ${s.nodes.length} nodes`).join(', '), `code ${code.length} chars`);
