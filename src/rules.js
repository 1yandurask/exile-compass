// Правила проверки цены Exile Compass поверх фильтров Awakened PoE Trade:
// что включено по умолчанию, нижняя граница 90%, уники, плашки для окна и применение правок.
'use strict';

const MIN_SHARE = 0.9; // нижняя граница по умолчанию — 90% от значения на предмете

// «Важные» свойства — включены сразу у не-уникальных предметов
const IMPORTANT = [
  /maximum life/i,
  /maximum energy shield/i,
  /maximum mana/i,
  /total elemental resistance/i,
  /movement speed/i,
  /to level of/i,
  /(spell|physical|elemental|fire|cold|lightning|chaos) damage(?! taken)/i,
  /adds # to # /i,
  /attack speed/i,
  /cast speed/i,
  /critical strike/i,
  /^(energy shield|armour|evasion rating|ward): #/i,
  /dps/i,
];

const isImportant = (s) => IMPORTANT.some((re) => re.test(s.text) || re.test(s.statRef || ''));
const isStat = (s) => !s.group && Array.isArray(s.tradeId);
const hasRange = (s) => !!(s.roll && s.roll.bounds && s.roll.bounds.min !== s.roll.bounds.max);

// Родное свойство уника: явное (explicit) свойство на уникальном предмете
const isUniqueMod = (s) => s.tag === 'explicit';

function defaultMin(roll) {
  if (!roll || typeof roll.value !== 'number') return roll?.min;
  // Без разброса — ровно это значение
  if (!roll.bounds || roll.bounds.min === roll.bounds.max) return roll.value;
  // Отрицательные и «чем меньше, тем лучше» оставляем как предложил Awakened PoE Trade
  if (roll.value <= 0 || roll.isNegated || roll.tradeInvert) return roll.min;
  const v = roll.value * MIN_SHARE;
  return roll.dp ? Math.floor(v * 100) / 100 : Math.floor(v);
}

/**
 * Применяет правила по умолчанию к пресету (меняет его).
 * @param item    ParsedItem
 * @param preset  { filters, stats } из createPresets
 */
/**
 * Гнёзда из строки «Sockets: G-G-G R-B»: группы связанных гнёзд и сколько каждого цвета.
 * Цвета сайта: r, g, b, w (A — гнездо бездны, на сайте цветом не ищется).
 */
function socketColors(item) {
  const line = String(item.rawText || '').split(/\r?\n/).find((l) => l.startsWith('Sockets: '));
  if (!line) return null;
  const groups = line.slice('Sockets: '.length).trim().split(/\s+/).map((g) => g.split('-').filter(Boolean)).filter((g) => g.length);
  const count = { r: 0, g: 0, b: 0, w: 0 };
  for (const s of groups.flat()) { const k = s.toLowerCase(); if (k in count) count[k]++; }
  if (!count.r && !count.g && !count.b && !count.w) return null;
  return { groups, count };
}

const RES_PSEUDO = /^pseudo\.pseudo_total_(elemental|fire|cold|lightning|chaos)_resistance$/;
const isResPseudo = (s) => isStat(s) && s.tradeId.some((id) => RES_PSEUDO.test(id));
const ELEMENT_RES = ['Fire', 'Cold', 'Lightning'];
const ZERO_ROLL = () => ({ value: 0, min: '', max: '', dp: false, isNegated: false, zero: true });

function withStats(item, statsByType) {
  return Object.assign(Object.create(Object.getPrototypeOf(item)), item, { statsByType });
}
function activePreset(core, item, opts) {
  const presets = core.createPresets(item, opts);
  return presets.presets.find((p) => p.id === presets.active) || presets.presets[0];
}

/**
 * Пресет для окна.
 * - Крафт-сопротивления (с верстака) входят в суммы сопротивлений, как обычные.
 * - Остальные крафт-свойства в суммы не входят и показываются отдельными строками, выключенными.
 * - Под суммой сопротивлений — все три стихии, даже если их нет на предмете.
 */
