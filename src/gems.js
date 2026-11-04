// Какие камни билда можно взять в этом городе: бесплатно в награду за квест или купить.
// Данные — data/gem-vendors.json (из Exile-Leveling, MIT): gemId → { name, level, support,
// vendors: [{ npc, act, quest, classes }], rewards: [{ npc, act, quest, offer, classes }] };
// пустой classes — любой класс.
'use strict';

// Продавцы камней в городах по актам
const TOWN_VENDORS = {
  1: ['Nessa'],
  2: ['Yeena'],
  3: ['Clarissa', 'Maramoa', 'Siosa'],
  4: ['Petarus and Vanja'],
  6: ['Lilly Roth'],
  7: ['Lilly Roth'],
  8: ['Lilly Roth'],
  9: ['Lilly Roth'],
  10: ['Lilly Roth'],
};

// После стольких напоминаний камень считается купленным
const AUTO_BOUGHT_AFTER = 3;

const gemKey = (name) => String(name || '').trim().toLowerCase();

function indexVendors(data) {
  const byName = new Map();
  for (const g of Object.values(data || {})) if (!byName.has(gemKey(g.name))) byName.set(gemKey(g.name), g);
  return { byId: data || {}, byName };
}

function findGem(idx, gem) {
  return idx.byId[gem.gemId] || idx.byName.get(gemKey(gem.name)) || null;
}

const classOk = (offer, cls) => !offer.classes.length || offer.classes.includes(cls);

/**
 * Камни для этого города.
 * @param idx       indexVendors(...)
 * @param gems      камни набора: [{ name, gemId }]
 * @param o         { className, level, act, shop } — shop: { [gemKey]: { seen, bought } }
 * @returns { quest: [...], buy: [...] } — quest: бесплатно в награду за квест этого акта
 *   (из одного набора наград — один камень, основные камни в приоритете); buy: у продавца.
 */
function gemsForTown(idx, gems, { className, level, act, shop = {} }) {
  const npcs = TOWN_VENDORS[act] || [];
  const out = { quest: [], buy: [] };
  if (!Number.isFinite(level)) return out;
  const usedOffers = new Set();
  const seen = new Set();
  // Сначала основные камни — им достаётся награда за квест, поддержки чаще покупаются
  const ordered = [...gems].sort((a, b) => (!!a.support - !!b.support));
  for (const gem of ordered) {
    const info = findGem(idx, gem);
    if (!info) continue;
    const key = gemKey(info.name);
    if (seen.has(key) || shop[key]?.bought || info.level > level) continue;
    const reward = (info.rewards || []).find((r) => r.act === act && classOk(r, className) && !usedOffers.has(r.offer));
    if (reward) {
      seen.add(key);
      usedOffers.add(reward.offer);
      out.quest.push({ key, name: info.name, npc: reward.npc, quest: reward.quest, level: info.level });
      continue;
    }
    const offer = info.vendors.find((v) => npcs.includes(v.npc) && classOk(v, className));
    if (!offer) continue;
    seen.add(key);
    out.buy.push({ key, name: info.name, npc: offer.npc, quest: offer.quest, level: info.level });
  }
  return out;
}

// Только покупка, без наград за квесты
function gemsToBuy(idx, gems, { className, level, act, shop = {} }) {
  const npcs = TOWN_VENDORS[act];
  if (!npcs || !Number.isFinite(level)) return [];
  const out = [];
  const seen = new Set();
  for (const gem of gems) {
    const info = findGem(idx, gem);
    if (!info) continue;
    const key = gemKey(info.name);
    if (seen.has(key) || shop[key]?.bought || info.level > level) continue;
    const offer = info.vendors.find((v) => npcs.includes(v.npc) && classOk(v, className));
    if (!offer) continue;
    seen.add(key);
    out.push({ key, name: info.name, npc: offer.npc, quest: offer.quest, level: info.level });
  }
  return out;
}

// Можно ли вообще получить камень этим классом (купить или взять за квест) — для отметки в окне билда
function buyable(idx, gem, className) {
  const info = findGem(idx, gem);
  return !!info && (info.vendors.some((v) => classOk(v, className)) || (info.rewards || []).some((r) => classOk(r, className)));
}

// Награда за квест — своя карточка на каждый камень: у кого и за какой квест
function questGemCards(list, act) {
  return list.map((g) => ({
    kind: 'questgem',
    label: `Free quest reward — Act ${act}`,
    title: g.name,
    text: `Take it from ${g.npc} as the reward for “${g.quest}”. No need to buy it.`,
  }));
}

// Одна карточка на продавца
function gemCards(list, act) {
  const byNpc = new Map();
  for (const g of list) {
    if (!byNpc.has(g.npc)) byNpc.set(g.npc, []);
    byNpc.get(g.npc).push(g);
  }
  return [...byNpc].map(([npc, gs]) => {
    const quests = [...new Set(gs.map((g) => g.quest))];
    return {
      kind: 'gem',
      label: `Gems to buy — ${npc}, Act ${act}`,
      title: gs.map((g) => g.name).join(', '),
      text: `Sold after ${quests.map((q) => `“${q}”`).join(', ')}.`,
    };
  });
}

// Счётчик показов: после AUTO_BOUGHT_AFTER камень помечается купленным
function countShown(shop, list) {
  const next = { ...shop };
  for (const g of list) {
    const cur = next[g.key] || { seen: 0, bought: false };
    const seen = cur.seen + 1;
    next[g.key] = { seen, bought: cur.bought || seen >= AUTO_BOUGHT_AFTER };
  }
  return next;
}

module.exports = { TOWN_VENDORS, AUTO_BOUGHT_AFTER, gemKey, indexVendors, findGem, gemsForTown, gemsToBuy, buyable, gemCards, questGemCards, countShown };
