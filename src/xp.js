// Штраф опыта PoE 1 по разнице уровня персонажа и уровня зоны.
// Безопасная разница = 3 + floor(уровень / 16); сверх неё
// множитель = ((L + 5) / (L + 5 + разница^2.5))^1.5.
// Зоны выше 70 считаются по «эффективному» уровню (-0.03·m² + 5.17·m − 144.9).
'use strict';

const safeZone = (level) => 3 + Math.floor(level / 16);

function effectiveMonsterLevel(m) {
  return m > 70 ? -0.03 * m * m + 5.17 * m - 144.9 : m;
}

// Доля опыта, которую получает персонаж (1 — без штрафа)
function xpMultiplier(level, areaLevel) {
  const diff = Math.max(Math.abs(level - effectiveMonsterLevel(areaLevel)) - safeZone(level), 0);
  if (!diff) return 1;
  return ((level + 5) / (level + 5 + diff ** 2.5)) ** 1.5;
}

// Первый уровень персонажа, на котором зона уже без штрафа (для зон выше персонажа)
function levelWithoutPenalty(areaLevel, from) {
  for (let l = from; l <= 100; l++) if (xpMultiplier(l, areaLevel) >= 1) return l;
  return null;
}

// Самая высокая зона, ниже которой персонаж ещё не теряет опыт (для зон ниже персонажа)
function lowestFineArea(level) {
  for (let a = 1; a <= 100; a++) if (xpMultiplier(level, a) >= 1) return a;
  return null;
}

/**
 * Карточка-предупреждение или null.
 * @param threshold доля потерь, с которой предупреждать (0.1 — 10%)
 */
function xpCard(level, areaLevel, threshold = 0.1) {
  if (!Number.isFinite(level) || !Number.isFinite(areaLevel)) return null;
  const mult = xpMultiplier(level, areaLevel);
  if (1 - mult < threshold) return null;
  const pct = Math.max(1, Math.round(mult * 100));
  const loss = 100 - pct;
  if (areaLevel > level) {
    const need = levelWithoutPenalty(areaLevel, level);
    return {
      kind: 'xp',
      label: `XP penalty — ${loss}% lost`,
      title: `Area is ${areaLevel - level} level${areaLevel - level === 1 ? '' : 's'} above you`,
      text: `Level ${level} in a level ${areaLevel} area: you get ${pct}% XP, and monsters hit harder.${need ? ` No penalty from level ${need} (${need - level} more).` : ''}`,
    };
  }
  const fine = lowestFineArea(level);
  return {
    kind: 'xp',
    label: `XP penalty — ${loss}% lost`,
    title: `You are ${level - areaLevel} level${level - areaLevel === 1 ? '' : 's'} above this area`,
    text: `Level ${level} in a level ${areaLevel} area: you get ${pct}% XP.${fine ? ` Areas of level ${fine}+ give full XP.` : ''}`,
  };
}

module.exports = { safeZone, effectiveMonsterLevel, xpMultiplier, levelWithoutPenalty, lowestFineArea, xpCard };