function presetFor(core, item, opts) {
  const all = item.statsByType || [];
  const crafted = all.filter((c) => c.type === 'crafted');
  const craftedRes = crafted.filter((c) => /Resistance/.test(c.stat.ref));
  const craftedOther = crafted.filter((c) => !craftedRes.includes(c));
  const preset = activePreset(core, craftedOther.length ? withStats(item, all.filter((c) => !craftedOther.includes(c))) : item, opts);
  if (!preset) return preset;
  // Крафт-строки (у флаконов) добавим сами. Крафт-сопротивление, если вдруг осталось отдельной
  // строкой, ищем как обычное свойство, а не как «именно крафт».
  preset.stats = preset.stats.filter((s) => {
    if (s.tag !== 'crafted') return true;
    if (!/Resistance/.test(s.statRef || '')) return false;
    const ids = s.sources?.[0]?.stat?.stat?.trade?.ids;
    if (!ids?.explicit) return false;
    s.tradeId = ids.explicit;
    s.tag = 'explicit';
    return true;
  });
  // Крафт-сопротивления просто входят в суммы (как у сайта торговли) — отдельной строки нет
  // Стихии, которых нет на предмете, — тоже в шторку под сумму (выключены, без значения)
  if (preset.stats.some((s) => isStat(s) && s.tradeId[0] === 'pseudo.pseudo_total_elemental_resistance')) {
    for (const el of ELEMENT_RES) {
      const id = `pseudo.pseudo_total_${el.toLowerCase()}_resistance`;
      if (preset.stats.some((s) => isStat(s) && s.tradeId[0] === id)) continue;
      preset.stats.push({
        tradeId: [id], statRef: `+#% total to ${el} Resistance`, text: `+#% total to ${el} Resistance`,
        tag: 'pseudo', sources: [], roll: ZERO_ROLL(), disabled: true, hidden: 'filters.hide_ele_res',
      });
    }
  }
  // Цвета гнёзд: искать по ним можно, менять нельзя; по умолчанию выключено
  const sockets = socketColors(item);
  if (sockets) preset.socketColors = { ...sockets, enabled: false };
  if (craftedOther.length) {
    for (const c of craftedOther) {
      const f = core.calculatedStatToFilter(c, opts.searchStatRange ?? 10, item);
      f.crafted = true;
      f.disabled = true;
      preset.stats.push(f);
    }
  }
  return preset;
}

function applyDefaults(item, preset) {
  const unique = item.rarity === 'Unique';
  for (const s of preset.stats) {
    if (!isStat(s)) continue; // группы («пустой префикс» и т.п.) — как решил Awakened PoE Trade
    // Отдельные огонь/холод/молния уже вошли в «total Elemental Resistance» — не показываем
    // (их можно выбрать в шторке под суммой — по умолчанию выключены)
    if (s.hidden === 'filters.hide_ele_res') {
      s.disabled = true;
      s.merged = true;
      delete s.hidden;
      if (s.roll && !s.roll.zero) { s.roll.min = defaultMin(s.roll); s.roll.max = ''; }
      continue;
    }
    const redundant = s.hidden === 'hide_redundant'; // повторяет другое свойство (Base Percentile и т.п.)
    delete s.hidden; // всё видно — что не нужно, просто выключено
    if (redundant || s.roll?.zero) {
      // повтор другого свойства / сопротивление, которое есть только за счёт крафта
      s.disabled = true;
    } else if (s.crafted || s.tag === 'crafted') {
      // Крафт с верстака: показываем отдельно, но в поиск по умолчанию не берём
      s.disabled = true;
    } else if (s.tag === 'fractured') {
      // «именно закреплённое свойство» — сильно сужает поиск; само значение уже есть в сумме
      s.disabled = true;
    } else if (unique) {
      // Родные свойства уника: без разброса — выключены, с разбросом — включены. Чужие — включены.
      s.disabled = isUniqueMod(s) ? !hasRange(s) : false;
    } else {
      s.disabled = !isImportant(s);
    }
    if (s.roll && !s.roll.zero) {
      s.roll.min = defaultMin(s.roll);
      s.roll.max = '';
    }
  }
  const f = preset.filters;
  // Параметры предмета учитываются все, что есть на предмете
  for (const k of ['itemLevel', 'linkedSockets', 'quality', 'gemLevel', 'mapTier', 'areaLevel']) {
    if (f[k]) f[k].disabled = false;
  }
  for (const inf of f.influences || []) inf.disabled = false;
  if (f.searchRelaxed) f.searchRelaxed.disabled = true; // искать ту же базу
  if (f.corrupted) f.corrupted.exact = true;
  // Неопознанный уник, выбранный в списке: по умолчанию цена этого уника вообще (опознанные лоты тоже),
  // «только неопознанные» — плашкой
  if (f.unidentified && item.rarity === 'Unique' && item.info?.unique) f.unidentified.disabled = true;
  return preset;
}

