// Готовит data/tree.json из официальной выгрузки GGG (github.com/grindinggear/skilltree-export).
// Запуск: node scripts/build-tree.js путь/к/skilltree-export/data.json 3.29.1
// Оставляет только то, что нужно для отрисовки: координаты, тип, имя, статы, связи.
'use strict';

const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Укажите путь к data.json из skilltree-export');
  process.exit(1);
}
const d = JSON.parse(fs.readFileSync(src, 'utf8'));
const { skillsPerOrbit, orbitRadii } = d.constants;

// Неравномерные углы для орбит на 16 и 40 узлов — как в игре и в Path of Building.
const ANGLES_16 = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
const ANGLES_40 = [0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 135, 140, 150, 160, 170,
  180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 270, 280, 290, 300, 310, 315, 320, 330, 340, 350];

function orbitAngle(orbit, index) {
  const n = skillsPerOrbit[orbit];
  if (n === 16) return ANGLES_16[index] * Math.PI / 180;
  if (n === 40) return ANGLES_40[index] * Math.PI / 180;
  return (2 * Math.PI * index) / n;
}

function typeOf(n) {
  if (n.classStartIndex != null) return 'S';
  if (n.isAscendancyStart) return 'A';
  if (n.isKeystone) return 'K';
  if (n.isMastery) return 'M';
  if (n.isJewelSocket) return 'J';
  if (n.isNotable) return 'N';
  return 'n';
}

const r1 = (x) => Math.round(x * 10) / 10;
const nodes = {};
for (const [id, n] of Object.entries(d.nodes)) {
  if (id === 'root' || n.isProxy || n.group == null) continue;
  // Notable для помазания маслами (isBlighted) на дереве не стоят — в игре их не видно.
  if (n.isBlighted) continue;
  // Узлы без единой связи (кроме мастерства) — служебные, тоже не рисуем.
  if (!n.isMastery && !(n.out?.length || n.in?.length)) continue;
  const g = d.groups[n.group];
  if (!g || g.isProxy) continue;
  // Узлы внутри кластерных самоцветов на дереве по умолчанию не видны.
  if (n.expansionJewel && n.expansionJewel.parent) continue;
  const a = orbitAngle(n.orbit, n.orbitIndex);
  const r = orbitRadii[n.orbit];
  const out = {
    x: r1(g.x + Math.sin(a) * r),
    y: r1(g.y - Math.cos(a) * r),
    t: typeOf(n),
    name: n.name || '',
  };
  if (n.stats?.length) out.s = n.stats;
  if (n.ascendancyName) out.asc = n.ascendancyName;
  if (n.classStartIndex != null) out.cls = n.classStartIndex;
  if (n.isMultipleChoiceOption) out.mco = 1;
  if (n.masteryEffects) out.me = Object.fromEntries(n.masteryEffects.map((e) => [e.effect, e.stats]));
  // Для дуг: центр группы, орбита и угол
  if (n.orbit > 0) out.arc = [n.group, n.orbit, r1(a * 1000) / 1000];
  nodes[id] = out;
}

// Рёбра без повторов. Связи мастерства, «корня» и между разными
// асцендантами (и с основным деревом) не рисуются — как в игре.
const edges = [];
const seen = new Set();
for (const [id, n] of Object.entries(d.nodes)) {
  if (!nodes[id]) continue;
  for (const o of [...(n.out || []), ...(n.in || [])]) {
    if (!nodes[o]) continue;
    const key = id < o ? `${id}-${o}` : `${o}-${id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const A = nodes[id];
    const B = nodes[o];
    if (A.t === 'M' || B.t === 'M') continue;
    if ((A.asc || '') !== (B.asc || '')) continue;
    if (A.t === 'S' && B.t === 'S') continue;
    edges.push([id, o]);
  }
}

const groups = {};
for (const [gid, g] of Object.entries(d.groups)) groups[gid] = [r1(g.x), r1(g.y)];

const classes = d.classes.map((c) => ({ name: c.name, asc: c.ascendancies.map((a) => a.name) }));
const bloodlines = (d.alternate_ascendancies || []).map((a) => ({ id: a.id, name: a.name }));

const out = {
  version: process.argv[3] || 'unknown',
  orbitRadii,
  classes,
  bloodlines,
  groups,
  nodes,
  edges,
  bounds: [d.min_x, d.min_y, d.max_x, d.max_y],
};

const dst = path.join(__dirname, '..', 'data', 'tree.json');
fs.mkdirSync(path.dirname(dst), { recursive: true });
const json = JSON.stringify(out);
fs.writeFileSync(dst, json);
// Та же база как скрипт — окно билда грузит её обычным <script>, без доступа к диску.
fs.writeFileSync(dst.replace(/\.json$/, '.js'), `window.TREE_DATA=${json};`);
console.log(`nodes ${Object.keys(nodes).length}, edges ${edges.length}, ${(fs.statSync(dst).size / 1e6).toFixed(2)} MB → ${dst}`);
