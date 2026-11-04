// Сгенерировано scripts/build-core.js — не править вручную.
// Разбор предметов и фильтры: Awakened PoE Trade (c) Alexander Drozdov, MIT License (core/apt/LICENSE).
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// core/src/entry.ts
var entry_exports = {};
__export(entry_exports, {
  CATEGORY_TO_TRADE_ID: () => CATEGORY_TO_TRADE_ID,
  ItemCategory: () => ItemCategory,
  ItemRarity: () => ItemRarity,
  ModifierType: () => ModifierType,
  calculatedStatToFilter: () => calculatedStatToFilter,
  createPresets: () => createPresets,
  createTradeRequest: () => createTradeRequest,
  init: () => init,
  parseClipboard: () => parseClipboard
});
module.exports = __toCommonJS(entry_exports);

// data/en/client_strings.js
var client_strings_default = {
  RARITY_NORMAL: "Normal",
  RARITY_MAGIC: "Magic",
  RARITY_RARE: "Rare",
  RARITY_UNIQUE: "Unique",
  RARITY_GEM: "Gem",
  RARITY_CURRENCY: "Currency",
  RARITY_DIVCARD: "Divination Card",
  RARITY_QUEST: "Quest",
  MAP_TIER: / \(Tier (\d+)\)$/,
  MAP_ITEM_QUANTITY: "Item Quantity: ",
  MAP_ITEM_RARITY: "Item Rarity: ",
  MAP_MONSTER_PACK_SIZE: "Monster Pack Size: ",
  MAP_MORE_MAPS: "More Maps: ",
  MAP_MORE_SCARABS: "More Scarabs: ",
  MAP_MORE_CURRENCY: "More Currency: ",
  MAP_MORE_DIVINATION_CARDS: "More Divination Cards: ",
  MAP_COMPLETION_REWARD: /^Reward: Foil (.*)$/,
  RARITY: "Rarity: ",
  ITEM_CLASS: "Item Class: ",
  ITEM_LEVEL: "Item Level: ",
  CORPSE_LEVEL: "Corpse Level: ",
  TALISMAN_TIER: "Talisman Tier: ",
  GEM_LEVEL: "Level: ",
  STACK_SIZE: "Stack Size: ",
  SOCKETS: "Sockets: ",
  QUALITY: "Quality: ",
  MEMORY_STRANDS: "Memory Strands: ",
  PHYSICAL_DAMAGE: "Physical Damage: ",
  ELEMENTAL_DAMAGE: "Elemental Damage: ",
  CRIT_CHANCE: "Critical Strike Chance: ",
  ATTACK_SPEED: "Attacks per Second: ",
  ARMOUR: "Armour: ",
  EVASION: "Evasion Rating: ",
  ENERGY_SHIELD: "Energy Shield: ",
  TAG_WARD: "Ward: ",
  BLOCK_CHANCE: "Chance to Block: ",
  CORRUPTED: "Corrupted",
  UNIDENTIFIED: "Unidentified",
  ITEM_SUPERIOR: /^Superior (.*)$/,
  MAP_BLIGHTED: /^Blighted (.*)$/,
  MAP_BLIGHT_RAVAGED: /^Blight-ravaged (.*)$/,
  INFLUENCE_SHAPER: "Shaper Item",
  INFLUENCE_ELDER: "Elder Item",
  INFLUENCE_CRUSADER: "Crusader Item",
  INFLUENCE_HUNTER: "Hunter Item",
  INFLUENCE_REDEEMER: "Redeemer Item",
  INFLUENCE_WARLORD: "Warlord Item",
  SECTION_SYNTHESISED: "Synthesised Item",
  ITEM_SYNTHESISED: /^Synthesised (.*)$/,
  VEILED_PREFIX: "Veiled Prefix",
  VEILED_SUFFIX: "Veiled Suffix",
  FLASK_CHARGES: /^Currently has \d+ Charges$/,
  METAMORPH_HELP: "Combine this with four other different samples in Tane's Laboratory.",
  BEAST_HELP: "Right-click to add this to your bestiary.",
  VOIDSTONE_HELP: "Socket this into your Atlas to empower Maps.",
  METAMORPH_BRAIN: /^.* Brain$/,
  METAMORPH_EYE: /^.* Eye$/,
  METAMORPH_LUNG: /^.* Lung$/,
  METAMORPH_HEART: /^.* Heart$/,
  METAMORPH_LIVER: /^.* Liver$/,
  CANNOT_USE_ITEM: "You cannot use this item. Its stats will be ignored",
  QUALITY_ANOMALOUS: /^Anomalous (.*)$/,
  QUALITY_DIVERGENT: /^Divergent (.*)$/,
  QUALITY_PHANTASMAL: /^Phantasmal (.*)$/,
  AREA_LEVEL: "Area Level: ",
  HEIST_WINGS_REVEALED: "Wings Revealed: ",
  HEIST_BLUEPRINT_TARGET: "Heist Target: ",
  HEIST_BLUEPRINT_ENCHANTS: "Enchanted Armaments",
  HEIST_BLUEPRINT_TRINKETS: "Thieves' Trinkets or Currency",
  HEIST_BLUEPRINT_GEMS: "Unusual Gems",
  HEIST_BLUEPRINT_REPLICAS: "Replicas or Experimented Items",
  HEIST_CONTRACT_JOB: /^Requires (?<job>.+) \(Level (?<level>\d+)(?:\s*\(unmet\))?\)$/,
  HEIST_JOB_LOCKPICKING: "Lockpicking",
  HEIST_JOB_BRUTEFORCE: "Brute Force",
  HEIST_JOB_PERCEPTION: "Perception",
  HEIST_JOB_DEMOLITION: "Demolition",
  HEIST_JOB_COUNTERTHAUMATURGY: "Counter-Thaumaturgy",
  HEIST_JOB_TRAPDISARMAMENT: "Trap Disarmament",
  HEIST_JOB_AGILITY: "Agility",
  HEIST_JOB_DECEPTION: "Deception",
  HEIST_JOB_ENGINEERING: "Engineering",
  HEIST_CONTRACT_TARGET: /^Heist Target: .+ \((.+)\)$/,
  HEIST_TARGET_PRICELESS: "Priceless",
  MIRRORED: "Mirrored",
  SPLIT: "Split",
  MODIFIER_LINE: /^(?<type>[^"]+)(?:\s+"(?<name>[^"]*)")?(?:\s+\(Tier: (?<tier>\d+)\))?(?:\s+\(Rank: (?<rank>\d+)\))?$/,
  PREFIX_MODIFIER: "Prefix Modifier",
  SUFFIX_MODIFIER: "Suffix Modifier",
  CRAFTED_PREFIX: "Master Crafted Prefix Modifier",
  CRAFTED_SUFFIX: "Master Crafted Suffix Modifier",
  IMPLICIT_MODIFIER: "Implicit Modifier",
  FRACTURED_PREFIX: "Fractured Prefix Modifier",
  FRACTURED_SUFFIX: "Fractured Suffix Modifier",
  UNSCALABLE_VALUE: " \u2014 Unscalable Value",
  CORRUPTED_IMPLICIT: "Corruption Implicit Modifier",
  MODIFIER_INCREASED: /^(.+?)% Increased$/,
  INCURSION_OPEN: "Open Rooms:",
  INCURSION_OBSTRUCTED: "Obstructed Rooms:",
  EATER_IMPLICIT: /^Eater of Worlds Implicit Modifier \((?<rank>.+)\)$/,
  EXARCH_IMPLICIT: /^Searing Exarch Implicit Modifier \((?<rank>.+)\)$/,
  ITEM_EATER: "Eater of Worlds Item",
  ITEM_EXARCH: "Searing Exarch Item",
  ELDRITCH_MOD_R1: "Lesser",
  ELDRITCH_MOD_R2: "Greater",
  ELDRITCH_MOD_R3: "Grand",
  ELDRITCH_MOD_R4: "Exceptional",
  ELDRITCH_MOD_R5: "Exquisite",
  ELDRITCH_MOD_R6: "Perfect",
  SENTINEL_CHARGE: "Charge: ",
  SHAPER_MODS: ["of Shaping", "The Shaper's", "Elevated Shaper's", "of Elevated Shaping"],
  ELDER_MODS: ["of the Elder", "The Elder's", "Elevated Elder's", "of the Elevated Elder"],
  CRUSADER_MODS: ["Crusader's", "of the Crusade", "Elevated Crusader's", "of the Elevated Crusade"],
  HUNTER_MODS: ["Hunter's", "of the Hunt", "Elevated Hunter's", "of the Elevated Hunt"],
  REDEEMER_MODS: ["of Redemption", "Redeemer's", "Elevated Redeemer's", "of Elevated Redemption"],
  WARLORD_MODS: ["Warlord's", "of the Conquest", "Elevated Warlord's", "of the Elevated Conquest"],
  DELVE_MODS: ["Subterranean", "of the Underground"],
  VEILED_MODS: ["Chosen", "of the Order", "Leo's", "Catarina's", "Elreon's", "Vorici's", "Haku's", "Tora's", "Vagan's", "Brinerot", "of Janus", "It's", "of Hillock", "Gravicius'", "Jorgin's", "Korell's", "Rin's", "of Cameria", "of Aisling", "of Riker"],
  INCURSION_MODS: ["Guatelitzi's", "Xopec's", "Topotante's", "Tacati's", "Matatl's", "of Matatl", "Citaqualotl's", "of Citaqualotl", "of Tacati", "of Guatelitzi", "of Puhuarte"],
  ESSENCE_MODS: ["of the Essence", "Essences"],
  INFAMOUS_MODS: ["of Infamy", "Infamous"],
  FOIL_UNIQUE: "Foil Unique",
  UNMODIFIABLE: "Unmodifiable",
  FOULBORN_NAME: /^Foulborn (.*)$/,
  FOULBORN_MODIFIER: "Foulborn Unique Modifier",
  VESTIGIAL_NAME: /^Vestigial (.*)$/,
  VESTIGIAL_IMPLICIT: "Vestigial Implicit Modifier",
  MAP_AREA: "Map Area: ",
  CHART_SULPHUR: "Dead Man's Sulphur: ",
  MERCENARY_LEVEL: "Mercenary Level: ",
  MERCENARY_BUILD: "Build: ",
  // ---
  CHAT_SYSTEM: /^: (?<body>.+)$/,
  CHAT_TRADE: /^\$(?:<(?<guild_tag>.+?)> )?(?<char_name>.+?): (?<body>.+)$/,
  CHAT_GLOBAL: /^#(?:<(?<guild_tag>.+?)> )?(?<char_name>.+?): (?<body>.+)$/,
  CHAT_PARTY: /^%(?:<(?<guild_tag>.+?)> )?(?<char_name>.+?): (?<body>.+)$/,
  CHAT_GUILD: /^&(?:<(?<guild_tag>.+?)> )?(?<char_name>.+?): (?<body>.+)$/,
  CHAT_WHISPER_TO: /^@To (?<char_name>.+?): (?<body>.+)$/,
  CHAT_WHISPER_FROM: /^@From (?:<(?<guild_tag>.+?)> )?(?<char_name>.+?): (?<body>.+)$/,
  CHAT_WEBTRADE_GEM: /^level (?<gem_lvl>\d+) (?<gem_qual>\d+)% (?<gem_name>.+)$/
};

// core/src/data.ts
var CLIENT_STRINGS = client_strings_default;
var ITEM_BY_TRANSLATED = () => void 0;
var ITEM_BY_REF = () => void 0;
var ITEMS_ITERATOR = function* () {
};
var ALTQ_GEM_NAMES = function* () {
};
var REPLICA_UNIQUE_NAMES = function* () {
};
var STAT_BY_MATCH_STR = () => void 0;
var STAT_BY_MATCH_STR_V2 = () => void 0;
var STAT_BY_REF_V2 = () => void 0;
var STATS_ITERATOR = function* () {
};
function ndjsonFindLines(ndjson) {
  return function* (searchString, andIncludes = []) {
    let start = 0;
    while (start < ndjson.length) {
      const matchPos = ndjson.indexOf(searchString, start);
      if (matchPos === -1) break;
      start = ndjson.lastIndexOf("\n", matchPos) + 1;
      let end = ndjson.indexOf("\n", matchPos);
      if (end === -1) end = ndjson.length;
      const jsonLine = ndjson.slice(start, end);
      if (andIncludes.every((str) => jsonLine.includes(str))) yield JSON.parse(jsonLine);
      start = end + 1;
    }
  };
}
function lines(ndjson) {
  return ndjson.split("\n").filter(Boolean);
}
function loadItems(ndjson) {
  const byName = /* @__PURE__ */ new Map();
  const byRef = /* @__PURE__ */ new Map();
  for (const line of lines(ndjson)) {
    const r = JSON.parse(line);
    const kn = `${r.namespace}::${r.name}`;
    const kr = `${r.namespace}::${r.refName}`;
    if (!byName.has(kn)) byName.set(kn, []);
    byName.get(kn).push(r);
    if (!byRef.has(kr)) byRef.set(kr, []);
    byRef.get(kr).push(r);
  }
  const find = (map) => (ns, name) => {
    const list = map.get(`${ns}::${name}`);
    if (!list) return void 0;
    const out = [];
    for (const r of list) {
      out.push(r);
      if (!r.disc && !r.unique) break;
    }
    return out;
  };
  ITEM_BY_TRANSLATED = find(byName);
  ITEM_BY_REF = find(byRef);
  ITEMS_ITERATOR = ndjsonFindLines(ndjson);
  const names = (it) => {
    const all = [...it].map((i) => i.name);
    return function* () {
      yield* all;
    };
  };
  ALTQ_GEM_NAMES = names(ITEMS_ITERATOR('altQuality":["Anomalous'));
  REPLICA_UNIQUE_NAMES = names(ITEMS_ITERATOR('refName":"Replica'));
}
function loadStats(ndjson) {
  const byRef = /* @__PURE__ */ new Map();
  const byMatcher = /* @__PURE__ */ new Map();
  for (const line of lines(ndjson)) {
    const sg = JSON.parse(line);
    const stats = "stats" in sg ? sg.stats : [sg];
    for (const s of stats) {
      if (!byRef.has(s.ref)) byRef.set(s.ref, sg);
      for (const m of s.matchers) {
        if (!byMatcher.has(m.string)) byMatcher.set(m.string, sg);
        if (m.advanced && !byMatcher.has(m.advanced)) byMatcher.set(m.advanced, sg);
      }
    }
  }
  STAT_BY_REF_V2 = (ref) => byRef.get(ref);
  STAT_BY_MATCH_STR_V2 = (matchStr) => byMatcher.get(matchStr);
  STAT_BY_MATCH_STR = function(matchStr) {
    const statOrGroup = STAT_BY_MATCH_STR_V2(matchStr);
    if (!statOrGroup) return void 0;
    let stat2;
    if ("stats" in statOrGroup) {
      const stats = statOrGroup.stats.filter((s) => s.matchers.some((m) => m.string === matchStr || m.advanced === matchStr));
      if (stats.length !== 1) return void 0;
      stat2 = stats[0];
    } else {
      stat2 = statOrGroup;
    }
    const matcher = stat2.matchers.find((m) => m.string === matchStr || m.advanced === matchStr);
    return { stat: stat2, matcher };
  };
  const _STATS_ITERATOR = ndjsonFindLines(ndjson);
  STATS_ITERATOR = function* (includes, andIncludes) {
    for (const sg of _STATS_ITERATOR(includes, andIncludes)) {
      if ("stats" in sg) yield* sg.stats;
      else yield sg;
    }
  };
}
function pseudoStatByRef(ref) {
  const statOrGroup = STAT_BY_REF_V2(ref);
  if (statOrGroup != null && "stats" in statOrGroup) {
    return statOrGroup.stats.find((stat2) => stat2.ref === ref && "pseudo" in stat2.trade.ids);
  }
  return statOrGroup;
}
function stat(text) {
  return text;
}
function init(itemsNdjson, statsNdjson) {
  loadItems(itemsNdjson);
  loadStats(statsNdjson);
}

// core/shims/neverthrow.js
var Ok = class _Ok {
  constructor(v) {
    this.value = v;
  }
  isOk() {
    return true;
  }
  isErr() {
    return false;
  }
  map(f) {
    return new _Ok(f(this.value));
  }
  andThen(f) {
    return f(this.value);
  }
};
var Err = class {
  constructor(e) {
    this.error = e;
  }
  isOk() {
    return false;
  }
  isErr() {
    return true;
  }
  map() {
    return this;
  }
  andThen() {
    return this;
  }
};
var ok = (v) => new Ok(v);
var err = (e) => new Err(e);

// core/apt/src/parser/advanced-mod-desc.ts
var SCOURGE_LINE = " (scourge)";
var ENCHANT_LINE = " (enchant)";
var IMPLICIT_LINE = " (implicit)";
function parseModInfoLine(line) {
  const [modText, xText2, xText3] = line.slice(1, -1).split("\u2014").map((_) => _.trim());
  let type = "explicit" /* Explicit */;
  let generation;
  let mechanic;
  let name;
  let tier;
  let rank;
  if (CLIENT_STRINGS.EATER_IMPLICIT.test(modText) || CLIENT_STRINGS.EXARCH_IMPLICIT.test(modText)) {
    const match = modText.match(CLIENT_STRINGS.EATER_IMPLICIT) ?? modText.match(CLIENT_STRINGS.EXARCH_IMPLICIT);
    type = "implicit" /* Implicit */;
    mechanic = "eldritch" /* Eldritch */;
    name = CLIENT_STRINGS.EATER_IMPLICIT.test(modText) ? "Eater of Worlds" : "Searing Exarch";
    switch (match.groups.rank) {
      case CLIENT_STRINGS.ELDRITCH_MOD_R1:
        rank = 1;
        break;
      case CLIENT_STRINGS.ELDRITCH_MOD_R2:
        rank = 2;
        break;
      case CLIENT_STRINGS.ELDRITCH_MOD_R3:
        rank = 3;
        break;
      case CLIENT_STRINGS.ELDRITCH_MOD_R4:
        rank = 4;
        break;
      case CLIENT_STRINGS.ELDRITCH_MOD_R5:
        rank = 5;
        break;
      case CLIENT_STRINGS.ELDRITCH_MOD_R6:
        rank = 6;
        break;
    }
  } else {
    const match = modText.match(CLIENT_STRINGS.MODIFIER_LINE);
    if (!match) {
      throw new Error("Invalid regex for mod info line");
    }
    switch (match.groups.type) {
      case CLIENT_STRINGS.IMPLICIT_MODIFIER:
      case CLIENT_STRINGS.CORRUPTED_IMPLICIT:
      case CLIENT_STRINGS.VESTIGIAL_IMPLICIT:
        type = "implicit" /* Implicit */;
        break;
      case CLIENT_STRINGS.FRACTURED_PREFIX:
      case CLIENT_STRINGS.FRACTURED_SUFFIX:
        type = "fractured" /* Fractured */;
        break;
      case CLIENT_STRINGS.CRAFTED_PREFIX:
      case CLIENT_STRINGS.CRAFTED_SUFFIX:
        type = "crafted" /* Crafted */;
        break;
    }
    switch (match.groups.type) {
      case CLIENT_STRINGS.PREFIX_MODIFIER:
      case CLIENT_STRINGS.FRACTURED_PREFIX:
      case CLIENT_STRINGS.CRAFTED_PREFIX:
        generation = "prefix";
        break;
      case CLIENT_STRINGS.SUFFIX_MODIFIER:
      case CLIENT_STRINGS.FRACTURED_SUFFIX:
      case CLIENT_STRINGS.CRAFTED_SUFFIX:
        generation = "suffix";
        break;
      case CLIENT_STRINGS.CORRUPTED_IMPLICIT:
        mechanic = "corrupted" /* Corruption */;
        break;
      case CLIENT_STRINGS.FOULBORN_MODIFIER:
        mechanic = "foulborn" /* Foulborn */;
        break;
      case CLIENT_STRINGS.VESTIGIAL_IMPLICIT:
        mechanic = "vestigial" /* Vestigial */;
        break;
    }
    name = match.groups.name ?? void 0;
    tier = Number(match.groups.tier) || void 0;
    rank = Number(match.groups.rank) || void 0;
  }
  if (!mechanic && name) {
    mechanic = mechanicFromModName(name);
  }
  let tags;
  let rollIncr;
  {
    const incrText = xText3 !== void 0 ? xText3 : xText2 !== void 0 && CLIENT_STRINGS.MODIFIER_INCREASED.test(xText2) ? xText2 : void 0;
    const tagsText = xText2 !== void 0 && incrText !== xText2 ? xText2 : void 0;
    tags = tagsText ? tagsText.split(", ") : [];
    rollIncr = incrText ? Number(CLIENT_STRINGS.MODIFIER_INCREASED.exec(incrText)[1]) : void 0;
  }
  return { type, generation, mechanic, name, tier, rank, tags, rollIncr };
}
function isModInfoLine(line) {
  return line.startsWith("{") && line.endsWith("}");
}
function* groupLinesByMod(lines2) {
  if (!lines2.length || !isModInfoLine(lines2[0])) {
    return;
  }
  let last;
  for (const line of lines2) {
    if (!isModInfoLine(line)) {
      last.statLines.push(line);
    } else {
      if (last) {
        yield last;
      }
      last = { modLine: line, statLines: [] };
    }
  }
  yield last;
}
function parseModType(lines2) {
  let modType;
  if (lines2.some((line) => line.endsWith(SCOURGE_LINE))) {
    modType = "scourge" /* Scourge */;
    lines2 = removeLinesEnding(lines2, SCOURGE_LINE);
  } else if (lines2.some((line) => line.endsWith(ENCHANT_LINE))) {
    modType = "enchant" /* Enchant */;
    lines2 = removeLinesEnding(lines2, ENCHANT_LINE);
  } else if (lines2.some((line) => line.endsWith(IMPLICIT_LINE))) {
    modType = "implicit" /* Implicit */;
    lines2 = removeLinesEnding(lines2, IMPLICIT_LINE);
  } else {
    throw new Error("Expected to be used only on lines that have modifier type");
  }
  return { modType, lines: lines2 };
}
function removeLinesEnding(lines2, ending) {
  return lines2.map(
    (line) => line.endsWith(ending) ? line.slice(0, -ending.length) : line
  );
}
var DIV_BY_100 = 2;
function applyIncr(mod, parsed) {
  const { rollIncr } = mod;
  const { roll } = parsed;
  if (!rollIncr || !roll || roll.unscalable) {
    return null;
  }
  return {
    stat: parsed.stat,
    translation: parsed.translation,
    roll: {
      unscalable: roll.unscalable,
      dp: roll.dp,
      value: incrRoll(roll.value, rollIncr, roll.dp ? DIV_BY_100 : 0),
      min: incrRoll(roll.min, rollIncr, roll.dp ? DIV_BY_100 : 0),
      max: incrRoll(roll.max, rollIncr, roll.dp ? DIV_BY_100 : 0)
    }
  };
}
function incrRoll(value, p, dp) {
  const res = value + value * p / 100;
  const rounding = Math.pow(10, dp);
  return Math.trunc((res + Number.EPSILON) * rounding) / rounding;
}
function mechanicFromModName(name) {
  if (CLIENT_STRINGS.SHAPER_MODS.includes(name)) {
    return "explicit-shaper" /* Shaper */;
  } else if (CLIENT_STRINGS.ELDER_MODS.includes(name)) {
    return "explicit-elder" /* Elder */;
  } else if (CLIENT_STRINGS.HUNTER_MODS.includes(name)) {
    return "explicit-hunter" /* Hunter */;
  } else if (CLIENT_STRINGS.WARLORD_MODS.includes(name)) {
    return "explicit-warlord" /* Warlord */;
  } else if (CLIENT_STRINGS.REDEEMER_MODS.includes(name)) {
    return "explicit-redeemer" /* Redeemer */;
  } else if (CLIENT_STRINGS.CRUSADER_MODS.includes(name)) {
    return "explicit-crusader" /* Crusader */;
  } else if (CLIENT_STRINGS.DELVE_MODS.includes(name)) {
    return "explicit-delve" /* Delve */;
  } else if (CLIENT_STRINGS.VEILED_MODS.includes(name)) {
    return "explicit-veiled" /* Unveiled */;
  } else if (CLIENT_STRINGS.INCURSION_MODS.includes(name)) {
    return "explicit-incursion" /* Incursion */;
  } else if (CLIENT_STRINGS.ESSENCE_MODS.includes(name)) {
    return "explicit-essence" /* Essence */;
  } else if (CLIENT_STRINGS.INFAMOUS_MODS.includes(name)) {
    return "explicit-infamous" /* Infamous */;
  }
  return void 0;
}

// core/apt/src/parser/modifiers.ts
function sumStatsByModType(mods) {
  const out = [];
  for (const modA of mods) {
    for (const statA of modA.stats) {
      if (out.some(
        (merged) => merged.stat.ref === statA.stat.ref && merged.type === modA.info.type
      )) {
        continue;
      }
      const sources = mods.reduce((filtered, modB) => {
        if (modB.info.type === modA.info.type) {
          const targetStat = modB.stats.find(
            (statB) => statB.stat.ref === statA.stat.ref
          );
          if (targetStat) {
            const roll = (applyIncr(modB.info, targetStat) ?? targetStat).roll;
            filtered.push({
              modifier: modB,
              stat: targetStat,
              contributes: roll && {
                value: roll.value,
                min: roll.min,
                max: roll.max
              }
            });
          }
        }
        return filtered;
      }, []);
      out.push({ stat: statA.stat, type: modA.info.type, sources });
    }
  }
  return out;
}
function statSourcesTotal(sources, mode = "sum") {
  if (sources.every((source) => !source.contributes)) {
    return void 0;
  }
  const fn = mode === "sum" ? (a, b) => a + b : (a, b) => Math.max(a, b);
  return sources.length === 1 ? sources[0].contributes : sources.reduce((sum, { contributes }) => {
    contributes = contributes ?? { value: 1, min: 1, max: 1 };
    sum.value = fn(sum.value, contributes.value);
    sum.min = fn(sum.min, contributes.min);
    sum.max = fn(sum.max, contributes.max);
    return sum;
  }, { value: 0, min: 0, max: 0 });
}
function translateStatWithRoll(calc, roll) {
  const { matchers } = calc.stat;
  let translation;
  if (!roll) {
    translation = matchers.find((m) => m.value == null) ?? matchers[0];
  } else {
    translation = matchers.find((m) => m.value === roll.value);
    if (!translation) {
      const sameSign = Math.sign(roll.min) === Math.sign(roll.max);
      translation = sameSign ? matchers.find((m) => m.value == null && Boolean(m.negate) === roll.value < 0) : matchers.find((m) => m.value == null && !m.negate);
    }
    if (!translation) {
      translation = matchers.find((m) => m.value == null);
      if (!translation) throw new Error("never");
    }
  }
  const dp = roll ? calc.stat.dp || calc.sources.some((s) => s.stat.stat.ref === calc.stat.ref && s.stat.roll?.dp) : void 0;
  return { string: translation.string, negate: translation.negate || false, dp };
}
var ModifierType = /* @__PURE__ */ ((ModifierType2) => {
  ModifierType2["Pseudo"] = "pseudo";
  ModifierType2["Explicit"] = "explicit";
  ModifierType2["Implicit"] = "implicit";
  ModifierType2["Crafted"] = "crafted";
  ModifierType2["Enchant"] = "enchant";
  ModifierType2["Scourge"] = "scourge";
  ModifierType2["Necropolis"] = "necropolis";
  ModifierType2["Veiled"] = "veiled";
  ModifierType2["Fractured"] = "fractured";
  ModifierType2["Imbued"] = "imbued";
  return ModifierType2;
})(ModifierType || {});
var ModifierMechanic = /* @__PURE__ */ ((ModifierMechanic2) => {
  ModifierMechanic2["Synthesised"] = "synthesised";
  ModifierMechanic2["Corruption"] = "corrupted";
  ModifierMechanic2["Eldritch"] = "eldritch";
  ModifierMechanic2["Foulborn"] = "foulborn";
  ModifierMechanic2["Vestigial"] = "vestigial";
  ModifierMechanic2["Shaper"] = "explicit-shaper";
  ModifierMechanic2["Elder"] = "explicit-elder";
  ModifierMechanic2["Crusader"] = "explicit-crusader";
  ModifierMechanic2["Hunter"] = "explicit-hunter";
  ModifierMechanic2["Redeemer"] = "explicit-redeemer";
  ModifierMechanic2["Warlord"] = "explicit-warlord";
  ModifierMechanic2["Delve"] = "explicit-delve";
  ModifierMechanic2["Unveiled"] = "explicit-veiled";
  ModifierMechanic2["Incursion"] = "explicit-incursion";
  ModifierMechanic2["Infamous"] = "explicit-infamous";
  ModifierMechanic2["Essence"] = "explicit-essence";
  return ModifierMechanic2;
})(ModifierMechanic || {});

// core/apt/src/parser/meta.ts
var ItemCategory = /* @__PURE__ */ ((ItemCategory2) => {
  ItemCategory2["Map"] = "Map";
  ItemCategory2["CapturedBeast"] = "Captured Beast";
  ItemCategory2["MetamorphSample"] = "Metamorph Sample";
  ItemCategory2["Helmet"] = "Helmet";
  ItemCategory2["BodyArmour"] = "Body Armour";
  ItemCategory2["Gloves"] = "Gloves";
  ItemCategory2["Boots"] = "Boots";
  ItemCategory2["Shield"] = "Shield";
  ItemCategory2["Amulet"] = "Amulet";
  ItemCategory2["Belt"] = "Belt";
  ItemCategory2["Ring"] = "Ring";
  ItemCategory2["Flask"] = "Flask";
  ItemCategory2["AbyssJewel"] = "Abyss Jewel";
  ItemCategory2["Jewel"] = "Jewel";
  ItemCategory2["Quiver"] = "Quiver";
  ItemCategory2["Claw"] = "Claw";
  ItemCategory2["Bow"] = "Bow";
  ItemCategory2["Sceptre"] = "Sceptre";
  ItemCategory2["Wand"] = "Wand";
  ItemCategory2["FishingRod"] = "Fishing Rod";
  ItemCategory2["Staff"] = "Staff";
  ItemCategory2["Warstaff"] = "Warstaff";
  ItemCategory2["Dagger"] = "Dagger";
  ItemCategory2["RuneDagger"] = "Rune Dagger";
  ItemCategory2["OneHandedAxe"] = "One-Handed Axe";
  ItemCategory2["TwoHandedAxe"] = "Two-Handed Axe";
  ItemCategory2["OneHandedMace"] = "One-Handed Mace";
  ItemCategory2["TwoHandedMace"] = "Two-Handed Mace";
  ItemCategory2["OneHandedSword"] = "One-Handed Sword";
  ItemCategory2["TwoHandedSword"] = "Two-Handed Sword";
  ItemCategory2["ClusterJewel"] = "Cluster Jewel";
  ItemCategory2["HeistBlueprint"] = "Heist Blueprint";
  ItemCategory2["HeistContract"] = "Heist Contract";
  ItemCategory2["HeistTool"] = "Heist Tool";
  ItemCategory2["HeistBrooch"] = "Heist Brooch";
  ItemCategory2["HeistGear"] = "Heist Gear";
  ItemCategory2["HeistCloak"] = "Heist Cloak";
  ItemCategory2["Trinket"] = "Trinket";
  ItemCategory2["Invitation"] = "Invitation";
  ItemCategory2["ExpeditionLogbook"] = "Expedition Logbook";
  ItemCategory2["Gem"] = "Gem";
  ItemCategory2["Currency"] = "Currency";
  ItemCategory2["DivinationCard"] = "Divination Card";
  ItemCategory2["Voidstone"] = "Voidstone";
  ItemCategory2["Sentinel"] = "Sentinel";
  ItemCategory2["MemoryLine"] = "Memory Line";
  ItemCategory2["SanctumRelic"] = "Sanctum Relic";
  ItemCategory2["Tincture"] = "Tincture";
  ItemCategory2["Charm"] = "Charm";
  ItemCategory2["Idol"] = "Idol";
  ItemCategory2["Graft"] = "Graft";
  ItemCategory2["Chart"] = "Chart";
  ItemCategory2["MercenaryWarrant"] = "Mercenary Warrant";
  return ItemCategory2;
})(ItemCategory || {});
var WEAPON_ONE_HANDED_MELEE = /* @__PURE__ */ new Set([
  "One-Handed Axe" /* OneHandedAxe */,
  "One-Handed Mace" /* OneHandedMace */,
  "One-Handed Sword" /* OneHandedSword */,
  "Claw" /* Claw */,
  "Dagger" /* Dagger */,
  "Rune Dagger" /* RuneDagger */,
  "Sceptre" /* Sceptre */
]);
var WEAPON_ONE_HANDED = /* @__PURE__ */ new Set([
  "Wand" /* Wand */,
  ...WEAPON_ONE_HANDED_MELEE
]);
var WEAPONE_TWO_HANDED_MELEE = /* @__PURE__ */ new Set([
  "Two-Handed Axe" /* TwoHandedAxe */,
  "Two-Handed Mace" /* TwoHandedMace */,
  "Two-Handed Sword" /* TwoHandedSword */,
  "Staff" /* Staff */,
  "Warstaff" /* Warstaff */
]);
var WEAPON = /* @__PURE__ */ new Set([
  "Fishing Rod" /* FishingRod */,
  "Bow" /* Bow */,
  ...WEAPON_ONE_HANDED,
  ...WEAPONE_TWO_HANDED_MELEE
]);
var ARMOUR = /* @__PURE__ */ new Set([
  "Body Armour" /* BodyArmour */,
  "Boots" /* Boots */,
  "Gloves" /* Gloves */,
  "Helmet" /* Helmet */,
  "Shield" /* Shield */
]);
var JEWELLERY = /* @__PURE__ */ new Set([
  "Amulet" /* Amulet */,
  "Belt" /* Belt */,
  "Ring" /* Ring */
]);
var HEIST_EQUIPMENT = /* @__PURE__ */ new Set([
  "Heist Tool" /* HeistTool */,
  "Heist Brooch" /* HeistBrooch */,
  "Heist Gear" /* HeistGear */,
  "Heist Cloak" /* HeistCloak */
]);
var MAGIC_ONLY_OR_UNIQUE_ITEM = /* @__PURE__ */ new Set([
  "Flask" /* Flask */,
  "Tincture" /* Tincture */,
  "Voidstone" /* Voidstone */,
  "Sanctum Relic" /* SanctumRelic */,
  "Charm" /* Charm */
]);
var CONSUMABLE_CRAFTABLE_ITEM = /* @__PURE__ */ new Set([
  "Map" /* Map */,
  "Heist Blueprint" /* HeistBlueprint */,
  "Heist Contract" /* HeistContract */,
  "Invitation" /* Invitation */,
  "Memory Line" /* MemoryLine */,
  "Expedition Logbook" /* ExpeditionLogbook */,
  "Chart" /* Chart */
]);

// core/apt/src/parser/stat-translations.ts
var LOCALIZED_PAREN_LEFT = /^\s*(?:\(|（)/;
var LOCALIZED_PAREN_RIGHT = /(?:\)|）)\s*$/;
function* linesToStatStrings(lines2) {
  const notParsedLines = [];
  let reminderString = false;
  outer:
    for (let start = 0; start < lines2.length; start += 1) {
      if (lines2[start].match(LOCALIZED_PAREN_LEFT)) {
        reminderString = true;
      }
      if (reminderString && lines2[start].match(LOCALIZED_PAREN_RIGHT)) {
        reminderString = false;
        continue;
      }
      if (reminderString) {
        continue;
      }
      for (let end = start; end < lines2.length; end += 1) {
        let str = lines2.slice(start, end + 1).join("\n");
        const unscalable = str.endsWith(CLIENT_STRINGS.UNSCALABLE_VALUE);
        if (unscalable) {
          str = str.slice(0, -CLIENT_STRINGS.UNSCALABLE_VALUE.length);
        }
        const isParsed = yield { string: str, unscalable };
        if (isParsed) {
          start += end - start;
          continue outer;
        }
      }
      notParsedLines.push(lines2[start]);
    }
  return notParsedLines.filter((line) => line.length);
}
var PLACEHOLDER_MAP = [
  // 0 # -> max 0 #
  [[]],
  // 1 # -> max 1 #
  [[0], []],
  // 2 # -> max 2 #
  [[0, 1], [0], [1], []],
  // 3 # -> max 2 #
  [[0, 1, 2], [1, 2], [0, 2], [0, 1], [2], [1], [0]],
  // 4 # -> max 2 #
  [[0, 1, 2, 3], [1, 2, 3], [0, 2, 3], [0, 1, 3], [0, 1, 2], [2, 3], [1, 3], [1, 2], [0, 3], [0, 2], [0, 1]]
];
function* _statPlaceholderGenerator(stat2) {
  const matches = [];
  const withPlaceholders = stat2.replace(/\(\)/gm, "").replace(/(?<value>(?<!\d|\))[+-]?\d+(?:\.\d+)?)(?:\((?<min>.[^)-]*)(?:-(?<max>[^)]+))?\))?/gm, (_, roll, min, max) => {
    if (min != null && max == null) {
      max = min;
    }
    const captured = {
      roll: Number(roll),
      rollStr: roll,
      decimal: roll.includes(".") || min?.includes(".") || max?.includes(".") || false,
      bounds: { min: Number(min), max: Number(max) }
    };
    matches.push(captured);
    if (Number.isNaN(captured.bounds.min) || Number.isNaN(captured.bounds.max)) {
      captured.bounds = void 0;
      return min != null ? `#(${min}-${max})` : "#";
    } else {
      return "#";
    }
  });
  if (matches.length < PLACEHOLDER_MAP.length) {
    for (const replacements of PLACEHOLDER_MAP[matches.length]) {
      let idx = -1;
      const replaced = withPlaceholders.replace(/#/gm, () => {
        idx += 1;
        return replacements.includes(idx) ? matches[idx].rollStr : "#";
      });
      yield {
        stat: replaced,
        values: matches.filter((_, idx2) => !replacements.includes(idx2))
      };
    }
  }
  yield { stat: stat2, values: [] };
}
function tryParseTranslation(stat2, modType, itemCategory) {
  for (const combination of _statPlaceholderGenerator(stat2.string)) {
    const found = findAndResolveTranslation({
      matchStr: combination.stat,
      modType,
      itemCategory,
      roll: combination.values.length === 1 ? combination.values[0].roll : void 0
    });
    if (!found || !(modType in found.stat.trade.ids)) {
      continue;
    }
    let legacyStatRolls = false;
    if (found.matcher.negate) {
      for (const stat3 of combination.values) {
        stat3.roll *= -1;
        if (stat3.bounds) {
          stat3.bounds.min *= -1;
          stat3.bounds.max *= -1;
        }
      }
    }
    if (found.stat.ref === "# uses remaining") {
      const uses = combination.values[0];
      uses.bounds = {
        min: 1,
        max: uses.bounds?.max ?? uses.roll
      };
    }
    for (const stat3 of combination.values) {
      if (!stat3.bounds) continue;
      if (stat3.bounds.min > stat3.bounds.max) {
        stat3.bounds = {
          max: stat3.bounds.min,
          min: stat3.bounds.max
        };
      }
      if (stat3.roll > stat3.bounds.max) {
        stat3.bounds.max = stat3.roll;
        legacyStatRolls = true;
      }
      if (stat3.roll < stat3.bounds.min) {
        stat3.bounds.min = stat3.roll;
        legacyStatRolls = true;
      }
    }
    if (!combination.values.length && found.matcher.value) {
      combination.values = [{
        roll: found.matcher.value,
        decimal: false,
        bounds: {
          min: found.matcher.value,
          max: found.matcher.value
        }
      }];
    }
    return {
      stat: found.stat,
      translation: found.matcher,
      roll: combination.values.length ? {
        unscalable: stat2.unscalable,
        generation: legacyStatRolls ? "legacy" : void 0,
        dp: found.stat.dp || combination.values.some((stat3) => stat3.decimal),
        value: getRollOrMinmaxAvg(combination.values.map((stat3) => stat3.roll)),
        min: getRollOrMinmaxAvg(combination.values.map((stat3) => stat3.bounds?.min ?? stat3.roll)),
        max: getRollOrMinmaxAvg(combination.values.map((stat3) => stat3.bounds?.max ?? stat3.roll))
      } : void 0
    };
  }
}
function getRollOrMinmaxAvg(values) {
  if (values.length === 2) {
    return (values[0] + values[1]) / 2;
  } else {
    return values[0];
  }
}
function findAndResolveTranslation(params) {
  const { matchStr } = params;
  const statOrGroup = STAT_BY_MATCH_STR_V2(matchStr);
  if (!statOrGroup) return void 0;
  let stat2;
  if (!("stats" in statOrGroup)) {
    stat2 = statOrGroup;
  } else {
    stat2 = _resolveTranslation(statOrGroup, params);
  }
  if (stat2) {
    const matcher = stat2.matchers.find((m) => m.string === matchStr || m.advanced === matchStr);
    if (!matcher) return void 0;
    return { stat: stat2, matcher };
  }
  return void 0;
}
function _resolveTranslation(statGroup, params) {
  const { resolve, stats } = statGroup;
  const { matchStr, modType, itemCategory, roll } = params;
  if (resolve.strat === "select") {
    let idx = resolve.test.findIndex((expected) => expected !== null && testItemCategory(itemCategory ?? null, expected));
    if (idx === -1) idx = resolve.test.indexOf(null);
    return idx !== -1 ? stats[idx] : void 0;
  }
  const onTradeStats = stats.filter((stat2) => modType in stat2.trade.ids);
  if (onTradeStats.length === 1) return onTradeStats[0];
  if (resolve.strat === "trivial-merge") {
    const withMatchStr = matchStr.length ? onTradeStats.filter((stat2) => stat2.matchers.some((m) => m.string === matchStr || m.advanced === matchStr)) : onTradeStats;
    if (!withMatchStr.length) return void 0;
    const merged = withMatchStr[0];
    for (const stat2 of withMatchStr) {
      if (merged === stat2) continue;
      _mergeTradeIdsInto(merged, stat2);
    }
    return merged;
  } else if (resolve.strat === "percent-merge") {
    const pctStat = stats[resolve.kind.indexOf("percent")];
    const matcher = pctStat.matchers.find((m) => m.string === matchStr || m.advanced === matchStr);
    const roll100 = matcher !== void 0 && matcher.value === 100;
    if (roll100) {
      const otherStat = stats[resolve.kind.indexOf("value")];
      const flag = otherStat.matchers.length === 1 && !otherStat.matchers[0].string.includes("#");
      _mergeTradeIdsInto(pctStat, otherStat, flag ? "{empty_if_100}" : "{div_by_100}");
      return pctStat;
    }
    return stats.find((stat2) => stat2.matchers.some((m) => m.string === matchStr || m.advanced === matchStr));
  } else if (resolve.strat === "flag-merge") {
    if (roll === void 0) return void 0;
    const valStat = stats[resolve.kind.indexOf("value")];
    const flagStat = stats[resolve.kind.indexOf("flag")];
    const flagRoll = flagStat.matchers[0].value;
    if (roll === flagRoll) {
      _mergeTradeIdsInto(valStat, flagStat, "{empty}");
    }
    return valStat;
  }
  return void 0;
}
function _mergeTradeIdsInto(dest, source, prefix) {
  for (const modType in source.trade.ids) {
    let tradeId = source.trade.ids[modType][0];
    if (prefix) tradeId = prefix + tradeId;
    if (modType in dest.trade.ids) {
      if (!dest.trade.ids[modType].includes(tradeId)) {
        dest.trade.ids[modType].push(tradeId);
      }
    } else {
      dest.trade.ids[modType] = [tradeId];
    }
  }
}
function testItemCategory(actual, expected) {
  if (actual === null) return false;
  switch (expected) {
    case "WEAPON":
      return WEAPON.has(actual);
    case "ARMOUR":
      return ARMOUR.has(actual);
    case "HEIST_EQUIPMENT":
      return HEIST_EQUIPMENT.has(actual);
    default:
      return expected === actual;
  }
}

