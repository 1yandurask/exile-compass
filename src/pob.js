// Импорт билдов Path of Building: код или ссылка → этапы (дерево, камни, уники, самоцветы).
'use strict';

const zlib = require('zlib');
const { parseXml, child, childrenOf } = require('./xml');

let GEMS = { byId: {}, byName: {} };
try { GEMS = require('../data/gems.json'); } catch { /* без цветов */ }

// ---------------------------------------------------------------- код и ссылки

// Код PoB — это XML, сжатый zlib и закодированный в base64 (URL-safe вариант).
function decodeCode(code) {
  const clean = String(code || '').trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  if (!/^[A-Za-z0-9+/=]{20,}$/.test(clean)) throw new Error('This does not look like a Path of Building code');
  const buf = Buffer.from(clean, 'base64');
  let xml;
  try {
    xml = zlib.inflateSync(buf).toString('utf8');
  } catch {
    try { xml = zlib.inflateRawSync(buf).toString('utf8'); } catch {
      throw new Error('Could not unpack the code — copy it again from Path of Building (Import/Export → Generate)');
    }
  }
  if (!xml.includes('<PathOfBuilding')) throw new Error('The code unpacked, but it is not a Path of Building build');
  return xml;
}

// Куда идти за «сырым» кодом для известных сайтов.
function rawUrlFor(input) {
  let url;
  try { url = new URL(String(input).trim()); } catch { return null; }
  const host = url.hostname.replace(/^www\./, '');
  const parts = url.pathname.split('/').filter(Boolean);
  if (host === 'pobb.in' && parts[0]) return `https://pobb.in/${parts[0] === 'u' ? parts.slice(0, 3).join('/') : parts[0]}/raw`;
  if (host === 'pastebin.com' && parts[0]) return `https://pastebin.com/raw/${parts.at(-1)}`;
  if (host === 'poe.ninja' && parts.includes('pob')) return `https://poe.ninja/pob/raw/${parts.at(-1)}`;
  if (host === 'maxroll.gg' || host === 'mobalytics.gg') return null; // у этих сайтов нет «сырого» кода
  return url.href;
}

function looksLikeUrl(s) {
  return /^https?:\/\//i.test(String(s).trim());
}

async function fetchBuildCode(input, userAgent = 'exile-compass') {
  const raw = rawUrlFor(input);
  if (!raw) throw new Error('This site does not share Path of Building codes directly — open the build there and copy the PoB code instead');
  const res = await fetch(raw, { headers: { 'User-Agent': userAgent } });
  if (!res.ok) throw new Error(`The link answered ${res.status} — check that the build is public`);
  const text = (await res.text()).trim();
  if (text.startsWith('<')) {
    if (text.includes('<PathOfBuilding')) return { xml: text };
    throw new Error('The link opened a web page, not a build code — copy the PoB code instead');
  }
  return { xml: decodeCode(text), code: text };
}

// ---------------------------------------------------------------- камни

function isSupport(g) {
  return /^Support/.test(g.attrs.skillId || '') || /SupportGem|\/Support/.test(g.attrs.gemId || '');
}

function gemName(g) {
  let name = g.attrs.nameSpec || g.attrs.skillId || 'Unknown gem';
  if (isSupport(g) && !/Support$/.test(name)) name += ' Support';
  return name;
}

// Цвет камня: R — сила, G — ловкость, B — интеллект, W — белый
function gemColour(gem) {
  for (const k of [gem.gemId, gem.skillId]) if (k && GEMS.byId[k]) return GEMS.byId[k];
  const base = String(gem.name || '').replace(/ Support$/, '').toLowerCase();
  return GEMS.byName[base] || GEMS.byName[String(gem.name || '').toLowerCase()] || '';
}

