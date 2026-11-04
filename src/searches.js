// Строки для поиска в окне торговца PoE 1. Поле поиска принимает регулярные выражения
// до 50 символов; внутри кавычек «|» означает «или».
'use strict';

const MAX_LEN = 50;

// «+1 к уровню камней» на оружии. Само свойство указывает на тип оружия (данные модов PoB):
// «… Spell Skill Gems» — жезлы, скипетры, кинжалы для заклинаний, посохи;
// «Socketed Melee Gems» — оружие ближнего боя; «Socketed Bow Gems» — луки.
// Берём короткие, но однозначные куски текста свойств — иначе всё вместе не влезает в 50 символов
const GEM_MODS = { spell: 'spell skill', melee: 'ted melee', bow: 'ted bow' };
// «movement sp», а не короче: «nt sp» совпало бы и с «Totem Placement Speed»
const MS = 'movement sp';
const CLASS_WEAPONS = {
  Witch: ['spell'],
  Templar: ['spell', 'melee'],
  Shadow: ['spell', 'melee'],
  Ranger: ['bow'],
  Duelist: ['melee'],
  Marauder: ['melee'],
  Scion: ['spell', 'melee', 'bow'],
};
const WEAPON_WORDS = { spell: 'wands, sceptres, staves', melee: 'melee weapons', bow: 'bows' };

const LINK3 = '-\\w-'; // три сокета через два дефиса: «Sockets: R-G-B B»
const quote = (s) => `"${s}"`;

/**
 * Встроенные строки под класс персонажа. Первая — всё сразу в одной строке:
 * 3-link и больше, скорость передвижения, оружие с +1 к уровню камней для этого класса.
 */
function builtin(className) {
  const kinds = CLASS_WEAPONS[className] || [];
  const weapon = kinds.map((k) => GEM_MODS[k]);
  const all = [LINK3, MS, ...weapon].join('|');
  const list = [];
  list.push({
    id: 'auto:all',
    name: className ? `All-in-one (${className})` : 'All-in-one',
    text: quote(all),
    note: `3+ links, movement speed${kinds.length ? `, +1 gem level ${kinds.map((k) => WEAPON_WORDS[k]).join(' / ')}` : ''}`,
  });
  list.push(
    { id: 'auto:3link', name: '3-link', text: LINK3, note: 'Any item with 3 or more linked sockets' },
    { id: 'auto:4link', name: '4-link', text: '-\\w-\\w-', note: 'Any item with 4 or more linked sockets' },
    { id: 'auto:5link', name: '5-link', text: '-\\w-\\w-\\w-', note: 'Any item with 5 or more linked sockets' },
    { id: 'auto:ms', name: 'Movement speed', text: quote(MS), note: 'Boots with movement speed (quicksilver flasks match too)' },
  );
  if (weapon.length) {
    list.push({
      id: 'auto:gemlevel',
      name: `+1 gem level weapon (${className})`,
      text: quote(weapon.join('|')),
      note: `+1 to level of gems on ${kinds.map((k) => WEAPON_WORDS[k]).join(' / ')}`,
    });
  }
  return list.map((x) => ({ ...x, auto: true }));
}

function validate(item) {
  const name = String(item?.name || '').trim().slice(0, 40);
  const text = String(item?.text || '').trim();
  if (!name) throw new Error('Give the search a name');
  if (!text) throw new Error('The search text is empty');
  if (text.length > MAX_LEN) throw new Error(`The game accepts up to ${MAX_LEN} characters — this one has ${text.length}`);
  return { name, text };
}

module.exports = { MAX_LEN, GEM_MODS, CLASS_WEAPONS, MS, builtin, validate };
