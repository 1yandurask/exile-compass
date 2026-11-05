'use strict';

const { app, BrowserWindow, globalShortcut, ipcMain, screen, Tray, Menu, nativeImage, dialog, shell, clipboard } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { importBuild, stageView, cleanTitle } = require('./src/pob');
const { isRisky } = require('./src/hotkeys');
const { ClientLogWatcher, findDefaultLog, lastLevel } = require('./src/clientLog');
const { buildIndex, lookup, nearby, cardsFor } = require('./src/zones');
const gemShop = require('./src/gems');
const { Updater } = require('./src/updater');
const { DiscordPresence } = require('./src/discord');
const { xpCard } = require('./src/xp');
const searches = require('./src/searches');
const { GameKeys } = require('./src/keys');
const { PriceCheck } = require('./src/priceCheck');
const PKG = require('./package.json');

if (!app.requestSingleInstanceLock()) app.quit();

// Любая непредвиденная ошибка — в журнал error.log в папке программы, а не падение программы
function logError(where, err) {
  try { require('./src/store').errorLog(app.getPath('userData'))(where, err); } catch { /* не важно */ }
}
process.on('uncaughtException', (e) => logError('uncaught', e));
process.on('unhandledRejection', (e) => logError('unhandled promise', e));
app.on('child-process-gone', (_e, d) => logError('child process gone', `${d?.type} ${d?.reason} ${d?.exitCode ?? ''}`));

// Окно упало (видеодрайвер, нехватка памяти) — убираем его, при следующем открытии создастся заново
function onRendererGone(win, name, cleanup) {
  win.webContents.on?.('render-process-gone', (_e, d) => {
    logError(`window ${name} gone`, d?.reason || 'unknown');
    try { if (!win.isDestroyed()) win.destroy(); } catch { /* уже нет */ }
    cleanup();
  });
}

const DATA_DIR = path.join(__dirname, 'data');
const TREE_VERSION = readJsonSafe(path.join(__dirname, 'data', 'tree.json'))?.version || '';
function readJsonSafe(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } }
const userFile = (name) => path.join(app.getPath('userData'), name);
const store = require('./src/store');
const readJson = (file, fallback) => store.readJson(file, fallback);

// ---------------------------------------------------------------- настройки

const OVERLAYS = {
  build: { file: 'build.html', title: 'Build', size: [1180, 720] },
  quests: { file: 'quests.html', title: 'Quests', size: [520, 640] },
  secrets: { file: 'secrets.html', title: 'Secret rooms', size: [520, 640] },
  search: { file: 'search.html', title: 'Vendor search', size: [500, 600] },
};
// Клавиши-действия без своего окна
const ACTIONS = {
  copy: { title: 'Paste selected search' },
  relog: { title: 'Relog' },
  price: { title: 'Price check' },
  main: { title: 'Open Exile Compass' },
};
const keyTitle = (k) => (OVERLAYS[k] || ACTIONS[k])?.title || k;

const DEFAULTS = {
  hotkeys: { build: 'F6', quests: 'F7', secrets: 'F8', search: 'F9', copy: 'F10', relog: '', price: 'Ctrl+D', main: 'Ctrl+Space' },
  price: { league: '', saleMode: 'securable' }, // saleMode: securable — мгновенный выкуп; available — и лично
  welcomed: false, // первый запуск пройден
  windows: { build: { opacity: 0.96 }, quests: { opacity: 0.94 }, secrets: { opacity: 0.94 }, search: { opacity: 0.96 } },
  searches: { custom: [], selected: 'auto:all' }, // свои строки поиска и выбранная
  activeBuild: null,
  trayHintShown: false,
  notify: { quests: true, lab: true, secrets: true, gems: true, near: true, xp: true, copy: true },
  logPath: '',
  questsDone: [],
  labDone: [],
  discord: { enabled: true },
  toastPos: null, // { display, rx, ry, anchor } — доли экрана, чтобы не съезжало при смене разрешения
};

let settings;
let builds; // [{ id, name, addedAt, source, build, stage, skillSet, overrides }]

// Что передать в stageView: набор камней — один на весь билд, выбирается вручную
function viewOpts(b, index) {
  return { ...(b.overrides?.[index] || {}), skillSet: b.skillSet };
}

// Первый запуск Exile Compass: забрать билды и настройки из PoE Act Guide и PoE Price Check
function migrateOld() {
  if (fs.existsSync(userFile('settings.json'))) return;
  const appData = app.getPath('appData');
  const guide = path.join(appData, 'PoE Act Guide');
  const price = readJson(path.join(appData, 'PoE Price Check', 'settings.json'), null);
  const s = readJson(path.join(guide, 'settings.json'), null) || {};
  const oldBuilds = readJson(path.join(guide, 'builds.json'), null);
  if (!Object.keys(s).length && !oldBuilds && !price) return;
  const hotkeys = { ...DEFAULTS.hotkeys, ...(s.hotkeys || {}) };
  const used = new Set(Object.values(hotkeys).filter(Boolean));
  const take = (kind, accel) => {
    if (accel === undefined) return;
    if (accel && used.has(accel) && hotkeys[kind] !== accel) return; // занято другой клавишей — оставляем свою
    used.delete(hotkeys[kind]);
    hotkeys[kind] = accel;
    if (accel) used.add(accel);
  };
  if (price) {
    take('price', price.hotkey);
    take('main', price.mainHotkey);
  }
  const merged = {
    ...s,
    hotkeys,
    price: { league: price?.league || '', saleMode: price?.saleMode === 'available' ? 'available' : 'securable' },
    welcomed: true, // уже пользовались — первый запуск не показываем
    trayHintShown: false,
    migratedFrom: [Object.keys(s).length || oldBuilds ? 'PoE Act Guide' : '', price ? 'PoE Price Check' : ''].filter(Boolean),
  };
  try {
    store.writeJson(userFile('settings.json'), merged, true);
    if (oldBuilds) store.writeJson(userFile('builds.json'), oldBuilds);
  } catch { /* не вышло — начнём с чистого листа */ }
}

