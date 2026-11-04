// Собирает ядро (core/) в один CommonJS-файл lib/core.js.
// Запуск: node scripts/build-core.js  (нужен esbuild: npm i -D esbuild или глобальный)
'use strict';
const path = require('path');
const fs = require('fs');

let esbuild;
for (const p of ['esbuild', '/opt/npm-tools/node_modules/esbuild']) {
  try { esbuild = require(p); break; } catch { /* дальше */ }
}
if (!esbuild) { console.error('esbuild not found: npm i -D esbuild'); process.exit(1); }

const root = path.join(__dirname, '..');
const core = path.join(root, 'core');
const apt = path.join(core, 'apt', 'src');
const shim = (f) => path.join(core, 'shims', f);

// Пути Awakened PoE Trade «@/…» и сторонние библиотеки → исходники и заглушки
const ALIAS = [
  [/^@\/assets\/data$/, path.join(core, 'src', 'data.ts')],
  [/^@\/web\/Config$/, shim('config.js')],
  [/^@\/web\/background\/IPC$/, shim('ipc.js')],
  [/background\/Leagues$/, shim('leagues.js')],
  [/^vue$/, shim('vue.js')],
  [/^luxon$/, shim('luxon.js')],
  [/^dot-prop$/, shim('dot-prop.js')],
  [/^object-hash$/, shim('object-hash.js')],
  [/^neverthrow$/, shim('neverthrow.js')],
];

const aliasPlugin = {
  name: 'apt-alias',
  setup (build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      for (const [re, target] of ALIAS) if (re.test(args.path)) return { path: target };
      if (args.path.startsWith('@/')) {
        const base = path.join(apt, args.path.slice(2));
        for (const ext of ['.ts', '/index.ts', '.js']) if (fs.existsSync(base + ext)) return { path: base + ext };
      }
      return undefined;
    });
  },
};

esbuild.build({
  entryPoints: [path.join(core, 'src', 'entry.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  outfile: path.join(root, 'lib', 'core.js'),
  plugins: [aliasPlugin],
  logLevel: 'warning',
  banner: { js: '// Сгенерировано scripts/build-core.js — не править вручную.\n// Разбор предметов и фильтры: Awakened PoE Trade (c) Alexander Drozdov, MIT License (core/apt/LICENSE).' },
}).then(() => console.log('lib/core.js built')).catch(() => process.exit(1));