// core/apt/src/parser/ParsedItem.ts
var ItemRarity = /* @__PURE__ */ ((ItemRarity2) => {
  ItemRarity2["Normal"] = "Normal";
  ItemRarity2["Magic"] = "Magic";
  ItemRarity2["Rare"] = "Rare";
  ItemRarity2["Unique"] = "Unique";
  return ItemRarity2;
})(ItemRarity || {});

// core/apt/src/parser/magic-name.ts
function magicBasetype(name) {
  const separator = name.includes(" ") ? " " : "";
  const words = name.split(separator);
  const perm = words.flatMap(
    (_, start) => Array(words.length - start).fill(void 0).map(
      (_2, idx) => words.slice(start, start + idx + 1).join(separator)
    )
  );
  const result = perm.map((name2) => {
    const result2 = ITEM_BY_TRANSLATED("ITEM", name2);
    return { name: name2, found: result2 && result2[0].craftable };
  }).filter((res) => res.found).sort((a, b) => b.name.length - a.name.length);
  return result.length ? result[0].name : void 0;
}

// core/apt/src/parser/calc-q20.ts
var QUALITY_STATS = {
  ARMOUR: {
    flat: [stat("+# to Armour")],
    incr: [
      stat("#% increased Armour"),
      stat("#% increased Armour and Energy Shield"),
      stat("#% increased Armour and Evasion"),
      stat("#% increased Armour, Evasion and Energy Shield")
    ]
  },
  EVASION: {
    flat: [stat("+# to Evasion Rating")],
    incr: [
      stat("#% increased Evasion Rating"),
      stat("#% increased Armour and Evasion"),
      stat("#% increased Evasion and Energy Shield"),
      stat("#% increased Armour, Evasion and Energy Shield")
    ]
  },
  ENERGY_SHIELD: {
    flat: [stat("+# to maximum Energy Shield")],
    incr: [
      stat("#% increased Energy Shield"),
      stat("#% increased Armour and Energy Shield"),
      stat("#% increased Evasion and Energy Shield"),
      stat("#% increased Armour, Evasion and Energy Shield")
    ]
  },
  WARD: {
    flat: [stat("+# to Ward")],
    incr: [
      stat("#% increased Ward")
    ]
  },
  PHYSICAL_DAMAGE: {
    flat: [stat("Adds # to # Physical Damage")],
    incr: [
      stat("#% increased Physical Damage")
    ]
  }
};
var QUALITY_CHANGING_ENCHANT = [
  stat("Quality does not increase Defences"),
  stat("Quality does not increase Physical Damage")
];
function getTradeMaxQuality(item) {
  if (item.statsByType.some((calc) => QUALITY_CHANGING_ENCHANT.includes(calc.stat.ref))) {
    return 0;
  }
  return Math.max(20, item.quality ?? 0);
}
function getPropQuality(item) {
  if (item.statsByType.some((calc) => QUALITY_CHANGING_ENCHANT.includes(calc.stat.ref))) {
    return 0;
  }
  return item.quality ?? 0;
}
function propAt20Quality(total, statRefs, bounds, item) {
  const { incr, flat, sources } = calcPropBase(statRefs, item);
  const base = calcFlat(total, incr.value, getPropQuality(item)) - flat.value;
  const [baseMin, baseMax] = bounds ?? [base, base];
  const quality = getTradeMaxQuality(item);
  return {
    roll: !Number.isNaN(base) ? {
      value: calcIncreased(base + flat.value, incr.value, quality),
      min: calcIncreased(baseMin + flat.min, incr.min, quality),
      max: calcIncreased(baseMax + flat.max, incr.max, quality)
    } : { value: 0, min: 0, max: 0 },
    sources: sources.map((source) => ({ ...source, contributes: void 0 }))
  };
}
function calcPropBounds(total, statRefs, item) {
  const { incr, flat, sources } = calcPropBase(statRefs, item);
  const base = calcFlat(total, incr.value) - flat.value;
  return {
    roll: {
      value: calcIncreased(base + flat.value, incr.value),
      min: calcIncreased(base + flat.min, incr.min),
      max: calcIncreased(base + flat.max, incr.max)
    },
    sources: statRefs.incr.length && statRefs.flat.length ? sources.map((source) => ({ ...source, contributes: void 0 })) : statRefs.incr.length ? sources.map((source) => ({
      ...source,
      contributes: {
        value: base * source.contributes.value / 100,
        min: base * source.contributes.min / 100,
        max: base * source.contributes.max / 100
      }
    })) : sources
  };
}
function calcPropPercentile(total, bounds, statRefs, item) {
  const { incr, flat } = calcPropBase(statRefs, item);
  const roll = calcFlat(total, incr.value, getPropQuality(item)) - flat.value;
  const [min, max] = bounds;
  const result = Math.round((roll - min) / (max - min) * 100);
  return Math.min(Math.max(result, 0), 100);
}
function calcPropBase(statRefs, item) {
  const incr = { value: 0, min: 0, max: 0 };
  const flat = { value: 0, min: 0, max: 0 };
  const sources = [];
  for (const calc of item.statsByType) {
    let total;
    if (statRefs.flat.includes(calc.stat.ref)) {
      total = flat;
    } else if (statRefs.incr.includes(calc.stat.ref)) {
      total = incr;
    } else {
      continue;
    }
    const roll = statSourcesTotal(calc.sources);
    total.value += roll.value;
    total.min += roll.min;
    total.max += roll.max;
    sources.push(...calc.sources);
  }
  return { incr, flat, sources };
}
function calcFlat(total, incrPct, morePct = 0) {
  return total / (1 + morePct / 100) / (1 + incrPct / 100);
}
function calcIncreased(flat, incrPct, morePct = 0) {
  return flat * (1 + incrPct / 100) * (1 + morePct / 100);
}