function load() {
  migrateOld();
  const s = readJson(userFile('settings.json'), {});
  settings = {
    ...DEFAULTS,
    ...s,
    hotkeys: { ...DEFAULTS.hotkeys, ...(s.hotkeys || {}) },
    notify: { ...DEFAULTS.notify, ...(s.notify || {}) },
    discord: { enabled: s.discord?.enabled ?? DEFAULTS.discord.enabled },
    price: { ...DEFAULTS.price, ...(s.price || {}) },
    questsDone: Array.isArray(s.questsDone) ? s.questsDone : [],
    labDone: Array.isArray(s.labDone) ? s.labDone : [],
    searches: { ...DEFAULTS.searches, ...(s.searches || {}), custom: Array.isArray(s.searches?.custom) ? s.searches.custom : [] },
    windows: Object.fromEntries(Object.keys(OVERLAYS).map((k) => [k, { ...DEFAULTS.windows[k], ...(s.windows?.[k] || {}) }])),
  };
  // «Exit to character select» стала «Relog»
  if (s.hotkeys?.logout && !s.hotkeys.relog) settings.hotkeys.relog = s.hotkeys.logout;
  delete settings.hotkeys.logout;
  // Новые клавиши (проверка цены, главное окно) не отбирают клавишу, уже занятую раньше
  for (const kind of ['price', 'main']) {
    const accel = settings.hotkeys[kind];
    if (accel && Object.entries(settings.hotkeys).some(([k, a]) => k !== kind && a === accel && !['price', 'main'].includes(k))) settings.hotkeys[kind] = '';
  }
  if (settings.hotkeys.price && settings.hotkeys.price === settings.hotkeys.main) settings.hotkeys.main = '';
  // Клавиша из прошлых тестовых сборок больше не существует
  delete settings.hotkeys.forge;
  // Раньше по умолчанию была выбрана строка 4-link — теперь общая
  if (settings.searches.selected === 'auto:4link') settings.searches.selected = 'auto:all';
  builds = readJson(userFile('builds.json'), []);
}

function saveSettings() {
  try { store.writeJson(userFile('settings.json'), settings, true); } catch (e) { logError('save settings', e); }
}

function saveBuilds() {
  try { store.writeJson(userFile('builds.json'), builds); } catch (e) { logError('save builds', e); }
}

function activeBuild() {
  return builds.find((b) => b.id === settings.activeBuild) || null;
}

// ---------------------------------------------------------------- окна-оверлеи

const wins = {};
let mainWin = null;
let tray = null;
let quitting = false;
const hotkeyErrors = {};

function defaultBounds(kind) {
  const { workArea } = screen.getPrimaryDisplay();
  const [w, h] = OVERLAYS[kind].size;
  const width = Math.min(w, workArea.width - 40);
  const height = Math.min(h, workArea.height - 40);
  const x = kind === 'build'
    ? workArea.x + Math.round((workArea.width - width) / 2)
    : workArea.x + workArea.width - width - 40;
  return { x, y: workArea.y + Math.round((workArea.height - height) / 2), width, height };
}

// Окно должно оставаться на одном из экранов (монитор могли отключить)
function visibleBounds(b) {
  if (!b) return null;
  const onScreen = screen.getAllDisplays().some(({ workArea: a }) => b.x < a.x + a.width - 60 && b.x + b.width > a.x + 60 && b.y >= a.y - 20 && b.y < a.y + a.height - 40);
  return onScreen ? b : null;
}

function createOverlay(kind) {
  const conf = settings.windows[kind];
  const bounds = visibleBounds(conf.bounds) || defaultBounds(kind);
  const win = new BrowserWindow({
    ...bounds,
    minWidth: kind === 'build' ? 760 : 360,
    minHeight: kind === 'build' ? 480 : 320,
    title: OVERLAYS[kind].title,
    frame: false,
    show: false,
    skipTaskbar: true,
    resizable: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    backgroundColor: '#1a1714',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, spellcheck: false },
  });
  onRendererGone(win, kind, () => { if (wins[kind] === win) delete wins[kind]; syncEscape(); });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setOpacity(conf.opacity);
  win.loadFile(path.join(__dirname, 'renderer', OVERLAYS[kind].file));

  let saveTimer = null;
  const remember = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (win.isDestroyed()) return;
      settings.windows[kind].bounds = win.getBounds();
      saveSettings();
    }, 400);
  };
  win.on('moved', remember);
  win.on('resized', remember);
  win.on('close', (e) => { if (!quitting) { e.preventDefault(); hideOverlay(kind); } });
  wins[kind] = win;
  return win;
}

function anyOverlayVisible() {
  return Object.values(wins).some((w) => w && !w.isDestroyed() && w.isVisible());
}

// Esc перехватываем только пока открыто хотя бы одно окно — иначе он нужен игре
function syncEscape() {
  const want = anyOverlayVisible() || !!priceCheck?.visible();
  const has = globalShortcut.isRegistered('Escape');
  if (want && !has) globalShortcut.register('Escape', closeEverything);
  if (!want && has) globalShortcut.unregister('Escape');
}

function closeEverything() {
  if (priceCheck?.visible()) priceCheck.hide();
  hideAllOverlays();
}

function showOverlay(kind) {
  const win = (wins[kind] && !wins[kind].isDestroyed() && wins[kind]) || createOverlay(kind);
  win.setAlwaysOnTop(true, 'screen-saver');
  win.show();
  win.focus();
  syncEscape();
}

function hideOverlay(kind) {
  wins[kind]?.hide();
  syncEscape();
}

function hideAllOverlays() {
  for (const k of Object.keys(wins)) wins[k]?.hide();
  syncEscape();
}

function toggleOverlay(kind) {
  const win = wins[kind];
  if (win && win.isVisible()) hideOverlay(kind);
  else showOverlay(kind);
}

// ---------------------------------------------------------------- клавиши

