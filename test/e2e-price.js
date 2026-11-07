// Сквозная проверка main.js без Electron: Ctrl+D → копирование предмета → окно цены →
// поиск на поддельном сайте торговли → правки → повторный поиск → лиги, лимиты, Esc.
// Запуск: node test/e2e-harness.js
'use strict';

const Module = require('module');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert/strict');
const { EventEmitter } = require('events');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'exile-compass-price-'));
const shortcuts = new Map();
const handlers = {};
const created = [];
const opened = [];
let clip = 'something else';
let readyResolve;

class FakeWindow {
  constructor(o) { this.o = o; this.visible = false; this.bounds = { x: o.x || 0, y: o.y || 0, width: o.width, height: o.height }; this.sent = []; this.events = {}; this.webContents = { send: (ch, v) => this.sent.push([ch, v]) }; created.push(this); }
  loadFile(f) { this.file = path.basename(f); }
  setAlwaysOnTop() {} setMenuBarVisibility() {} once() {} focus() { this.focused = true; }
  on(ev, fn) { this.events[ev] = fn; }
  show() { this.visible = true; this.focused = true; } showInactive() { this.visible = true; this.inactive = true; } hide() { this.visible = false; this.focused = false; }
  isFocused() { return !!this.focused; }
  isVisible() { return this.visible; } isDestroyed() { return false; }
  getBounds() { return this.bounds; } setBounds(b) { this.bounds = b; }
  setOpacity(v) { this.opacity = v; } close() { this.closed = true; }
  setIgnoreMouseEvents(v, o) { this.ignoreMouse = v; this.forward = !!o?.forward; }
}

// Поддельный сайт торговли и poe.ninja
const requests = [];
let tradeMode = 'ok';
globalThis.__priceCheckFetch = async (url, init = {}) => {
  requests.push({ url, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null, headers: init.headers });
  const json = (status, body, headers = {}) => ({ status, ok: status < 400, headers: { get: (k) => headers[k.toLowerCase()] ?? null }, json: async () => body, text: async () => JSON.stringify(body) });
  if (url.includes('/api/trade/data/leagues')) return json(200, { result: [{ id: 'Standard', realm: 'pc', text: 'Standard' }, { id: 'Mirage', realm: 'pc', text: 'Mirage' }, { id: 'Hardcore Mirage', realm: 'pc', text: 'Hardcore Mirage' }] });
  if (url.includes('poe.ninja')) return json(200, { x: [{ type: 'Currency', lines: [{ name: 'Divine Orb', chaos: 200 }] }] });
  if (tradeMode === '429') return json(429, {}, { 'retry-after': '30' });
  if (url.includes('/api/trade/search/')) return json(200, { id: 'QID', total: 3, result: ['a', 'b', 'c'] }, { 'x-rate-limit-rules': 'Ip', 'x-rate-limit-ip': '100:1:1', 'x-rate-limit-ip-state': '0:1:0' });
  if (url.includes('/api/trade/fetch/')) {
    return json(200, { result: [
      { id: 'a', listing: { price: { amount: 3, currency: 'chaos' }, indexed: new Date(Date.now() - 120_000).toISOString(), account: { name: 'Seller1', online: {} }, fee: 2 }, item: { ilvl: 84 } },
      { id: 'b', listing: { price: { amount: 1, currency: 'divine' }, indexed: new Date(Date.now() - 7200_000).toISOString(), account: { name: 'Seller1', online: {} } }, item: { ilvl: 85 } },
      { id: 'c', listing: { price: { amount: 2, currency: 'divine' }, indexed: new Date(Date.now() - 86400_000).toISOString(), account: { name: 'Seller2', online: {} } }, item: { ilvl: 86 } },
    ] }, { 'x-rate-limit-rules': 'Ip', 'x-rate-limit-ip': '100:1:1', 'x-rate-limit-ip-state': '0:1:0' });
  }
  return json(404, { error: { message: 'unknown' } });
};