function parseSkillSet(set) {
  const groups = [];
  for (const s of childrenOf(set, 'Skill')) {
    if (s.attrs.enabled === 'false') continue;
    if (s.attrs.source) continue; // умения, которые дают предметы
    const gems = childrenOf(s, 'Gem')
      .filter((g) => g.attrs.enabled !== 'false')
      .map((g) => {
        const gem = {
          name: gemName(g),
          support: isSupport(g),
          level: Number(g.attrs.level) || null,
          quality: Number(g.attrs.quality) || 0,
          gemId: g.attrs.gemId || '',
          skillId: g.attrs.skillId || '',
        };
        gem.colour = gemColour(gem);
        return gem;
      });
    if (!gems.length) continue;
    // Основной камень — первый не саппорт; остальные — по порядку из билда
    const mainIdx = gems.findIndex((g) => !g.support);
    const ordered = mainIdx > 0 ? [gems[mainIdx], ...gems.filter((_, i) => i !== mainIdx)] : gems;
    groups.push({ label: s.attrs.label || '', slot: s.attrs.slot || '', gems: ordered });
  }
  return groups;
}

// ---------------------------------------------------------------- предметы

// Служебные строки в тексте предмета PoB, которые не являются свойствами
const META_COLON = /^(Unique ID|Item Level|LevelReq|Level|Quality|Sockets|Implicits|Variant|Selected Variant|Has Alt Variant\w*|Selected Alt Variant\w*|League|Source|Upgrade|Requires|Radius|Limited to|Prefix|Suffix|Crafted|Catalyst\w*|Cluster Jewel \w+|Talisman Tier|Armour|Evasion|Energy Shield|Ward|\w*BasePercentile|Note|ModRange|Influence)\s*:/i;
const META_EXACT = /^(Corrupted|Mirrored|Split|Unidentified|Foulborn|Shaper Item|Elder Item|Crusader Item|Redeemer Item|Hunter Item|Warlord Item|Synthesised Item|Fractured Item)$/i;
const isMeta = (l) => META_COLON.test(l) || META_EXACT.test(l);

// Текст предмета PoB: «Rarity: X», имя (и база), затем строки свойств.
function parseItem(text) {
  const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const ri = lines.findIndex((l) => /^Rarity:/i.test(l));
  if (ri < 0) return null;
  const rarity = lines[ri].split(':')[1].trim().toUpperCase();
  const twoLines = rarity === 'UNIQUE' || rarity === 'RARE' || rarity === 'RELIC';
  const name = lines[ri + 1] || '';
  const base = twoLines ? lines[ri + 2] || '' : '';
  const body = lines.slice(ri + (twoLines ? 3 : 2));

  const selected = Number((body.find((l) => /^Selected Variant:/i.test(l)) || '').split(':')[1]) || null;
  const implicitCount = Number((body.find((l) => /^Implicits:/i.test(l)) || '').split(':')[1]) || 0;
  const corrupted = body.some((l) => /^Corrupted$/i.test(l));
  const implicit = [];
  const explicit = [];
  let afterImplicitsHeader = !body.some((l) => /^Implicits:/i.test(l));
  let seenImplicits = 0;
  for (const raw of body) {
    if (/^Implicits:/i.test(raw)) { afterImplicitsHeader = true; continue; }
    if (isMeta(raw) || !afterImplicitsHeader) continue;
    // Строки для другого варианта уникального предмета пропускаем
    const v = /\{variant:([\d,]+)\}/.exec(raw);
    if (v && selected && !v[1].split(',').map(Number).includes(selected)) continue;
    const crafted = /\{crafted\}/.test(raw);
    // {range:0.3} + «(10-20)» — PoB хранит положение значения в диапазоне; считаем само число
    const r = /\{range:([\d.]+)\}/.exec(raw);
    const k = r ? Number(r[1]) : 0.5;
    const textLine = raw.replace(/\{[^}]*\}/g, '')
      .replace(/\((-?[\d.]+)-(-?[\d.]+)\)/g, (_, a, b) => {
        const lo = Number(a);
        const hi = Number(b);
        const val = lo + (hi - lo) * k;
        return String(Number.isInteger(lo) && Number.isInteger(hi) ? Math.round(val) : Math.round(val * 100) / 100);
      })
      .trim();
    if (!textLine) continue;
    const mod = crafted ? `${textLine} (crafted)` : textLine;
    if (seenImplicits < implicitCount) { implicit.push(mod); seenImplicits++; } else explicit.push(mod);
  }
  return { rarity, name, base, implicit, explicit, corrupted };
}