function registerHotkeys() {
  globalShortcut.unregisterAll();
  for (const [kind, accel] of Object.entries(settings.hotkeys)) {
    delete hotkeyErrors[kind];
    if (!accel) continue;
    try {
      const fn = ACTIONS[kind] ? () => runAction(kind) : () => toggleOverlay(kind);
      if (!globalShortcut.register(accel, fn)) {
        hotkeyErrors[kind] = 'This key is taken by another program';
      }
    } catch {
      hotkeyErrors[kind] = 'This key cannot be used';
    }
  }
  syncEscape();
}

// ---------------------------------------------------------------- состояние для окна билда

function buildState() {
  const b = activeBuild();
  if (!b) return { stage: null };
  const index = Math.min(Math.max(0, b.stage || 0), b.build.stages.length - 1);
  const stage = stageView(b.build, index, viewOpts(b, index));
  // Для каждого камня: можно ли его купить этим классом и отмечен ли он купленным
  const shop = {};
  for (const g of stage?.groups || []) {
    for (const gem of g.gems) {
      const info = gemShop.findGem(GEM_INDEX, gem);
      if (!info || !gemShop.buyable(GEM_INDEX, gem, b.build.className)) continue;
      const k = gemShop.gemKey(info.name);
      shop[gem.name] = { key: k, bought: !!b.gemShop?.[k]?.bought };
    }
  }
  return {
    buildId: b.id,
    buildName: b.name,
    stage,
    shop,
    stageTitles: b.build.stages.map((s) => cleanTitle(s.title)),
    skillSetTitles: b.build.skillSets.map((s) => cleanTitle(s.title)),
  };
}

function pushBuildState() {
  pushSearches();
  const w = wins.build;
  if (w && !w.isDestroyed()) w.webContents.send('state', buildState());
}

function libraryView() {
  return {
    builds: builds.map((b) => ({
      id: b.id,
      name: b.name,
      className: b.build.className,
      ascendClassName: b.build.ascendClassName,
      stages: b.build.stages.map((s) => cleanTitle(s.title)),
      stage: b.stage || 0,
      source: b.source,
      addedAt: b.addedAt,
    })),
    active: settings.activeBuild,
    hotkeys: settings.hotkeys,
    hotkeyErrors,
    windows: Object.fromEntries(Object.keys(OVERLAYS).map((k) => [k, { opacity: settings.windows[k].opacity }])),
    treeVersion: TREE_VERSION,
    notify: settings.notify,
    log: logState,
    character: character ? { level: character.level, cls: character.cls } : null,
    discord: {
      enabled: settings.discord.enabled,
      status: presence ? presence.status : 'off',
      error: discordError,
    },
    update: updater ? updater.state : null,
    version: app.getVersion(),
    welcomed: !!settings.welcomed,
    migratedFrom: settings.migratedFrom || [],
    price: priceCheck.summary(),
    playing: { cls: playing.cls, level: playing.level, area: playing.area },
    risky: Object.fromEntries(Object.entries(settings.hotkeys).map(([k, a]) => [k, isRisky(a)])),
  };
}

function pushLibrary() {
  if (mainWin && !mainWin.isDestroyed()) mainWin.webContents.send('library', libraryView());
}

// ---------------------------------------------------------------- уведомления по Client.txt

const DATA = {
  quests: readJson(path.join(DATA_DIR, 'quests.json'), null),
  labyrinth: readJson(path.join(DATA_DIR, 'labyrinth.json'), null),
  secrets: readJson(path.join(DATA_DIR, 'secrets.json'), null),
};
const AREAS = readJson(path.join(DATA_DIR, 'areas.json'), {});
const GEM_INDEX = gemShop.indexVendors(readJson(path.join(DATA_DIR, 'gem-vendors.json'), {}));
const zoneIndex = buildIndex(DATA.quests, DATA.labyrinth, DATA.secrets, AREAS);
// Шаблоны строк журнала, означающих прохождение испытания (labyrinth.json → completeLog)
const LAB_PATTERNS = (DATA.labyrinth?.completeLog || []).map((p) => { try { return new RegExp(p, 'i'); } catch { return null; } }).filter(Boolean);
const NOTIFY_KIND = { quest: 'quests', lab: 'lab', secret: 'secrets' };
let character = null; // { name, cls, level } — последнее повышение уровня нашего персонажа

// ---------------------------------------------------------------- Discord

// Application ID приложения «PoE Act Guide» в Discord Developer Portal — одно на всех игроков
const DISCORD_APP_ID = '1567362983657607248';
const CLASSES = readJsonSafe(path.join(DATA_DIR, 'tree.json'))?.classes || [];
let presence = null;
let discordError = '';
// Кто сейчас в игре — по любому повышению уровня, независимо от активного билда
const playing = { cls: '', level: null, area: '', act: null };

function pushPresence() {
  presence?.update({ ...playing });
}

function startPresence() {
  presence?.stop();
  presence = null;
  discordError = '';
  if (!settings.discord.enabled) return;
  presence = new DiscordPresence({ clientId: DISCORD_APP_ID, classes: CLASSES });
  presence.on('status', () => pushLibrary());
  presence.on('error-message', (m) => { discordError = m; pushLibrary(); });
  presence.start();
  pushPresence();
}
let watcher = null;
let toastWin = null;
let toastTimer = null;
const logState = { path: '', ok: false, error: '', lastZone: '' };

function createToast() {
  toastWin = new BrowserWindow({
    width: 440,
    height: 120,
    frame: false,
    transparent: true,
    show: false,
    resizable: false,
    focusable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, spellcheck: false },
  });
  onRendererGone(toastWin, 'toast', () => { toastWin = null; });
  toastWin.setAlwaysOnTop(true, 'screen-saver');
  toastWin.setIgnoreMouseEvents(true); // клики проходят в игру
  toastWin.loadFile(path.join(__dirname, 'renderer', 'toast.html'));
}

const TOAST_W = 440;