// Поддельный PowerShell: на COPY кладёт в буфер текст предмета
let itemText = fs.readFileSync(path.join(__dirname, 'items', 'rare-body.txt'), 'utf8');
let copyAnswer = 'OK';
let advancedCopyFails = false; // неопознанные: игра не копирует по Ctrl+Alt+C, только по Ctrl+C
const helperCmds = [];
let helper = null;
globalThis.__priceCheckSpawn = () => {
  const p = new EventEmitter();
  helper = p;
  p.stdout = new EventEmitter();
  p.stdin = { write: (s) => { helperCmds.push(s.trim()); if (s.trim() === 'FOCUS') setTimeout(() => p.stdout.emit('data', 'OK\n'), 2); if (s.trim() === 'COPY') { if (copyAnswer === 'OK' && !advancedCopyFails) clip = itemText; setTimeout(() => p.stdout.emit('data', `${copyAnswer}\n`), 5); } if (s.trim() === 'COPYPLAIN') { if (copyAnswer === 'OK') clip = itemText; setTimeout(() => p.stdout.emit('data', `${copyAnswer}\n`), 5); } }, end() {} };
  p.kill = () => {};
  setTimeout(() => p.stdout.emit('data', 'READY\n'), 1);
  return p;
};

const DISPLAY = { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };
// Старые программы: Exile Compass при первом запуске забирает их настройки
fs.mkdirSync(path.join(tmp, 'PoE Price Check'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'PoE Price Check', 'settings.json'), JSON.stringify({ hotkey: 'Ctrl+D', mainHotkey: 'Ctrl+Space', league: '', saleMode: 'securable' }));
fs.mkdirSync(path.join(tmp, 'PoE Act Guide'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'PoE Act Guide', 'settings.json'), JSON.stringify({ hotkeys: { build: 'F6', search: 'Ctrl+D', logout: 'F12' }, logPath: path.join(tmp, 'no-Client.txt') }));
fs.writeFileSync(path.join(tmp, 'PoE Act Guide', 'builds.json'), '[]');

const electron = {
  app: {
    requestSingleInstanceLock: () => true,
    whenReady: () => new Promise((r) => { readyResolve = r; }),
    getPath: () => tmp,
    getVersion: () => '0.1.0',
    userAgentFallback: 'Mozilla/5.0 Electron',
    isPackaged: false,
    on() {}, quit() {},
  },
  BrowserWindow: FakeWindow,
  globalShortcut: {
    register: (a, fn) => { shortcuts.set(a, fn); return true; },
    unregister: (a) => shortcuts.delete(a),
    unregisterAll: () => shortcuts.clear(),
    isRegistered: (a) => shortcuts.has(a),
  },
  ipcMain: { handle: (ch, fn) => { handlers[ch] = fn; } },
  screen: {
    getCursorScreenPoint: () => ({ x: 100, y: 100 }),
    getDisplayNearestPoint: () => DISPLAY,
    getPrimaryDisplay: () => DISPLAY,
    getAllDisplays: () => [DISPLAY],
    getDisplayMatching: () => DISPLAY,
  },
  dialog: { showOpenDialog: async () => ({ canceled: true, filePaths: [] }) },
  Tray: class { setToolTip() {} setContextMenu() {} on() {} destroy() {} },
  Menu: { buildFromTemplate: () => ({}) },
  nativeImage: { createFromPath: () => ({}) },
  shell: { openExternal: (u) => opened.push(u) },
  clipboard: { readText: () => clip, writeText: (t) => { clip = t; } },
  net: { fetch: () => { throw new Error('real network is not used in tests'); } },
};
const origLoad = Module._load;
Module._load = function (req, ...rest) {
  if (req === 'electron') return electron;
  return origLoad.call(this, req, ...rest);
};