const SLOT_ORDER = ['Weapon 1', 'Weapon 2', 'Helmet', 'Body Armour', 'Gloves', 'Boots', 'Amulet', 'Ring 1', 'Ring 2', 'Belt',
  'Flask 1', 'Flask 2', 'Flask 3', 'Flask 4', 'Flask 5'];

function slotRank(name) {
  const i = SLOT_ORDER.indexOf(name);
  return i < 0 ? 100 : i;
}

const isUnique = (it) => it && ['UNIQUE', 'RELIC'].includes(it.rarity);

function uniquesOf(slotEls, items) {
  const out = [];
  const seen = new Set();
  for (const s of slotEls) {
    const id = s.attrs.itemId;
    if (!id || id === '0' || /Swap/.test(s.attrs.name || '')) continue;
    const it = items.get(id);
    if (!isUnique(it) || seen.has(id)) continue;
    seen.add(id);
    out.push({ slot: s.attrs.name, name: it.name, base: it.base });
  }
  return out.sort((a, b) => slotRank(a.slot) - slotRank(b.slot));
}

// Самоцветы в гнёздах дерева этого этапа
function jewelsOf(spec, items) {
  const out = [];
  for (const s of childrenOf(child(spec, 'Sockets'), 'Socket')) {
    const it = items.get(s.attrs.itemId);
    if (!it || !s.attrs.itemId || s.attrs.itemId === '0') continue;
    out.push({ nodeId: s.attrs.nodeId, ...it });
  }
  return out;
}

// ---------------------------------------------------------------- сопоставление наборов с этапами

// В названиях PoB бывают цветовые коды: ^7, ^xE05030
const cleanTitle = (s) => String(s || '').replace(/\^x[0-9a-f]{6}/gi, '').replace(/\^\d/g, '').replace(/\s+/g, ' ').trim();

// Этап дерева № N ↔ набор камней № N ↔ набор предметов № N — по порядку, как в PoB.
// Наборов меньше, чем этапов, — на последних этапах остаётся последний набор.
function matchByOrder(index, sets) {
  return sets.length ? Math.min(Math.max(0, index), sets.length - 1) : -1;
}

// ---------------------------------------------------------------- разбор

