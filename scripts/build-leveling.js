// Готовит data/areas.json и data/gem-vendors.json из данных проекта Exile-Leveling (MIT).
// Запуск: node scripts/build-leveling.js путь/к/exile-leveling/common/data/json
'use strict';

const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/build-leveling.js <exile-leveling>/common/data/json');
  process.exit(1);
}
const read = (f) => JSON.parse(fs.readFileSync(path.join(src, f), 'utf8'));
const out = path.join(__dirname, '..', 'data');

// Зоны: id из журнала игры («Generating level N area "1_2_9"») → название, акт, соседи
const areas = read('areas.json');
const areaOut = {};
for (const a of Object.values(areas)) {
  areaOut[a.id] = {
    name: a.name,
    act: a.act,
    level: a.level,
    town: !!a.is_town_area,
    links: (a.connection_ids || []).filter((id) => areas[id]),
  };
}

// Камни у продавцов и в награду за квесты: gemId → { vendors: [{ npc, act, quest, classes }],
// rewards: [{ npc, act, quest, offer, classes }] }; пустой classes — любой класс.
// offer — id набора наград: из одного набора можно взять только один камень.
const gems = read('gems.json');
const quests = read('quests.json');
const vendors = {};
const rewards = {};
for (const q of Object.values(quests)) {
  const act = Number(q.act);
  if (!(act >= 1 && act <= 10)) continue; // только кампания
  for (const [offerId, offer] of Object.entries(q.reward_offers || {})) {
    for (const [gemId, v] of Object.entries(offer.vendor || {})) {
      if (!gems[gemId]) continue;
      (vendors[gemId] ||= []).push({ npc: v.npc, act, quest: q.name, classes: v.classes || [] });
    }
    for (const [gemId, v] of Object.entries(offer.quest || {})) {
      if (!gems[gemId]) continue;
      (rewards[gemId] ||= []).push({ npc: offer.quest_npc, act, quest: q.name, offer: offerId, classes: v.classes || [] });
    }
  }
}
const gemOut = {};
for (const id of new Set([...Object.keys(vendors), ...Object.keys(rewards)])) {
  const g = gems[id];
  gemOut[id] = { name: g.name, level: g.required_level || 1, support: !!g.is_support, vendors: vendors[id] || [], rewards: rewards[id] || [] };
}

fs.writeFileSync(path.join(out, 'areas.json'), JSON.stringify(areaOut));
fs.writeFileSync(path.join(out, 'gem-vendors.json'), JSON.stringify(gemOut));
const lic = path.join(src, '..', '..', '..', 'LICENSE');
if (fs.existsSync(lic)) fs.copyFileSync(lic, path.join(out, 'LICENSE-exile-leveling.txt'));
console.log(`areas: ${Object.keys(areaOut).length}, gems from vendors or quests: ${Object.keys(gemOut).length}`);