// Пометки «откуда свойство»: механика свойства важнее его типа
const MECHANIC_BADGE = {
  corrupted: 'Corrupted',
  synthesised: 'Synthesised',
  foulborn: 'Foulborn',
  vestigial: 'Vestigial',
  'explicit-shaper': 'Shaper',
  'explicit-elder': 'Elder',
  'explicit-crusader': 'Crusader',
  'explicit-hunter': 'Hunter',
  'explicit-redeemer': 'Redeemer',
  'explicit-warlord': 'Warlord',
  'explicit-veiled': 'Veiled',
  'explicit-delve': 'Delve',
  'explicit-incursion': 'Incursion',
  'explicit-essence': 'Essence',
};
const TYPE_BADGE = { implicit: 'Implicit', crafted: 'Crafted', fractured: 'Fractured', enchant: 'Enchant', veiled: 'Veiled', scourge: 'Scourge' };

function sourceBadge(info) {
  if (!info) return null;
  if (info.mechanic === 'eldritch') return /eater/i.test(info.name || '') ? 'Eater' : 'Exarch';
  return MECHANIC_BADGE[info.mechanic] || TYPE_BADGE[info.type] || null;
}

/**
 * Пометки свойства. У суммы (pseudo) — только особые источники (влияние, крафт, осквернение…),
 * «Implicit» у суммы не пишем, если в ней есть и обычные свойства.
 */
function badgesFor(s) {
  const out = [];
  const sources = s.sources || [];
  for (const src of sources) {
    const b = sourceBadge(src.modifier?.info);
    if (b && !out.includes(b)) out.push(b);
  }
  if (s.tag === 'pseudo' && out.includes('Implicit') && sources.some((src) => !sourceBadge(src.modifier?.info))) {
    out.splice(out.indexOf('Implicit'), 1);
  }
  if (!out.length && MECHANIC_BADGE[s.tag]) out.push(MECHANIC_BADGE[s.tag]);
  return out;
}

const INFLUENCE_LABEL = (v) => `${v[0].toUpperCase()}${v.slice(1)} influence`;

// Параметры предмета → плашки
const ITEM_CHIPS = [
  { key: 'itemLevel', label: 'Item level', max: true },
  { key: 'linkedSockets', label: 'Linked sockets' },
  { key: 'quality', label: 'Quality' },
  { key: 'gemLevel', label: 'Gem level' },
  { key: 'mapTier', label: 'Map tier' },
  { key: 'areaLevel', label: 'Area level' },
];

/**
 * Плашки для окна. id стабильны внутри одного пресета.
 * kind: 'item' — параметр предмета, 'stat' — свойство.
 */