// Где показывать уведомление. Если оно в нижней половине экрана (например, над шаром
// жизни), окно растёт вверх, чтобы новые карточки не уходили за край.
function toastAnchor() {
  const p = settings.toastPos;
  const displays = screen.getAllDisplays();
  const d = (p && displays.find((x) => x.id === p.display)) || screen.getPrimaryDisplay();
  const b = d.bounds;
  if (!p) return { x: b.x + Math.round((b.width - TOAST_W) / 2), y: b.y + 70, anchor: 'top', b };
  return { x: b.x + Math.round(p.rx * b.width), y: b.y + Math.round(p.ry * b.height), anchor: p.anchor, b };
}

function placeToast(height) {
  const h = Math.max(60, Math.min(height, 520));
  const a = toastAnchor();
  const x = Math.min(Math.max(a.x, a.b.x), a.b.x + a.b.width - TOAST_W);
  const top = a.anchor === 'bottom' ? a.y - h : a.y;
  const y = Math.min(Math.max(top, a.b.y), a.b.y + a.b.height - h);
  toastWin.setBounds({ x, y, width: TOAST_W, height: h });
}

// Окно для перетаскивания уведомления на нужное место
let posWin = null;
function openPositioner() {
  if (posWin && !posWin.isDestroyed()) { posWin.show(); posWin.focus(); return; }
  const a = toastAnchor();
  const h = 150;
  posWin = new BrowserWindow({
    x: Math.min(Math.max(a.x, a.b.x), a.b.x + a.b.width - TOAST_W),
    y: Math.min(Math.max(a.anchor === 'bottom' ? a.y - h : a.y, a.b.y), a.b.y + a.b.height - h),
    width: TOAST_W,
    height: h,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, spellcheck: false },
  });
  posWin.setAlwaysOnTop(true, 'screen-saver');
  posWin.loadFile(path.join(__dirname, 'renderer', 'position.html'));
  posWin.on('closed', () => { posWin = null; });
}

function savePosition() {
  if (!posWin || posWin.isDestroyed()) return;
  const r = posWin.getBounds();
  const d = screen.getDisplayMatching(r);
  const b = d.bounds;
  const bottom = r.y + r.height / 2 > b.y + b.height / 2;
  settings.toastPos = {
    display: d.id,
    rx: (r.x - b.x) / b.width,
    ry: ((bottom ? r.y + r.height : r.y) - b.y) / b.height,
    anchor: bottom ? 'bottom' : 'top',
  };
  saveSettings();
  posWin.close();
}

// Сколько держать уведомление: «скопировано» — коротко, камни — дольше (их нужно успеть прочитать в городе)
function toastDuration(cards) {
  if (cards.every((c) => c.kind === 'copy')) return 2200;
  const gems = cards.some((c) => c.kind === 'gem' || c.kind === 'questgem');
  return 4500 + cards.length * 2500 + (gems ? 8000 : 0);
}

function showToast(cards) {
  if (!cards.length) return;
  if (!toastWin || toastWin.isDestroyed()) createToast();
  placeToast(30 + cards.length * 96);
  toastWin.webContents.send('toast', { cards });
  toastWin.showInactive(); // не забираем фокус у игры
  toastWin.setAlwaysOnTop(true, 'screen-saver');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastWin?.webContents.send('toast-hide');
    toastTimer = setTimeout(() => toastWin?.hide(), 350);
  }, toastDuration(cards));
}

function doneSet() {
  return new Set([...settings.questsDone, ...settings.labDone]);
}

// Камни, которые пора купить в этом городе; показы считаются — после третьего камень «куплен»
function gemCardsFor(area) {
  const b = activeBuild();
  if (!b || !area?.town || !settings.notify.gems || !character) return [];
  const si = Math.min(b.stage || 0, b.build.stages.length - 1);
  const stage = stageView(b.build, si, viewOpts(b, si));
  const gems = (stage?.groups || []).flatMap((g) => g.gems);
  const { quest, buy } = gemShop.gemsForTown(GEM_INDEX, gems, { className: b.build.className, level: character.level, act: area.act, shop: b.gemShop || {} });
  const list = [...quest, ...buy];
  if (!list.length) return [];
  b.gemShop = gemShop.countShown(b.gemShop || {}, list);
  saveBuilds();
  pushBuildState();
  // Сначала то, что можно взять бесплатно за квест, потом покупка
  return [...gemShop.questGemCards(quest, area.act), ...gemShop.gemCards(buy, area.act)];
}

// Штраф опыта: уровень персонажа из журнала против уровня зоны. В городах и убежищах не нужен.
function xpCardsFor(zone, areaLevel, area) {
  if (!settings.notify.xp || !playing.level || area?.town || /hideout/i.test(zone)) return [];
  const card = xpCard(playing.level, areaLevel, 0.1);
  return card ? [card] : [];
}

// ---------------------------------------------------------------- строки поиска у торговца

// Базовый класс персонажа, которым сейчас играют (из журнала: там может быть асценданси),
// иначе — класс активного билда
function currentClass() {
  const cls = playing.cls;
  const base = cls && (CLASSES.find((c) => c.name === cls) || CLASSES.find((c) => c.asc.includes(cls)));
  return base?.name || activeBuild()?.build.className || '';
}

function searchList() {
  const className = currentClass();
  const auto = searches.builtin(className);
  const items = [...auto, ...settings.searches.custom.map((c) => ({ ...c, custom: true }))];
  return {
    items,
    selected: items.some((x) => x.id === settings.searches.selected) ? settings.searches.selected : 'auto:all',
    className,
    copyKey: settings.hotkeys.copy || '',
    max: searches.MAX_LEN,
  };
}

function copySearch(id, toast = true) {
  const list = searchList();
  const item = list.items.find((x) => x.id === id) || list.items.find((x) => x.id === list.selected);
  if (!item) return null;
  clipboard.writeText(item.text);
  if (toast && settings.notify.copy) showToast([{ kind: 'copy', label: 'Copied — paste into the vendor search (Ctrl+V)', title: item.name, text: item.text }]);
  return item;
}

