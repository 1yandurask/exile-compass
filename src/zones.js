// Какие квесты и испытания Лабиринта есть в зоне, в которую только что вошёл игрок.
// Многие зоны повторяются во второй половине кампании (The Wetlands — 2 и 6 акт,
// The Control Blocks — 5 и 10). Акт берётся по id зоны из журнала («1_2_9»),
// а если зона неизвестна — по её уровню.
'use strict';

// Уровни монстров по актам (границы пересекаются на один уровень)
const ACT_LEVELS = [
  [1, 13], [13, 23], [23, 33], [33, 40], [40, 45],
  [45, 50], [50, 55], [55, 61], [60, 64], [64, 70],
];

function actsForLevel(level) {
  const out = new Set();
  ACT_LEVELS.forEach(([lo, hi], i) => { if (level >= lo && level <= hi) out.add(i + 1); });
  return out;
}

const key = (s) => String(s || '').trim().toLowerCase().replace(/^the /, '');

const labId = (t) => `${t.act}:${t.trial}`;

/**
 * @param areas  data/areas.json: id → { name, act, town, links }
 */
function buildIndex(quests, labyrinth, secrets, areas = null) {
  const index = new Map();
  index.areas = areas || {};
  const add = (zone, entry) => {
    const k = key(zone);
    if (!index.has(k)) index.set(k, []);
    index.get(k).push(entry);
  };
  for (const act of quests?.acts || []) {
    for (const q of act.quests) {
      for (const z of q.zones || []) add(z, { kind: 'quest', act: act.act, id: `${act.act}:${q.name}`, quest: q });
    }
  }
  for (const t of labyrinth?.trials || []) add(t.zone, { kind: 'lab', act: t.act, id: labId(t), trial: t });
  for (const act of secrets?.acts || []) {
    for (const e of act.entries) if (e.zone) add(e.zone, { kind: 'secret', act: act.act, secret: e });
  }
  return index;
}

/**
 * @returns {Array<{kind, act, ...}>} что есть в этой зоне; пусто, если акт определить нельзя
 */
function lookup(index, zone, level, areaId) {
  const entries = index.get(key(zone)) || [];
  if (!entries.length) return [];
  const area = areaId && index.areas?.[areaId];
  if (area && key(area.name) === key(zone)) return entries.filter((e) => e.act === area.act);
  if (Number.isFinite(level)) {
    const acts = actsForLevel(level);
    return entries.filter((e) => acts.has(e.act));
  }
  // Уровня нет — показываем, только если зона встречается в одном акте
  const acts = new Set(entries.map((e) => e.act));
  return acts.size === 1 ? entries : [];
}

/**
 * Квесты и испытания в соседних зонах: «следующая зона — испытание Лабиринта».
 * Зону, из которой игрок пришёл, и цели в текущей зоне пропускаем.
 * @returns entries с полем near — название соседней зоны
 */
function nearby(index, areaId, prevAreaId, done = new Set()) {
  const area = areaId && index.areas?.[areaId];
  if (!area) return [];
  const here = new Set(lookup(index, area.name, null, areaId).map((e) => e.id));
  const out = [];
  for (const id of area.links || []) {
    if (id === prevAreaId) continue;
    const next = index.areas[id];
    if (!next) continue;
    for (const e of lookup(index, next.name, null, id)) {
      if ((e.kind === 'quest' || e.kind === 'lab') && !done.has(e.id) && !here.has(e.id)) {
        out.push({ ...e, near: next.name });
      }
    }
  }
  return out;
}

// Карточки для окна-уведомления. done — id выполненных квестов и пройденных испытаний.
function cardsFor(entries, done = new Set()) {
  const cards = [];
  const seenQuest = new Set();
  const nearCards = new Map(); // одна карточка на соседнюю зону и вид
  for (const e of entries) {
    if (e.near) {
      if (done.has(e.id)) continue;
      const k = `${e.kind}|${e.near}`;
      let card = nearCards.get(k);
      if (!card) {
        card = {
          kind: e.kind,
          near: true,
          label: e.kind === 'quest' ? `Next area — passive point · Act ${e.act}` : `Next area — Labyrinth trial · Act ${e.act}`,
          title: `→ ${e.near}`,
          items: [],
        };
        nearCards.set(k, card);
        cards.push(card);
      }
      const item = e.kind === 'quest' ? `${e.quest.name} (+${e.quest.points})` : `Trial of ${e.trial.trial}`;
      if (!card.items.includes(item)) card.items.push(item);
      card.text = card.items.join(' · ');
      continue;
    }
    if (e.kind === 'quest') {
      if (done.has(e.id) || seenQuest.has(e.id)) continue;
      seenQuest.add(e.id);
      const q = e.quest;
      cards.push({
        kind: 'quest',
        label: `+${q.points} passive point${q.points === 1 ? '' : 's'} — Act ${e.act}`,
        title: q.name,
        text: `${q.task}. Reward from ${q.reward}.`,
      });
    } else if (e.kind === 'secret') {
      cards.push({
        kind: 'secret',
        label: `Secret room — Act ${e.act}`,
        title: e.secret.title,
        text: e.secret.text || '',
      });
    } else {
      if (done.has(e.id)) continue;
      const t = e.trial;
      cards.push({
        kind: 'lab',
        label: `Labyrinth trial — Act ${e.act}`,
        title: `Trial of ${t.trial}`,
        text: `The trial is in this area.${t.traps ? ` ${t.traps}.` : ''}`,
      });
    }
  }
  for (const c of nearCards.values()) delete c.items;
  const rank = { quest: 0, lab: 1, secret: 2 };
  // Сначала то, что в этой зоне, потом подсказки про соседние
  return cards.sort((a, b) => (!!a.near - !!b.near) || (rank[a.kind] - rank[b.kind]));
}

module.exports = { actsForLevel, buildIndex, lookup, nearby, cardsFor, labId };
