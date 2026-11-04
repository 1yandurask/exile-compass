// Готовит data/gems.json — цвет каждого камня (R/G/B/W) из данных Path of Building.
// Запуск: node scripts/build-gems.js путь/к/PathOfBuilding/src/Data/Gems.lua
// Данные PoB распространяются по лицензии MIT (см. data/LICENSE-PathOfBuilding.txt).
'use strict';

const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  console.error('Укажите путь к src/Data/Gems.lua из репозитория Path of Building');
  process.exit(1);
}
const lua = fs.readFileSync(src, 'utf8');

const byId = {};
const byName = {};
const blockRe = /\["(Metadata\/Items\/Gems\/[^"]+)"\]\s*=\s*\{([\s\S]*?)\n\t\},/g;
let m;
let count = 0;
while ((m = blockRe.exec(lua))) {
  const [, gameId, body] = m;
  const str = (k) => (new RegExp(`\\b${k}\\s*=\\s*"([^"]*)"`).exec(body) || [])[1];
  const num = (k) => Number((new RegExp(`\\b${k}\\s*=\\s*(\\d+)`).exec(body) || [])[1] || 0);
  const tags = (/tags\s*=\s*\{([\s\S]*?)\}/.exec(body) || [])[1] || '';
  const req = { R: num('reqStr'), G: num('reqDex'), B: num('reqInt') };
  let colour = 'W';
  const best = Object.entries(req).sort((a, b) => b[1] - a[1])[0];
  if (best[1] > 0) colour = best[0];
  else if (/\bstrength\s*=\s*true/.test(tags)) colour = 'R';
  else if (/\bdexterity\s*=\s*true/.test(tags)) colour = 'G';
  else if (/\bintelligence\s*=\s*true/.test(tags)) colour = 'B';

  byId[gameId] = colour;
  for (const k of [str('grantedEffectId'), str('variantId')]) if (k) byId[k] = colour;
  const name = str('name');
  if (name) byName[name.toLowerCase()] = colour;
  count++;
}

const dst = path.join(__dirname, '..', 'data', 'gems.json');
fs.writeFileSync(dst, JSON.stringify({ byId, byName }));
console.log(`${count} gems → ${dst} (${(fs.statSync(dst).size / 1024).toFixed(0)} KB)`);