// Клавиша поиска: копирует выбранную строку и, если впереди игра, вставляет её в поле
// поиска у торговца (Ctrl+F → Ctrl+A → Ctrl+V). Не в игре — просто копирует.
let pasting = false;
async function pasteSearch() {
  if (pasting) return;
  pasting = true;
  try {
    const item = copySearch(settings.searches.selected, false);
    if (!item) return;
    const r = await gameKeys.paste();
    if (!settings.notify.copy) return;
    showToast([{
      kind: 'copy',
      label: r === 'OK' ? 'Pasted into the search box' : 'Copied — paste into the vendor search (Ctrl+V)',
      title: item.name,
      text: item.text,
    }]);
  } finally {
    pasting = false;
  }
}

// Нажатия в игру (чат-команды). В сквозной проверке подменяется.
const testSpawn = globalThis.__gameKeysSpawn || globalThis.__actGuideSpawn || globalThis.__priceCheckSpawn;
const gameKeys = new GameKeys(testSpawn ? { spawn: testSpawn } : {});

// Проверка цены: окно поверх игры и поиск на сайте торговли
const priceCheck = new PriceCheck({
  settings: () => settings.price,
  save: () => saveSettings(),
  gameKeys,
  preload: path.join(__dirname, 'preload.js'),
  rendererDir: path.join(__dirname, 'renderer'),
  dataDir: DATA_DIR,
  onVisible: () => syncEscape(),
  onChange: () => pushLibrary(),
  logError,
});

// Выход к выбору персонажа: /exit через чат (Enter → Ctrl+V → Enter), затем в буфере —
// выбранная строка поиска. Вставка, а не набор по буквам: так не мешает русская раскладка.
let exiting = false;
// Relog: первое нажатие — /exit (выход к выбору персонажа), второе нажатие на экране выбора — Enter
// (вход тем же персонажем). Одно нажатие клавиши — одно действие, как требуют правила игры для макросов:
// Enter сам по себе программа не нажимает.
const RELOG_WINDOW_MS = 90 * 1000; // сколько после /exit второе нажатие считается входом
let relogAt = 0; // когда отправили /exit; 0 — не на экране выбора

async function relog() {
  if (exiting) return;
  if (relogAt && Date.now() - relogAt < RELOG_WINDOW_MS) {
    exiting = true;
    try {
      const r = await gameKeys.enter();
      if (r === 'OK') relogAt = 0;
      else showToast([{ kind: 'xp', label: 'Relog', title: 'Did not enter the game', text: keysFailText(r) }]);
    } finally {
      exiting = false;
    }
    return;
  }
  exiting = true;
  try {
    const sel = searchList();
    const search = sel.items.find((x) => x.id === sel.selected);
    hideAllOverlays(); // фокус должен быть у игры
    await new Promise((r) => setTimeout(r, 60));
    clipboard.writeText('/exit');
    const r = await gameKeys.chat();
    // Игра читает буфер при обработке Ctrl+V — даём ей мгновение, потом кладём строку поиска
    await new Promise((res) => setTimeout(res, r === 'OK' ? 250 : 0));
    if (search) clipboard.writeText(search.text);
    if (r === 'OK') {
      relogAt = Date.now();
      // Подсказка: второе нажатие на экране выбора — вход; заодно строка поиска, если она скопирована
      showToast([{
        kind: 'copy',
        label: search ? 'Relog · search copied' : 'Relog',
        title: `Press ${settings.hotkeys.relog || 'the key'} again to enter the game`,
        text: search && settings.notify.copy ? search.text : '',
      }]);
    } else {
      showToast([{ kind: 'xp', label: 'Relog', title: 'Did not exit', text: `${keysFailText(r)}${search ? ' The search is copied anyway.' : ''}` }]);
    }
  } finally {
    exiting = false;
  }
}

function keysFailText(r) {
  return {
    NOTGAME: 'The game window was not in front — click into the game and press the key again.',
    UNAVAILABLE: 'Sending keys to the game works only on Windows.',
    BLOCKED: 'Windows did not let Exile Compass send keys to the game (PowerShell is blocked, often by an antivirus). Allow Exile Compass in your antivirus and restart it.',
  }[r] || 'Could not send keys to the game. If the game runs as administrator, run this app as administrator too.';
}

function runAction(kind) {
  if (kind === 'copy') pasteSearch();
  if (kind === 'relog') relog();
  if (kind === 'price') priceCheck.check();
  if (kind === 'main') toggleMain();
}

function pushSearches() {
  const w = wins.search;
  if (w && !w.isDestroyed()) w.webContents.send('searches', searchList());
}

function onZone({ zone, level, areaId, prevAreaId }) {
  relogAt = 0; // вошли в игру — следующее нажатие relog снова выходит
  logState.lastZone = zone;
  playing.area = zone;
  playing.act = AREAS[areaId]?.act ?? null;
  if (playing.act > 10) playing.act = null; // эпилог и карты — без номера акта
  pushPresence();
  const area = AREAS[areaId] && AREAS[areaId].name.toLowerCase() === zone.toLowerCase() ? AREAS[areaId] : null;
  const allowed = (e) => settings.notify[NOTIFY_KIND[e.kind]];
  const entries = lookup(zoneIndex, zone, level, areaId).filter(allowed);
  const near = settings.notify.near && area ? nearby(zoneIndex, areaId, prevAreaId, doneSet()).filter(allowed) : [];
  const cards = [...xpCardsFor(zone, level, area), ...gemCardsFor(area), ...cardsFor([...entries, ...near], doneSet())];
  showToast(cards);
  pushLibrary();
}

// Наш ли это персонаж: класс в журнале — базовый или асцендант; без билда принимаем любой
function ourCharacter(ev) {
  const b = activeBuild();
  if (!b) return true;
  return [b.build.className, b.build.ascendClassName].filter(Boolean).includes(ev.cls);
}

// Уровень из журнала для активного билда (после запуска или смены билда)
function refreshCharacter() {
  const file = logState.ok || watcher ? logState.path : '';
  const last = file ? lastLevel(file, ourCharacter) : null;
  character = last ? { name: last.name, cls: last.cls, level: last.level } : null;
}

