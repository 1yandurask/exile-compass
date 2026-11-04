// Скачать шрифты Alegreya и Alegreya Sans (SIL OFL) из репозитория Google Fonts в renderer/fonts.
// Запуск: node scripts/fetch-fonts.js (делается при сборке на GitHub).
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://raw.githubusercontent.com/google/fonts/main/ofl/';
const FILES = {
  'Alegreya.ttf': 'alegreya/Alegreya%5Bwght%5D.ttf',
  'AlegreyaSans-Regular.ttf': 'alegreyasans/AlegreyaSans-Regular.ttf',
  'AlegreyaSans-Medium.ttf': 'alegreyasans/AlegreyaSans-Medium.ttf',
  'AlegreyaSans-Bold.ttf': 'alegreyasans/AlegreyaSans-Bold.ttf',
  'OFL-Alegreya.txt': 'alegreya/OFL.txt',
  'OFL-AlegreyaSans.txt': 'alegreyasans/OFL.txt',
};
const OUT = path.join(__dirname, '..', 'renderer', 'fonts');

function get(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'exile-compass-build' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
        res.resume();
        return resolve(get(new URL(res.headers.location, url).href, redirects - 1));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`${url}: ${res.statusCode}`)); }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, src] of Object.entries(FILES)) {
    const buf = await get(BASE + src);
    if (name.endsWith('.ttf') && buf.length < 10000) throw new Error(`${name}: file is too small`);
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log(`${name}: ${buf.length} bytes`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