function chipsFor(item, preset) {
  const f = preset.filters;
  const out = [];
  if (f.searchRelaxed) {
    out.push({ id: 'base', kind: 'item', label: `Base: ${item.info.refName}`, enabled: !!f.searchRelaxed.disabled, fields: false });
  }
  for (const c of ITEM_CHIPS) {
    const v = f[c.key];
    if (!v) continue;
    out.push({ id: c.key, kind: 'item', label: c.label, value: v.value, min: v.value, max: c.max ? (v.max ?? '') : null, enabled: !v.disabled, fields: true, maxField: !!c.max });
  }
  (f.influences || []).forEach((inf, i) => {
    out.push({ id: `influence:${i}`, kind: 'item', label: INFLUENCE_LABEL(String(inf.value)), enabled: !inf.disabled, fields: false });
  });
  if (f.corrupted) {
    out.push({ id: 'corrupted', kind: 'item', label: f.corrupted.value ? 'Corrupted' : 'Not corrupted', enabled: f.corrupted.exact !== false, fields: false });
  }
  if (f.unidentified && item.rarity === 'Unique') {
    out.push({ id: 'unidentified', kind: 'item', label: 'Unidentified only', enabled: !f.unidentified.disabled, fields: false });
  }
  const totalRes = preset.stats.findIndex((s) => isStat(s) && s.tradeId.some((id) => /pseudo_total_elemental_resistance$/.test(id)));
  if (preset.socketColors) {
    const c = preset.socketColors.count;
    const words = [['r', 'red'], ['g', 'green'], ['b', 'blue'], ['w', 'white']].filter(([k]) => c[k]).map(([k, w]) => `${c[k]} ${w}`);
    out.push({ id: 'sockets', kind: 'item', label: `Socket colours: ${words.join(', ')}`, sockets: preset.socketColors.groups, enabled: preset.socketColors.enabled, fields: false });
  }
  preset.stats.forEach((s, i) => {
    if (!isStat(s)) return;
    out.push({
      id: `stat:${i}`,
      // Отдельное сопротивление — в шторке под «total Elemental Resistance»
      parent: s.merged && totalRes >= 0 ? `stat:${totalRes}` : null,
      absent: !!s.roll?.zero, // этого сопротивления на предмете нет
      kind: 'stat',
      tag: s.tag,
      crafted: !!(s.crafted || s.tag === 'crafted'),
      badges: badgesFor(s),
      label: s.text,
      value: s.roll ? s.roll.value : null,
      min: s.roll ? s.roll.min : null,
      max: s.roll ? s.roll.max : null,
      range: s.roll?.bounds ? [s.roll.bounds.min, s.roll.bounds.max] : null,
      enabled: !s.disabled,
      fields: !!s.roll,
      maxField: !!s.roll,
    });
  });
  return out;
}

const num = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? '' : Number(v));

/**
 * Применяет правки из окна: { [chipId]: { enabled, min, max } }.
 * Включить можно только то, что есть на предмете: неизвестные id игнорируются.
 */
function applyEdits(preset, edits) {
  const f = preset.filters;
  for (const [id, e] of Object.entries(edits || {})) {
    if (id === 'base' && f.searchRelaxed) f.searchRelaxed.disabled = !!e.enabled;
    else if (id === 'corrupted' && f.corrupted) f.corrupted.exact = !!e.enabled;
    else if (id === 'sockets' && preset.socketColors) preset.socketColors.enabled = !!e.enabled;
    else if (id === 'unidentified' && f.unidentified) f.unidentified.disabled = !e.enabled;
    else if (id.startsWith('influence:')) {
      const inf = (f.influences || [])[Number(id.split(':')[1])];
      if (inf) inf.disabled = !e.enabled;
    } else if (id.startsWith('stat:')) {
      const s = preset.stats[Number(id.split(':')[1])];
      if (!s || !isStat(s)) continue;
      s.disabled = !e.enabled;
      if (s.roll) {
        if ('min' in e) s.roll.min = num(e.min);
        if ('max' in e) s.roll.max = num(e.max);
      }
    } else if (f[id] && ITEM_CHIPS.some((c) => c.key === id)) {
      f[id].disabled = !e.enabled;
      if ('min' in e && num(e.min) !== '') f[id].value = num(e.min);
      if ('max' in e && ITEM_CHIPS.find((c) => c.key === id).max) f[id].max = num(e.max) === '' ? undefined : num(e.max);
    }
  }
  return preset;
}