function onLevel(ev) {
  const changed = playing.cls !== ev.cls;
  playing.cls = ev.cls;
  playing.level = ev.level;
  pushPresence();
  if (changed) pushSearches(); // строки поиска под класс персонажа
  if (!ourCharacter(ev)) return;
  character = { name: ev.name, cls: ev.cls, level: ev.level };
  pushLibrary();
}

// Испытание пройдено — если шаблон из labyrinth.json совпал, пока игрок в зоне испытания
function onMessage({ text, areaId }) {
  if (!LAB_PATTERNS.length || !LAB_PATTERNS.some((re) => re.test(text))) return;
  const area = AREAS[areaId];
  if (!area) return;
  const trial = lookup(zoneIndex, area.name, null, areaId).find((e) => e.kind === 'lab');
  if (!trial || settings.labDone.includes(trial.id)) return;
  settings.labDone = [...settings.labDone, trial.id];
  saveSettings();
  wins.quests?.webContents.send('lab-done', settings.labDone);
}

function startLogWatch() {
  watcher?.stop();
  watcher = null;
  const file = settings.logPath || findDefaultLog();
  logState.path = file;
  logState.ok = false;
  logState.error = '';
  if (!file) {
    logState.error = 'Client.txt not found — choose it manually';
    return;
  }
  try {
    watcher = new ClientLogWatcher(file);
    watcher.on('zone', onZone);
    watcher.on('level', onLevel);
    watcher.on('message', onMessage);
    refreshCharacter();
    const any = lastLevel(file);
    if (any) { playing.cls = any.cls; playing.level = any.level; pushPresence(); }
    watcher.start();
    logState.ok = true;
  } catch (e) {
    logState.error = `Cannot read ${file}`;
    watcher = null;
  }
}

// ---------------------------------------------------------------- автообновление

let updater = null;

function startUpdater() {
  // В собранной программе electron-builder может убрать раздел build из package.json
  const pub = PKG.build?.publish || {};
  updater = new Updater({
    version: app.getVersion(),
    owner: pub.owner || '1yandurask',
    repo: pub.repo || 'exile-compass',
    portable: !!process.env.PORTABLE_EXECUTABLE_DIR, // так electron-builder помечает portable-версию
    packaged: !!app.isPackaged,
    userAgent: `exile-compass/${app.getVersion()}`,
  });
  if (process.env.ACT_GUIDE_TEST || process.env.EXILE_COMPASS_TEST) globalThis.__updater = updater; // для сквозной проверки
  updater.on('state', (st) => {
    pushLibrary();
    if (st.status === 'ready') rebuildTrayMenu();
  });
  updater.start();
}

// Перезапуск с обновлением: сначала отпускаем всё, что может задержать выход
// (трей, клавиши, журнал, Discord) — установщик ждёт, пока программа закроется
function restartToUpdate() {
  if (updater?.state.status !== 'ready') return;
  quitting = true;
  priceCheck.quitting = true;
  gameKeys.stop();
  watcher?.stop();
  presence?.stop();
  updater.stop();
  globalShortcut.unregisterAll();
  tray?.destroy?.();
  tray = null;
  setImmediate(() => updater.install());
}

// ---------------------------------------------------------------- IPC

function handle(channel, fn) {
  ipcMain.handle(channel, async (e, ...args) => {
    try {
      return { ok: true, result: await fn(e, ...args) };
    } catch (err) {
      return { ok: false, error: err.message || String(err) };
    }
  });
}