const call = async (ch, ...args) => {
  const r = await handlers[ch]({ sender: null }, ...args);
  if (!r.ok) throw new Error(r.error);
  return r.result;
};
const win = (f) => created.find((w) => w.file === f);
const lastPrice = () => win('price.html').sent.filter(([ch]) => ch === 'price').at(-1)[1];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  require('../main.js');
  readyResolve();
  await wait(100);

  // Старт: Ctrl+Space, лига по умолчанию — лига испытаний
  assert.ok(shortcuts.has('Ctrl+Space'));
  const mw = win('main.html');
  mw.visible = false;
  shortcuts.get('Ctrl+Space')();
  assert.ok(mw.visible, 'Ctrl+Space открывает главное окно');
  shortcuts.get('Ctrl+Space')();
  assert.ok(!mw.visible, 'и закрывает');
  let m = await call('lib:get');
  assert.equal(m.price.league, 'Mirage', 'не Standard и не Hardcore');
  assert.deepEqual(m.price.leagues.map((l) => l.id), ['Standard', 'Mirage', 'Hardcore Mirage']);
  assert.equal(m.price.saleMode, 'securable');
  console.log('✓ запуск: Ctrl+D перехвачен, лига испытаний выбрана сама');
  assert.deepEqual(m.migratedFrom, ['PoE Act Guide', 'PoE Price Check']);
  assert.equal(m.welcomed, true, 'уже пользовались — первый запуск не показываем');
  assert.equal(m.hotkeys.search, 'Ctrl+D', 'клавиша из Act Guide осталась');
  assert.equal(m.hotkeys.relog, 'F12', 'клавиша «выход к выбору персонажа» перешла в relog');
  assert.ok(!('logout' in m.hotkeys));
  assert.equal(m.hotkeys.price, '', 'у проверки цены та же клавиша — не отбираем, пусть выберут другую');
  await call('hotkey:set', 'search', 'F9');
  m = await call('hotkey:set', 'price', 'Ctrl+D');
  assert.ok(shortcuts.has('Ctrl+D') && shortcuts.has('F9'));
  console.log('✓ первый запуск: настройки Act Guide и Price Check перенесены, клавиши без столкновений');

  // Ctrl+D: предмет из игры → окно → поиск
  shortcuts.get('Ctrl+D')();
  await wait(300);
  const pw = win('price.html');
  assert.ok(pw.visible && pw.inactive && !pw.focused, 'окно цены открыто, фокус остался у игры');
  assert.deepEqual(pw.bounds, { x: 0, y: 0, width: 1920, height: 1080 }, 'слой на весь экран');
  assert.equal(pw.o.transparent, true);
  assert.ok(shortcuts.has('Escape'));
  assert.equal(clip, 'something else', 'буфер обмена возвращён как был');
  let v = lastPrice();
  assert.equal(v.item.name, 'Grim Shell');
  assert.equal(v.league, 'Mirage');
  const search = requests.find((r) => r.url.includes('/search/'));
  assert.equal(search.url, 'https://www.pathofexile.com/api/trade/search/Mirage');
  assert.equal(search.body.query.status.option, 'securable');
  assert.equal(search.headers['User-Agent'], 'Mozilla/5.0 Electron');
  assert.equal(v.result.listings.length, 3);
  assert.deepEqual(v.result.listings.map((l) => [l.amount, l.short]), [[3, 'c'], [1, 'div'], [2, 'div']]);
  assert.deepEqual(v.result.listings[1].converted, { amount: 200, currency: 'c' }, 'пересчёт по poe.ninja');
  assert.equal(v.result.listings[0].instant, true);
  const lastCheck = (await call('lib:get')).price.last;
  assert.equal(lastCheck.listings.length, 3, 'главное окно видит последнюю проверку');
  assert.ok(lastCheck.name);
  assert.ok(win('main.html').sent.some(([ch, v]) => ch === 'library' && v.price.last), 'и получает её сразу');
  console.log('✓ Ctrl+D: предмет скопирован из игры, найден, 3 лота с ценами и пересчётом');

  // Выключить жизнь, поменять минимум сопротивлений → Search
  const life = v.chips.find((c) => /maximum Life/.test(c.label));
  const res = v.chips.find((c) => /total Elemental Resistance/.test(c.label));
  requests.length = 0;
  v = await call('price:search', { [life.id]: { enabled: false }, [res.id]: { enabled: true, min: 60, max: '' } });
  const body = requests.find((r) => r.url.includes('/search/')).body;
  const ids = body.query.stats[0].filters.filter((f) => !f.disabled).map((f) => [f.id, f.value.min]);
  assert.deepEqual(ids, [['pseudo.pseudo_total_elemental_resistance', 60]]);
  assert.equal(v.chips.find((c) => c.id === life.id).enabled, false, 'выключенное остаётся выключенным');
  console.log('✓ правки: свойство выключено, минимум изменён, поиск заново');

  // Открыть на сайте
  await call('price:open');
  assert.match(opened[0], /^https:\/\/www\.pathofexile\.com\/trade\/search\/Mirage\?q=/);

  // Смена лиги в окне цены — поиск в новой лиге
  requests.length = 0;
  v = await call('price:league', 'Standard');
  assert.equal(v.league, 'Standard');
  assert.ok(requests.some((r) => r.url.endsWith('/search/Standard')));
  assert.equal((await call('lib:get')).price.league, 'Standard', 'и в главном окне');
  console.log('✓ «Open on trade site» и смена лиги из окна цены');

  // Лимит сайта: 429 → таймер, без ошибки
  tradeMode = '429';
  v = await call('price:search', {});
  assert.equal(v.error, '');
  assert.ok(lastPrice().wait >= 29_000, 'окно получило время ожидания');
  await assert.rejects(() => call('price:search', {}).then((x) => { if (!x.wait) throw new Error('no wait'); throw new Error('wait'); }), /wait/, 'пока сайт велел ждать — ждём');
  tradeMode = 'ok';
  console.log('✓ лимит сайта: окно показывает таймер');

  // Esc закрывает окно и отпускает клавишу
  shortcuts.get('Escape')();
  assert.ok(!pw.visible);
  assert.ok(!shortcuts.has('Escape'));

  // Ошибка из жалобы: второй предмет показывал цены первого (брался старый текст из буфера)
  await wait(5200); // лимит сайта по умолчанию — 1 поиск в 5 с
  shortcuts.get('Ctrl+D')();
  await wait(300);
  assert.equal(lastPrice().item.name, 'Grim Shell');
  itemText = fs.readFileSync(path.join(__dirname, 'items', 'unique-body.txt'), 'utf8');
  await wait(5200);
  shortcuts.get('Ctrl+D')(); // окно открыто — закрыть и проверить новый предмет под курсором
  await wait(400);
  assert.equal(lastPrice().item.name, "Shavronne's Wrappings", 'проверен новый предмет, а не старый');
  assert.ok(pw.visible);
  await wait(5200);
  shortcuts.get('Ctrl+D')(); // тот же предмет ещё раз — тоже проверяется
  await wait(400);
  assert.equal(lastPrice().item.name, "Shavronne's Wrappings");
  assert.ok(pw.visible, 'тот же предмет можно проверить повторно');
  copyAnswer = 'NOTGAME';
  const sentBefore = pw.sent.length;
  shortcuts.get('Ctrl+D')(); // игра не впереди
  await wait(300);
  assert.ok(!pw.visible, 'окно закрылось');
  assert.equal(pw.sent.length, sentBefore, 'старый предмет из буфера не показывается');
  copyAnswer = 'OK';
  itemText = fs.readFileSync(path.join(__dirname, 'items', 'rare-body.txt'), 'utf8');
  console.log('✓ Ctrl+D при открытом окне — новый предмет; повторная проверка; без игры старое не показывается');

  // Неопознанный уник: сначала выбор уника (с картинками), поиска до выбора нет
  itemText = fs.readFileSync(path.join(__dirname, 'items', 'unid-unique-belt.txt'), 'utf8');
  advancedCopyFails = true;
  await wait(5200);
  const searches = () => requests.filter((r) => r.url.includes('/api/trade/search/'));
  const nSearch = searches().length;
  shortcuts.get('Ctrl+D')();
  await wait(1300); // Ctrl+Alt+C ждём 0,7 с, потом Ctrl+C
  let pv = lastPrice();
  assert.ok(pw.visible);
  assert.ok(pv.pick.length > 5 && pv.pick.some((u) => u.name === 'Headhunter' && /^https:\/\/web\.poecdn\.com\//.test(u.icon)), 'список уников базы с картинками');
  assert.equal(pv.item.name, 'Leather Belt');
  assert.ok(!pv.chips?.length, 'плашек пока нет');
  assert.ok(helperCmds.includes('COPYPLAIN'), 'Ctrl+Alt+C не скопировал — скопировано обычным Ctrl+C');
  advancedCopyFails = false;
  assert.equal(searches().length, nSearch, 'до выбора на сайт не ходим');
  await wait((pv.waitMs || 0) + 300); // лимит сайта от прошлых проверок
  pv = await call('price:pickUnique', 'Headhunter');
  assert.equal(pv.item.name, 'Headhunter');
  assert.equal(pv.item.base, 'Leather Belt');
  assert.equal(pv.unique.name, 'Headhunter');
  assert.ok(!pv.pick, 'после выбора — обычное окно цены');
  assert.equal(searches().at(-1).body.query.name, 'Headhunter');
  assert.equal(searches().at(-1).body.query.type, 'Leather Belt');
  pv = await call('price:changeUnique');
  assert.ok(pv.pick.length > 5 && !pv.chips, '«Choose another» — снова список');
  await assert.rejects(() => call('price:pickUnique', 'Mageblood'), /Unknown unique/, 'чужой уник не выбрать');
  // На базе один уник — выбираем сами
  itemText = fs.readFileSync(path.join(__dirname, 'items', 'unid-unique-single.txt'), 'utf8');
  await wait(5200);
  shortcuts.get('Ctrl+D')();
  await wait(400);
  pv = lastPrice();
  assert.equal(pv.item.name, "Shavronne's Wrappings", 'единственный уник базы — без вопроса');
  assert.ok(!pv.pick);
  itemText = fs.readFileSync(path.join(__dirname, 'items', 'rare-body.txt'), 'utf8');
  console.log('✓ неопознанный уник: выбор из списка с картинками, «Choose another», единственный — сам');

  // Клик в игру мимо окна: окно теряет фокус и закрывается
  await wait(5200);
  shortcuts.get('Ctrl+D')();
  await wait(300);
  assert.ok(pw.visible);
  pw.events.blur();
  assert.ok(!pw.visible, 'потеря фокуса закрывает окно');
  console.log('✓ закрытие при потере фокуса');

  // Клик мимо панели, когда окно не в фокусе: мышь проходит в игру, помощник ловит клик
  await wait(5200);
  shortcuts.get('Ctrl+D')();
  await wait(300);
  assert.ok(pw.visible && pw.ignoreMouse === true && pw.forward, 'мимо панели окно пропускает мышь');
  await call('price:hover', true);
  assert.equal(pw.ignoreMouse, false, 'над панелью окно принимает клики');
  await call('price:hover', false);
  await call('price:panel', { x: 100, y: 50, width: 680, height: 600 });
  const w = helperCmds.filter((c) => c.startsWith('WATCH')).pop();
  assert.match(w, /^WATCH \d+ \d+ \d+ \d+$/, w);
  helperCmds.length = 0;
  helper.stdout.emit('data', 'OUTSIDE\n');
  await wait(20);
  assert.ok(!pw.visible, 'клик мимо панели закрыл окно');
  assert.ok(helperCmds.includes('UNWATCH'));
  assert.ok(!helperCmds.includes('FOCUS'), 'фокус и так у игры — не трогаем');
  // Окно получило фокус (кликнули по панели), закрыли Esc — фокус возвращается игре
  await wait(5200);
  shortcuts.get('Ctrl+D')();
  await wait(300);
  pw.focused = true;
  helperCmds.length = 0;
  await call('price:close');
  await wait(20);
  assert.ok(!pw.visible && helperCmds.includes('FOCUS'), 'после Esc/крестика фокус — игре');
  console.log('✓ клик мимо панели закрывает окно и доходит до игры; после Esc фокус у игры');

  // Валюта — сообщение про обменник, без поиска
  itemText = 'Item Class: Stackable Currency\nRarity: Currency\nDivine Orb\n--------\nStack Size: 3/20\n--------\nRandomises the numeric values of the random modifiers on an item\n';
  requests.length = 0;
  clip = 'x';
  shortcuts.get('Ctrl+D')();
  await wait(300);
  v = lastPrice();
  assert.match(v.error, /Currency Exchange/);
  assert.ok(!requests.some((r) => r.url.includes('/search/')));
  console.log('✓ валюта: сообщение про обменник, на сайт не ходим');

  // Не в игре: Ctrl+D молчит, если в буфере не предмет
  copyAnswer = 'NOTGAME';
  shortcuts.get('Escape')?.();
  pw.visible = false;
  clip = 'hello';
  shortcuts.get('Ctrl+D')();
  await wait(200);
  assert.ok(!pw.visible, 'не в игре и в буфере не предмет — окно не открываем');

  // Режим продажи и смена клавиши
  m = await call('pc:saleMode', 'available');
  assert.equal(m.price.saleMode, 'available');
  await call('capture:start');
  assert.equal(shortcuts.size, 0);
  m = await call('hotkey:set', 'price', 'Ctrl+Shift+D');
  assert.ok(shortcuts.has('Ctrl+Shift+D') && !shortcuts.has('Ctrl+D'));
  await assert.rejects(() => call('hotkey:set', 'main', 'Ctrl+Shift+D'), /already used for “Price check”/);
  await assert.rejects(() => call('hotkey:set', 'price', 'F6'), /already used/, 'клавиша окна дерева занята');
  m = await call('hotkey:set', 'main', 'Ctrl+Alt+Space');
  assert.ok(shortcuts.has('Ctrl+Alt+Space') && !shortcuts.has('Ctrl+Space'));
  const saved = JSON.parse(fs.readFileSync(path.join(tmp, 'settings.json'), 'utf8'));
  assert.deepEqual([saved.hotkeys.price, saved.hotkeys.main, saved.price.league, saved.price.saleMode], ['Ctrl+Shift+D', 'Ctrl+Alt+Space', 'Standard', 'available']);
  console.log('✓ настройки: продавцы, клавиша, лига сохраняются');

  console.log('\nСквозная проверка пройдена');
  process.exit(0);
})().catch((e) => {
  console.error('✗', e.stack || e.message);
  process.exit(1);
});