// core/apt/src/parser/Parser.ts
var parsers = [
  parseUnidentified,
  { virtual: parseSuperior },
  { virtual: parseFoulborn },
  { virtual: parseVestigial },
  parseSynthesised,
  parseCategoryByHelpText,
  { virtual: parseMapTier },
  { virtual: normalizeName },
  { virtual: findInDatabase },
  // -----------
  parseItemLevel,
  parseTalismanTier,
  parseGem,
  parseVaalGem,
  parseArmour,
  parseWeapon,
  parseAccessory,
  parseFlask,
  parseTincture,
  parseStackSize,
  parseCorrupted,
  parseImbuedGem,
  parseFoil,
  parseInfluence,
  parseMap,
  parseSockets,
  parseHeistContract,
  parseHeistBlueprint,
  parseChart,
  parseAreaLevel,
  parseAtzoatlRooms,
  parseMirroredTablet,
  parseFilledCoffin,
  parseMirrored,
  parseSplit,
  parseSentinelCharge,
  parseScryingOrb,
  parseMercenary,
  parseLogbookArea,
  parseLogbookArea,
  parseLogbookArea,
  parseMercenaryGems,
  parseMercenaryGems,
  parseMercenaryGems,
  parseMercenaryGems,
  parseMercenaryGems,
  parseMercenaryGems,
  parseModifiers,
  // enchant
  parseModifiers,
  // scourge
  parseModifiers,
  // implicit
  parseModifiers,
  // explicit
  { virtual: augmentModifiers },
  { virtual: transformToLegacyModifiers },
  { virtual: parseFractured },
  { virtual: pickCorrectVariant },
  { virtual: calcDisenchantDust },
  { virtual: calcBasePercentile }
];
var VALUE_AUGMENTED = " (augmented)";
function parseClipboard(clipboard) {
  try {
    let sections = itemTextToSections(clipboard);
    if (sections[0][2] === CLIENT_STRINGS.CANNOT_USE_ITEM) {
      sections[0].pop();
      sections[1].unshift(...sections[0]);
      sections.shift();
    }
    const parsed = parseNamePlate(sections[0]);
    if (!parsed.isOk()) return parsed;
    sections.shift();
    parsed.value.rawText = clipboard;
    for (const parser of parsers) {
      if (typeof parser === "object") {
        const error = parser.virtual(parsed.value);
        if (error) return error;
        continue;
      }
      for (const section of sections) {
        parseEldritchItem(section);
        const result = parser(section, parsed.value);
        if (result === "SECTION_PARSED") {
          sections = sections.filter((s) => s !== section);
          break;
        } else if (result === "PARSER_SKIPPED") {
          break;
        }
      }
    }
    return Object.freeze(parsed);
  } catch (e) {
    console.log(e);
    return err("item.parse_error");
  }
}
function itemTextToSections(text) {
  const lines2 = text.split(/\r?\n/);
  if (lines2[lines2.length - 1] === "") {
    lines2.pop();
  }
  const sections = [[]];
  lines2.reduce((section, line) => {
    if (line !== "--------") {
      section.push(line);
      return section;
    } else {
      const section2 = [];
      sections.push(section2);
      return section2;
    }
  }, sections[0]);
  return sections.filter((section) => section.length);
}
function normalizeName(item) {
  if (item.rarity === "Magic" /* Magic */) {
    const baseType = magicBasetype(item.name);
    if (baseType) {
      item.name = baseType;
    }
  }
  if (item.category === "Metamorph Sample" /* MetamorphSample */) {
    if (CLIENT_STRINGS.METAMORPH_BRAIN.test(item.name)) {
      item.name = "Metamorph Brain";
    } else if (CLIENT_STRINGS.METAMORPH_EYE.test(item.name)) {
      item.name = "Metamorph Eye";
    } else if (CLIENT_STRINGS.METAMORPH_LUNG.test(item.name)) {
      item.name = "Metamorph Lung";
    } else if (CLIENT_STRINGS.METAMORPH_HEART.test(item.name)) {
      item.name = "Metamorph Heart";
    } else if (CLIENT_STRINGS.METAMORPH_LIVER.test(item.name)) {
      item.name = "Metamorph Liver";
    }
  }
}
function findInDatabase(item) {
  let info;
  if (item.category === "Divination Card" /* DivinationCard */) {
    info = ITEM_BY_TRANSLATED("DIVINATION_CARD", item.name);
  } else if (item.category === "Captured Beast" /* CapturedBeast */) {
    info = ITEM_BY_TRANSLATED("CAPTURED_BEAST", item.baseType ?? item.name);
  } else if (item.category === "Gem" /* Gem */) {
    info = ITEM_BY_TRANSLATED("GEM", item.name);
  } else if (item.category === "Metamorph Sample" /* MetamorphSample */) {
    info = ITEM_BY_TRANSLATED("ITEM", item.name);
  } else if (item.category === "Voidstone" /* Voidstone */) {
    info = ITEM_BY_REF("ITEM", "Charged Compass");
  } else if (item.rarity === "Unique" /* Unique */ && !item.isUnidentified) {
    info = ITEM_BY_TRANSLATED("UNIQUE", item.name);
  } else {
    info = ITEM_BY_TRANSLATED("ITEM", item.baseType ?? item.name);
  }
  if (!info?.length) {
    return err("item.unknown");
  }
  if (info[0].unique) {
    const baseTypes = ITEM_BY_TRANSLATED("ITEM", item.baseType);
    if (!baseTypes?.length) return err("item.unknown");
    const baseTypeRef = baseTypes[0].refName;
    info = info.filter((info2) => info2.unique.base === baseTypeRef);
  }
  item.infoVariants = info;
  item.info = info[0];
  if (!item.category) {
    if (item.info.craftable) {
      item.category = item.info.craftable.category;
    } else if (item.info.unique) {
      item.category = ITEM_BY_REF(
        "ITEM",
        item.info.unique.base
      )[0].craftable.category;
    }
  }
}
function parseMapTier(item) {
  const execResult = CLIENT_STRINGS.MAP_TIER.exec(item.baseType || item.name);
  if (!execResult) return;
  item.mapTier = Number(execResult[1]);
  if (item.baseType) {
    item.baseType = item.baseType.replace(execResult[0], "");
  } else {
    item.name = item.name.replace(execResult[0], "");
  }
}
function parseAreaPropNested(line, item) {
  if (line.startsWith(CLIENT_STRINGS.MAP_ITEM_QUANTITY)) {
    item.areaItemQuantity = parseInt(line.slice(CLIENT_STRINGS.MAP_ITEM_QUANTITY.length), 10);
    return true;
  } else if (line.startsWith(CLIENT_STRINGS.MAP_ITEM_RARITY)) {
    item.areaItemRarity = parseInt(line.slice(CLIENT_STRINGS.MAP_ITEM_RARITY.length), 10);
    return true;
  } else if (line.startsWith(CLIENT_STRINGS.MAP_MONSTER_PACK_SIZE)) {
    item.areaPackSize = parseInt(line.slice(CLIENT_STRINGS.MAP_MONSTER_PACK_SIZE.length), 10);
    return true;
  }
  return false;
}
function parseMap(section, item) {
  if (item.category !== "Map" /* Map */) return "PARSER_SKIPPED";
  let isParsed = "SECTION_SKIPPED";
  for (const line of section) {
    if (parseAreaPropNested(line, item)) {
      isParsed = "SECTION_PARSED";
    } else if (line.startsWith(CLIENT_STRINGS.MAP_MORE_MAPS)) {
      item.mapMoreMaps = parseInt(line.slice(CLIENT_STRINGS.MAP_MORE_MAPS.length), 10);
      isParsed = "SECTION_PARSED";
    } else if (line.startsWith(CLIENT_STRINGS.MAP_MORE_SCARABS)) {
      item.mapMoreScarabs = parseInt(line.slice(CLIENT_STRINGS.MAP_MORE_SCARABS.length), 10);
      isParsed = "SECTION_PARSED";
    } else if (line.startsWith(CLIENT_STRINGS.MAP_MORE_CURRENCY)) {
      item.mapMoreCurrency = parseInt(line.slice(CLIENT_STRINGS.MAP_MORE_CURRENCY.length), 10);
      isParsed = "SECTION_PARSED";
    } else if (line.startsWith(CLIENT_STRINGS.MAP_MORE_DIVINATION_CARDS)) {
      item.mapMoreDivCards = parseInt(line.slice(CLIENT_STRINGS.MAP_MORE_DIVINATION_CARDS.length), 10);
      isParsed = "SECTION_PARSED";
    } else if (line.startsWith(CLIENT_STRINGS.MAP_AREA)) {
      const areaName = section[0].slice(CLIENT_STRINGS.MAP_AREA.length);
      const areaInfo = ITEM_BY_TRANSLATED("AREA", areaName);
      if (!areaInfo) throw new Error("Unknown Area name.");
      item.mapArea = areaInfo[0];
      isParsed = "SECTION_PARSED";
    } else if (CLIENT_STRINGS.MAP_COMPLETION_REWARD.test(line)) {
      const rewardName = CLIENT_STRINGS.MAP_COMPLETION_REWARD.exec(line)[1];
      const rewardInfo = ITEM_BY_TRANSLATED("UNIQUE", rewardName);
      if (!rewardInfo) throw new Error("Unknown Unique Item.");
      item.mapCompletionReward = rewardInfo[0];
      isParsed = "SECTION_PARSED";
    }
  }
  return isParsed;
}
function parseFractured(item) {
  if (item.newMods.some((mod) => mod.info.type === "fractured" /* Fractured */)) {
    item.isFractured = true;
  }
}
function pickCorrectVariant(item) {
  item.info = _pickCorrectVariant(item.infoVariants, item) ?? item.infoVariants[0];
  if (item.info.unique) {
    const baseVariants = ITEM_BY_REF("ITEM", item.info.unique.base);
    item.uniqueBase = _pickCorrectVariant(baseVariants, item) ?? baseVariants[0];
  }
}
function _pickCorrectVariant(variants, item) {
  if (variants.length <= 1) return variants[0];
  for (const variant of variants) {
    const cond = variant.disc;
    if (cond.propAR && !item.armourAR) continue;
    if (cond.propEV && !item.armourEV) continue;
    if (cond.propES && !item.armourES) continue;
    if (cond.mapTier) {
      if (!item.mapTier) continue;
      if (cond.mapTier === "W" && !(item.mapTier <= 5)) continue;
      if (cond.mapTier === "Y" && !(item.mapTier >= 6 && item.mapTier <= 10)) continue;
      if (cond.mapTier === "R" && !(item.mapTier >= 11)) continue;
    }
    if (cond.hasImplicit && !item.statsByType.some((calc) => calc.type === "implicit" /* Implicit */ && calc.stat.ref === cond.hasImplicit.ref)) continue;
    if (cond.hasExplicit && !item.statsByType.some((calc) => calc.type === "explicit" /* Explicit */ && calc.stat.ref === cond.hasExplicit.ref)) continue;
    if (cond.sectionText && !item.rawText.includes(cond.sectionText)) continue;
    return variant;
  }
}
function parseNamePlate(section) {
  let line = section.shift();
  if (!line?.startsWith(CLIENT_STRINGS.ITEM_CLASS)) {
    return err("item.parse_error");
  }
  line = section.shift();
  let rarityText;
  if (line?.startsWith(CLIENT_STRINGS.RARITY)) {
    rarityText = line.slice(CLIENT_STRINGS.RARITY.length);
    line = section.shift();
  }
  let name;
  if (line != null) {
    name = markupConditionParser(line);
  } else {
    return err("item.parse_error");
  }
  line = section.shift();
  const baseType = line && markupConditionParser(line);
  const item = {
    rarity: void 0,
    category: void 0,
    name,
    baseType,
    isUnidentified: false,
    isCorrupted: false,
    newMods: [],
    statsByType: [],
    unknownModifiers: [],
    influences: [],
    info: void 0,
    infoVariants: void 0,
    rawText: void 0
  };
  switch (rarityText) {
    case CLIENT_STRINGS.RARITY_CURRENCY:
      item.category = "Currency" /* Currency */;
      break;
    case CLIENT_STRINGS.RARITY_DIVCARD:
      item.category = "Divination Card" /* DivinationCard */;
      break;
    case CLIENT_STRINGS.RARITY_GEM:
      item.category = "Gem" /* Gem */;
      break;
    case CLIENT_STRINGS.RARITY_NORMAL:
    case CLIENT_STRINGS.RARITY_QUEST:
      item.rarity = "Normal" /* Normal */;
      break;
    case CLIENT_STRINGS.RARITY_MAGIC:
      item.rarity = "Magic" /* Magic */;
      break;
    case CLIENT_STRINGS.RARITY_RARE:
      item.rarity = "Rare" /* Rare */;
      break;
    case CLIENT_STRINGS.RARITY_UNIQUE:
      item.rarity = "Unique" /* Unique */;
      break;
  }
  return ok(item);
}
function parseInfluence(section, item) {
  if (section.length <= 2) {
    const countBefore = item.influences.length;
    for (const line of section) {
      switch (line) {
        case CLIENT_STRINGS.INFLUENCE_CRUSADER:
          item.influences.push("Crusader" /* Crusader */);
          break;
        case CLIENT_STRINGS.INFLUENCE_ELDER:
          item.influences.push("Elder" /* Elder */);
          break;
        case CLIENT_STRINGS.INFLUENCE_SHAPER:
          item.influences.push("Shaper" /* Shaper */);
          break;
        case CLIENT_STRINGS.INFLUENCE_HUNTER:
          item.influences.push("Hunter" /* Hunter */);
          break;
        case CLIENT_STRINGS.INFLUENCE_REDEEMER:
          item.influences.push("Redeemer" /* Redeemer */);
          break;
        case CLIENT_STRINGS.INFLUENCE_WARLORD:
          item.influences.push("Warlord" /* Warlord */);
          break;
      }
    }
    if (countBefore < item.influences.length) {
      return "SECTION_PARSED";
    }
  }
  return "SECTION_SKIPPED";
}
function parseCorrupted(section, item) {
  if (section[0] === CLIENT_STRINGS.CORRUPTED) {
    item.isCorrupted = true;
    return "SECTION_PARSED";
  } else if (section[0] === CLIENT_STRINGS.UNMODIFIABLE) {
    item.isCorrupted = true;
    item.isUnmodifiable = true;
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseFoil(section, item) {
  if (item.rarity !== "Unique" /* Unique */) {
    return "PARSER_SKIPPED";
  }
  if (section[0] === CLIENT_STRINGS.FOIL_UNIQUE) {
    item.isFoil = true;
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseUnidentified(section, item) {
  if (section[0] === CLIENT_STRINGS.UNIDENTIFIED) {
    item.isUnidentified = true;
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseItemLevel(section, item) {
  let prefix = CLIENT_STRINGS.ITEM_LEVEL;
  if (item.info.refName === "Filled Coffin") {
    prefix = CLIENT_STRINGS.CORPSE_LEVEL;
  }
  for (const line of section) {
    if (line.startsWith(prefix)) {
      item.itemLevel = Number(line.slice(prefix.length));
      return "SECTION_PARSED";
    }
  }
  return "SECTION_SKIPPED";
}
function parseTalismanTier(section, item) {
  if (section[0].startsWith(CLIENT_STRINGS.TALISMAN_TIER)) {
    item.talismanTier = Number(section[0].slice(CLIENT_STRINGS.TALISMAN_TIER.length));
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseVaalGem(section, item) {
  if (item.category !== "Gem" /* Gem */) return "PARSER_SKIPPED";
  if (section.length === 1) {
    const gemInfo = ITEM_BY_TRANSLATED("GEM", section[0]);
    if (gemInfo) {
      item.vaalGem = gemInfo[0];
      return "SECTION_PARSED";
    }
  }
  return "SECTION_SKIPPED";
}
function parseGem(section, item) {
  if (item.category !== "Gem" /* Gem */) {
    return "PARSER_SKIPPED";
  }
  if (section[1]?.startsWith(CLIENT_STRINGS.GEM_LEVEL)) {
    item.gemLevel = parseInt(section[1].slice(CLIENT_STRINGS.GEM_LEVEL.length), 10);
    parseQualityNested(section, item);
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseImbuedGem(section, item) {
  if (item.category !== "Gem" /* Gem */) return "PARSER_SKIPPED";
  if (section.length === 1) {
    const support = STAT_BY_MATCH_STR(section[0]);
    if (!support) return "SECTION_SKIPPED";
    item.newMods.push({
      info: { tags: [], type: "imbued" /* Imbued */ },
      stats: [{
        stat: support.stat,
        translation: support.matcher
      }]
    });
    item.imbuedGem = true;
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseStackSize(section, item) {
  if (item.rarity !== "Normal" /* Normal */ && item.category !== "Currency" /* Currency */ && item.category !== "Divination Card" /* DivinationCard */) {
    return "PARSER_SKIPPED";
  }
  if (section[0].startsWith(CLIENT_STRINGS.STACK_SIZE)) {
    const [value, max] = section[0].slice(CLIENT_STRINGS.STACK_SIZE.length).replace(/[^\d/]/g, "").split("/").map(Number);
    item.stackSize = { value, max };
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseSockets(section, item) {
  if (section[0].startsWith(CLIENT_STRINGS.SOCKETS)) {
    let sockets = section[0].slice(CLIENT_STRINGS.SOCKETS.length).trimEnd();
    item.sockets = {
      white: sockets.split("W").length - 1,
      linked: void 0
    };
    sockets = sockets.replace(/[^ -]/g, "#");
    if (sockets === "#-#-#-#-#-#") {
      item.sockets.linked = 6;
    } else if (sockets === "# #-#-#-#-#" || sockets === "#-#-#-#-# #" || sockets === "#-#-#-#-#") {
      item.sockets.linked = 5;
    }
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseQualityNested(section, item) {
  for (const line of section) {
    if (line.startsWith(CLIENT_STRINGS.QUALITY)) {
      item.quality = parseInt(line.slice(CLIENT_STRINGS.QUALITY.length), 10);
      return true;
    }
  }
  return false;
}
function parseMemoryStrandsNested(section, item) {
  for (const line of section) {
    if (line.startsWith(CLIENT_STRINGS.MEMORY_STRANDS)) {
      item.memoryStrands = parseInt(line.slice(CLIENT_STRINGS.MEMORY_STRANDS.length), 10);
      return true;
    }
  }
  return false;
}
function parseArmour(section, item) {
  let isParsed = "SECTION_SKIPPED";
  for (const line of section) {
    if (line.startsWith(CLIENT_STRINGS.ARMOUR)) {
      item.armourAR = parseInt(line.slice(CLIENT_STRINGS.ARMOUR.length), 10);
      isParsed = "SECTION_PARSED";
      continue;
    }
    if (line.startsWith(CLIENT_STRINGS.EVASION)) {
      item.armourEV = parseInt(line.slice(CLIENT_STRINGS.EVASION.length), 10);
      isParsed = "SECTION_PARSED";
      continue;
    }
    if (line.startsWith(CLIENT_STRINGS.ENERGY_SHIELD)) {
      item.armourES = parseInt(line.slice(CLIENT_STRINGS.ENERGY_SHIELD.length), 10);
      isParsed = "SECTION_PARSED";
      continue;
    }
    if (line.startsWith(CLIENT_STRINGS.TAG_WARD)) {
      item.armourWARD = parseInt(line.slice(CLIENT_STRINGS.TAG_WARD.length), 10);
      isParsed = "SECTION_PARSED";
      continue;
    }
    if (line.startsWith(CLIENT_STRINGS.BLOCK_CHANCE)) {
      item.armourBLOCK = parseInt(line.slice(CLIENT_STRINGS.BLOCK_CHANCE.length), 10);
      isParsed = "SECTION_PARSED";
      continue;
    }
  }
  if (isParsed === "SECTION_PARSED") {
    parseQualityNested(section, item);
    parseMemoryStrandsNested(section, item);
  }
  return isParsed;
}
function parseWeapon(section, item) {
  let isParsed = "SECTION_SKIPPED";
  for (const line of section) {
    if (line.startsWith(CLIENT_STRINGS.CRIT_CHANCE)) {
      item.weaponCRIT = parseFloat(line.slice(CLIENT_STRINGS.CRIT_CHANCE.length));
      isParsed = "SECTION_PARSED";
      continue;
    }
    if (line.startsWith(CLIENT_STRINGS.ATTACK_SPEED)) {
      item.weaponAS = parseFloat(line.slice(CLIENT_STRINGS.ATTACK_SPEED.length));
      isParsed = "SECTION_PARSED";
      continue;
    }
    if (line.startsWith(CLIENT_STRINGS.PHYSICAL_DAMAGE)) {
      item.weaponPHYSICAL = getRollOrMinmaxAvg(
        line.slice(CLIENT_STRINGS.PHYSICAL_DAMAGE.length).split("-").map((str) => parseInt(str, 10))
      );
      isParsed = "SECTION_PARSED";
      continue;
    }
    if (line.startsWith(CLIENT_STRINGS.ELEMENTAL_DAMAGE)) {
      item.weaponELEMENTAL = line.slice(CLIENT_STRINGS.ELEMENTAL_DAMAGE.length).split(", ").map((element) => getRollOrMinmaxAvg(element.split("-").map((str) => parseInt(str, 10)))).reduce((sum, x) => sum + x, 0);
      isParsed = "SECTION_PARSED";
      continue;
    }
  }
  if (isParsed === "SECTION_PARSED") {
    parseQualityNested(section, item);
    parseMemoryStrandsNested(section, item);
  }
  return isParsed;
}
function parseAccessory(section, item) {
  if (!JEWELLERY.has(item.category) && item.category !== "Quiver" /* Quiver */) return "PARSER_SKIPPED";
  let isParsed = "SECTION_SKIPPED";
  for (const line of section) {
    if (line.endsWith(VALUE_AUGMENTED)) {
      const found = tryParseTranslation({ string: line.slice(0, -VALUE_AUGMENTED.length), unscalable: true }, "pseudo" /* Pseudo */, void 0);
      if (found && found.stat.jewelleryQuality) {
        item.quality = found.roll.value;
        item.newMods.push({
          info: { tags: [], type: "pseudo" /* Pseudo */ },
          stats: [found]
        });
        isParsed = "SECTION_PARSED";
      }
    }
  }
  if (parseMemoryStrandsNested(section, item)) {
    isParsed = "SECTION_PARSED";
  }
  return isParsed;
}
function parseLogbookArea(section, item) {
  if (item.info.refName !== "Expedition Logbook") return "PARSER_SKIPPED";
  if (section.length < 3) return "SECTION_SKIPPED";
  const faction = STAT_BY_MATCH_STR(section[1]);
  if (!faction || !faction.stat.ref.startsWith("Has Logbook Faction:")) return "SECTION_SKIPPED";
  const areaMods = [{
    info: { tags: [], type: "pseudo" /* Pseudo */ },
    stats: [{
      stat: faction.stat,
      translation: faction.matcher
    }]
  }];
  const { modType, lines: lines2 } = parseModType(section.slice(2));
  for (const line of lines2) {
    const found = STAT_BY_MATCH_STR(line);
    if (found && found.stat.better === 0 /* NotComparable */) {
      areaMods.push({
        info: { tags: [], type: modType },
        stats: [{
          stat: found.stat,
          translation: found.matcher
        }]
      });
    }
  }
  if (!item.logbookAreaMods) {
    item.logbookAreaMods = [areaMods];
  } else {
    item.logbookAreaMods.push(areaMods);
  }
  return "SECTION_PARSED";
}
function parseMercenary(section, item) {
  if (item.info.refName !== "Mercenary Warrant") return "PARSER_SKIPPED";
  for (const line of section) {
    if (line.startsWith(CLIENT_STRINGS.MERCENARY_LEVEL)) {
      item.itemLevel = Number(line.slice(CLIENT_STRINGS.MERCENARY_LEVEL.length));
    } else if (line.startsWith(CLIENT_STRINGS.MERCENARY_BUILD)) {
      let buildInfo = ITEM_BY_TRANSLATED("MERCENARY_BUILD", line.slice(CLIENT_STRINGS.MERCENARY_BUILD.length));
      if (!buildInfo) throw new Error("Unknown Mercenary Build.");
      if (typeof buildInfo[0].mercenaryBuild === "string") {
        buildInfo = ITEM_BY_REF("MERCENARY_BUILD", buildInfo[0].mercenaryBuild);
      }
      item.mercenaryBuild = buildInfo[0];
    }
  }
  if (item.mercenaryBuild) {
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseMercenaryGems(section, item) {
  if (item.info.refName !== "Mercenary Warrant") return "PARSER_SKIPPED";
  const skill = tryParseTranslation({ string: section[0], unscalable: true }, "pseudo" /* Pseudo */, "Mercenary Warrant" /* MercenaryWarrant */);
  if (!skill) return "SECTION_SKIPPED";
  const group = [skill];
  for (const line of section.slice(1)) {
    const support = tryParseTranslation({ string: line, unscalable: true }, "pseudo" /* Pseudo */, "Mercenary Warrant" /* MercenaryWarrant */);
    if (support) {
      group.push(support);
    }
    if (!support || support.stat.mercenary.syntheticFamily && support.stat.mercenary.tier !== 3) {
      item.unknownModifiers.push({
        text: `${line} [${section[0]}]`,
        type: "pseudo" /* Pseudo */
      });
    }
  }
  if (!item.mercenarySkills) {
    item.mercenarySkills = [];
  }
  item.mercenarySkills.push(group);
  return "SECTION_PARSED";
}
function parseModifiers(section, item) {
  if (item.rarity !== "Normal" /* Normal */ && item.rarity !== "Magic" /* Magic */ && item.rarity !== "Rare" /* Rare */ && item.rarity !== "Unique" /* Unique */) {
    return "PARSER_SKIPPED";
  }
  const recognizedLine = section.find(
    (line) => line.endsWith(ENCHANT_LINE) || line.endsWith(SCOURGE_LINE) || isModInfoLine(line)
  );
  if (!recognizedLine) {
    return "SECTION_SKIPPED";
  }
  if (isModInfoLine(recognizedLine)) {
    for (const { modLine, statLines } of groupLinesByMod(section)) {
      const modInfo = parseModInfoLine(modLine);
      if (statLines[0] === CLIENT_STRINGS.VEILED_PREFIX || statLines[0] === CLIENT_STRINGS.VEILED_SUFFIX) {
        modInfo.type = "veiled" /* Veiled */;
        item.isVeiled = true;
      }
      parseStatsFromMod(statLines, item, { info: modInfo, stats: [] });
    }
  } else {
    const { modType, lines: lines2 } = parseModType(section);
    const modInfo = {
      type: modType,
      tags: []
    };
    parseStatsFromMod(lines2, item, { info: modInfo, stats: [] });
  }
  return "SECTION_PARSED";
}
function parseMirrored(section, item) {
  if (section[0] === CLIENT_STRINGS.MIRRORED) {
    item.isMirrored = true;
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseSplit(section, item) {
  if (section.length === 1) {
    if (section[0] === CLIENT_STRINGS.SPLIT) {
      item.isSplit = true;
      return "SECTION_PARSED";
    }
  }
  return "SECTION_SKIPPED";
}
function parseFlask(section, item) {
  if (item.category !== "Flask" /* Flask */) return "PARSER_SKIPPED";
  let isParsed = "SECTION_SKIPPED";
  for (const line of section) {
    if (CLIENT_STRINGS.FLASK_CHARGES.test(line)) {
      isParsed = "SECTION_PARSED";
      break;
    }
  }
  if (isParsed === "SECTION_PARSED") {
    parseQualityNested(section, item);
  }
  return isParsed;
}
function parseTincture(section, item) {
  if (item.category !== "Tincture" /* Tincture */) return "PARSER_SKIPPED";
  if (parseQualityNested(section, item)) {
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseSentinelCharge(section, item) {
  if (item.category !== "Sentinel" /* Sentinel */) return "PARSER_SKIPPED";
  if (section.length === 1) {
    if (section[0].startsWith(CLIENT_STRINGS.SENTINEL_CHARGE)) {
      item.sentinelCharge = parseInt(section[0].slice(CLIENT_STRINGS.SENTINEL_CHARGE.length), 10);
      return "SECTION_PARSED";
    }
  }
  return "SECTION_SKIPPED";
}
function parseScryingOrb(section, item) {
  if (item.info.refName !== "Scrying Orb") return "PARSER_SKIPPED";
  if (section.length === 1) {
    if (section[0].startsWith(CLIENT_STRINGS.MAP_AREA)) {
      const areaName = section[0].slice(CLIENT_STRINGS.MAP_AREA.length);
      const areaInfo = ITEM_BY_TRANSLATED("AREA", areaName);
      if (!areaInfo) throw new Error("Unknown Area name.");
      item.mapArea = areaInfo[0];
      return "SECTION_PARSED";
    }
  }
  return "SECTION_SKIPPED";
}
function parseEldritchItem(section) {
  while (section.length) {
    const lastLine = section[section.length - 1];
    if (lastLine === CLIENT_STRINGS.ITEM_EATER || lastLine === CLIENT_STRINGS.ITEM_EXARCH) {
      section.pop();
    } else {
      break;
    }
  }
}
function parseSynthesised(section, item) {
  if (section.length === 1) {
    if (section[0] === CLIENT_STRINGS.SECTION_SYNTHESISED) {
      item.isSynthesised = true;
      if (item.baseType) {
        item.baseType = CLIENT_STRINGS.ITEM_SYNTHESISED.exec(item.baseType)[1];
      } else {
        item.name = CLIENT_STRINGS.ITEM_SYNTHESISED.exec(item.name)[1];
      }
      return "SECTION_PARSED";
    }
  }
  return "SECTION_SKIPPED";
}
function parseSuperior(item) {
  if (item.rarity === "Normal" /* Normal */ || item.rarity === "Magic" /* Magic */ && item.isUnidentified || item.rarity === "Rare" /* Rare */ && item.isUnidentified || item.rarity === "Unique" /* Unique */ && item.isUnidentified) {
    if (CLIENT_STRINGS.ITEM_SUPERIOR.test(item.name)) {
      item.name = CLIENT_STRINGS.ITEM_SUPERIOR.exec(item.name)[1];
    }
  }
}
function parseFoulborn(item) {
  if (item.rarity !== "Unique" /* Unique */ || item.isUnidentified) return;
  if (CLIENT_STRINGS.FOULBORN_NAME.test(item.name)) {
    item.name = CLIENT_STRINGS.FOULBORN_NAME.exec(item.name)[1];
    item.isFoulborn = true;
  }
}
function parseVestigial(item) {
  if (item.rarity !== "Unique" /* Unique */ || !item.baseType) return;
  if (CLIENT_STRINGS.VESTIGIAL_NAME.test(item.baseType)) {
    item.baseType = CLIENT_STRINGS.VESTIGIAL_NAME.exec(item.baseType)[1];
    item.isVestigial = true;
  }
}
function parseCategoryByHelpText(section, item) {
  if (section[0] === CLIENT_STRINGS.BEAST_HELP) {
    item.category = "Captured Beast" /* CapturedBeast */;
    return "SECTION_PARSED";
  } else if (section[0] === CLIENT_STRINGS.METAMORPH_HELP) {
    item.category = "Metamorph Sample" /* MetamorphSample */;
    return "SECTION_PARSED";
  } else if (section[0] === CLIENT_STRINGS.VOIDSTONE_HELP) {
    item.category = "Voidstone" /* Voidstone */;
    return "SECTION_PARSED";
  }
  return "SECTION_SKIPPED";
}
function parseHeistContract(section, item) {
  if (item.category !== "Heist Contract" /* HeistContract */) return "PARSER_SKIPPED";
  if (!parseAreaLevelNested(section, item)) {
    return "SECTION_SKIPPED";
  }
  item.heistContract = {};
  for (const line of section) {
    const jobMatch = line.match(CLIENT_STRINGS.HEIST_CONTRACT_JOB);
    if (jobMatch) {
      switch (jobMatch.groups.job) {
        case CLIENT_STRINGS.HEIST_JOB_LOCKPICKING:
          item.heistContract.requiredJob = "Lockpicking";
          break;
        case CLIENT_STRINGS.HEIST_JOB_BRUTEFORCE:
          item.heistContract.requiredJob = "Brute Force";
          break;
        case CLIENT_STRINGS.HEIST_JOB_PERCEPTION:
          item.heistContract.requiredJob = "Perception";
          break;
        case CLIENT_STRINGS.HEIST_JOB_DEMOLITION:
          item.heistContract.requiredJob = "Demolition";
          break;
        case CLIENT_STRINGS.HEIST_JOB_COUNTERTHAUMATURGY:
          item.heistContract.requiredJob = "Counter-Thaumaturgy";
          break;
        case CLIENT_STRINGS.HEIST_JOB_TRAPDISARMAMENT:
          item.heistContract.requiredJob = "Trap Disarmament";
          break;
        case CLIENT_STRINGS.HEIST_JOB_AGILITY:
          item.heistContract.requiredJob = "Agility";
          break;
        case CLIENT_STRINGS.HEIST_JOB_DECEPTION:
          item.heistContract.requiredJob = "Deception";
          break;
        case CLIENT_STRINGS.HEIST_JOB_ENGINEERING:
          item.heistContract.requiredJob = "Engineering";
          break;
      }
      item.heistContract.jobLevel = Number(jobMatch.groups.level);
      continue;
    }
    const targetMatch = line.match(CLIENT_STRINGS.HEIST_CONTRACT_TARGET);
    if (targetMatch) {
      if (targetMatch[1] === CLIENT_STRINGS.HEIST_TARGET_PRICELESS) {
        item.heistContract.targetValue = "Priceless";
      }
      continue;
    }
  }
  return "SECTION_PARSED";
}
function parseHeistBlueprint(section, item) {
  if (item.category !== "Heist Blueprint" /* HeistBlueprint */) return "PARSER_SKIPPED";
  if (!parseAreaLevelNested(section, item)) {
    return "SECTION_SKIPPED";
  }
  item.heistBlueprint = {};
  for (const line of section) {
    if (line.startsWith(CLIENT_STRINGS.HEIST_BLUEPRINT_TARGET)) {
      const targetText = line.slice(CLIENT_STRINGS.HEIST_BLUEPRINT_TARGET.length);
      switch (targetText) {
        case CLIENT_STRINGS.HEIST_BLUEPRINT_ENCHANTS:
          item.heistBlueprint.target = "Enchants";
          break;
        case CLIENT_STRINGS.HEIST_BLUEPRINT_GEMS:
          item.heistBlueprint.target = "Gems";
          break;
        case CLIENT_STRINGS.HEIST_BLUEPRINT_REPLICAS:
          item.heistBlueprint.target = "Replicas";
          break;
        case CLIENT_STRINGS.HEIST_BLUEPRINT_TRINKETS:
          item.heistBlueprint.target = "Trinkets";
          break;
      }
    } else if (line.startsWith(CLIENT_STRINGS.HEIST_WINGS_REVEALED)) {
      const [revealed, total] = line.slice(CLIENT_STRINGS.HEIST_WINGS_REVEALED.length).split("/");
      item.heistBlueprint.wingsRevealed = parseInt(revealed, 10);
      item.heistBlueprint.wingsTotal = parseInt(total, 10);
    }
  }
  return "SECTION_PARSED";
}
function parseChart(section, item) {
  if (item.category !== "Chart" /* Chart */) return "PARSER_SKIPPED";
  if (!parseAreaLevelNested(section, item)) {
    return "SECTION_SKIPPED";
  }
  const areaInfo = ITEM_BY_TRANSLATED("AREA", section[0]);
  if (!areaInfo) throw new Error("Unknown Area name.");
  item.mapArea = areaInfo[0];
  for (const line of section) {
    if (parseAreaPropNested(line, item)) {
    } else if (line.startsWith(CLIENT_STRINGS.CHART_SULPHUR)) {
      item.chartSulphur = parseInt(line.slice(CLIENT_STRINGS.CHART_SULPHUR.length), 10);
    }
  }
  return "SECTION_PARSED";
}
function parseAreaLevelNested(section, item) {
  for (const line of section) {
    if (line.startsWith(CLIENT_STRINGS.AREA_LEVEL)) {
      item.areaLevel = Number(line.slice(CLIENT_STRINGS.AREA_LEVEL.length));
      return true;
    }
  }
  return false;
}
function parseAreaLevel(section, item) {
  if (item.info.refName !== "Chronicle of Atzoatl" && item.info.refName !== "Expedition Logbook" && item.info.refName !== "Mirrored Tablet" && item.info.refName !== "Forbidden Tome") return "PARSER_SKIPPED";
  if (!parseAreaLevelNested(section, item)) {
    return "SECTION_SKIPPED";
  }
  return "SECTION_PARSED";
}
function parseAtzoatlRooms(section, item) {
  if (item.info.refName !== "Chronicle of Atzoatl") return "PARSER_SKIPPED";
  if (section[0] !== CLIENT_STRINGS.INCURSION_OPEN) return "SECTION_SKIPPED";
  let state = 1 /* Open */;
  for (const line of section.slice(1)) {
    if (line === CLIENT_STRINGS.INCURSION_OBSTRUCTED) {
      state = 2 /* Obstructed */;
      continue;
    }
    const found = STAT_BY_MATCH_STR(line);
    if (found) {
      item.newMods.push({
        info: { tags: [], type: "pseudo" /* Pseudo */ },
        stats: [{
          stat: found.stat,
          translation: {
            string: state === 1 /* Open */ ? found.matcher.string : `${CLIENT_STRINGS.INCURSION_OBSTRUCTED} ${found.matcher.string}`
          },
          roll: { value: state, min: state, max: state, dp: false, unscalable: true }
        }]
      });
    } else {
      item.unknownModifiers.push({
        text: line,
        type: "pseudo" /* Pseudo */
      });
    }
  }
  return "SECTION_PARSED";
}
function parseMirroredTablet(section, item) {
  if (item.info.refName !== "Mirrored Tablet") return "PARSER_SKIPPED";
  if (section.length < 8) return "SECTION_SKIPPED";
  for (const line of section) {
    const found = tryParseTranslation({ string: line, unscalable: true }, "pseudo" /* Pseudo */, void 0);
    if (found) {
      item.newMods.push({
        info: { tags: [], type: "pseudo" /* Pseudo */ },
        stats: [found]
      });
    } else {
      item.unknownModifiers.push({
        text: line,
        type: "pseudo" /* Pseudo */
      });
    }
  }
  return "SECTION_PARSED";
}
function parseFilledCoffin(section, item) {
  if (item.info.refName !== "Filled Coffin") return "PARSER_SKIPPED";
  if (!section.some((line) => line.endsWith(IMPLICIT_LINE))) return "SECTION_SKIPPED";
  const { lines: lines2 } = parseModType(section);
  const modInfo = {
    type: "necropolis" /* Necropolis */,
    tags: []
  };
  parseStatsFromMod(lines2, item, { info: modInfo, stats: [] });
  return "SECTION_PARSED";
}
function markupConditionParser(text) {
  text = text.replace(/<<set:.+?>>/g, "");
  text = text.replace(/<(if:.+?|elif:.+?|else)>{(.+?)}/g, (_, type, body) => {
    return type.startsWith("if:") ? body : "";
  });
  return text;
}
function parseStatsFromMod(lines2, item, modifier) {
  item.newMods.push(modifier);
  if (modifier.info.type === "veiled" /* Veiled */) {
    const found = STAT_BY_MATCH_STR(modifier.info.name);
    if (found) {
      modifier.stats.push({
        stat: found.stat,
        translation: found.matcher
      });
    } else {
      item.unknownModifiers.push({
        text: modifier.info.name,
        type: modifier.info.type
      });
    }
    return;
  }
  const statIterator = linesToStatStrings(lines2);
  let stat2 = statIterator.next();
  while (!stat2.done) {
    const parsedStat = tryParseTranslation(stat2.value, modifier.info.type, item.category);
    if (parsedStat) {
      modifier.stats.push(parsedStat);
      stat2 = statIterator.next(true);
    } else {
      stat2 = statIterator.next(false);
    }
  }
  item.unknownModifiers.push(...stat2.value.map((line) => ({
    text: line,
    type: modifier.info.type
  })));
}
function augmentModifiers(item) {
  for (const mod of item.newMods) {
    if (item.isSynthesised && mod.info.type === "implicit" /* Implicit */) {
      mod.info.mechanic ??= "synthesised" /* Synthesised */;
    }
    for (const stat2 of mod.stats) {
      if (stat2.roll?.generation !== "legacy" || stat2.roll.unscalable) continue;
      if (item.rarity === "Unique" /* Unique */ && item.isCorrupted) {
        stat2.roll.generation = "volatile";
      } else if (item.rarity === "Rare" /* Rare */ && item.isMirrored && (item.category === "Ring" /* Ring */ || item.category === "Amulet" /* Amulet */)) {
        stat2.roll.generation = "reflecting";
      }
    }
  }
}
function transformToLegacyModifiers(item) {
  item.statsByType = sumStatsByModType(item.newMods);
}
function calcBasePercentile(item) {
  const info = item.uniqueBase?.armour ?? item.info.armour;
  if (!info) return;
  if (item.armourAR && info.ar) {
    item.basePercentile = calcPropPercentile(item.armourAR, info.ar, QUALITY_STATS.ARMOUR, item);
  } else if (item.armourEV && info.ev) {
    item.basePercentile = calcPropPercentile(item.armourEV, info.ev, QUALITY_STATS.EVASION, item);
  } else if (item.armourES && info.es) {
    item.basePercentile = calcPropPercentile(item.armourES, info.es, QUALITY_STATS.ENERGY_SHIELD, item);
  } else if (item.armourWARD && info.ward) {
    item.basePercentile = calcPropPercentile(item.armourWARD, info.ward, QUALITY_STATS.WARD, item);
  }
}
function calcDisenchantDust(item) {
  if (!item.info.unique?.disenchantValue) return;
  let increaseByFactors = 0;
  increaseByFactors += item.influences.length * 50;
  if (item.quality) {
    increaseByFactors += item.quality * 2;
  }
  if (item.isCorrupted) {
    for (const mod of item.newMods) {
      if (mod.info.mechanic === "corrupted" /* Corruption */) {
        increaseByFactors += 50;
      }
    }
  }
  const factorsMulti = (increaseByFactors + 100) / 100;
  const term1 = 50;
  const term2 = 2 * (Math.min(Math.max(item.itemLevel, 46), 68) - 46);
  const term3 = Math.floor(3 * (Math.min(Math.max(item.itemLevel, 46), 68) - 46) / 11);
  const term4 = 25 * (Math.min(Math.max(item.itemLevel, 68), 84) - 68);
  const totalMulti = 5 * (term1 + term2 + term3 + term4) * factorsMulti;
  item.dustEquivalent = Math.floor(item.info.unique.disenchantValue * totalMulti);
}

// core/shims/vue.js
var shallowReactive = (x) => x;
var shallowRef = (value) => ({ value });

// core/apt/src/web/price-check/trade/RateLimiter.ts
var RateLimiter = class {
  constructor(max, window) {
    this.max = max;
    this.window = window;
  }
  max;
  window;
  stack = shallowReactive([]);
  queue = shallowRef(0);
  _destroyed = false;
  wait(borrow = true) {
    return this._wait(borrow);
  }
  async _wait(borrow) {
    if (this._destroyed) throw new Error("RateLimiter is no longer active");
    if (this.isFullyUtilized) {
      this.queue.value++;
      await this.stack[0].promise;
      this.queue.value--;
      return this._wait(borrow);
    } else {
      if (borrow) {
        this.push();
      }
    }
  }
  push() {
    const handle = new ResourceHandle(this.window * 1e3, () => {
      const idx = this.stack.indexOf(handle);
      if (idx !== -1) {
        this.stack.splice(idx, 1);
      }
    });
    this.stack.push(handle);
  }
  static async waitMulti(limiters) {
    const _limiters = Array.from(limiters);
    try {
      await Promise.all(_limiters.map((rl) => rl.wait(false)));
    } catch (e) {
      if (e instanceof Error && e.message === "RateLimiter is no longer active") {
        return this.waitMulti(limiters);
      } else {
        throw e;
      }
    }
    if (_limiters.every((rl) => !rl.isFullyUtilized)) {
      _limiters.forEach((rl) => {
        rl.wait();
      });
    } else {
      return this.waitMulti(limiters);
    }
  }
  static estimateTime(count, limiters, ignoreState = false) {
    let simulation;
    {
      const now = Date.now();
      simulation = Array.from(limiters).map((l) => ({
        max: l.max,
        window: l.window,
        stack: ignoreState ? [] : l.stack.map((entry) => entry.releasedAt - now).sort((a, b) => a - b)
      }));
    }
    let total = 0;
    while (count--) {
      while (simulation.some((limit) => limit.stack.length >= limit.max)) {
        const waitTime = simulation.reduce((ms, limit) => limit.stack.length >= limit.max ? Math.max(limit.stack[0] - total, ms) : ms, 0);
        total += waitTime;
        for (const limit of simulation) {
          limit.stack = limit.stack.filter((time) => time > total);
        }
      }
      for (const limit of simulation) {
        limit.stack.push(total + limit.window * 1e3);
      }
    }
    return total;
  }
  isEqualLimit(other) {
    return this.max === other.max && this.window === other.window;
  }
  get isFullyUtilized() {
    return !this.available;
  }
  get available() {
    return Math.max(this.max - this.stack.length, 0);
  }
  destroy() {
    this._destroyed = true;
    if (this.queue.value) {
      this.stack[0].cancel(new Error("RateLimiter is no longer active"));
    }
  }
  toString() {
    return `RateLimiter<max=${this.max}:window=${this.window}>: (stack=${this.stack.length},queue=${this.queue.value})`;
  }
};
var ResourceHandle = class {
  borrowedAt;
  releasedAt;
  promise;
  _tmid;
  _cb;
  _resolve;
  _reject;
  constructor(millis, cb) {
    this.borrowedAt = Date.now();
    this.releasedAt = this.borrowedAt + millis;
    this._cb = cb;
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      this._tmid = setTimeout(() => {
        this._cb();
        this._resolve();
      }, millis);
    });
  }
  cancel(reason) {
    clearTimeout(this._tmid);
    this._cb();
    this._reject(reason);
  }
};

// core/apt/src/web/price-check/trade/common.ts
function tradeTag(item) {
  return item.info.tradeTag;
}
var RATE_LIMIT_RULES = {
  SEARCH: shallowReactive(/* @__PURE__ */ new Set([
    new RateLimiter(1, 5)
  ])),
  EXCHANGE: shallowReactive(/* @__PURE__ */ new Set([
    new RateLimiter(1, 5)
  ])),
  FETCH: shallowReactive(/* @__PURE__ */ new Set([
    new RateLimiter(1, 5)
  ]))
};

// core/apt/src/web/price-check/filters/interfaces.ts
var _INTERNAL_TRADE_IDS = [
  "item.not_group",
  "item.count_one_group",
  "item.base_percentile",
  "item.memory_strands",
  "item.armour",
  "item.evasion_rating",
  "item.energy_shield",
  "item.ward",
  "item.block",
  "item.total_dps",
  "item.physical_dps",
  "item.elemental_dps",
  "item.crit",
  "item.aps",
  "item.has_empty_modifier",
  "item.mercenary_6link",
  "item.map_item_quantity",
  "item.map_item_rarity",
  "item.map_pack_size",
  "item.heist_job_lockpicking",
  "item.heist_job_bruteforce",
  "item.heist_job_perception",
  "item.heist_job_demolition",
  "item.heist_job_counterthaumaturgy",
  "item.heist_job_trapdisarmament",
  "item.heist_job_agility",
  "item.heist_job_deception",
  "item.heist_job_engineering",
  "item.heist_target_priceless",
  "item.heist_wings_revealed",
  "item.heist_wings_total",
  "item.chart_sulphur"
];
var INTERNAL_TRADE_IDS = _INTERNAL_TRADE_IDS;
var FilterTagExtra = /* @__PURE__ */ ((FilterTagExtra2) => {
  FilterTagExtra2["Variant"] = "variant";
  FilterTagExtra2["Property"] = "property";
  FilterTagExtra2["Brick"] = "brick";
  FilterTagExtra2["MercenaryPrimary"] = "mercenary-primary";
  FilterTagExtra2["MercenarySecondary"] = "mercenary-secondary";
  FilterTagExtra2["MercenaryUtility"] = "mercenary-utility";
  FilterTagExtra2["MercenarySupport"] = "mercenary-support";
  FilterTagExtra2["FilterGroup"] = "filter-group";
  return FilterTagExtra2;
})(FilterTagExtra || {});
var FilterTag = {
  ...ModifierType,
  ...ModifierMechanic,
  ...FilterTagExtra
};

// core/shims/dot-prop.js
function setProperty(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) {
    if (o[k] == null || typeof o[k] !== "object") o[k] = {};
    o = o[k];
  }
  o[keys[keys.length - 1]] = value;
  return obj;
}

// core/apt/src/web/price-check/filters/pseudo/utils.ts
function _findAndResolveByRef(name, modType, itemCategory, hint) {
  const statOrGroup = STAT_BY_REF_V2(name);
  if (!statOrGroup) return void 0;
  let stat2;
  if (!("stats" in statOrGroup)) {
    stat2 = statOrGroup;
  } else {
    const { resolve, stats } = statOrGroup;
    if (resolve.strat === "select" || resolve.strat === "trivial-merge") {
      stat2 = _resolveTranslation(statOrGroup, { matchStr: "", itemCategory, modType, roll: void 0 });
    } else {
      if (!hint || hint.expected !== resolve.strat) return void 0;
      if (resolve.strat === "percent-merge") {
        stat2 = stats[resolve.kind.indexOf(hint.pick === "percent" ? "percent" : "value")];
      } else if (resolve.strat === "flag-merge") {
        stat2 = stats[resolve.kind.indexOf(hint.pick === "flag" ? "flag" : "value")];
      }
    }
  }
  if (stat2 && modType in stat2.trade.ids) {
    return stat2;
  }
  return void 0;
}
function findAndResolveByRef(name, modType, itemCategory, hint) {
  const stat2 = _findAndResolveByRef(name, modType, itemCategory, hint);
  if (!stat2) {
    throw new Error(`Unexpected stat shape: ${name}`);
  }
  return stat2;
}
function statToNotFilter(opts) {
  return {
    tradeId: opts.stat.trade.ids[opts.type],
    statRef: opts.stat.ref,
    text: (opts.stat.matchers.find(
      (matcher) => Boolean(matcher.negate) === Boolean(opts.negateString)
    ) ?? opts.stat.matchers[0]).string,
    tag: opts.type,
    sources: [],
    disabled: opts.disabled,
    not: true
  };
}
function metaNotFilter(opts) {
  return {
    tradeId: ["item.not_group"],
    statRef: "Not",
    text: "Not",
    tag: FilterTag.FilterGroup,
    sources: [],
    disabled: opts.disabled
  };
}
function metaCountOneFilter(opts) {
  return {
    tradeId: ["item.count_one_group"],
    statRef: "Count (1)",
    text: "Count (1)",
    tag: FilterTag.FilterGroup,
    sources: [],
    disabled: opts.disabled
  };
}

// core/apt/src/web/price-check/filters/util.ts
function decimalPlaces(value, dp) {
  if (typeof dp === "number") {
    return dp;
  } else if (!dp || Math.abs(value) >= 10) {
    return 0;
  } else {
    return Math.abs(value) < 2.3 ? 2 : 1;
  }
}
function roundRoll(value, dp) {
  const rounding = Math.pow(10, decimalPlaces(value, dp));
  return Math.trunc(value * rounding) / rounding;
}
function percentRoll(value, p, method, dp = false) {
  const res = value + Math.abs(value) * p / 100;
  const rounding = Math.pow(10, decimalPlaces(value, dp));
  return method((res + Number.EPSILON) * rounding) / rounding;
}
function percentRollDelta(value, delta, p, method, dp = false) {
  const res = value + delta * p / 100;
  const rounding = Math.pow(10, decimalPlaces(value, dp));
  return method((res + Number.EPSILON) * rounding) / rounding;
}

// core/apt/src/web/price-check/filters/pseudo/index.ts
var RESISTANCES_INFO = [
  { ref: stat("+#% to All Resistances"), elements: ["fire", "cold", "lightning"], chaos: true },
  { ref: stat("+#% to all Elemental Resistances"), elements: ["fire", "cold", "lightning"] },
  { ref: stat("+#% to Fire Resistance"), elements: ["fire"] },
  { ref: stat("+#% to Cold Resistance"), elements: ["cold"] },
  { ref: stat("+#% to Lightning Resistance"), elements: ["lightning"] },
  { ref: stat("+#% to Fire and Lightning Resistances"), elements: ["fire", "lightning"] },
  { ref: stat("+#% to Fire and Cold Resistances"), elements: ["fire", "cold"] },
  { ref: stat("+#% to Cold and Lightning Resistances"), elements: ["cold", "lightning"] },
  { ref: stat("+#% to Chaos Resistance"), elements: [], chaos: true },
  { ref: stat("+#% to Fire and Chaos Resistances"), elements: ["fire"], chaos: true },
  { ref: stat("+#% to Cold and Chaos Resistances"), elements: ["cold"], chaos: true },
  { ref: stat("+#% to Lightning and Chaos Resistances"), elements: ["lightning"], chaos: true }
];
var ATTRIBUTES_INFO = [
  { ref: stat("+# to all Attributes"), attributes: ["str", "dex", "int"] },
  { ref: stat("+# to Strength"), attributes: ["str"] },
  { ref: stat("+# to Dexterity"), attributes: ["dex"] },
  { ref: stat("+# to Intelligence"), attributes: ["int"] },
  { ref: stat("+# to Strength and Intelligence"), attributes: ["str", "int"] },
  { ref: stat("+# to Strength and Dexterity"), attributes: ["str", "dex"] },
  { ref: stat("+# to Dexterity and Intelligence"), attributes: ["dex", "int"] }
];
var PSEUDO_RULES = [
  {
    pseudo: stat("+#% total Elemental Resistance"),
    disabled: false,
    stats: RESISTANCES_INFO.filter((info) => info.elements.length).map((info) => ({ ref: info.ref, multiplier: info.elements.length, keep: info.chaos }))
  },
  {
    pseudo: stat("+#% total to Fire Resistance"),
    group: "to_x_ele_res",
    stats: RESISTANCES_INFO.filter((info) => info.elements.includes("fire")).map((info) => ({ ref: info.ref, keep: info.elements.length > 1 || info.chaos }))
  },
  {
    pseudo: stat("+#% total to Cold Resistance"),
    group: "to_x_ele_res",
    stats: RESISTANCES_INFO.filter((info) => info.elements.includes("cold")).map((info) => ({ ref: info.ref, keep: info.elements.length > 1 || info.chaos }))
  },
  {
    pseudo: stat("+#% total to Lightning Resistance"),
    group: "to_x_ele_res",
    stats: RESISTANCES_INFO.filter((info) => info.elements.includes("lightning")).map((info) => ({ ref: info.ref, keep: info.elements.length > 1 || info.chaos }))
  },
  {
    pseudo: stat("+#% total to Chaos Resistance"),
    stats: RESISTANCES_INFO.filter((info) => info.chaos === true).map((info) => ({ ref: info.ref, keep: info.elements.length > 0 })),
    mutate(filter) {
      if (filter.sources.length === 1 && filter.sources[0].modifier.info.type === "crafted" /* Crafted */) {
        filter.hidden = "filters.hide_crafted_chaos";
      } else {
        filter.disabled = false;
      }
    }
  },
  {
    pseudo: stat("+# total to all Attributes"),
    group: "to_all_attrs",
    stats: [
      { ref: stat("+# to all Attributes") }
      // NOTE: not including other sources from `ATTRIBUTES_INFO`
    ]
  },
  {
    pseudo: stat("+# total to Strength"),
    group: "to_x_attr",
    stats: ATTRIBUTES_INFO.filter((info) => info.attributes.includes("str")).map((info) => ({ ref: info.ref, keep: info.attributes.length > 1 }))
  },
  {
    pseudo: stat("+# total to Dexterity"),
    group: "to_x_attr",
    stats: ATTRIBUTES_INFO.filter((info) => info.attributes.includes("dex")).map((info) => ({ ref: info.ref, keep: info.attributes.length > 1 }))
  },
  {
    pseudo: stat("+# total to Intelligence"),
    group: "to_x_attr",
    stats: ATTRIBUTES_INFO.filter((info) => info.attributes.includes("int")).map((info) => ({ ref: info.ref, keep: info.attributes.length > 1 }))
  },
  {
    pseudo: stat("+# total maximum Life"),
    disabled: false,
    stats: [
      { ref: stat("+# to maximum Life"), required: true },
      ...ATTRIBUTES_INFO.filter((info) => info.attributes.includes("str")).map((info) => ({ ref: info.ref, multiplier: 5 / 10, keep: true }))
    ]
  },
  {
    pseudo: stat("+# total maximum Mana"),
    stats: [
      { ref: stat("+# to maximum Mana"), required: true },
      ...ATTRIBUTES_INFO.filter((info) => info.attributes.includes("int")).map((info) => ({ ref: info.ref, multiplier: 5 / 10, keep: true }))
    ]
  },
  {
    pseudo: stat("#% total increased maximum Energy Shield"),
    stats: [
      { ref: stat("#% increased maximum Energy Shield") }
    ]
  },
  {
    pseudo: stat("+# total maximum Energy Shield"),
    stats: [
      { ref: stat("+# to maximum Energy Shield") }
      // global
    ]
  },
  {
    pseudo: stat("+#% total Attack Speed"),
    stats: [
      { ref: stat("#% increased Attack Speed") }
      // global
      // { ref: stat('#% increased Attack and Cast Speed') }
    ]
  },
  {
    pseudo: stat("+#% total Cast Speed"),
    stats: [
      { ref: stat("#% increased Cast Speed") }
      // { ref: stat('#% increased Attack and Cast Speed') }
    ]
  },
  {
    pseudo: stat("#% increased Movement Speed"),
    stats: [
      { ref: stat("#% increased Movement Speed") }
    ]
  },
  {
    pseudo: stat("#% total increased Physical Damage"),
    stats: [
      { ref: stat("#% increased Global Physical Damage") }
    ]
  },
  {
    pseudo: stat("+#% Global Critical Strike Chance"),
    group: "global_crit_chance",
    stats: [
      { ref: stat("#% increased Global Critical Strike Chance") }
    ]
  },
  {
    pseudo: stat("+#% total Critical Strike Chance for Spells"),
    replaces: "global_crit_chance",
    stats: [
      { ref: stat("#% increased Spell Critical Strike Chance"), required: true },
      { ref: stat("#% increased Global Critical Strike Chance") }
    ]
  },
  {
    pseudo: stat("+#% Global Critical Strike Multiplier"),
    stats: [
      { ref: stat("+#% to Global Critical Strike Multiplier") }
    ]
  },
  {
    pseudo: stat("#% increased Elemental Damage"),
    group: "incr_ele_dmg",
    stats: [
      { ref: stat("#% increased Elemental Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Lightning Damage"),
    replaces: "incr_ele_dmg",
    stats: [
      { ref: stat("#% increased Lightning Damage"), required: true },
      { ref: stat("#% increased Elemental Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Cold Damage"),
    replaces: "incr_ele_dmg",
    stats: [
      { ref: stat("#% increased Cold Damage"), required: true },
      { ref: stat("#% increased Elemental Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Fire Damage"),
    group: "incr_fire_dmg",
    replaces: "incr_ele_dmg",
    stats: [
      { ref: stat("#% increased Fire Damage"), required: true },
      { ref: stat("#% increased Elemental Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Spell Damage"),
    group: "incr_spell_dmg",
    stats: [
      { ref: stat("#% increased Spell Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Lightning Spell Damage"),
    replaces: "incr_spell_dmg",
    stats: [
      { ref: stat("#% increased Lightning Spell Damage"), required: true },
      { ref: stat("#% increased Spell Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Cold Spell Damage"),
    replaces: "incr_spell_dmg",
    stats: [
      { ref: stat("#% increased Cold Spell Damage"), required: true },
      { ref: stat("#% increased Spell Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Fire Spell Damage"),
    replaces: "incr_spell_dmg",
    stats: [
      { ref: stat("#% increased Fire Spell Damage"), required: true },
      { ref: stat("#% increased Spell Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Elemental Damage with Attack Skills"),
    replaces: "incr_ele_dmg",
    stats: [
      { ref: stat("#% increased Elemental Damage with Attack Skills"), required: true },
      { ref: stat("#% increased Elemental Damage") }
    ]
  },
  {
    pseudo: stat("#% increased Burning Damage"),
    replaces: "incr_fire_dmg",
    stats: [
      { ref: stat("#% increased Burning Damage"), required: true },
      { ref: stat("#% increased Fire Damage") },
      { ref: stat("#% increased Elemental Damage") }
    ]
  },
  {
    pseudo: stat("# Life Regenerated per Second"),
    stats: [
      { ref: stat("Regenerate # Life per second") }
    ]
  },
  {
    pseudo: stat("#% of Life Regenerated per Second"),
    stats: [
      { ref: stat("Regenerate #% of Life per second") }
    ]
  },
  {
    pseudo: stat("#% of Physical Attack Damage Leeched as Life"),
    stats: [
      { ref: stat("#% of Physical Attack Damage Leeched as Life") }
    ]
  },
  {
    pseudo: stat("#% of Physical Attack Damage Leeched as Mana"),
    stats: [
      { ref: stat("#% of Physical Attack Damage Leeched as Mana") }
    ]
  },
  {
    pseudo: stat("#% increased Mana Regeneration Rate"),
    stats: [
      { ref: stat("#% increased Mana Regeneration Rate") }
    ]
  }
];
function filterPseudo(ctx) {
  const filterByGroup = /* @__PURE__ */ new Map();
  const appliedRules = [];
  rulesLoop:
    for (const rule of PSEUDO_RULES) {
      const sources = filterPseudoSources(ctx.statsByType, ({ stat: stat2 }, source) => {
        const info = rule.stats.find((info2) => info2.ref === stat2.ref);
        if (!info) return null;
        const multi = info.multiplier ?? 1;
        return {
          ...source,
          contributes: {
            value: source.contributes.value * multi,
            min: source.contributes.min * multi,
            max: source.contributes.max * multi
          }
        };
      });
      if (!sources.length) continue;
      if (rule.stats.some((s) => s.required)) {
        for (const stat2 of rule.stats) {
          if (stat2.required && !sources.some((source) => source.stat.stat.ref === stat2.ref)) {
            continue rulesLoop;
          }
        }
      }
      if (ctx.item.rarity === "Unique" /* Unique */) {
        if (ctx.item.isCorrupted) {
          if (sources.length < 2) continue;
        } else {
          const explicitSources = sources.filter((source) => source.modifier.info.type === "explicit" /* Explicit */);
          if (explicitSources.length < 2) continue;
        }
      }
      const filter = calculatedStatToFilter({
        stat: pseudoStatByRef(rule.pseudo),
        type: "pseudo" /* Pseudo */,
        sources
      }, ctx.searchInRange, ctx.item);
      filter.disabled = rule.disabled ?? true;
      if (rule.mutate) {
        rule.mutate(filter);
      }
      ctx.filters.push(filter);
      appliedRules.push(rule);
      if (rule.replaces && filterByGroup.has(rule.replaces)) {
        const replacedFilters = filterByGroup.get(rule.replaces);
        ctx.filters = ctx.filters.filter((filter2) => !replacedFilters.includes(filter2));
      }
      if (rule.group) {
        if (filterByGroup.has(rule.group)) {
          filterByGroup.get(rule.group).push(filter);
        } else {
          filterByGroup.set(rule.group, [filter]);
        }
      }
    }
  ctx.statsByType = ctx.statsByType.filter((m) => !appliedRules.some((rule) => rule.stats.some(({ ref, keep }) => m.stat.ref === ref && (!keep || ctx.item.rarity !== "Unique" /* Unique */))));
  if (filterByGroup.has("to_x_ele_res")) {
    const resFilters = filterByGroup.get("to_x_ele_res");
    resFilters.sort((a, b) => b.roll.value - a.roll.value);
    const maxFilter = resFilters[0]?.roll?.value === resFilters[1]?.roll?.value ? void 0 : resFilters[0];
    void maxFilter;
    for (const filter of resFilters) {
      filter.hidden = "filters.hide_ele_res";
    }
  }
  if (filterByGroup.has("to_x_attr")) {
    const attrFilters = filterByGroup.get("to_x_attr");
    attrFilters.sort((a, b) => b.roll.value - a.roll.value);
    if (attrFilters.length === 3) {
      const toAll = filterByGroup.get("to_all_attrs");
      if (attrFilters.every((f) => f.roll.value === attrFilters[0].roll.value) && toAll != null) {
        ctx.filters = ctx.filters.filter((filter) => !attrFilters.includes(filter));
      } else {
        if (toAll != null) {
          ctx.filters = ctx.filters.filter((filter) => !toAll.includes(filter));
        }
        if (attrFilters[2].roll.value / attrFilters[0].roll.value < 0.3) {
          if (attrFilters[1].roll.value === attrFilters[2].roll.value) {
            attrFilters[1].hidden = "hide_attr_same_2nd_n_3rd";
            attrFilters[2].hidden = "hide_attr_same_2nd_n_3rd";
          } else {
            attrFilters[2].hidden = "hide_attr_smallest_total";
          }
        }
      }
    }
  }
}
function filterPseudoSources(stats, mapFn) {
  const out = [];
  for (const calc of stats) {
    for (const source of calc.sources) {
      const result = mapFn(calc, source);
      if (result) {
        out.push(result);
      }
    }
  }
  return out;
}

// core/apt/src/web/price-check/filters/pseudo/atzoatl-rules.ts
var HIDDEN_GREEDY = "filters.hide_greedy";
var RULES = [
  { ref: stat("Has Room: Banquet Hall"), remove: true },
  { ref: stat("Has Room: Antechamber"), remove: true },
  { ref: stat("Has Room: Passageways"), remove: true },
  { ref: stat("Has Room: Cloister"), remove: true },
  { ref: stat("Has Room: Tunnels"), remove: true },
  { ref: stat("Has Room: Cellar"), remove: true },
  { ref: stat("Has Room: Chasm"), remove: true },
  { ref: stat("Has Room: Halls"), remove: true },
  { ref: stat("Has Room: Tombs"), remove: true },
  { ref: stat("Has Room: Pits"), remove: true },
  { ref: stat("Has Room: Shrine of Empowerment (Tier 1)"), remove: true },
  { ref: stat("Has Room: Sanctum of Unity (Tier 2)"), remove: true },
  { ref: stat("Has Room: Temple Nexus (Tier 3)"), remove: true },
  { ref: stat("Has Room: Explosives Room (Tier 1)"), remove: true, explosivesRoom: true },
  { ref: stat("Has Room: Demolition Lab (Tier 2)"), remove: true, explosivesRoom: true },
  { ref: stat("Has Room: Shrine of Unmaking (Tier 3)"), remove: true, explosivesRoom: true },
  // TierApex
  { ref: stat("Has Room: Apex of Atzoatl"), disabled: false },
  // Tier0
  { ref: stat("Has Room: Corruption Chamber (Tier 1)"), remove: true },
  { ref: stat("Has Room: Catalyst of Corruption (Tier 2)"), remove: true },
  { ref: stat("Has Room: Locus of Corruption (Tier 3)"), disabled: false },
  // Tier0
  { ref: stat("Has Room: Gemcutter's Workshop (Tier 1)"), remove: true },
  { ref: stat("Has Room: Department of Thaumaturgy (Tier 2)"), remove: true },
  { ref: stat("Has Room: Doryani's Institute (Tier 3)"), disabled: false },
  // Tier0
  { ref: stat("Has Room: Sacrificial Chamber (Tier 1)"), remove: true },
  { ref: stat("Has Room: Hall of Offerings (Tier 2)"), remove: true },
  { ref: stat("Has Room: Apex of Ascension (Tier 3)"), disabled: false },
  // Tier1
  { ref: stat("Has Room: Vault (Tier 1)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Treasury (Tier 2)") },
  { ref: stat("Has Room: Wealth of the Vaal (Tier 3)"), disabled: false },
  // Tier1
  { ref: stat("Has Room: Surveyor's Study (Tier 1)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Office of Cartography (Tier 2)") },
  { ref: stat("Has Room: Atlas of Worlds (Tier 3)") },
  // Tier1
  { ref: stat("Has Room: Hall of Mettle (Tier 1)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Hall of Heroes (Tier 2)") },
  { ref: stat("Has Room: Hall of Legends (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Storage Room (Tier 1)"), remove: true },
  { ref: stat("Has Room: Warehouses (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Museum of Artefacts (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Guardhouse (Tier 1)"), remove: true },
  { ref: stat("Has Room: Barracks (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Hall of War (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Workshop (Tier 1)"), remove: true },
  { ref: stat("Has Room: Engineering Department (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Factory (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Royal Meeting Room (Tier 1)"), remove: true },
  { ref: stat("Has Room: Hall of Lords (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Throne of Atziri (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Torment Cells (Tier 1)"), remove: true },
  { ref: stat("Has Room: Torture Cages (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Sadist's Den (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Strongbox Chamber (Tier 1)"), remove: true },
  { ref: stat("Has Room: Hall of Locks (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Court of Sealed Death (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Jeweller's Workshop (Tier 1)"), remove: true },
  { ref: stat("Has Room: Jewellery Forge (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: Glittering Halls (Tier 3)") },
  // Tier2
  { ref: stat("Has Room: Splinter Research Lab (Tier 1)"), remove: true },
  { ref: stat("Has Room: Breach Containment Chamber (Tier 2)"), hidden: HIDDEN_GREEDY },
  { ref: stat("Has Room: House of the Others (Tier 3)") },
  // Tier3
  { ref: stat("Has Room: Tempest Generator (Tier 1)"), remove: true },
  { ref: stat("Has Room: Hurricane Engine (Tier 2)"), remove: true },
  { ref: stat("Has Room: Storm of Corruption (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Armourer's Workshop (Tier 1)"), remove: true },
  { ref: stat("Has Room: Armoury (Tier 2)"), remove: true },
  { ref: stat("Has Room: Chamber of Iron (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Sparring Room (Tier 1)"), remove: true },
  { ref: stat("Has Room: Arena of Valour (Tier 2)"), remove: true },
  { ref: stat("Has Room: Hall of Champions (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Poison Garden (Tier 1)"), remove: true },
  { ref: stat("Has Room: Cultivar Chamber (Tier 2)"), remove: true },
  { ref: stat("Has Room: Toxic Grove (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Hatchery (Tier 1)"), remove: true },
  { ref: stat("Has Room: Automaton Lab (Tier 2)"), remove: true },
  { ref: stat("Has Room: Hybridisation Chamber (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Trap Workshop (Tier 1)"), remove: true },
  { ref: stat("Has Room: Temple Defense Workshop (Tier 2)"), remove: true },
  { ref: stat("Has Room: Defense Research Lab (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Flame Workshop (Tier 1)"), remove: true },
  { ref: stat("Has Room: Omnitect Forge (Tier 2)"), remove: true },
  { ref: stat("Has Room: Crucible of Flame (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Lightning Workshop (Tier 1)"), remove: true },
  { ref: stat("Has Room: Omnitect Reactor Plant (Tier 2)"), remove: true },
  { ref: stat("Has Room: Conduit of Lightning (Tier 3)"), hidden: HIDDEN_GREEDY },
  // Tier3
  { ref: stat("Has Room: Pools of Restoration (Tier 1)"), remove: true },
  { ref: stat("Has Room: Sanctum of Vitality (Tier 2)"), remove: true },
  { ref: stat("Has Room: Sanctum of Immortality (Tier 3)"), hidden: HIDDEN_GREEDY }
];
function applyRules(filters) {
  for (const filter of filters) {
    filter.disabled = true;
  }
  const hasExplosives = RULES.filter((rule) => rule.explosivesRoom).some((rule) => filters.some((filter) => filter.statRef === rule.ref && filter.option.value === 1 /* Open */));
  for (const rule of RULES) {
    const index = filters.findIndex((filter2) => filter2.statRef === rule.ref);
    if (index === -1) continue;
    const filter = filters[index];
    const isObstructed = filter.option.value === 2 /* Obstructed */;
    if (rule.remove || isObstructed && !hasExplosives) {
      filters.splice(index, 1);
      continue;
    }
    if (rule.hidden !== void 0) {
      filter.hidden = rule.hidden;
    }
    if (rule.disabled !== void 0) {
      filter.disabled = rule.disabled;
    }
    if (isObstructed) {
      filter.option = void 0;
    }
  }
}

// core/apt/src/web/price-check/filters/pseudo/reflection-rules.ts
var RULES2 = [
  { ref: stat("Reflection of the Breachlord (Difficulty #)") },
  { ref: stat("Reflection of Delirium (Difficulty #)"), difficulty: "any" },
  { ref: stat("Reflection of Tyranny (Difficulty #)") },
  { ref: stat("Reflection of the Trove (Difficulty #)") },
  { ref: stat("Reflection of Thralldom (Difficulty #)") },
  { ref: stat("Reflection of Phaaryl (Difficulty #)") },
  { ref: stat("Reflection of Perverted Faith (Difficulty #)") },
  { ref: stat("Reflection of Kalandra (Difficulty #)"), disabled: false },
  { ref: stat("Reflection of Experimentation (Difficulty #)") },
  { ref: stat("Reflection of the Sun (Difficulty #)"), disabled: false },
  { ref: stat("Reflection of the Monolith (Difficulty #)") },
  { ref: stat("Reflection of the Nightmare (Difficulty #)") },
  { ref: stat("Reflection of Azurite (Difficulty #)") },
  { ref: stat("Reflection of Paradise (Difficulty #)"), disabled: false },
  { ref: stat("Reflection of Angling (Difficulty #)"), disabled: false }
];
function applyRules2(filters) {
  for (let i = 0; i < filters.length; ) {
    const filter = filters[i];
    const rule = RULES2.find((rule2) => rule2.ref === filter.statRef);
    if (!rule) {
      const difficulty = filter.roll.value;
      if (difficulty < 8) {
        filters.splice(i, 1);
        continue;
      } else {
        filter.hidden = "low_tier_reflection";
      }
    } else {
      if (rule.difficulty === "any") {
        filter.roll = void 0;
      }
      if (rule.disabled !== void 0) {
        filter.disabled = rule.disabled;
      }
    }
    i += 1;
  }
}

// core/apt/src/web/price-check/filters/pseudo/maps.ts
var PSEUDO = {
  MORE_SCARABS: stat("More Scarabs: #%"),
  MORE_MAPS: stat("More Maps: #%"),
  MORE_DIVINATION_CARDS: stat("More Divination Cards: #%"),
  MORE_CURRENCY: stat("More Currency: #%"),
  EXPLICIT_MODIFIERS: stat("# Modifiers")
};
var VALDO_LETHAL_STATS = [
  stat("Players who Die in area are sent to the Void")
];
function areaProps({ disabled }, ctx) {
  const { item } = ctx;
  if (item.areaItemQuantity) {
    ctx.filters.push(propToFilter({
      ref: "Item Quantity: +#%",
      tradeId: "item.map_item_quantity",
      roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.areaItemQuantity },
      sources: [],
      disabled: disabled.itemQuantity
    }, ctx));
  }
  if (item.areaItemRarity) {
    ctx.filters.push(propToFilter({
      ref: "Item Rarity: +#%",
      tradeId: "item.map_item_rarity",
      roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.areaItemRarity },
      sources: [],
      disabled: disabled.itemRarity
    }, ctx));
  }
  if (item.areaPackSize) {
    ctx.filters.push(propToFilter({
      ref: "Monster Pack Size: +#%",
      tradeId: "item.map_pack_size",
      roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.areaPackSize },
      sources: [],
      disabled: disabled.packSize
    }, ctx));
  }
}
function mapProps(bulk, ctx) {
  const { item } = ctx;
  if (item.category !== "Map" /* Map */ || item.mapCompletionReward || item.rarity === "Unique" /* Unique */) return;
  if (!bulk) {
    const hasValuableDrops = Boolean(item.mapMoreScarabs || item.mapMoreCurrency || item.mapMoreDivCards);
    areaProps({
      disabled: {
        itemQuantity: false,
        itemRarity: hasValuableDrops,
        packSize: false
      }
    }, ctx);
    if (item.mapMoreMaps) {
      ctx.filters.push(noSourcePseudoToFilter({
        pseudo: pseudoStatByRef(PSEUDO.MORE_MAPS),
        roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.mapMoreMaps },
        disabled: true
      }, ctx));
    }
    if (item.mapMoreScarabs) {
      ctx.filters.push(noSourcePseudoToFilter({
        pseudo: pseudoStatByRef(PSEUDO.MORE_SCARABS),
        roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.mapMoreScarabs },
        disabled: false
      }, ctx));
    }
    if (item.mapMoreCurrency) {
      ctx.filters.push(noSourcePseudoToFilter({
        pseudo: pseudoStatByRef(PSEUDO.MORE_CURRENCY),
        roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.mapMoreCurrency },
        disabled: false
      }, ctx));
    }
    if (item.mapMoreDivCards) {
      ctx.filters.push(noSourcePseudoToFilter({
        pseudo: pseudoStatByRef(PSEUDO.MORE_DIVINATION_CARDS),
        roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.mapMoreDivCards },
        disabled: false
      }, ctx));
    }
  }
  const explicitMods = item.newMods.filter((mod) => mod.info.generation === "prefix" || mod.info.generation === "suffix");
  if (explicitMods.length === 8) {
    ctx.filters.push(noSourcePseudoToFilter({
      pseudo: pseudoStatByRef(PSEUDO.EXPLICIT_MODIFIERS),
      roll: { min: 0, max: 8, value: explicitMods.length },
      disabled: false
    }, { ...ctx, searchInRange: 0 }));
  }
}
function chartProps(bulk, ctx) {
  const { item } = ctx;
  if (bulk || item.category !== "Chart" /* Chart */) return;
  areaProps({
    disabled: {
      itemQuantity: false,
      itemRarity: false,
      packSize: false
    }
  }, ctx);
  if (item.chartSulphur) {
    ctx.filters.push(propToFilter({
      ref: "Dead Man's Sulphur: +#%",
      tradeId: "item.chart_sulphur",
      roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.chartSulphur },
      sources: [],
      disabled: false
    }, ctx));
  }
}
function valdoBadMods(ctx) {
  if (!ctx.item.mapCompletionReward) return;
  for (const lethalStatRef of VALDO_LETHAL_STATS) {
    if (ctx.item.statsByType.some((calc) => calc.stat.ref === lethalStatRef)) continue;
    const lethalStat = findAndResolveByRef(lethalStatRef, "explicit" /* Explicit */, ctx.item.category);
    const filter = statToNotFilter({
      stat: lethalStat,
      type: "explicit" /* Explicit */,
      disabled: false
    });
    ctx.filters.push(filter);
  }
}

// core/apt/src/web/price-check/filters/pseudo/flasks.ts
var STATS = {
  INCR_CHARGE_RECOVERY: stat("#% increased Charge Recovery"),
  INCR_EFFECT: stat("#% increased effect")
};
function applyFlaskHybridMod(ctx) {
  const applicable = ctx.item.rarity === "Magic" /* Magic */ && ctx.filters.some((filter2) => filter2.statRef === STATS.INCR_CHARGE_RECOVERY) && !ctx.filters.some((filter2) => filter2.statRef === STATS.INCR_EFFECT);
  if (!applicable) return;
  const effectStat = findAndResolveByRef(STATS.INCR_EFFECT, "explicit" /* Explicit */, ctx.item.category);
  const filter = statToNotFilter({
    stat: effectStat,
    type: "explicit" /* Explicit */,
    negateString: true,
    disabled: false
  });
  const insertAfter = ctx.filters.findIndex((filter2) => filter2.statRef === STATS.INCR_CHARGE_RECOVERY);
  ctx.filters.splice(insertAfter + 1, 0, filter);
}

// core/apt/src/web/price-check/filters/pseudo/heist.ts
var PSEUDO2 = {
  ENCHANT_MODS: stat("# Enchant Modifiers")
};
function applyHeistRules(ctx) {
  applyContractRules(ctx);
  applyBlueprintRules(ctx);
}
function applyContractRules(ctx) {
  if (ctx.item.category !== "Heist Contract" /* HeistContract */ || ctx.item.rarity === "Unique" /* Unique */) return;
  const { item } = ctx;
  if (item.heistContract?.requiredJob && item.heistContract.jobLevel) {
    let internalId;
    switch (item.heistContract.requiredJob) {
      case "Lockpicking":
        internalId = "item.heist_job_lockpicking";
        break;
      case "Brute Force":
        internalId = "item.heist_job_bruteforce";
        break;
      case "Perception":
        internalId = "item.heist_job_perception";
        break;
      case "Demolition":
        internalId = "item.heist_job_demolition";
        break;
      case "Counter-Thaumaturgy":
        internalId = "item.heist_job_counterthaumaturgy";
        break;
      case "Trap Disarmament":
        internalId = "item.heist_job_trapdisarmament";
        break;
      case "Agility":
        internalId = "item.heist_job_agility";
        break;
      case "Deception":
        internalId = "item.heist_job_deception";
        break;
      case "Engineering":
        internalId = "item.heist_job_engineering";
        break;
    }
    ctx.filters.push(propToFilter({
      ref: internalId,
      tradeId: internalId,
      roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.heistContract.jobLevel },
      sources: [],
      disabled: false
    }, { ...ctx, searchInRange: 0 }));
  }
  if (item.heistContract?.targetValue === "Priceless") {
    ctx.filters.push(propToFilter({
      ref: "Heist Target: Priceless",
      tradeId: "item.heist_target_priceless",
      roll: void 0,
      sources: [],
      disabled: false
    }, ctx));
  }
}
function applyBlueprintRules(ctx) {
  if (ctx.item.category !== "Heist Blueprint" /* HeistBlueprint */ || ctx.item.rarity === "Unique" /* Unique */) return;
  if (!ctx.filters.some((filter) => filter.tag === FilterTag.Enchant)) {
    const filter = statToNotFilter({
      stat: pseudoStatByRef(PSEUDO2.ENCHANT_MODS),
      type: "pseudo" /* Pseudo */,
      disabled: false
    });
    ctx.filters.push(filter);
  }
  const { item } = ctx;
  ctx.filters.push(propToFilter({
    ref: "Wings Revealed: #",
    tradeId: "item.heist_wings_revealed",
    roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.heistBlueprint.wingsRevealed },
    sources: [],
    disabled: false
  }, { ...ctx, searchInRange: 0 }));
  ctx.filters.push(propToFilter({
    ref: "Total Wings: #",
    tradeId: "item.heist_wings_total",
    roll: { min: 0, max: Number.MAX_SAFE_INTEGER, value: item.heistBlueprint.wingsTotal },
    sources: [],
    disabled: false
  }, { ...ctx, searchInRange: 0 }));
}

// core/apt/src/web/price-check/filters/pseudo/timeless-jewel.ts
function filterTimelessJewelKeystones(ctx) {
  const treeSeedStat = ctx.statsByType.find((calc) => calc.stat.better === 0 /* NotComparable */ && calc.stat.modFamily != null);
  if (!treeSeedStat) return;
  const group = {
    group: "one",
    expanded: true,
    meta: metaCountOneFilter({ disabled: false }),
    stats: []
  };
  for (const familyStatRef of treeSeedStat.stat.modFamily) {
    let calc = treeSeedStat;
    if (familyStatRef !== treeSeedStat.stat.ref) {
      const familyStat = findAndResolveByRef(familyStatRef, treeSeedStat.type, ctx.item.category);
      calc = sumStatsByModType([{
        info: treeSeedStat.sources[0].modifier.info,
        stats: [{
          stat: familyStat,
          translation: familyStat.matchers[0],
          roll: calc.sources[0].stat.roll
        }]
      }])[0];
    }
    const filter = calculatedStatToFilter(calc, ctx.searchInRange, ctx.item);
    if (familyStatRef !== treeSeedStat.stat.ref) {
      filter.tag = FilterTag.Pseudo;
      filter.disabled = true;
    }
    group.stats.push(filter);
  }
  ctx.statsByType = ctx.statsByType.filter((stat2) => stat2 !== treeSeedStat);
  ctx.groups.push(group);
}

// core/apt/src/web/price-check/filters/pseudo/anointments.ts
var OILS = [
  "Prismatic Oil",
  "Clear Oil",
  "Sepia Oil",
  "Amber Oil",
  "Verdant Oil",
  "Teal Oil",
  "Azure Oil",
  "Indigo Oil",
  "Violet Oil",
  "Crimson Oil",
  "Black Oil",
  "Opalescent Oil",
  "Silver Oil",
  "Golden Oil"
];
function decodeOils(calc) {
  if (calc.type !== "enchant" /* Enchant */) return;
  let encoded;
  if (calc.stat.anointments) {
    if (calc.stat.anointments.length === 1) {
      encoded = calc.stat.anointments[0].oils;
    } else {
      encoded = calc.stat.anointments.find((anoint) => anoint.roll === calc.sources[0].stat.roll?.value)?.oils;
    }
  }
  if (!encoded) return;
  const decoded = encoded.split(",").map(Number).sort((a, b) => b - a).map((idx) => OILS[idx]);
  return decoded;
}
function applyAnointmentRules(filters, item) {
  const anointment = filters.find((filter) => filter.oils);
  if (!anointment) return;
  if (item.talismanTier) {
    anointment.disabled = false;
  } else if (!item.isCorrupted && !item.isMirrored) {
    const oils = anointment.oils;
    if (oils[0] !== "Golden Oil" && oils[0] !== "Silver Oil") {
      anointment.hidden = "filters.hide_anointment";
      anointment.disabled = true;
    }
  }
}

// core/apt/src/web/price-check/filters/create-stat-filters.ts
function createExactStatFilters(item, statsByType, opts) {
  if (item.info.area?.blighted || item.category === "Invitation" /* Invitation */) return [];
  const keepByType = ["pseudo" /* Pseudo */, "fractured" /* Fractured */, "enchant" /* Enchant */, "necropolis" /* Necropolis */, "imbued" /* Imbued */];
  if (!item.influences.length && !item.isFractured && item.category !== "Tincture" /* Tincture */ && item.category !== "Idol" /* Idol */ && item.category !== "Chart" /* Chart */) {
    keepByType.push("implicit" /* Implicit */);
  }
  if (item.rarity === "Magic" /* Magic */ && (item.category !== "Cluster Jewel" /* ClusterJewel */ && item.category !== "Map" /* Map */ && item.category !== "Heist Contract" /* HeistContract */ && item.category !== "Heist Blueprint" /* HeistBlueprint */ && item.category !== "Chart" /* Chart */ && item.category !== "Sentinel" /* Sentinel */)) {
    keepByType.push("explicit" /* Explicit */);
  } else if (item.rarity === "Rare" /* Rare */ && item.category === "Idol" /* Idol */) {
    keepByType.push("explicit" /* Explicit */);
  }
  if (item.category === "Flask" /* Flask */) {
    keepByType.push("crafted" /* Crafted */);
  }
  const ctx = {
    item,
    searchInRange: opts.mode !== "props" ? Math.min(2, opts.searchStatRange) : opts.searchStatRange,
    filters: [],
    groups: [],
    statsByType: statsByType.filter((calc) => keepByType.includes(calc.type))
  };
  filterBasePercentile(ctx);
  filterMemoryStrands(ctx);
  mapProps(opts.mode === "bulk", ctx);
  chartProps(opts.mode === "bulk", ctx);
  valdoBadMods(ctx);
  ctx.filters.push(
    ...ctx.statsByType.map((mod) => calculatedStatToFilter(mod, ctx.searchInRange, item))
  );
  if (item.info.refName === "Chronicle of Atzoatl") {
    applyRules(ctx.filters);
    return ctx.filters;
  }
  if (item.info.refName === "Mirrored Tablet") {
    applyRules2(ctx.filters);
    return ctx.filters;
  }
  for (const filter of ctx.filters) {
    if (filter.not) continue;
    filter.hidden = void 0;
    if (filter.tag === FilterTag.Explicit) {
      filter.disabled = !filter.sources.some(
        (source) => source.modifier.info.tier != null && source.modifier.info.tier <= 2
      );
    } else if (filter.tag !== FilterTag.Property && filter.tag !== FilterTag.Pseudo) {
      filter.disabled = false;
    }
    if (filter.statRef === "# uses remaining") {
      filter.roll.min = filter.roll.value;
      filter.roll.default.min = filter.roll.value;
      filter.roll.default.max = filter.roll.value;
    }
  }
  if (item.category === "Cluster Jewel" /* ClusterJewel */) {
    applyClusterJewelRules(ctx.filters, true);
  }
  if (item.category === "Heist Contract" /* HeistContract */ || item.category === "Heist Blueprint" /* HeistBlueprint */) {
    applyHeistRules(ctx);
  } else if (item.category === "Flask" /* Flask */) {
    applyFlaskRules(ctx.filters);
    applyFlaskHybridMod(ctx);
  } else if (item.category === "Memory Line" /* MemoryLine */ || item.category === "Sanctum Relic" /* SanctumRelic */ || item.category === "Charm" /* Charm */) {
    enableAllFilters(ctx.filters);
  } else if (item.category === "Idol" /* Idol */) {
    enableGoodRolledFilters(ctx.filters, 0.66);
  }
  return ctx.filters;
}
function initUiModFilters(item, opts) {
  const ctx = {
    item,
    filters: [],
    groups: [],
    searchInRange: item.rarity === "Normal" /* Normal */ ? 100 : opts.searchStatRange,
    statsByType: item.statsByType.map((calc) => {
      if (calc.type === "fractured" /* Fractured */ && calc.stat.trade.ids["explicit" /* Explicit */]) {
        return { ...calc, type: "explicit" /* Explicit */ };
      } else {
        return calc;
      }
    })
  };
  filterEquipmentProps(ctx);
  if (item.rarity === "Unique" /* Unique */) {
    filterBasePercentile(ctx);
  }
  filterMemoryStrands(ctx, "hide_memory_strands");
  if (item.info.refName !== "Split Personality") {
    filterPseudo(ctx);
  }
  if (item.uniqueBase?.refName === "Timeless Jewel") {
    filterTimelessJewelKeystones(ctx);
  }
  if (!item.isCorrupted && !item.isMirrored) {
    ctx.statsByType = ctx.statsByType.filter((mod) => mod.type !== "fractured" /* Fractured */);
    ctx.statsByType.push(...item.statsByType.filter((mod) => mod.type === "fractured" /* Fractured */));
  }
  if (item.isVeiled) {
    ctx.statsByType = ctx.statsByType.filter((mod) => mod.type !== "veiled" /* Veiled */);
  }
  ctx.filters.push(
    ...ctx.statsByType.map((mod) => calculatedStatToFilter(mod, ctx.searchInRange, item))
  );
  if (item.isVeiled) {
    ctx.filters.forEach((filter) => {
      filter.disabled = true;
    });
  }
  finalFilterTweaks(ctx);
  return [...ctx.filters, ...ctx.groups];
}
function calculatedStatToFilter(calc, percent, item) {
  const { stat: stat2, sources, type } = calc;
  let filter;
  if (stat2.trade.option) {
    filter = {
      tradeId: stat2.trade.ids[type],
      statRef: stat2.ref,
      text: sources[0].stat.translation.string,
      tag: type === "enchant" /* Enchant */ ? FilterTag.Enchant : FilterTag.Variant,
      sources,
      option: {
        value: sources[0].contributes.value
      },
      disabled: false
    };
  }
  const roll = statSourcesTotal(
    calc.sources,
    item.info.refName === "Mirrored Tablet" ? "max" : "sum"
  );
  const translation = translateStatWithRoll(calc, roll);
  filter ??= {
    tradeId: stat2.trade.ids[type],
    statRef: stat2.ref,
    text: translation.string,
    tag: type,
    oils: decodeOils(calc),
    sources,
    roll: void 0,
    disabled: true
  };
  if (calc.stat.better === 0 /* NotComparable */) {
    if (type !== "enchant" /* Enchant */) {
      filter.tag = FilterTag.Variant;
    }
    if (!filter.oils) {
      filter.disabled = false;
    }
  }
  if (type === "implicit" /* Implicit */ || type === "explicit" /* Explicit */) {
    if (type === "explicit" /* Explicit */ && item.info.unique) {
      if (item.info.unique.fixedStats) {
        const fixedStats = item.info.unique.fixedStats;
        if (!fixedStats.includes(filter.statRef)) {
          filter.tag = FilterTag.Variant;
        }
      } else if (sources.some(
        (s) => s.modifier.info.generation === "prefix" || s.modifier.info.generation === "suffix"
      )) {
        filter.tag = FilterTag.Variant;
      }
    }
    const mechanic = sources.find((s) => s.modifier.info.mechanic != null)?.modifier.info.mechanic;
    if (mechanic) {
      filter.tag = mechanic;
    }
  }
  if (roll && !filter.option) {
    if (item.rarity === "Magic" /* Magic */ && (item.isUnmodifiable || item.isCorrupted || item.isMirrored)) {
      percent = 0;
    } else if (item.rarity === "Unique" /* Unique */ || item.rarity === "Magic" /* Magic */ && item.category === "Jewel" /* Jewel */ || calc.sources.some(({ modifier }) => modifier.info.tier === 1 && modifier.info.type === "fractured" /* Fractured */)) {
      const perfectRoll = calc.stat.better === 1 /* PositiveRoll */ && roll.value >= roll.max || calc.stat.better === -1 /* NegativeRoll */ && roll.value <= roll.min;
      if (perfectRoll) {
        percent = 0;
      }
    }
    let goodness;
    if (calc.stat.better !== 0 /* NotComparable */) {
      if (roll.min === roll.max) {
        goodness = 1;
      } else {
        goodness = (roll.value - roll.min) / (roll.max - roll.min);
        if (calc.stat.better === -1 /* NegativeRoll */) {
          goodness = 1 - goodness;
        }
      }
    }
    const dp = calc.stat.dp || calc.sources.some((s) => s.stat.stat.ref === calc.stat.ref && s.stat.roll?.dp);
    const filterBounds = {
      min: percentRoll(roll.min, -0, Math.floor, dp),
      max: percentRoll(roll.max, 0, Math.ceil, dp)
    };
    const filterDefault = calc.stat.better === 0 /* NotComparable */ ? { min: roll.value, max: roll.value } : item.rarity === "Unique" /* Unique */ ? {
      min: percentRollDelta(roll.value, roll.max - roll.min, -percent, Math.floor, dp),
      max: percentRollDelta(roll.value, roll.max - roll.min, +percent, Math.ceil, dp)
    } : {
      min: percentRoll(roll.value, -percent, Math.floor, dp),
      max: percentRoll(roll.value, +percent, Math.ceil, dp)
    };
    filterDefault.min = Math.max(filterDefault.min, filterBounds.min);
    filterDefault.max = Math.min(filterDefault.max, filterBounds.max);
    filter.roll = {
      value: roundRoll(roll.value, dp),
      min: void 0,
      max: void 0,
      default: filterDefault,
      bounds: roll.min !== roll.max && calc.stat.better !== 0 /* NotComparable */ ? filterBounds : void 0,
      dp,
      isNegated: false,
      tradeInvert: calc.stat.trade.inverted,
      goodness
    };
    filterFillMinMax(filter.roll, calc.stat.better);
    if (translation.negate) {
      filterAdjustmentForNegate(filter.roll);
    }
  }
  return filter;
}
function hideNotVariableStat(filter, item) {
  if (item.rarity !== "Unique" /* Unique */ || filter.tag !== FilterTag.Explicit && filter.tag !== FilterTag.Property) return;
  if (item.quality && JEWELLERY.has(item.category) && filter.sources.some((source) => source.modifier.info.rollIncr && source.stat.roll && !source.stat.roll.unscalable)) return;
  const hasRollAndScalable = filter.sources.some((source) => source.stat.roll && !source.stat.roll.unscalable);
  if (item.isCorrupted && hasRollAndScalable) {
    const isVvoCorrupted = item.newMods.some((mod) => mod.stats.some((stat2) => stat2.roll?.generation === "volatile"));
    if (!isVvoCorrupted) {
      filter.disabled = false;
    }
    return;
  }
  if (!filter.roll) {
    filter.hidden = "filters.hide_const_roll";
    filter.disabled = true;
  } else if (!filter.roll.bounds) {
    filter.roll.min = void 0;
    filter.roll.max = void 0;
    filter.hidden = "filters.hide_const_roll";
    filter.disabled = true;
  } else if (BASE_PCTL_AFFECTED_IDS.includes(filter.tradeId[0]) && filter.sources.every((source) => source.stat.roll?.min === source.stat.roll?.max) && getPropQuality(item) < 21) {
    filter.roll.min = void 0;
    filter.roll.max = void 0;
    filter.hidden = "hide_variable_by_base_percentile_only";
    filter.disabled = true;
  }
  if (item.isFoulborn && filter.tag === FilterTag.Explicit) {
    filter.disabled = false;
  }
}
function filterFillMinMax(roll, better) {
  switch (better) {
    case 1 /* PositiveRoll */:
      roll.min = roll.default.min;
      break;
    case -1 /* NegativeRoll */:
      roll.max = roll.default.max;
      break;
    case 0 /* NotComparable */:
      roll.min = roll.default.min;
      roll.max = roll.default.max;
      break;
  }
}
function filterAdjustmentForNegate(roll) {
  roll.tradeInvert = !roll.tradeInvert;
  roll.isNegated = true;
  const swap = structuredClone(roll);
  if (swap.bounds && roll.bounds) {
    roll.bounds.min = -1 * swap.bounds.max;
    roll.bounds.max = -1 * swap.bounds.min;
  }
  roll.default.min = -1 * swap.default.max;
  roll.default.max = -1 * swap.default.min;
  roll.value = -1 * swap.value;
  roll.min = typeof swap.max === "number" ? -1 * swap.max : void 0;
  roll.max = typeof swap.min === "number" ? -1 * swap.min : void 0;
}
function finalFilterTweaks(ctx) {
  const { item } = ctx;
  if (item.category === "Cluster Jewel" /* ClusterJewel */ && item.rarity !== "Unique" /* Unique */) {
    applyClusterJewelRules(ctx.filters, false);
  } else if (item.category === "Flask" /* Flask */) {
    applyFlaskRules(ctx.filters);
    applyFlaskHybridMod(ctx);
  }
  const hasEmptyModifier = showHasEmptyModifier(ctx);
  if (hasEmptyModifier !== false) {
    ctx.filters.push({
      tradeId: ["item.has_empty_modifier"],
      text: "1 Empty or Crafted Modifier",
      statRef: "1 Empty or Crafted Modifier",
      disabled: true,
      hidden: "filters.hide_empty_mod",
      tag: FilterTag.Pseudo,
      sources: [],
      option: {
        value: hasEmptyModifier
      }
    });
  }
  if (item.category === "Amulet" /* Amulet */ || item.category === "Ring" /* Ring */) {
    applyAnointmentRules(ctx.filters, ctx.item);
  }
  for (const filter of ctx.filters) {
    hideNotVariableStat(filter, item);
    if (filter.tag === FilterTag.Enchant) {
      if (QUALITY_CHANGING_ENCHANT.includes(filter.statRef)) {
        filter.hidden = "hide_enchant_meta_stat";
      }
    } else if (filter.tag === FilterTag.Fractured) {
      const mod = ctx.item.statsByType.find((mod2) => mod2.stat.ref === filter.statRef);
      if (mod.stat.trade.ids["explicit" /* Explicit */]) {
        filter.hidden = "filters.hide_for_crafting";
      }
    } else if (filter.sources[0]?.stat.stat.jewelleryQuality) {
      filter.hidden = "hide_jewellery_quality";
    } else if (filter.tag === FilterTag.Implicit) {
      if (item.rarity === "Unique" /* Unique */ && !item.isCorrupted && item.category !== "Jewel" /* Jewel */) {
        filter.hidden = "hide_unique_base_implicit";
        filter.disabled = true;
      }
    } else if (filter.tag === FilterTag.Foulborn || filter.tag === FilterTag.Vestigial || filter.tag === FilterTag.Variant) {
      filter.disabled = false;
    }
  }
  const basePercentile = ctx.filters.find((fitler) => fitler.tradeId[0] === "item.base_percentile");
  if (basePercentile && item.rarity === "Unique" /* Unique */) {
    const hasVisibleArmourProp = ctx.filters.some((filter) => BASE_PCTL_AFFECTED_IDS.includes(filter.tradeId[0]) && !filter.hidden);
    if (hasVisibleArmourProp) {
      basePercentile.hidden = "hide_redundant";
      basePercentile.disabled = true;
    }
  }
  if (item.rarity === "Unique" /* Unique */) {
    const countVisible = ctx.filters.reduce((cnt, filter) => filter.hidden ? cnt : cnt + 1, 0);
    if (countVisible <= 3) {
      enableAllFilters(ctx.filters);
    }
  }
}
function applyClusterJewelRules(filters, exact) {
  for (const filter of filters) {
    if (filter.statRef === "# Added Passive Skills are Jewel Sockets") {
      filter.hidden = "filters.hide_const_roll";
      filter.disabled = true;
    }
    if (filter.statRef === "Adds # Passive Skills") {
      filter.disabled = false;
      if (filter.roll.value === 4) {
        filter.roll.max = 5;
      } else if (filter.roll.value === 5 && exact) {
        filter.roll.min = filter.roll.default.min;
      } else if (filter.roll.value === 3 || filter.roll.value === 6 || filter.roll.value === 10 || filter.roll.value === 11 || filter.roll.value === 12) {
        filter.roll.min = filter.roll.default.min;
        filter.roll.max = void 0;
      }
    }
  }
}
function applyFlaskRules(filters) {
  const usedEnkindling = filters.find((filter) => filter.statRef === "Gains no Charges during Flask Effect");
  for (const filter of filters) {
    if (filter.tag === FilterTag.Enchant && !usedEnkindling) {
      filter.hidden = "hide_harvest_and_instilling";
      filter.disabled = true;
    }
  }
}
function showHasEmptyModifier(ctx) {
  const { item } = ctx;
  if (item.rarity !== "Rare" /* Rare */ || item.isCorrupted || item.isMirrored) return false;
  const randomMods = item.newMods.filter((mod) => mod.info.type === "explicit" /* Explicit */ || mod.info.type === "fractured" /* Fractured */ || mod.info.type === "veiled" /* Veiled */ || mod.info.type === "crafted" /* Crafted */);
  const craftedMod = randomMods.find((mod) => mod.info.type === "crafted" /* Crafted */);
  if (randomMods.length === 5 && !craftedMod || randomMods.length === 6 && craftedMod) {
    let prefixes = randomMods.filter((mod) => mod.info.generation === "prefix").length;
    let suffixes = randomMods.filter((mod) => mod.info.generation === "suffix").length;
    if (craftedMod) {
      if (craftedMod.info.generation === "prefix") {
        prefixes -= 1;
      } else {
        suffixes -= 1;
      }
    }
    if (prefixes === 2) return 1 /* Prefix */;
    if (suffixes === 2) return 2 /* Suffix */;
  }
  return false;
}
function enableAllFilters(filters) {
  for (const filter of filters) {
    if (!filter.hidden) {
      filter.disabled = false;
    }
  }
}
function enableGoodRolledFilters(filters, abovePct) {
  for (const filter of filters) {
    if (filter.hidden) continue;
    if (!filter.roll || filter.roll.goodness == null) {
      filter.disabled = false;
      continue;
    }
    if (filter.roll.goodness >= abovePct) {
      filter.disabled = false;
    }
  }
}

// core/apt/src/web/price-check/filters/pseudo/item-property.ts
var BASE_PCTL_AFFECTED_IDS = ["item.armour", "item.evasion_rating", "item.energy_shield", "item.ward"];
function filterEquipmentProps(ctx) {
  if (ARMOUR.has(ctx.item.category)) {
    armourProps(ctx);
  }
  if (WEAPON.has(ctx.item.category)) {
    weaponProps(ctx);
  }
}
function filterBasePercentile(ctx) {
  if (ctx.item.basePercentile != null) {
    ctx.filters.push(propToFilter({
      ref: "Base Percentile: #%",
      tradeId: "item.base_percentile",
      roll: { min: 0, max: 100, value: ctx.item.basePercentile },
      sources: [],
      disabled: ctx.item.basePercentile < 50
    }, ctx));
  }
}
function filterMemoryStrands(ctx, hidden) {
  if (ctx.item.memoryStrands != null) {
    ctx.filters.push(propToFilter({
      ref: "Memory Strands: #",
      tradeId: "item.memory_strands",
      roll: { min: 0, max: 100, value: ctx.item.memoryStrands },
      sources: [],
      disabled: ctx.item.memoryStrands < 60 || hidden !== void 0,
      hidden
    }, ctx));
  }
}
var ARMOUR_STATS = /* @__PURE__ */ new Set([
  ...QUALITY_STATS.ARMOUR.flat,
  ...QUALITY_STATS.EVASION.flat,
  ...QUALITY_STATS.ENERGY_SHIELD.flat,
  ...QUALITY_STATS.WARD.flat,
  ...QUALITY_STATS.ARMOUR.incr,
  ...QUALITY_STATS.EVASION.incr,
  ...QUALITY_STATS.ENERGY_SHIELD.incr,
  ...QUALITY_STATS.WARD.incr,
  stat("+#% Chance to Block")
]);
function armourProps(ctx) {
  const { item } = ctx;
  const baseInfo = item.uniqueBase ?? item.info;
  if (item.armourAR) {
    const totalQ20 = propAt20Quality(item.armourAR, QUALITY_STATS.ARMOUR, baseInfo.armour?.ar, item);
    ctx.filters.push(propToFilter({
      ref: "Armour: #",
      tradeId: "item.armour",
      roll: totalQ20.roll,
      sources: totalQ20.sources,
      disabled: !isSingleAttrArmour(item)
    }, ctx));
  }
  if (item.armourEV) {
    const totalQ20 = propAt20Quality(item.armourEV, QUALITY_STATS.EVASION, baseInfo.armour?.ev, item);
    ctx.filters.push(propToFilter({
      ref: "Evasion Rating: #",
      tradeId: "item.evasion_rating",
      roll: totalQ20.roll,
      sources: totalQ20.sources,
      disabled: !isSingleAttrArmour(item)
    }, ctx));
  }
  if (item.armourES) {
    const totalQ20 = propAt20Quality(item.armourES, QUALITY_STATS.ENERGY_SHIELD, baseInfo.armour?.es, item);
    ctx.filters.push(propToFilter({
      ref: "Energy Shield: #",
      tradeId: "item.energy_shield",
      roll: totalQ20.roll,
      sources: totalQ20.sources,
      disabled: !isSingleAttrArmour(item)
    }, ctx));
  }
  if (item.armourWARD) {
    const totalQ20 = propAt20Quality(item.armourWARD, QUALITY_STATS.WARD, baseInfo.armour?.ward, item);
    ctx.filters.push(propToFilter({
      ref: "Ward: #",
      tradeId: "item.ward",
      roll: totalQ20.roll,
      sources: totalQ20.sources,
      disabled: !isSingleAttrArmour(item)
    }, ctx));
  }
  if (item.armourBLOCK) {
    const block = calcPropBounds(item.armourBLOCK, { flat: ["+#% Chance to Block"], incr: [] }, item);
    ctx.filters.push(propToFilter({
      ref: "Block: #%",
      tradeId: "item.block",
      roll: block.roll,
      sources: block.sources,
      disabled: true
    }, ctx));
  }
  if (item.armourAR || item.armourEV || item.armourES || item.armourWARD || item.armourBLOCK) {
    removeUsedStats(ctx, ARMOUR_STATS);
  }
}
var WEAPON_STATS = /* @__PURE__ */ new Set([
  ...QUALITY_STATS.PHYSICAL_DAMAGE.flat,
  ...QUALITY_STATS.PHYSICAL_DAMAGE.incr,
  stat("#% increased Attack Speed"),
  stat("#% increased Critical Strike Chance"),
  // stat('Adds # to # Chaos Damage'),
  stat("Adds # to # Lightning Damage"),
  stat("Adds # to # Cold Damage"),
  stat("Adds # to # Fire Damage")
]);
function weaponProps(ctx) {
  const { item } = ctx;
  const attackSpeed = calcPropBounds(item.weaponAS ?? 0, { incr: ["#% increased Attack Speed"], flat: [] }, item);
  const physQ20 = propAt20Quality(item.weaponPHYSICAL ?? 0, QUALITY_STATS.PHYSICAL_DAMAGE, void 0, item);
  const pdpsQ20 = {
    value: physQ20.roll.value * attackSpeed.roll.value,
    min: physQ20.roll.min * attackSpeed.roll.min,
    max: physQ20.roll.max * attackSpeed.roll.max
  };
  const eleDmg = calcPropBounds(item.weaponELEMENTAL ?? 0, {
    flat: ["Adds # to # Lightning Damage", "Adds # to # Cold Damage", "Adds # to # Fire Damage"],
    incr: []
  }, item);
  const edps = {
    value: eleDmg.roll.value * attackSpeed.roll.value,
    min: eleDmg.roll.min * attackSpeed.roll.min,
    max: eleDmg.roll.max * attackSpeed.roll.max
  };
  const dps = {
    value: pdpsQ20.value + edps.value,
    min: pdpsQ20.min + edps.min,
    max: pdpsQ20.max + edps.max
  };
  if (item.weaponELEMENTAL) {
    if (item.weaponPHYSICAL) {
      ctx.filters.push(propToFilter({
        ref: "Total DPS: #",
        tradeId: "item.total_dps",
        roll: dps,
        sources: [],
        disabled: false
      }, ctx));
    }
    ctx.filters.push(propToFilter({
      ref: "Elemental DPS: #",
      tradeId: "item.elemental_dps",
      roll: edps,
      sources: [],
      disabled: edps.value / dps.value < 0.67,
      hidden: edps.value / dps.value < 0.67 ? "filters.hide_ele_dps" : void 0
    }, ctx));
  }
  if (item.weaponPHYSICAL) {
    ctx.filters.push(propToFilter({
      ref: "Physical DPS: #",
      tradeId: "item.physical_dps",
      roll: pdpsQ20,
      sources: [],
      disabled: !isPdpsImportant(item) || pdpsQ20.value / dps.value < 0.67,
      hidden: pdpsQ20.value / dps.value < 0.67 ? "filters.hide_phys_dps" : void 0
    }, ctx));
  }
  ctx.filters.push(propToFilter({
    ref: "Attacks per Second: #",
    tradeId: "item.aps",
    roll: attackSpeed.roll,
    sources: attackSpeed.sources,
    dp: true,
    disabled: true
  }, ctx));
  if (item.weaponCRIT) {
    const critChance = calcPropBounds(item.weaponCRIT, { incr: ["#% increased Critical Strike Chance"], flat: [] }, item);
    ctx.filters.push(propToFilter({
      ref: "Critical Strike Chance: #%",
      tradeId: "item.crit",
      roll: critChance.roll,
      sources: critChance.sources,
      dp: true,
      disabled: true
    }, ctx));
  }
  if (item.weaponAS || item.weaponCRIT || item.weaponELEMENTAL || item.weaponPHYSICAL) {
    removeUsedStats(ctx, WEAPON_STATS);
  }
}
function removeUsedStats(ctx, stats) {
  ctx.statsByType = ctx.statsByType.filter((m) => !stats.has(m.stat.ref));
}
function isSingleAttrArmour(item) {
  return [
    item.armourAR,
    item.armourEV,
    item.armourES,
    item.armourWARD
  ].filter((value) => value != null).length === 1;
}
function isPdpsImportant(item) {
  switch (item.category) {
    case "One-Handed Axe" /* OneHandedAxe */:
    case "Two-Handed Axe" /* TwoHandedAxe */:
    case "One-Handed Sword" /* OneHandedSword */:
    case "Two-Handed Sword" /* TwoHandedSword */:
    case "Bow" /* Bow */:
    case "Warstaff" /* Warstaff */:
      return true;
    default:
      return false;
  }
}
function propToFilter(opts, ctx) {
  const stat2 = {
    ref: opts.ref,
    matchers: [{ string: opts.ref }],
    trade: { ids: { pseudo: [opts.tradeId] } },
    better: 1 /* PositiveRoll */
  };
  const filter = noSourcePseudoToFilter({
    pseudo: stat2,
    roll: opts.roll,
    dp: opts.dp,
    disabled: opts.disabled,
    hidden: opts.hidden
  }, ctx);
  filter.tag = FilterTag.Property;
  filter.sources = opts.sources;
  return filter;
}
function noSourcePseudoToFilter(opts, ctx) {
  const filter = calculatedStatToFilter({
    stat: opts.pseudo,
    type: "pseudo" /* Pseudo */,
    sources: [{
      modifier: {
        info: { type: "pseudo" /* Pseudo */, tags: [] },
        stats: []
      },
      stat: {
        stat: opts.pseudo,
        translation: opts.pseudo.matchers[0],
        roll: opts.roll ? {
          dp: opts.dp ?? false,
          unscalable: false,
          ...opts.roll
        } : void 0
      },
      contributes: opts.roll
    }]
  }, ctx.searchInRange, ctx.item);
  filter.sources = [];
  if (opts.disabled != null) filter.disabled = opts.disabled;
  if (opts.hidden != null) filter.hidden = opts.hidden;
  return filter;
}

// core/apt/src/web/price-check/filters/pseudo/mercenary.ts
var BUILD_RULES = [{
  build: "Kineticist",
  badSkills: [
    stat("Kinetic Bolt")
  ]
}, {
  build: "Manyshot",
  badSkills: [
    stat("Icicle Rain")
  ]
}, {
  build: "Combatant",
  badSkills: [
    stat("Wild Strike"),
    stat("Spectral Helix")
  ]
}];
function createMercenaryFilters(item) {
  const out = [];
  const rules = BUILD_RULES.find((rule) => rule.build === item.mercenaryBuild.refName);
  const mercenaryBuild = item.mercenaryBuild.mercenaryBuild;
  for (let [skill, ...supports] of item.mercenarySkills) {
    const rawSupports = supports;
    supports = rawSupports.filter((support) => !support.stat.mercenary.syntheticFamily || support.stat.mercenary.tier === 3);
    const skillType = mercenaryBuild.skills.find((buildSkill) => buildSkill.name === skill.stat.ref).type;
    const skillFilter = skillToFilter({
      stat: skill.stat,
      type: skillType,
      disabled: true,
      badSkills: rules?.badSkills
    });
    if (!supports.length) {
      if (skillType === "primary" && !rawSupports.length) {
        skillFilter.hidden = "filters.mercenary_primary_no_support";
      }
      out.push(skillFilter);
      continue;
    }
    const filterGroup = {
      group: "mercenary",
      expanded: false,
      meta: skillFilter,
      stats: []
    };
    supports.sort((a, b) => {
      return (b.stat.mercenary.tier & 3) - (a.stat.mercenary.tier & 3);
    });
    const possibleSupports = (skill.stat.mercenary.supports ?? []).map((familyName) => {
      const familyStat = findGemByRef(familyName);
      if (familyStat.modFamily) {
        return familyStat.modFamily.map((name) => findGemByRef(name));
      } else {
        return [familyStat];
      }
    });
    if (supports.length === 5 && possibleSupports.length) {
      const tier3Count = supports.filter((support) => support.stat.mercenary.tier >= 3 || support.stat.modFamily?.at(-1) === support.stat.ref).length;
      filterGroup.stats.push(propToFilter({
        ref: "6-Link",
        tradeId: "item.mercenary_6link",
        roll: { min: 0, max: 5, value: tier3Count },
        sources: possibleSupports.map((family) => encodeFamilyToSource(family)),
        disabled: true
      }, { filters: [], groups: [], item, searchInRange: 0, statsByType: [] }));
    }
    for (const support of supports) {
      const tier = support.stat.mercenary.tier;
      let tradeId;
      if (!support.stat.modFamily || tier === 3) {
        tradeId = support.stat.trade.ids["pseudo" /* Pseudo */];
      } else {
        tradeId = [];
        for (const ref of support.stat.modFamily) {
          const familyStat = findGemByRef(ref);
          if (familyStat.mercenary.tier >= tier) {
            tradeId.push(...familyStat.trade.ids["pseudo" /* Pseudo */]);
          }
        }
      }
      let canonStat = support.stat;
      if (support.stat.mercenary.canonical) {
        canonStat = findGemByRef(support.stat.mercenary.canonical);
      }
      filterGroup.stats.push({
        tradeId,
        statRef: canonStat.ref,
        text: canonStat.matchers[0].string,
        tag: FilterTag.MercenarySupport,
        mercenary: {
          tier,
          maxTier: tier >= 3 || support.stat.modFamily?.at(-1) === support.stat.ref
        },
        sources: [],
        option: { value: 1 /* Required */ },
        disabled: true
      });
    }
    if (supports.length === 5 && possibleSupports.length) {
      for (const family of possibleSupports) {
        const linked = family[0].mercenary.canonical ? rawSupports.some((support) => support.stat.mercenary.canonical === family[0].mercenary.canonical) : rawSupports.some((support) => support.stat.ref === family[0].ref);
        if (linked) continue;
        let canonStat = family[0];
        if (family[0].mercenary.canonical) {
          canonStat = family.find((support) => support.ref === family[0].mercenary.canonical);
        }
        filterGroup.stats.push({
          tradeId: family.flatMap((support) => support.trade.ids["pseudo" /* Pseudo */]),
          statRef: canonStat.ref,
          text: canonStat.matchers[0].string,
          tag: FilterTag.MercenarySupport,
          sources: [],
          not: true,
          disabled: true
        });
      }
    }
    out.push(filterGroup);
  }
  const notGroup = {
    group: "not",
    expanded: false,
    meta: metaNotFilter({ disabled: true }),
    stats: []
  };
  out.push(notGroup);
  for (const buildSkill of mercenaryBuild.skills) {
    if (item.mercenarySkills.some((group) => group[0].stat.ref === buildSkill.name)) continue;
    const filter = skillToFilter({
      stat: findGemByRef(buildSkill.name),
      type: buildSkill.type,
      disabled: true,
      badSkills: rules?.badSkills
    });
    if (filter.tag === FilterTag.Brick) {
      filter.disabled = false;
    }
    notGroup.stats.push(filter);
  }
  if (notGroup.stats.some((stat2) => !stat2.disabled)) {
    notGroup.meta.disabled = false;
  }
  return out;
}
function findGemByRef(name) {
  return findAndResolveByRef(name, "pseudo" /* Pseudo */, "Mercenary Warrant" /* MercenaryWarrant */);
}
function encodeFamilyToSource(family) {
  return {
    modifier: {
      info: void 0,
      stats: family.map((stat2) => ({ stat: stat2, translation: void 0 }))
    },
    stat: void 0
  };
}
function decodeFamilyFromSource(source) {
  return source.modifier.stats.map((stat2) => stat2.stat);
}
function skillToFilter(opts) {
  const filter = {
    tradeId: opts.stat.trade.ids["pseudo" /* Pseudo */],
    statRef: opts.stat.ref,
    text: opts.stat.matchers[0].string,
    tag: opts.type === "primary" ? FilterTag.MercenaryPrimary : opts.type === "secondary" ? FilterTag.MercenarySecondary : FilterTag.MercenaryUtility,
    mercenary: { icon: opts.stat.mercenary.icon },
    sources: [],
    disabled: opts.disabled
  };
  if (opts.badSkills?.includes(opts.stat.ref)) {
    filter.tag = FilterTag.Brick;
  }
  return filter;
}

// core/shims/object-hash.js
function hash(v) {
  return JSON.stringify(v);
}

// core/apt/src/web/price-check/trade/Cache.ts
var CACHE_TTL = 300;
var Cache = class {
  cached = /* @__PURE__ */ new Map();
  get(key) {
    const _key = hash.sha1(JSON.parse(JSON.stringify(key)));
    return this.cached.get(_key);
  }
  set(key, value, ttl) {
    const _key = hash.sha1(JSON.parse(JSON.stringify(key)));
    this.cached.set(_key, value);
    setTimeout(() => {
      this.cached.delete(_key);
    }, ttl * 1e3);
  }
  static deriveTtl(...limits) {
    return limits.length ? CACHE_TTL : 0;
  }
};

// core/apt/src/web/price-check/trade/pathofexile-trade.ts
var CATEGORY_TO_TRADE_ID = /* @__PURE__ */ new Map([
  ["Map" /* Map */, "map"],
  ["Abyss Jewel" /* AbyssJewel */, "jewel.abyss"],
  ["Amulet" /* Amulet */, "accessory.amulet"],
  ["Belt" /* Belt */, "accessory.belt"],
  ["Body Armour" /* BodyArmour */, "armour.chest"],
  ["Boots" /* Boots */, "armour.boots"],
  ["Bow" /* Bow */, "weapon.bow"],
  ["Claw" /* Claw */, "weapon.claw"],
  ["Dagger" /* Dagger */, "weapon.dagger"],
  ["Fishing Rod" /* FishingRod */, "weapon.rod"],
  ["Flask" /* Flask */, "flask"],
  ["Gloves" /* Gloves */, "armour.gloves"],
  ["Helmet" /* Helmet */, "armour.helmet"],
  ["Jewel" /* Jewel */, "jewel"],
  ["One-Handed Axe" /* OneHandedAxe */, "weapon.oneaxe"],
  ["One-Handed Mace" /* OneHandedMace */, "weapon.onemace"],
  ["One-Handed Sword" /* OneHandedSword */, "weapon.onesword"],
  ["Quiver" /* Quiver */, "armour.quiver"],
  ["Ring" /* Ring */, "accessory.ring"],
  ["Rune Dagger" /* RuneDagger */, "weapon.runedagger"],
  ["Sceptre" /* Sceptre */, "weapon.sceptre"],
  ["Shield" /* Shield */, "armour.shield"],
  ["Staff" /* Staff */, "weapon.staff"],
  ["Two-Handed Axe" /* TwoHandedAxe */, "weapon.twoaxe"],
  ["Two-Handed Mace" /* TwoHandedMace */, "weapon.twomace"],
  ["Two-Handed Sword" /* TwoHandedSword */, "weapon.twosword"],
  ["Wand" /* Wand */, "weapon.wand"],
  ["Warstaff" /* Warstaff */, "weapon.warstaff"],
  ["Cluster Jewel" /* ClusterJewel */, "jewel.cluster"],
  ["Heist Blueprint" /* HeistBlueprint */, "heistmission.blueprint"],
  ["Heist Contract" /* HeistContract */, "heistmission.contract"],
  ["Heist Tool" /* HeistTool */, "heistequipment.heisttool"],
  ["Heist Brooch" /* HeistBrooch */, "heistequipment.heistreward"],
  ["Heist Gear" /* HeistGear */, "heistequipment.heistweapon"],
  ["Heist Cloak" /* HeistCloak */, "heistequipment.heistutility"],
  ["Trinket" /* Trinket */, "accessory.trinket"],
  ["Sanctum Relic" /* SanctumRelic */, "sanctum.relic"],
  ["Tincture" /* Tincture */, "tincture"],
  ["Charm" /* Charm */, "azmeri.charm"],
  ["Idol" /* Idol */, "idol"],
  ["Graft" /* Graft */, "graft"],
  ["Chart" /* Chart */, "chart"]
]);
var TOTAL_MODS_TEXT = {
  CRAFTED_MODIFIERS: [
    stat("# Crafted Modifiers"),
    stat("# Crafted Prefix Modifiers"),
    stat("# Crafted Suffix Modifiers")
  ],
  EMPTY_MODIFIERS: [
    stat("# Empty Modifiers"),
    stat("# Empty Prefix Modifiers"),
    stat("# Empty Suffix Modifiers")
  ],
  TOTAL_MODIFIERS: [
    stat("# Modifiers"),
    stat("# Prefix Modifiers"),
    stat("# Suffix Modifiers")
  ]
};
var INFLUENCE_PSEUDO_TEXT = {
  ["Shaper" /* Shaper */]: stat("Has Shaper Influence"),
  ["Crusader" /* Crusader */]: stat("Has Crusader Influence"),
  ["Hunter" /* Hunter */]: stat("Has Hunter Influence"),
  ["Elder" /* Elder */]: stat("Has Elder Influence"),
  ["Redeemer" /* Redeemer */]: stat("Has Redeemer Influence"),
  ["Warlord" /* Warlord */]: stat("Has Warlord Influence")
};
function createTradeRequest(filters, stats) {
  const body = {
    query: {
      status: {
        option: filters.trade.offline ? "any" : filters.trade.merchantOnly ? "securable" : "available"
      },
      stats: [
        { type: "and", filters: [] }
      ],
      filters: {}
    },
    sort: {
      price: "asc"
    }
  };
  const { query } = body;
  if (filters.trade.currency) {
    setProperty(query.filters, "trade_filters.filters.price.option", filters.trade.currency);
  }
  if (filters.trade.collapseListings === "api" && (filters.trade.offline || !filters.trade.merchantOnly || filters.trade.collapseMerchant)) {
    setProperty(query.filters, "trade_filters.filters.collapse.option", String(true));
  }
  if (filters.trade.listed) {
    setProperty(query.filters, "trade_filters.filters.indexed.option", filters.trade.listed);
  }
  let activeSearch = filters.searchRelaxed && !filters.searchRelaxed.disabled ? filters.searchRelaxed : filters.searchExact;
  if (activeSearch.sub && !activeSearch.sub.disabled) {
    activeSearch = activeSearch.sub;
  }
  if (activeSearch.nameTrade) {
    query.name = nameToQuery(activeSearch.nameTrade, activeSearch.discriminatorTrade);
  } else if (activeSearch.name) {
    query.name = nameToQuery(activeSearch.name, activeSearch.discriminatorTrade);
  }
  if (activeSearch.baseTypeTrade) {
    query.type = nameToQuery(activeSearch.baseTypeTrade, activeSearch.discriminatorTrade);
  } else if (activeSearch.baseType) {
    query.type = nameToQuery(activeSearch.baseType, activeSearch.discriminatorTrade);
  }
  if (filters.foil && !filters.foil.disabled) {
    setProperty(query.filters, "type_filters.filters.rarity.option", "uniquefoil");
  } else if (filters.rarity) {
    setProperty(query.filters, "type_filters.filters.rarity.option", filters.rarity.disabled ? "nonunique" : filters.rarity.value);
  }
  if (activeSearch.category) {
    const id = CATEGORY_TO_TRADE_ID.get(activeSearch.category);
    if (id) {
      setProperty(query.filters, "type_filters.filters.category.option", id);
    } else {
      throw new Error(`Invalid category: ${activeSearch.category}`);
    }
  }
  if (filters.corrupted?.value === false || filters.corrupted?.exact) {
    setProperty(query.filters, "misc_filters.filters.corrupted.option", String(filters.corrupted.value));
  }
  if (filters.fractured?.value === false) {
    setProperty(query.filters, "misc_filters.filters.fractured_item.option", String(false));
  }
  if (filters.imbuedGem?.disabled) {
    setProperty(query.filters, "misc_filters.filters.gem_imbued.option", String(false));
  }
  if (filters.split?.disabled) {
    setProperty(query.filters, "misc_filters.filters.split.option", String(false));
  }
  if (filters.foulborn?.value === false) {
    setProperty(query.filters, "misc_filters.filters.foulborn_item.option", String(false));
  }
  if (filters.vestigial?.value === false) {
    setProperty(query.filters, "misc_filters.filters.vestigial.option", String(false));
  }
  if (filters.mirrored?.disabled) {
    setProperty(query.filters, "misc_filters.filters.mirrored.option", String(false));
  }
  if (filters.gemLevel && !filters.gemLevel.disabled) {
    setProperty(query.filters, "misc_filters.filters.gem_level.min", filters.gemLevel.value);
  }
  if (filters.quality && !filters.quality.disabled) {
    setProperty(query.filters, "misc_filters.filters.quality.min", filters.quality.value);
  }
  if (filters.itemLevel && !filters.itemLevel.disabled) {
    setProperty(query.filters, "misc_filters.filters.ilvl.min", filters.itemLevel.value);
    if (filters.itemLevel.max) {
      setProperty(query.filters, "misc_filters.filters.ilvl.max", filters.itemLevel.max);
    }
  }
  if (filters.stackSize && !filters.stackSize.disabled) {
    setProperty(query.filters, "misc_filters.filters.stack_size.min", filters.stackSize.value);
  }
  if (filters.linkedSockets && !filters.linkedSockets.disabled) {
    setProperty(query.filters, "socket_filters.filters.links.min", filters.linkedSockets.value);
  }
  if (filters.whiteSockets && !filters.whiteSockets.disabled) {
    setProperty(query.filters, "socket_filters.filters.sockets.w", filters.whiteSockets.value);
  }
  if (filters.mapTier && !filters.mapTier.disabled) {
    setProperty(query.filters, "map_filters.filters.map_tier.min", filters.mapTier.value);
    setProperty(query.filters, "map_filters.filters.map_tier.max", filters.mapTier.value);
  }
  if (filters.mapBlighted) {
    if (filters.mapBlighted.value === "Blighted") {
      setProperty(query.filters, "map_filters.filters.map_blighted.option", String(true));
    } else if (filters.mapBlighted.value === "Blight-ravaged") {
      setProperty(query.filters, "map_filters.filters.map_uberblighted.option", String(true));
    } else if (filters.mapBlighted.value === false) {
      setProperty(query.filters, "map_filters.filters.map_blighted.option", String(false));
      setProperty(query.filters, "map_filters.filters.map_uberblighted.option", String(false));
    }
  }
  if (filters.mapCompletionReward) {
    setProperty(query.filters, "map_filters.filters.map_completion_reward.option", filters.mapCompletionReward.nameTrade);
  }
  if (filters.unidentified && !filters.unidentified.disabled) {
    setProperty(query.filters, "misc_filters.filters.identified.option", String(false));
  }
  if (filters.areaLevel && !filters.areaLevel.disabled) {
    setProperty(query.filters, "map_filters.filters.area_level.min", filters.areaLevel.value);
    if (filters.areaLevel.max) {
      setProperty(query.filters, "map_filters.filters.area_level.max", filters.areaLevel.max);
    }
  }
  if (filters.sentinelCharge && !filters.sentinelCharge.disabled) {
    setProperty(query.filters, "sentinel_filters.filters.sentinel_durability.min", filters.sentinelCharge.value);
  }
  for (const stat2 of stats) {
    if (stat2.group || !stat2.tradeId[0].startsWith("item.")) continue;
    if (stat2.tradeId[0] === "item.has_empty_modifier") {
      const TARGET_ID = {
        CRAFTED_MODIFIERS: pseudoStatByRef(TOTAL_MODS_TEXT.CRAFTED_MODIFIERS[stat2.option.value]).trade.ids["pseudo" /* Pseudo */][0],
        EMPTY_MODIFIERS: pseudoStatByRef(TOTAL_MODS_TEXT.EMPTY_MODIFIERS[stat2.option.value]).trade.ids["pseudo" /* Pseudo */][0],
        TOTAL_MODIFIERS: pseudoStatByRef(TOTAL_MODS_TEXT.TOTAL_MODIFIERS[0]).trade.ids["pseudo" /* Pseudo */][0]
      };
      query.stats.push({
        type: "count",
        value: { min: 1, max: 1 },
        disabled: stat2.disabled,
        filters: [
          { id: TARGET_ID.EMPTY_MODIFIERS, value: { min: 1, max: 1 }, disabled: stat2.disabled },
          { id: TARGET_ID.CRAFTED_MODIFIERS, value: { min: 1, max: void 0 }, disabled: stat2.disabled }
        ]
      });
      query.stats.push({
        type: "count",
        value: { min: 1, max: 1 },
        disabled: stat2.disabled,
        filters: [
          { id: TARGET_ID.EMPTY_MODIFIERS, value: { min: 1, max: 1 }, disabled: stat2.disabled },
          { id: TARGET_ID.TOTAL_MODIFIERS, value: { min: 6, max: void 0 }, disabled: stat2.disabled }
        ]
      });
    }
    if (stat2.disabled) continue;
    const input = stat2.roll;
    switch (stat2.tradeId[0]) {
      case "item.base_percentile":
        setProperty(query.filters, "armour_filters.filters.base_defence_percentile.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "armour_filters.filters.base_defence_percentile.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.memory_strands":
        setProperty(query.filters, "misc_filters.filters.memory_level.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "misc_filters.filters.memory_level.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.armour":
        setProperty(query.filters, "armour_filters.filters.ar.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "armour_filters.filters.ar.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.evasion_rating":
        setProperty(query.filters, "armour_filters.filters.ev.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "armour_filters.filters.ev.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.energy_shield":
        setProperty(query.filters, "armour_filters.filters.es.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "armour_filters.filters.es.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.ward":
        setProperty(query.filters, "armour_filters.filters.ward.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "armour_filters.filters.ward.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.block":
        setProperty(query.filters, "armour_filters.filters.block.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "armour_filters.filters.block.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.total_dps":
        setProperty(query.filters, "weapon_filters.filters.dps.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "weapon_filters.filters.dps.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.physical_dps":
        setProperty(query.filters, "weapon_filters.filters.pdps.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "weapon_filters.filters.pdps.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.elemental_dps":
        setProperty(query.filters, "weapon_filters.filters.edps.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "weapon_filters.filters.edps.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.crit":
        setProperty(query.filters, "weapon_filters.filters.crit.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "weapon_filters.filters.crit.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.aps":
        setProperty(query.filters, "weapon_filters.filters.aps.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "weapon_filters.filters.aps.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.map_item_quantity":
        setProperty(query.filters, "map_filters.filters.map_iiq.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "map_filters.filters.map_iiq.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.map_item_rarity":
        setProperty(query.filters, "map_filters.filters.map_iir.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "map_filters.filters.map_iir.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.map_pack_size":
        setProperty(query.filters, "map_filters.filters.map_packsize.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "map_filters.filters.map_packsize.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_agility":
        setProperty(query.filters, "heist_filters.filters.heist_agility.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_agility.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_bruteforce":
        setProperty(query.filters, "heist_filters.filters.heist_brute_force.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_brute_force.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_counterthaumaturgy":
        setProperty(query.filters, "heist_filters.filters.heist_counter_thaumaturgy.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_counter_thaumaturgy.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_deception":
        setProperty(query.filters, "heist_filters.filters.heist_deception.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_deception.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_demolition":
        setProperty(query.filters, "heist_filters.filters.heist_demolition.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_demolition.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_engineering":
        setProperty(query.filters, "heist_filters.filters.heist_engineering.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_engineering.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_lockpicking":
        setProperty(query.filters, "heist_filters.filters.heist_lockpicking.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_lockpicking.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_perception":
        setProperty(query.filters, "heist_filters.filters.heist_perception.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_perception.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_job_trapdisarmament":
        setProperty(query.filters, "heist_filters.filters.heist_trap_disarmament.min", typeof input.min === "number" ? input.min : 1);
        setProperty(query.filters, "heist_filters.filters.heist_trap_disarmament.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_target_priceless":
        setProperty(query.filters, "heist_filters.filters.heist_objective_value.option", "priceless");
        break;
      case "item.heist_wings_revealed":
        setProperty(query.filters, "heist_filters.filters.heist_wings.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "heist_filters.filters.heist_wings.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.heist_wings_total":
        setProperty(query.filters, "heist_filters.filters.heist_max_wings.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "heist_filters.filters.heist_max_wings.max", typeof input.max === "number" ? input.max : void 0);
        break;
      case "item.chart_sulphur":
        setProperty(query.filters, "map_filters.filters.chart_sulphur.min", typeof input.min === "number" ? input.min : void 0);
        setProperty(query.filters, "map_filters.filters.chart_sulphur.max", typeof input.max === "number" ? input.max : void 0);
        break;
    }
  }
  stats = stats.map((stat2) => {
    if (!stat2.group && stat2.tag === FilterTag.MercenaryPrimary) {
      return { ...stat2, disabled: false };
    }
    return stat2;
  });
  const realStats = stats.filter((stat2) => !stat2.group && !INTERNAL_TRADE_IDS.includes(stat2.tradeId[0]));
  if (filters.veiled) {
    for (const statRef of filters.veiled.statRefs) {
      const statOrGroup = STAT_BY_REF_V2(statRef);
      const dbStats = "stats" in statOrGroup ? statOrGroup.stats : [statOrGroup];
      realStats.push({
        disabled: filters.veiled.disabled,
        tradeId: dbStats.filter((dbStat) => "veiled" /* Veiled */ in dbStat.trade.ids).map((dbStat) => dbStat.trade.ids["veiled" /* Veiled */][0])
      });
    }
  }
  if (filters.influences) {
    for (const influence of filters.influences) {
      realStats.push({
        disabled: influence.disabled,
        tradeId: pseudoStatByRef(INFLUENCE_PSEUDO_TEXT[influence.value]).trade.ids["pseudo" /* Pseudo */]
      });
    }
  }
  const qAnd = query.stats[0];
  const qNot = {
    type: "not",
    filters: []
  };
  for (const group of stats) {
    if (group.group === "not") {
      query.stats.push({
        type: "not",
        disabled: group.meta.disabled,
        filters: group.stats.flatMap((stat2) => everyTradeIdToQuery(stat2))
      });
    } else if (group.group === "one") {
      query.stats.push({
        type: "count",
        value: { min: 1 },
        disabled: group.meta.disabled || group.stats.every((stat2) => stat2.disabled),
        filters: group.stats.flatMap((stat2) => everyTradeIdToQuery(stat2))
      });
    } else if (group.group === "mercenary") {
      const { meta: skill, stats: stats2 } = group;
      if (skill.tag === FilterTag.MercenaryPrimary) {
        appendAndFilter({ ...skill, disabled: false }, qAnd, query.stats);
      } else if (!skill.disabled) {
        appendAndFilter(skill, qAnd, query.stats);
      }
      const socketedSupports = stats2.filter((stat2) => !stat2.not && !INTERNAL_TRADE_IDS.includes(stat2.tradeId[0]));
      const enabledOptionalGems = socketedSupports.filter((stat2) => !stat2.disabled && stat2.option.value === 0 /* Optional */);
      const enabledRequiredGems = socketedSupports.filter((stat2) => !stat2.disabled && stat2.option.value === 1 /* Required */);
      const localNotMode = stats2.some((stat2) => stat2.tradeId[0] === "item.mercenary_6link");
      const localNotStats = localNotMode ? stats2.filter((stat2) => stat2.not && !stat2.disabled) : [];
      for (const stat2 of stats2) {
        if (skill.disabled || enabledRequiredGems.length === 5) break;
        if (stat2.not) {
          if (localNotMode) continue;
          if (!stat2.disabled) {
            qNot.filters.push(...everyTradeIdToQuery(stat2));
          }
        } else if (stat2.tradeId[0] === "item.mercenary_6link") {
          const forceEnabled = stat2.disabled && localNotStats.length > 0;
          if (stat2.disabled && !forceEnabled) continue;
          const possibleSupports = stat2.sources.map((source) => decodeFamilyFromSource(source)).filter((family) => !localNotStats.some(
            (notStat) => notStat.statRef === family[0].mercenary.canonical || notStat.statRef === family[0].ref
          ));
          let tier3Count = typeof stat2.roll?.min === "number" ? Math.min(Math.max(stat2.roll.min, 0), 5) : 0;
          const maxTierEnabledCount = enabledRequiredGems.filter((stat3) => stat3.mercenary.maxTier).length + (enabledOptionalGems.length >= 2 ? enabledOptionalGems.filter((stat3) => stat3.mercenary.maxTier).length - 1 : 0);
          if (forceEnabled || maxTierEnabledCount >= tier3Count) {
            tier3Count = 0;
          }
          if (tier3Count < 5) {
            query.stats.push({
              type: "mercenary",
              disabled: false,
              ...weightedGroupToQuery({
                allOf: [skill.tradeId],
                someOf: {
                  min: 5,
                  ids: possibleSupports.map((family) => {
                    if (family.length >= 3) {
                      const minTier = family[0].mercenary.syntheticFamily ? 3 : 2;
                      family = family.filter((stat3) => stat3.mercenary.tier >= minTier);
                    }
                    return family.flatMap((stat3) => stat3.trade.ids["pseudo" /* Pseudo */]);
                  })
                }
              })
            });
          }
          if (tier3Count > 0) {
            query.stats.push({
              type: "mercenary",
              disabled: false,
              ...weightedGroupToQuery({
                allOf: [skill.tradeId],
                someOf: {
                  min: tier3Count,
                  ids: possibleSupports.map((family) => {
                    return family[family.length - 1].trade.ids["pseudo" /* Pseudo */];
                  })
                }
              })
            });
          }
        }
      }
      if (enabledOptionalGems.length >= 2) {
        query.stats.push({
          type: "mercenary",
          disabled: false,
          ...weightedGroupToQuery({
            allOf: [
              skill.tradeId,
              ...enabledRequiredGems.map((stat2) => stat2.tradeId)
            ],
            someOf: {
              min: enabledOptionalGems.length - 1,
              ids: enabledOptionalGems.map((stat2) => stat2.tradeId)
            }
          })
        });
      } else {
        query.stats.push({
          type: "mercenary",
          value: !skill.disabled && enabledRequiredGems.length ? { min: 1 + enabledRequiredGems.length } : void 0,
          // for a Skill without any checked Support Gems we use a simple AND filter
          disabled: skill.disabled || !enabledRequiredGems.length,
          filters: [
            ...everyTradeIdToQuery(skill),
            ...socketedSupports.flatMap((stat2) => everyTradeIdToQuery({
              ...stat2,
              option: void 0,
              disabled: stat2.option.value === 0 /* Optional */ ? true : stat2.disabled
            }))
          ]
        });
      }
    }
  }
  for (const stat2 of realStats) {
    if (stat2.not) {
      qNot.filters.push(...everyTradeIdToQuery(stat2));
    } else {
      appendAndFilter(stat2, qAnd, query.stats);
    }
  }
  if (qNot.filters.length) {
    query.stats.push(qNot);
  }
  return body;
}
var cache = new Cache();
function getMinMax(roll, divisor) {
  if (!roll) {
    return { min: void 0, max: void 0 };
  }
  const sign = roll.tradeInvert ? -1 : 1;
  const a = typeof roll.min === "number" ? roll.min * sign / divisor : void 0;
  const b = typeof roll.max === "number" ? roll.max * sign / divisor : void 0;
  return !roll.tradeInvert ? { min: a, max: b } : { min: b, max: a };
}
function weightedGroupToQuery(group) {
  const someOf = group.someOf ?? { min: 0, ids: [] };
  const allOf = group.allOf ?? [];
  const surplus = Math.max(0, someOf.ids.length - someOf.min);
  const weight = surplus + 1;
  const totalMin = someOf.min + allOf.length * weight;
  const flatIds = [];
  for (const familyIds of allOf) {
    for (const id of familyIds) {
      for (let i = 0; i < weight; i++) {
        flatIds.push(id);
      }
    }
  }
  flatIds.push(...someOf.ids.flatMap((familyIds) => familyIds));
  return {
    value: { min: totalMin },
    filters: flatIds.map((id) => ({ id }))
  };
}
function appendAndFilter(stat2, defaultAndGroup, allGroups) {
  if (stat2.tradeId.length === 1) {
    defaultAndGroup.filters.push(tradeIdToQuery(stat2.tradeId[0], stat2));
  } else {
    allGroups.push({
      type: "count",
      value: { min: 1 },
      disabled: stat2.disabled,
      filters: everyTradeIdToQuery(stat2)
    });
  }
}
function everyTradeIdToQuery(stat2) {
  return stat2.tradeId.map((id) => tradeIdToQuery(id, stat2));
}
function tradeIdToQuery(id, stat2) {
  let roll = stat2.roll;
  const divMinMax = id.startsWith("{div_by_100}") ? 100 : 1;
  if (id.startsWith("{empty}") || id.startsWith("{empty_if_100}") && roll?.value === 100) {
    roll = void 0;
  }
  if (id.startsWith("{")) {
    id = id.slice(id.indexOf("}") + 1);
  }
  return {
    id,
    value: {
      ...getMinMax(roll, divMinMax),
      option: stat2.option != null ? stat2.option.value : void 0
    },
    disabled: stat2.disabled
  };
}
function nameToQuery(name, discriminator) {
  if (!discriminator) {
    return name;
  } else {
    return {
      discriminator,
      option: name
    };
  }
}

// core/shims/leagues.js
var PERMANENT_SC = ["Standard"];

// core/apt/src/web/price-check/filters/create-item-filters.ts
function createFilters(item, opts) {
  const filters = {
    searchExact: {},
    trade: {
      offline: false,
      onlineInLeague: false,
      merchantOnly: opts.merchantOnly && // these are Divination Cards, and some items at start of league
      // that are on Currency Exchange but was not added to Bulk section of site yet
      !(item.info.exchangeable && !item.info.tradeTag),
      listed: null,
      currency: opts.currency,
      league: opts.league,
      collapseListings: opts.collapseListings,
      collapseMerchant: false
    }
  };
  if ((!item.info.craftable || CONSUMABLE_CRAFTABLE_ITEM.has(item.category)) && item.rarity !== "Unique" /* Unique */) {
    if (!opts.currency) {
      filters.trade.currency = "chaos_divine";
    }
    if (item.info.refName !== "Mercenary Warrant") {
      filters.trade.collapseMerchant = true;
    }
  }
  if (item.category === "Gem" /* Gem */) {
    return createGemFilters(item, filters, opts);
  }
  if (item.category === "Captured Beast" /* CapturedBeast */) {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
    return filters;
  }
  if (item.stackSize || tradeTag(item) || item.info.exchangeable) {
    filters.stackSize = {
      value: item.stackSize?.value || 1,
      disabled: !(item.stackSize && item.stackSize.value > 1 && opts.activateStockFilter)
    };
  }
  if (item.category === "Invitation" /* Invitation */) {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
    return filters;
  }
  if (item.category === "Metamorph Sample" /* MetamorphSample */) {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
    filters.itemLevel = {
      value: item.itemLevel,
      disabled: false
    };
    return filters;
  }
  if (item.info.refName === "Scrying Orb") {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info),
      sub: {
        baseType: item.mapArea.name,
        baseTypeTrade: item.mapArea.tradeDisc,
        discriminatorTrade: item.info.tradeDisc,
        disabled: false
      }
    };
    return filters;
  }
  if (item.category === "Divination Card" /* DivinationCard */ || item.category === "Currency" /* Currency */ || item.info.refName === "Charged Compass") {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
    if (item.info.refName === "Chronicle of Atzoatl") {
      filters.areaLevel = {
        value: floorToBracket(item.areaLevel, [1, 68, 73, 75, 78, 80]),
        disabled: false
      };
    } else if (item.info.refName === "Mirrored Tablet") {
      filters.areaLevel = {
        value: item.areaLevel,
        disabled: false
      };
    } else if (item.info.refName === "Forbidden Tome") {
      filters.areaLevel = {
        value: item.areaLevel,
        disabled: false
      };
      if (item.areaLevel < 83) {
        filters.areaLevel.max = item.areaLevel;
      }
    } else if (item.itemLevel) {
      filters.itemLevel = {
        value: item.itemLevel,
        disabled: false
      };
    }
    return filters;
  }
  if (item.category === "Map" /* Map */) {
    if (item.info.area?.blighted) {
      filters.searchExact = {
        baseType: item.info.name,
        baseTypeTrade: t(opts, ITEM_BY_REF("ITEM", "Map")[0]),
        discriminatorTrade: "map",
        sub: {
          baseType: item.mapArea.name,
          baseTypeTrade: item.mapArea.tradeDisc,
          discriminatorTrade: item.info.tradeDisc,
          disabled: false
        }
      };
    } else if (item.rarity === "Unique" /* Unique */ && item.uniqueBase) {
      filters.searchExact = {
        name: item.info.name,
        nameTrade: t(opts, item.info),
        baseTypeTrade: t(opts, item.uniqueBase)
      };
    } else {
      filters.searchExact = {
        baseType: item.info.name,
        baseTypeTrade: t(opts, item.info)
      };
    }
    if (item.info.refName === "Map" || item.uniqueBase?.refName === "Map") {
      filters.searchExact.discriminatorTrade = "map";
    }
    if (item.info.refName === "Blighted Map") {
      filters.mapBlighted = { value: "Blighted" };
    } else if (item.info.refName === "Blight-ravaged Map") {
      filters.mapBlighted = { value: "Blight-ravaged" };
    } else if (item.info.refName === "Map") {
      filters.mapBlighted = { value: false };
    }
    if (item.mapCompletionReward) {
      filters.mapCompletionReward = {
        name: item.mapCompletionReward.name,
        nameTrade: t(opts, item.mapCompletionReward)
      };
    }
    if (item.mapTier) {
      filters.mapTier = {
        value: item.mapTier,
        disabled: false
      };
    }
  } else if (item.info.refName === "Expedition Logbook") {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
    filters.areaLevel = {
      value: floorToBracket(item.areaLevel, [1, 68, 73, 78, 81, 83]),
      disabled: false
    };
  } else if (item.category === "Chart" /* Chart */) {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
    filters.searchRelaxed = {
      category: item.category,
      disabled: false,
      sub: {
        baseType: item.mapArea.name,
        baseTypeTrade: item.mapArea.tradeDisc,
        discriminatorTrade: item.info.tradeDisc,
        disabled: false
      }
    };
  } else if (item.rarity === "Unique" /* Unique */ && item.uniqueBase) {
    filters.searchExact = {
      name: item.info.name,
      nameTrade: t(opts, item.info),
      baseTypeTrade: t(opts, item.uniqueBase)
    };
  } else {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
    if (item.category && CATEGORY_TO_TRADE_ID.has(item.category)) {
      let disabled = opts.exact;
      if (item.category === "Cluster Jewel" /* ClusterJewel */ || item.category === "Idol" /* Idol */ || item.category === "Graft" /* Graft */ || item.category === "Heist Blueprint" /* HeistBlueprint */) {
        disabled = true;
      } else if (item.category === "Sanctum Relic" /* SanctumRelic */ || item.category === "Charm" /* Charm */ || item.category === "Heist Contract" /* HeistContract */) {
        disabled = false;
      }
      filters.searchRelaxed = {
        category: item.category,
        disabled
      };
    }
  }
  if (item.sentinelCharge != null) {
    filters.sentinelCharge = {
      value: item.sentinelCharge,
      disabled: false
    };
  }
  if (item.quality && item.quality >= 20 && !JEWELLERY.has(item.category)) {
    if (item.category === "Flask" /* Flask */ || item.category === "Tincture" /* Tincture */ || getPropQuality(item) === 0 || opts.exact) {
      filters.quality = {
        value: item.quality,
        disabled: item.quality <= 20
      };
    }
  }
  if (item.sockets?.linked) {
    filters.linkedSockets = {
      value: item.sockets.linked,
      disabled: false
    };
  }
  const forAdornedJewel = item.rarity === "Magic" /* Magic */ && // item.isCorrupted && -- let the buyer corrupt
  (item.category === "Jewel" /* Jewel */ || item.category === "Abyss Jewel" /* AbyssJewel */);
  if (!item.isUnmodifiable && (item.info.craftable || item.rarity === "Unique" /* Unique */)) {
    filters.corrupted = {
      value: item.isCorrupted,
      exact: forAdornedJewel
    };
  }
  if (forAdornedJewel) {
    filters.rarity = {
      value: "magic",
      disabled: false
    };
  } else if (opts.exact && item.rarity === "Magic" /* Magic */ && !CONSUMABLE_CRAFTABLE_ITEM.has(item.category) && !MAGIC_ONLY_OR_UNIQUE_ITEM.has(item.category)) {
    filters.rarity = {
      value: "magic",
      disabled: true
    };
  } else if (item.info.craftable && (item.rarity === "Normal" /* Normal */ || item.rarity === "Magic" /* Magic */ || item.rarity === "Rare" /* Rare */)) {
    filters.rarity = {
      value: "nonunique",
      disabled: false
    };
  }
  if (item.isMirrored) {
    filters.mirrored = { disabled: false, hidden: false };
  } else if (item.info.craftable && !item.isCorrupted) {
    filters.mirrored = { disabled: true, hidden: true };
  }
  if (item.isSplit) {
    filters.split = { disabled: false, hidden: false };
  } else if ((!PERMANENT_SC.includes(opts.league) || opts.exact) && item.info.craftable && !item.isCorrupted && !item.isMirrored && !item.isSynthesised && !item.isFractured && !item.influences.length) {
    filters.split = { disabled: true, hidden: true };
  }
  if (!item.isFractured && (item.info.craftable && !item.isCorrupted && !item.isMirrored)) {
    filters.fractured = { value: false };
  }
  if (item.isFoil) {
    filters.foil = { disabled: false };
  }
  if (item.influences.length && item.influences.length <= 2) {
    filters.influences = item.influences.map((influence) => ({
      value: influence,
      disabled: !opts.exact
    }));
  }
  if (item.itemLevel) {
    if (item.rarity !== "Unique" /* Unique */ && item.category !== "Map" /* Map */ && item.category !== "Jewel" /* Jewel */ && /* https://pathofexile.gamepedia.com/Jewel#Affixes */
    item.category !== "Heist Blueprint" /* HeistBlueprint */ && item.category !== "Heist Contract" /* HeistContract */ && item.category !== "Chart" /* Chart */ && item.category !== "Memory Line" /* MemoryLine */ && item.category !== "Sanctum Relic" /* SanctumRelic */ && item.category !== "Charm" /* Charm */ && item.category !== "Idol" /* Idol */ && item.info.refName !== "Expedition Logbook") {
      if (item.category === "Cluster Jewel" /* ClusterJewel */) {
        filters.itemLevel = {
          value: floorToBracket(item.itemLevel, [1, 50, 68, 75, 84]),
          max: ceilToBracket(item.itemLevel, [100, 74, 67, 49]),
          disabled: !opts.exact
        };
      } else {
        filters.itemLevel = {
          value: Math.min(item.itemLevel, 86),
          disabled: !opts.exact || item.category === "Flask" /* Flask */ || item.category === "Tincture" /* Tincture */
        };
      }
    }
    if (item.rarity === "Unique" /* Unique */) {
      if (item.isUnidentified && item.info.refName === "Watcher's Eye") {
        filters.itemLevel = {
          value: item.itemLevel,
          disabled: false
        };
      }
      if (item.itemLevel >= 75 && [
        "Agnerod",
        "Agnerod East",
        "Agnerod North",
        "Agnerod South",
        "Agnerod West"
      ].includes(item.info.refName)) {
        const normalizedLvl = item.itemLevel >= 82 ? 82 : item.itemLevel >= 80 ? 80 : item.itemLevel >= 78 ? 78 : 75;
        filters.itemLevel = {
          value: normalizedLvl,
          disabled: false
        };
      }
    }
  }
  if (item.isUnidentified) {
    filters.unidentified = {
      value: true,
      disabled: item.rarity !== "Unique" /* Unique */
    };
  }
  if (item.isVeiled) {
    filters.veiled = {
      statRefs: item.statsByType.filter((calc) => calc.type === "veiled" /* Veiled */).map((calc) => calc.stat.ref),
      disabled: false
    };
    if (item.rarity !== "Unique" /* Unique */) {
      if (filters.itemLevel) {
        filters.itemLevel.disabled = false;
      }
    }
  }
  if (item.rarity === "Unique" /* Unique */) {
    filters.foulborn = {
      value: Boolean(item.isFoulborn)
    };
    filters.vestigial = {
      value: Boolean(item.isVestigial)
    };
  }
  if (item.category === "Heist Contract" /* HeistContract */ || item.category === "Heist Blueprint" /* HeistBlueprint */ || item.category === "Chart" /* Chart */) {
    if (item.rarity !== "Unique" /* Unique */) {
      filters.areaLevel = {
        value: item.areaLevel,
        disabled: false
      };
    }
  }
  return filters;
}
function createGemFilters(item, filters, opts) {
  if (!item.info.gem.transfigured) {
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, item.info)
    };
  } else {
    const normalGem = ITEM_BY_REF("GEM", item.info.gem.normalVariant)[0];
    filters.searchExact = {
      baseType: item.info.name,
      baseTypeTrade: t(opts, normalGem),
      discriminatorTrade: item.info.tradeDisc
    };
  }
  if (item.vaalGem) {
    filters.searchExact.sub = {
      baseType: item.vaalGem.name,
      baseTypeTrade: t(opts, item.vaalGem),
      discriminatorTrade: item.info.tradeDisc,
      disabled: false
    };
  }
  filters.corrupted = {
    value: item.isCorrupted
  };
  if (!item.imbuedGem && item.isCorrupted && item.gemLevel >= 20) {
    filters.imbuedGem = {
      disabled: true
    };
  }
  filters.gemLevel = {
    value: item.gemLevel,
    disabled: item.gemLevel < item.info.gem.maxLevel
  };
  if (item.quality) {
    filters.quality = {
      value: item.quality,
      disabled: item.info.gem.maxLevel === 1 ? false : item.info.gem.maxLevel === 20 && !item.info.gem.transfigured ? item.quality < 16 : item.quality < 20
    };
  }
  return filters;
}
function t(opts, info) {
  return opts.useEn ? info.refName : info.name;
}
function floorToBracket(value, brackets) {
  let prev = brackets[0];
  for (const num of brackets) {
    if (num > value) {
      return prev;
    } else {
      prev = num;
    }
  }
  return prev;
}
function ceilToBracket(value, brackets) {
  let prev = brackets[0];
  for (const num of brackets) {
    if (num < value) {
      return prev;
    } else {
      prev = num;
    }
  }
  return prev;
}

// core/apt/src/web/price-check/filters/create-presets.ts
var ROMAN_NUMERALS = ["I", "II", "III", "IV", "V"];
function createPresets(item, opts) {
  if (item.info.refName === "Expedition Logbook") {
    return {
      active: ROMAN_NUMERALS[0],
      presets: item.logbookAreaMods.map((area, idx) => ({
        id: ROMAN_NUMERALS[idx],
        filters: createFilters(item, { ...opts, exact: true }),
        stats: createExactStatFilters(item, sumStatsByModType(area), opts)
      }))
    };
  } else if (item.info.refName === "Mercenary Warrant") {
    return {
      active: "filters.preset_exact",
      presets: [{
        id: "filters.preset_exact",
        filters: createFilters(item, { ...opts, exact: true }),
        stats: createMercenaryFilters(item)
      }]
    };
  }
  if (!item.info.craftable && item.rarity !== "Unique" /* Unique */ || item.isUnidentified || item.rarity === "Normal" /* Normal */ || item.category === "Flask" /* Flask */ && item.rarity !== "Unique" /* Unique */ || item.category === "Tincture" /* Tincture */ && item.rarity !== "Unique" /* Unique */ || item.category === "Sanctum Relic" /* SanctumRelic */ && item.rarity !== "Unique" /* Unique */ || item.category === "Idol" /* Idol */ && item.rarity !== "Unique" /* Unique */ || item.category === "Charm" /* Charm */ || item.category === "Map" /* Map */ || item.category === "Memory Line" /* MemoryLine */ || item.category === "Invitation" /* Invitation */ || item.category === "Heist Contract" /* HeistContract */ || item.category === "Heist Blueprint" /* HeistBlueprint */ || item.category === "Chart" /* Chart */ || item.category === "Sentinel" /* Sentinel */) {
    if (item.rarity !== "Unique" /* Unique */ && (item.category === "Map" /* Map */ && !item.mapCompletionReward || item.category === "Chart" /* Chart */)) {
      const bulkPreset = {
        id: "filters.preset_bulk",
        filters: createFilters(item, { ...opts, exact: true }),
        stats: createExactStatFilters(item, item.statsByType, { ...opts, mode: "bulk" })
      };
      if (item.rarity === "Rare" /* Rare */ && !item.isUnidentified && !item.info.area?.blighted) {
        const propsPreset = {
          id: "filters.preset_pseudo",
          filters: createFilters(item, { ...opts, exact: true }),
          stats: createExactStatFilters(item, item.statsByType, { ...opts, mode: "props" })
        };
        return {
          active: item.category === "Chart" /* Chart */ && item.mapArea.area.special ? bulkPreset.id : propsPreset.id,
          presets: [propsPreset, bulkPreset]
        };
      } else {
        return { active: bulkPreset.id, presets: [bulkPreset] };
      }
    }
    return {
      active: "filters.preset_exact",
      presets: [{
        id: "filters.preset_exact",
        filters: createFilters(item, { ...opts, exact: true }),
        stats: createExactStatFilters(item, item.statsByType, opts)
      }]
    };
  }
  const pseudoPreset = {
    id: "filters.preset_pseudo",
    filters: createFilters(item, { ...opts, exact: false }),
    stats: initUiModFilters(item, opts)
  };
  const likelyFinishedItem = item.rarity === "Unique" /* Unique */ || item.statsByType.some((calc) => calc.type === "crafted" /* Crafted */) || item.quality === 20 && !item.memoryStrands || // quality > 20 can be used for selling bases, quality < 20 drops sometimes
  item.isCorrupted || item.isMirrored;
  const hasCraftingValue = item.isSynthesised || item.isFractured || item.influences.length || item.category === "Cluster Jewel" /* ClusterJewel */ || item.category === "Jewel" /* Jewel */ && item.rarity === "Magic" /* Magic */ || item.category !== "Jewel" /* Jewel */ && item.category !== "Abyss Jewel" /* AbyssJewel */ && item.itemLevel >= 82;
  if (likelyFinishedItem || !hasCraftingValue) {
    return { active: pseudoPreset.id, presets: [pseudoPreset] };
  }
  const baseItemPreset = {
    id: "filters.preset_base_item",
    filters: createFilters(item, { ...opts, exact: true }),
    stats: createExactStatFilters(item, item.statsByType, opts)
  };
  return {
    active: pseudoPreset.id,
    presets: [pseudoPreset, baseItemPreset]
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CATEGORY_TO_TRADE_ID,
  ItemCategory,
  ItemRarity,
  ModifierType,
  calculatedStatToFilter,
  createPresets,
  createTradeRequest,
  init,
  parseClipboard
});