function registerIpc() {
  // Окно билда
  handle('state:get', () => buildState());
  handle('stage:set', (_e, i) => {
    const b = activeBuild();
    if (!b) return buildState();
    b.stage = Math.min(Math.max(0, Number(i) || 0), b.build.stages.length - 1);
    saveBuilds();
    pushLibrary();
    // Этап могли сменить из главного окна — окно дерева тоже обновить
    const w = wins.build;
    if (w && !w.isDestroyed() && w.webContents !== _e.sender) w.webContents.send('state', buildState());
    return buildState();
  });
  handle('override:set', (_e, kind, idx) => {
    const b = activeBuild();
    if (!b || !['skillSet', 'itemSet'].includes(kind)) return buildState();
    // Набор камней — общий для всех этапов, переключение этапов его не меняет
    if (kind === 'skillSet') {
      b.skillSet = Number(idx);
      saveBuilds();
      return buildState();
    }
    b.overrides = b.overrides || {};
    const st = b.stage || 0;
    b.overrides[st] = { ...(b.overrides[st] || {}), [kind]: Number(idx) };
    saveBuilds();
    return buildState();
  });

  // Любое окно-оверлей
  handle('overlay:close', (e) => {
    const kind = Object.keys(wins).find((k) => wins[k]?.webContents === e.sender);
    if (kind) hideOverlay(kind);
  });
  handle('data:get', (_e, kind) => {
    if (!['quests', 'labyrinth', 'secrets'].includes(kind)) throw new Error('Unknown data');
    return readJson(path.join(DATA_DIR, `${kind}.json`), null);
  });

  // Квесты: отметки «выполнено» хранятся здесь — по ним же глушатся уведомления
  handle('quests:done', () => settings.questsDone);
  handle('quests:mark', (_e, id, done) => {
    const set = new Set(settings.questsDone);
    if (done) set.add(String(id)); else set.delete(String(id));
    settings.questsDone = [...set];
    saveSettings();
    return settings.questsDone;
  });
  handle('quests:clear', () => { settings.questsDone = []; saveSettings(); return []; });

  // Испытания Лабиринта
  handle('lab:done', () => settings.labDone);
  handle('lab:mark', (_e, id, done) => {
    const set = new Set(settings.labDone);
    if (done) set.add(String(id)); else set.delete(String(id));
    settings.labDone = [...set];
    saveSettings();
    return settings.labDone;
  });
  handle('lab:clear', () => { settings.labDone = []; saveSettings(); return []; });

  // Камни: отметка «куплен» в окне билда
  handle('gems:mark', (_e, key, bought) => {
    const b = activeBuild();
    if (!b) return buildState();
    b.gemShop = b.gemShop || {};
    const k = String(key);
    b.gemShop[k] = { seen: bought ? Math.max(b.gemShop[k]?.seen || 0, gemShop.AUTO_BOUGHT_AFTER) : 0, bought: !!bought };
    saveBuilds();
    return buildState();
  });

  // Строки поиска у торговца
  handle('search:list', () => searchList());
  handle('search:select', (_e, id) => {
    if (searchList().items.some((x) => x.id === id)) settings.searches.selected = id;
    saveSettings();
    return searchList();
  });
  handle('search:copy', (_e, id) => {
    if (!copySearch(id)) throw new Error('Unknown search');
    settings.searches.selected = id;
    saveSettings();
    return searchList();
  });
  handle('search:save', (_e, item) => {
    const clean = searches.validate(item);
    const list = settings.searches.custom;
    const i = list.findIndex((x) => x.id === item?.id);
    if (i >= 0) list[i] = { ...list[i], ...clean };
    else { const id = `my:${crypto.randomUUID()}`; list.push({ id, ...clean }); settings.searches.selected = id; }
    saveSettings();
    return searchList();
  });
  handle('search:delete', (_e, id) => {
    settings.searches.custom = settings.searches.custom.filter((x) => x.id !== id);
    if (settings.searches.selected === id) settings.searches.selected = 'auto:all';
    saveSettings();
    return searchList();
  });

  // Discord
  handle('discord:set', (_e, patch) => {
    if (typeof patch?.enabled === 'boolean') settings.discord.enabled = patch.enabled;
    saveSettings();
    startPresence();
    return libraryView();
  });

  // Положение уведомления
  handle('toast:move', () => openPositioner());
  handle('toast:place', () => savePosition());
  handle('toast:cancel', () => posWin?.close());
  handle('toast:reset', () => {
    settings.toastPos = null;
    saveSettings();
    posWin?.close();
  });

  // Уведомление подстраивает высоту под число карточек
  handle('toast:size', (_e, h) => { if (toastWin && !toastWin.isDestroyed()) placeToast(Number(h) + 4); });

  // Настройки уведомлений
  handle('notify:set', (_e, kind, on) => {
    if (kind in settings.notify) settings.notify[kind] = !!on;
    saveSettings();
    return libraryView();
  });
  handle('notify:test', () => {
    showToast([
      { kind: 'gem', label: 'Gems to buy — Nessa, Act 1', title: 'Frostblink, Arcane Surge Support', text: 'Sold after “Mercy Mission”.' },
      { kind: 'quest', label: '+1 passive point — Act 2', title: 'The Way Forward', text: 'Kill Captain Arteri, take the Thaumetic Emblem, open the blockade. Reward from Bestel (Act 1 town).' },
      { kind: 'lab', label: 'Labyrinth trial — Act 2', title: 'Trial of Swirling Fear', text: 'The trial is in this area. Spinning blades.' },
      { kind: 'secret', label: 'Secret room — Act 6', title: 'Tukohama tribe island', text: 'A small island in the centre of the area, connected by a red totem bridge.' },
      { kind: 'lab', near: true, label: 'Next area — Labyrinth trial · Act 3', title: '→ The Crematorium', text: 'Trial of Burning Rage' },
    ]);
  });
  handle('log:choose', async () => {
    const r = await dialog.showOpenDialog(mainWin, {
      title: 'Where is Client.txt?',
      defaultPath: 'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs',
      filters: [{ name: 'Client.txt', extensions: ['txt'] }],
      properties: ['openFile'],
    });
    if (!r.canceled && r.filePaths[0]) {
      settings.logPath = r.filePaths[0];
      saveSettings();
      startLogWatch();
    }
    return libraryView();
  });

  // Обновление
  handle('update:install', () => restartToUpdate());
  handle('update:check', () => updater?.check());
  handle('update:open', () => { if (updater?.state.url) shell.openExternal(updater.state.url); });

  // Проверка цены: окно цены и главное окно
  priceCheck.registerIpc(handle);
  handle('pc:league', (_e, id) => { priceCheck.setLeague(id); return libraryView(); });
  handle('pc:saleMode', (_e, mode) => { priceCheck.setSaleMode(mode); return libraryView(); });
  handle('pc:reloadLeagues', async () => { await priceCheck.loadLeagues(); return libraryView(); });
  handle('pc:checkClipboard', async () => { await priceCheck.checkClipboard(); return libraryView(); });
  handle('pc:reopen', () => priceCheck.reopen());

  // Первый запуск пройден
  handle('app:welcomed', () => { settings.welcomed = true; saveSettings(); return libraryView(); });

  // Главное окно
  handle('lib:get', () => libraryView());
  handle('lib:add', async (_e, input, name) => {
    const { build, source } = await importBuild(input, `exile-compass/${app.getVersion()}`);
    const id = crypto.randomUUID();
    const auto = [build.ascendClassName || build.className, build.level ? `lvl ${build.level}` : ''].filter(Boolean).join(', ');
    builds.unshift({
      id,
      name: String(name || '').trim().slice(0, 60) || auto || 'Build',
      addedAt: Date.now(),
      source: source === 'code' || source === 'xml' ? 'Path of Building code' : source,
      build,
      stage: 0,
      overrides: {},
    });
    settings.activeBuild = id;
    saveBuilds();
    saveSettings();
    refreshCharacter();
    pushBuildState();
    return libraryView();
  });
  handle('lib:rename', (_e, id, name) => {
    const b = builds.find((x) => x.id === id);
    if (b && String(name).trim()) b.name = String(name).trim().slice(0, 60);
    saveBuilds();
    pushBuildState();
    return libraryView();
  });
  handle('lib:delete', (_e, id) => {
    builds = builds.filter((b) => b.id !== id);
    if (settings.activeBuild === id) settings.activeBuild = builds[0]?.id || null;
    saveBuilds();
    saveSettings();
    pushBuildState();
    return libraryView();
  });
  handle('lib:activate', (_e, id) => {
    if (builds.some((b) => b.id === id)) settings.activeBuild = id;
    saveSettings();
    refreshCharacter();
    pushBuildState();
    return libraryView();
  });

  // На время выбора клавиши снимаем перехват, чтобы нажатие дошло до окна
  handle('capture:start', () => { globalShortcut.unregisterAll(); });
  handle('capture:end', () => { registerHotkeys(); return libraryView(); });
  handle('hotkey:set', (_e, kind, accel) => {
    if (!OVERLAYS[kind] && !ACTIONS[kind]) throw new Error('Unknown window');
    const clash = Object.entries(settings.hotkeys).find(([k, a]) => k !== kind && a && a === accel);
    if (clash) throw new Error(`${accel} is already used for “${keyTitle(clash[0])}”`);
    settings.hotkeys[kind] = accel;
    saveSettings();
    registerHotkeys();
    return libraryView();
  });
  handle('win:opacity', (_e, kind, v) => {
    const op = Math.min(1, Math.max(0.4, Number(v) || 1));
    settings.windows[kind].opacity = op;
    wins[kind]?.setOpacity(op);
    saveSettings();
    return libraryView();
  });
  handle('win:reset', (_e, kind) => {
    delete settings.windows[kind].bounds;
    wins[kind]?.setBounds(defaultBounds(kind));
    saveSettings();
    return libraryView();
  });
  handle('win:open', (_e, kind) => { showOverlay(kind); });
}

