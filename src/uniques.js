// Неопознанный уник: игра показывает только базу. Какие уники бывают на этой базе — из справочника
// предметов (тот же items.ndjson, что у разбора), с картинками с web.poecdn.com.
'use strict';

/**
 * @returns Map: база (refName) → [{ name, refName, icon, replica, info }], без повторов, по алфавиту,
 *          реплики — в конце
 */
function uniqueIndex(ndjson) {
  const byBase = new Map();
  for (const line of String(ndjson).split('\n')) {
    if (!line.includes('"namespace":"UNIQUE"')) continue;
    let r;
    try { r = JSON.parse(line); } catch { continue; }
    const base = r.unique?.base;
    if (!base || !r.name) continue;
    const list = byBase.get(base) || [];
    if (list.some((u) => u.name === r.name)) continue;
    list.push({ name: r.name, refName: r.refName, icon: /^https:\/\/web\.poecdn\.com\//.test(r.icon || '') ? r.icon : '', replica: /^Replica /.test(r.refName), info: r });
    byBase.set(base, list);
  }
  for (const list of byBase.values()) list.sort((a, b) => (a.replica - b.replica) || a.name.localeCompare(b.name));
  return byBase;
}

const isUnidUnique = (item) => item?.rarity === 'Unique' && !!item.isUnidentified && !item.info?.unique;

/** Делает из неопознанного уника выбранный уник (меняет item): поиск пойдёт по имени и базе. */
function resolveUnique(item, u) {
  item.uniqueBase = item.info;
  item.info = u.info;
  item.infoVariants = [u.info];
  item.name = u.info.name;
  return item;
}

module.exports = { uniqueIndex, isUnidUnique, resolveUnique };