/**
 * Окончательный запрос: снятые плашки не попадают в поиск.
 * corrupted без отметки убираем совсем (иначе Awakened PoE Trade всё равно добавит «не corrupted»).
 */
function finalizeRequest(body, preset, saleMode) {
  const q = body.query;
  q.status = { option: saleMode === 'available' ? 'available' : 'securable' };
  if (preset.filters.corrupted && preset.filters.corrupted.exact === false) {
    delete q.filters?.misc_filters?.filters?.corrupted;
  }
  // Цвета гнёзд: не меньше стольких же красных/зелёных/синих/белых (всего на предмете)
  if (preset.socketColors?.enabled) {
    q.filters ??= {};
    q.filters.socket_filters ??= { filters: {} };
    q.filters.socket_filters.filters ??= {};
    const sockets = { ...(q.filters.socket_filters.filters.sockets || {}) };
    for (const [k, n] of Object.entries(preset.socketColors.count)) if (n) sockets[k] = n; else delete sockets[k];
    q.filters.socket_filters.filters.sockets = sockets;
    q.filters.socket_filters.disabled = false;
  }
  return body;
}

// Строка свойства из расширенного копирования без диапазонов и пометок: «+1(1-2) to … (crafted)» → «+1 to …»
const cleanLine = (l) => l.replace(/\((-?[\d.]+)-(-?[\d.]+)\)/g, '').replace(/\s+\((implicit|crafted|fractured|enchant|scourge|crucible)\)$/i, '').trim();
const modLines = (item) => String(item.rawText || '').split(/\r?\n/).filter((l) => l && !l.startsWith('{') && !l.startsWith('--------')).map(cleanLine);

const r1 = (v) => Math.round(v * 10) / 10;
const ELEMENTS = ['Fire', 'Cold', 'Lightning'];

/**
 * DPS оружия: физический и стихийный (по стихиям — из свойств «Adds # to # Fire Damage» на оружии).
 * @returns null для не-оружия, иначе { aps, phys, ele, parts: [{ element, dps }] }
 */
function weaponInfo(item) {
  const aps = item.weaponAS;
  if (!aps) return null;
  const phys = r1((item.weaponPHYSICAL || 0) * aps);
  const ele = r1((item.weaponELEMENTAL || 0) * aps);
  const sums = { Fire: 0, Cold: 0, Lightning: 0 };
  for (const l of modLines(item)) {
    const m = /^Adds (\d+) to (\d+) (Fire|Cold|Lightning) Damage$/.exec(l);
    if (m) sums[m[3]] += (Number(m[1]) + Number(m[2])) / 2;
  }
  let parts = ELEMENTS.filter((e) => sums[e] > 0).map((e) => ({ element: e, dps: r1(sums[e] * aps) }));
  // Разложение не сошлось с суммой на предмете — показываем только общий стихийный DPS
  const total = parts.reduce((a, p) => a + p.dps, 0);
  if (!ele || Math.abs(total - ele) > Math.max(1, ele * 0.02)) parts = [];
  return { aps, phys, ele, parts };
}

// Особые свойства для заголовка: дополнительные стрелы и уровни камней
const HIGHLIGHT = [/additional Arrows?\b/i, /to Level of (all .*Gems|Socketed .*Gems)/i];
function highlights(item) {
  const out = [];
  if (item.category === 'Gem') return out; // в описании камня такие слова — не свойства
  for (const l of modLines(item)) if (HIGHLIGHT.some((re) => re.test(l)) && !out.includes(l)) out.push(l);
  return out;
}

module.exports = { socketColors, weaponInfo, highlights, presetFor, MIN_SHARE, IMPORTANT, isImportant, applyDefaults, chipsFor, applyEdits, finalizeRequest, defaultMin, badgesFor };