// ---------------------------------------------------------------- главное окно и трей

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1120,
    height: 800,
    minWidth: 760,
    minHeight: 560,
    title: 'Exile Compass',
    icon: path.join(__dirname, 'assets', 'icon256.png'),
    backgroundColor: '#1a1714',
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, spellcheck: false },
  });
  const w = mainWin;
  onRendererGone(w, 'main', () => { if (mainWin === w) mainWin = null; });
  w.on('closed', () => { if (mainWin === w) mainWin = null; });
  mainWin.setMenuBarVisibility(false);
  mainWin.loadFile(path.join(__dirname, 'renderer', 'main.html'));
  mainWin.once('ready-to-show', () => { if (!process.argv.includes('--hidden')) mainWin?.show(); });
  mainWin.on('close', (e) => {
    if (quitting) return;
    e.preventDefault();
    hideMain();
    if (!settings.trayHintShown && tray) {
      tray.displayBalloon?.({
        title: 'Exile Compass is still running',
        content: 'Your hotkeys keep working. To quit, right-click the tray icon → Quit.',
      });
      settings.trayHintShown = true;
      saveSettings();
    }
  });
}

// Спрятанное главное окно через пару минут закрывается совсем — меньше памяти, пока играешь.
// Открывается снова по клавише или из трея.
let mainRelease = null;
function hideMain() {
  if (!mainWin || mainWin.isDestroyed()) return;
  mainWin.hide();
  clearTimeout(mainRelease);
  mainRelease = setTimeout(() => {
    if (quitting || !mainWin || mainWin.isDestroyed() || mainWin.isVisible()) return;
    const w = mainWin;
    mainWin = null;
    try { w.destroy?.(); } catch { /* уже закрыто */ }
  }, 2 * 60 * 1000);
  mainRelease.unref?.();
}

function showMain() {
  clearTimeout(mainRelease);
  if (!mainWin || mainWin.isDestroyed()) createMainWindow();
  mainWin.show();
  mainWin.focus();
}

function toggleMain() {
  if (mainWin && !mainWin.isDestroyed() && mainWin.isVisible() && mainWin.isFocused?.() !== false) hideMain();
  else showMain();
}

function rebuildTrayMenu() {
  if (!tray) return;
  const ready = updater?.state.status === 'ready';
  tray.setContextMenu(Menu.buildFromTemplate([
    ...(ready ? [{ label: `Restart to update to ${updater.state.latest}`, click: restartToUpdate }, { type: 'separator' }] : []),
    { label: 'Open Exile Compass', click: showMain },
    { type: 'separator' },
    { label: 'Build', click: () => showOverlay('build') },
    { label: 'Quests', click: () => showOverlay('quests') },
    { label: 'Secret rooms', click: () => showOverlay('secrets') },
    { label: 'Vendor search', click: () => showOverlay('search') },
    { label: `Price check: ${settings.hotkeys.price || 'no key'}`, enabled: false },
    { type: 'separator' },
    { label: 'Quit', click: () => { quitting = true; app.quit(); } },
  ]));
  if (ready) {
    tray.displayBalloon?.({ title: 'Update ready', content: `Exile Compass ${updater.state.latest} will be installed when you restart the app.` });
  }
}

function createTray() {
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'assets', 'icon32.png')));
  tray.setToolTip('Exile Compass');
  rebuildTrayMenu();
  tray.on('click', showMain);
}

app.on('second-instance', showMain);

app.whenReady().then(() => {
  app.setAppUserModelId?.('com.exilecompass.app'); // значок и уведомления Windows — от имени программы
  load();
  registerIpc();
  createTray();
  createMainWindow();
  // Окно дерева и уведомления создаём заранее — по клавише они открываются мгновенно.
  // Остальные окна (квесты, секретные комнаты, поиск) — при первом открытии: меньше памяти.
  createOverlay('build');
  createToast();
  priceCheck.init();
  registerHotkeys();
  startLogWatch();
  gameKeys.start(); // заранее, чтобы первое нажатие не ждало запуска
  startPresence();
  startUpdater();
});

app.on('window-all-closed', (e) => e.preventDefault?.());

app.on('before-quit', () => {
  quitting = true;
  priceCheck.quitting = true;
  watcher?.stop();
  updater?.stop();
  presence?.stop();
  gameKeys.stop();
  globalShortcut.unregisterAll();
});