function parseBuild(xml) {
  const doc = parseXml(xml);
  const pob = child(doc, 'PathOfBuilding');
  if (!pob) throw new Error('Not a Path of Building build');
  const buildEl = child(pob, 'Build');

  // Камни: новые билды — <SkillSet>, старые — <Skill> прямо в <Skills>
  const skillsEl = child(pob, 'Skills');
  let skillSets = childrenOf(skillsEl, 'SkillSet').map((s) => ({ title: cleanTitle(s.attrs.title), groups: parseSkillSet(s) }));
  if (!skillSets.length && skillsEl) skillSets = [{ title: '', groups: parseSkillSet(skillsEl) }];
  // Активный набор камней в PoB — с него и начинаем; дальше игрок переключает сам
  const activeSkill = Math.max(0, childrenOf(skillsEl, 'SkillSet').findIndex((s) => s.attrs.id === skillsEl?.attrs.activeSkillSet));

  // Предметы
  const itemsEl = child(pob, 'Items');
  const items = new Map();
  for (const it of childrenOf(itemsEl, 'Item')) {
    const parsed = parseItem(it.text);
    if (parsed) items.set(it.attrs.id, parsed);
  }
  let itemSets = childrenOf(itemsEl, 'ItemSet').map((s) => ({ title: cleanTitle(s.attrs.title), slots: childrenOf(s, 'Slot') }));
  if (!itemSets.length && itemsEl) itemSets = [{ title: '', slots: childrenOf(itemsEl, 'Slot') }];

  // Этапы — варианты дерева
  const treeEl = child(pob, 'Tree');
  const specs = childrenOf(treeEl, 'Spec');
  if (!specs.length) throw new Error('The build has no passive tree');

  const stages = specs.map((spec, i) => {
    const title = cleanTitle(spec.attrs.title) || (specs.length === 1 ? 'Build' : `Tree ${i + 1}`);
    const nodes = (spec.attrs.nodes || '').split(',').map((x) => x.trim()).filter(Boolean);
    const mastery = {};
    for (const m of (spec.attrs.masteryEffects || '').matchAll(/\{(\d+),(\d+)\}/g)) mastery[m[1]] = m[2];
    return {
      title,
      treeVersion: spec.attrs.treeVersion || '',
      classId: Number(spec.attrs.classId) || 0,
      ascendClassId: Number(spec.attrs.ascendClassId) || 0,
      nodes,
      mastery,
      jewels: jewelsOf(spec, items),
    };
  });

  return {
    className: buildEl?.attrs.className || '',
    ascendClassName: buildEl?.attrs.ascendClassName || '',
    level: Number(buildEl?.attrs.level) || 0,
    stages,
    activeSkillSet: Math.min(activeSkill, Math.max(0, skillSets.length - 1)),
    skillSets: skillSets.map((s) => ({ title: s.title, groups: s.groups })),
    itemSets: itemSets.map((s) => ({ title: s.title, uniques: uniquesOf(s.slots, items) })),
  };
}

// Всё, что нужно окну билда для одного этапа.
// Набор предметов выбирается заново при каждом показе — так правила
// сопоставления применяются и к билдам, сохранённым старой версией программы.
// Набор камней не зависит от этапа дерева: его выбирает игрок (по умолчанию — активный в PoB).
function defaultSkillSet(build) {
  const n = build.skillSets.length;
  return n ? Math.min(Math.max(0, build.activeSkillSet || 0), n - 1) : -1;
}

function stageView(build, index, overrides = {}) {
  const st = build.stages[index];
  if (!st) return null;
  // Наборы подбираются при каждом показе — так правило действует и для билдов, сохранённых раньше
  const si = Number.isInteger(overrides.skillSet) && build.skillSets[overrides.skillSet] ? overrides.skillSet : defaultSkillSet(build);
  const autoItem = matchByOrder(index, build.itemSets);
  const ii = overrides.itemSet ?? autoItem;
  const groups = (build.skillSets[si]?.groups || []).map((g) => ({
    ...g,
    gems: g.gems.map((gem) => ({ ...gem, colour: gem.colour || gemColour(gem) })),
  }));
  return {
    index,
    count: build.stages.length,
    title: cleanTitle(st.title),
    classId: st.classId,
    ascendClassId: st.ascendClassId,
    treeVersion: st.treeVersion,
    nodes: st.nodes,
    prevNodes: index > 0 ? build.stages[index - 1].nodes : [],
    mastery: st.mastery,
    skillSet: si,
    skillSetTitle: cleanTitle(build.skillSets[si]?.title),
    groups,
    itemSet: ii,
    itemSetTitle: cleanTitle(build.itemSets[ii]?.title),
    uniques: build.itemSets[ii]?.uniques || [],
    jewels: st.jewels || null, // null — билд сохранён версией без самоцветов
  };
}

async function importBuild(input, userAgent) {
  const text = String(input || '').trim();
  if (!text) throw new Error('Paste a Path of Building code or a link');
  if (looksLikeUrl(text)) {
    const { xml } = await fetchBuildCode(text, userAgent);
    return { build: parseBuild(xml), source: text };
  }
  if (text.startsWith('<')) return { build: parseBuild(text), source: 'xml' };
  return { build: parseBuild(decodeCode(text)), source: 'code' };
}

module.exports = { decodeCode, rawUrlFor, parseBuild, stageView, importBuild, parseItem, gemColour, matchByOrder, defaultSkillSet, cleanTitle };
