// Сквозная проверка main.js без Electron: подменяем electron, добавляем билд,
// нажимаем хоткеи, проверяем Esc, этапы, прозрачность и сохранение настроек.
// Запуск: node test/e2e-harness.js
'use strict';

const Module = require('module');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert/strict');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'act-guide-'));
const logFile = path.join(tmp, 'Client.txt');
fs.writeFileSync(logFile, 'start\n');
fs.writeFileSync(path.join(tmp, 'settings.json'), JSON.stringify({ logPath: logFile }));
const DISPLAY = { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };
process.env.ACT_GUIDE_TEST = '1';
const handlers = {};
let trayDestroyed = false;
let clip = '';
// Поддельный powershell для бинда выхода: записывает, что было в буфере в момент нажатий
const chatClips = [];
const pasteClips = [];
let chatAnswer = 'OK';
let enters = 0;
globalThis.__actGuideSpawn = () => {
  const { EventEmitter } = require('events');
  const p = new EventEmitter();
  p.stdout = new EventEmitter();
  p.stdin = {
    write: (s) => {
      const cmd = s.trim();
      if (cmd === 'CHAT') chatClips.push(clip);
      if (cmd === 'ENTER') enters++;
      if (cmd === 'PASTE') pasteClips.push(clip);
      setTimeout(() => p.stdout.emit('data', `${chatAnswer}\n`), 5);
    },
    end() {},
  };
  p.kill = () => {};
  setTimeout(() => p.stdout.emit('data', 'READY\n'), 1);
  return p;
};
const shortcuts = new Map();
const created = [];
let readyResolve;

class FakeWindow {
  constructor(opts) {
    this.opts = opts;
    this.visible = false;
    this.bounds = { x: opts.x ?? 0, y: opts.y ?? 0, width: opts.width, height: opts.height };
    this.opacity = 1;
    this.events = {};
    this.sent = [];
    this.wcEvents = {};
    this.webContents = { send: (ch, v) => this.sent.push([ch, v]), on: (ev, fn) => { this.wcEvents[ev] = fn; } };
    created.push(this);
  }
  loadFile(f) { this.file = path.basename(f); }
  setAlwaysOnTop(v, level) { this.top = [v, level]; }
  setOpacity(v) { this.opacity = v; }
  setSkipTaskbar(v) { this.skip = v; }
  getOpacity() { return this.opacity; }
  setFocusable(v) { this.focusable = v; }
  getMinimumSize() { return this.min || [0, 0]; }
  setMinimumSize(w, h) { this.min = [w, h]; }
  setMenuBarVisibility() {}
  once() {} focus() {}
  on(ev, fn) { this.events[ev] = fn; }
  show() { this.visible = true; }
  showInactive() { this.visible = true; this.inactive = true; }
  setIgnoreMouseEvents(v) { this.clickThrough = v; }
  hide() { this.visible = false; }
  close() { this.closed = true; this.events.closed?.(); }
  isVisible() { return this.visible; }
  isFocused() { return !!this.focusedFlag; }
  isDestroyed() { return !!this.destroyed; }
  destroy() { this.destroyed = true; this.visible = false; }
  getBounds() { return this.bounds; }
  setBounds(b) { this.bounds = b; }
}

const electron = {
  app: {
    requestSingleInstanceLock: () => true,
    whenReady: () => new Promise((r) => { readyResolve = r; }),
    getPath: () => tmp,
    getVersion: () => '1.0.0',
    userAgentFallback: 'test',
    on() {},
    quit() {},
  },
  BrowserWindow: FakeWindow,
  globalShortcut: {
    register: (a, fn) => { if (a === 'F12') return false; shortcuts.set(a, fn); return true; },
    unregister: (a) => shortcuts.delete(a),
    unregisterAll: () => shortcuts.clear(),
    isRegistered: (a) => shortcuts.has(a),
  },
  ipcMain: { handle: (ch, fn) => { handlers[ch] = fn; } },
  screen: {
    getPrimaryDisplay: () => DISPLAY,
    getAllDisplays: () => [DISPLAY],
    getDisplayMatching: () => DISPLAY,
    getCursorScreenPoint: () => ({ x: 100, y: 100 }),
    getDisplayNearestPoint: () => DISPLAY,
  },
  net: { fetch: async () => ({ ok: false, status: 503, headers: { get: () => null }, json: async () => ({ result: [] }), text: async () => '{}' }) },
  shell: { openExternal() {} },
  Tray: class { setToolTip() {} setContextMenu() {} on() {} destroy() { trayDestroyed = true; } },
  Menu: { buildFromTemplate: () => ({}) },
  nativeImage: { createFromPath: () => ({}) },
  clipboard: { writeText: (t) => { clip = t; }, readText: () => clip },
};
const origLoad = Module._load;
Module._load = function (req, ...rest) {
  if (req === 'electron') return electron;
  return origLoad.call(this, req, ...rest);
};

const call = async (ch, sender, ...args) => {
  const r = await handlers[ch]({ sender }, ...args);
  if (!r.ok) throw new Error(r.error);
  return r.result;
};
const press = (accel) => shortcuts.get(accel)();
const win = (file) => created.find((w) => w.file === file);

(async () => {
  require('../main.js');
  readyResolve();
  await new Promise((r) => setTimeout(r, 50));

  // Окно дерева и уведомления созданы заранее и спрятаны, остальные — при первом открытии
  assert.ok(win('build.html') && win('toast.html'));
  assert.ok(!win('quests.html') && !win('secrets.html') && !win('search.html'), 'редкие окна не держим в памяти заранее');
  assert.ok(!win('build.html').visible);
  assert.deepEqual([...shortcuts.keys()].sort(), ['Ctrl+D', 'Ctrl+Space', 'F10', 'F6', 'F7', 'F8', 'F9']);
  assert.deepEqual(win('build.html').top, [true, 'screen-saver']);
  console.log('✓ окна поверх игры созданы, клавиши F6–F10 перехвачены');

  // Пустое состояние
  assert.equal((await call('state:get')).stage, null);

  // Добавляем билд кодом PoB
  const code = fs.readFileSync(path.join(__dirname, 'fixtures', 'witch.code'), 'utf8');
  const lib = await call('lib:add', null, code, '');
  assert.equal(lib.builds[0].name, 'Necromancer, lvl 70');
  assert.equal(lib.active, lib.builds[0].id);
  const st = await call('state:get');
  assert.equal(st.stage.title, 'Act 1');
  assert.deepEqual(st.stageTitles, ['Act 1', 'Act 2-3', 'Act 4-5', 'Act 6-10']);
  console.log('✓ билд добавлен по коду PoB, 4 этапа');

  // Хоткей открывает, повтор — закрывает; Esc перехватывается только пока окно открыто
  press('F6');
  assert.ok(win('build.html').visible);
  assert.ok(shortcuts.has('Escape'));
  press('F6');
  assert.ok(!win('build.html').visible);
  assert.ok(!shortcuts.has('Escape'));
  press('F6');
  press('F7');
  assert.ok(win('build.html').visible && win('quests.html').visible);
  press('Escape');
  assert.ok(!win('build.html').visible && !win('quests.html').visible);
  assert.ok(!shortcuts.has('Escape'));
  console.log('✓ клавиша открывает и закрывает окно, Esc закрывает все и отпускается после');

  // Кнопка «×» в окне
  press('F8');
  await call('overlay:close', win('secrets.html').webContents);
  assert.ok(!win('secrets.html').visible);

  // Этапы и ручной выбор набора камней
  const s2 = await call('stage:set', null, 2);
  assert.equal(s2.stage.title, 'Act 4-5');
  assert.ok(s2.stage.prevNodes.length > 0);
  const s3 = await call('override:set', null, 'skillSet', 2);
  assert.equal(s3.stage.skillSetTitle, 'Act 4-5');
  const s4 = await call('stage:set', null, 0);
  assert.equal(s4.stage.skillSetTitle, 'Act 4-5', 'смена этапа дерева не меняет набор камней');
  await call('stage:set', null, 2);
  console.log('✓ переключение этапов и ручной выбор набора камней');

  // Смена клавиши, конфликт и занятая клавиша
  await call('capture:start');
  assert.equal(shortcuts.size, 0, 'на время выбора клавиши перехват снят');
  await call('hotkey:set', null, 'quests', 'Ctrl+Q');
  assert.ok(shortcuts.has('Ctrl+Q') && !shortcuts.has('F7'));
  await assert.rejects(() => call('hotkey:set', null, 'secrets', 'F6'), /already used/);
  const busy = await call('hotkey:set', null, 'secrets', 'F12');
  assert.match(busy.hotkeyErrors.secrets, /taken/);
  await call('hotkey:set', null, 'secrets', 'F8');
  console.log('✓ смена клавиши, защита от повторов и занятых клавиш');

  // Прозрачность и позиция запоминаются
  await call('win:opacity', null, 'build', 0.7);
  assert.equal(win('build.html').opacity, 0.7);
  win('build.html').bounds = { x: 100, y: 80, width: 900, height: 600 };
  win('build.html').events.moved();
  await new Promise((r) => setTimeout(r, 500));
  const saved = JSON.parse(fs.readFileSync(path.join(tmp, 'settings.json'), 'utf8'));
  assert.equal(saved.windows.build.opacity, 0.7);
  assert.deepEqual(saved.windows.build.bounds, { x: 100, y: 80, width: 900, height: 600 });
  assert.equal(saved.hotkeys.quests, 'Ctrl+Q');
  const buildsFile = JSON.parse(fs.readFileSync(path.join(tmp, 'builds.json'), 'utf8'));
  assert.equal(buildsFile[0].stage, 2);
  console.log('✓ прозрачность, положение окна, клавиши и этап сохраняются');

  // Данные квестов и комнат доступны окнам
  const q = await call('data:get', null, 'quests');
  assert.equal(q.acts.length, 10);
  assert.equal((await call('data:get', null, 'labyrinth')).trials.length, 12);
  await assert.rejects(() => call('data:get', null, '../../etc/passwd'), /Unknown/);

  // Удаление билда
  const after = await call('lib:delete', null, lib.builds[0].id);
  assert.equal(after.builds.length, 0);
  assert.equal((await call('state:get')).stage, null);
  console.log('✓ данные квестов/Лабиринта, удаление билда');

  // Уведомления по Client.txt
  const toast = win('toast.html');
  assert.ok(toast && toast.clickThrough, 'окно уведомления пропускает клики в игру');
  const log = (l) => fs.appendFileSync(logFile, `2026/11/04 01:00:00 1 abc ${l}\r\n`);
  log('[DEBUG Client 7] Generating level 17 area "1_2_9" with seed 1');
  log('[INFO Client 7] : You have entered The Western Forest.');
  await new Promise((r) => setTimeout(r, 1600));
  const sent = toast.sent.filter(([ch]) => ch === 'toast');
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0][1].cards.map((c) => [c.kind, c.title]).sort(), [['quest', 'Deal with the Bandits — kill all three'], ['quest', 'The Way Forward']]);
  assert.ok(toast.visible && toast.inactive, 'показано без перехвата фокуса');

  await call('quests:mark', null, '2:The Way Forward', true);
  log('[DEBUG Client 7] Generating level 17 area "1_2_10" with seed 1');
  log('[INFO Client 7] : You have entered The Crypt Level 1.');
  log('[DEBUG Client 7] Generating level 17 area "1_2_9" with seed 2');
  log('[INFO Client 7] : You have entered The Western Forest.');
  await new Promise((r) => setTimeout(r, 1600));
  const later = toast.sent.filter(([ch]) => ch === 'toast').slice(1).map(([, p]) => p.cards.map((c) => `${c.kind}:${c.title}`));
  assert.deepEqual(later, [['lab:Trial of Swirling Fear'], ['quest:Deal with the Bandits — kill all three']], 'зелёная карточка Лабиринта; выполненный квест больше не всплывает');
  log('[DEBUG Client 7] Generating level 46 area "2_6_7" with seed 1');
  log('[INFO Client 7] : You have entered The Karui Fortress.');
  await new Promise((r) => setTimeout(r, 1200));
  const karui = toast.sent.filter(([ch]) => ch === 'toast').at(-1)[1].cards.map((c) => c.kind);
  assert.deepEqual(karui, ['quest', 'secret'], 'в The Karui Fortress — квест и секретная комната');
  await call('notify:set', null, 'lab', false);
  log('[INFO Client 7] : You have entered The Crypt Level 1.');
  await new Promise((r) => setTimeout(r, 1200));
  assert.equal(toast.sent.filter(([ch]) => ch === 'toast').length, 4, 'выключенные уведомления Лабиринта не показываются');
  const libv = await call('lib:get');
  assert.equal(libv.log.ok, true);
  assert.equal(libv.log.lastZone, 'The Crypt Level 1');
  assert.equal(libv.update.status, 'idle', 'из исходников обновление не проверяется');
  console.log('✓ уведомления: квесты, Лабиринт и секретные комнаты по зоне и уровню, выполненные и выключенные молчат');

  const toasts = () => toast.sent.filter(([ch]) => ch === 'toast').map(([, p]) => p.cards);
  // Соседняя зона: из The Climb видна The Lower Prison с испытанием
  await call('notify:set', null, 'lab', true);
  log('[DEBUG Client 7] Generating level 9 area "1_1_6" with seed 1');
  log('[INFO Client 7] : You have entered The Climb.');
  await new Promise((r) => setTimeout(r, 1200));
  const climb = toasts().at(-1);
  assert.deepEqual(climb.map((c) => [c.kind, !!c.near, c.title]), [['lab', true, '→ The Lower Prison']]);
  // Испытание отмечено — подсказка пропадает
  await call('lab:mark', null, '1:Piercing Truth', true);
  const before = toasts().length;
  log('[DEBUG Client 7] Generating level 9 area "1_1_6" with seed 2');
  log('[INFO Client 7] : You have entered The Climb.');
  await new Promise((r) => setTimeout(r, 1200));
  assert.equal(toasts().length, before, 'пройденное испытание не подсказывается');
  assert.deepEqual(await call('lab:done'), ['1:Piercing Truth']);
  console.log('✓ подсказка про соседнюю зону с испытанием; отмеченное испытание молчит');

  // Камни в городе: билд ведьмы, уровень из журнала, третье напоминание = «куплен»
  const lib2 = await call('lib:add', null, code, '');
  const st0 = await call('stage:set', null, 0);
  const firstGem = Object.entries(st0.shop)[0];
  assert.ok(firstGem, 'у первого этапа есть камни, которые продают');
  log('[INFO Client 7] : Hero (Witch) is now level 12');
  log('[INFO Client 7] : Other (Marauder) is now level 70');
  await new Promise((r) => setTimeout(r, 1000));
  assert.equal((await call('lib:get')).character.level, 12, 'чужой класс не сбивает уровень');
  for (let i = 0; i < 3; i++) {
    log(`[DEBUG Client 7] Generating level 13 area "1_1_town" with seed ${i}`);
    log("[INFO Client 7] : You have entered Lioneye's Watch.");
    await new Promise((r) => setTimeout(r, 1000));
    const gemCard = toasts().at(-1).find((c) => c.kind === 'gem');
    assert.ok(gemCard && /Nessa/.test(gemCard.label), `напоминание ${i + 1} о камнях у Нессы`);
  }
  const shown = toasts().length;
  log('[DEBUG Client 7] Generating level 13 area "1_1_town" with seed 9');
  log("[INFO Client 7] : You have entered Lioneye's Watch.");
  await new Promise((r) => setTimeout(r, 1000));
  assert.ok(toasts().length === shown || !toasts().at(-1).some((c) => c.kind === 'gem'), 'после трёх напоминаний молчит');
  const st1 = await call('state:get');
  assert.ok(Object.values(st1.shop).some((g) => g.bought), 'камни отмечены купленными');
  const undo = await call('gems:mark', null, firstGem[1].key, false);
  assert.equal(Object.values(undo.shop).find((g) => g.key === firstGem[1].key).bought, false);
  await call('lib:delete', null, lib2.builds[0].id);
  console.log('✓ камни в городе: по классу и уровню из журнала, после трёх напоминаний — «куплен»');

  // Положение уведомления: перетащили в низ экрана — окно растёт вверх
  await call('toast:move');
  const pos = win('position.html');
  pos.bounds = { x: 300, y: 860, width: 440, height: 150 };
  await call('toast:place');
  const saved2 = JSON.parse(fs.readFileSync(path.join(tmp, 'settings.json'), 'utf8')).toastPos;
  assert.equal(saved2.anchor, 'bottom');
  assert.ok(pos.closed);
  await call('notify:test');
  const tb = toast.bounds;
  assert.equal(tb.x, 300);
  assert.equal(tb.y + tb.height, 1010, 'низ уведомления там, где был низ карточки');
  await call('toast:reset');
  console.log('✓ уведомление перетаскивается; в нижней половине экрана растёт вверх');

  // Discord: включено сразу со встроенным Application ID, выключается галочкой
  let dc = (await call('lib:get')).discord;
  assert.equal(dc.status, 'waiting', 'включено сразу, ждёт игру и Discord');
  assert.equal(dc.clientId, undefined, 'ID в окно не передаётся');
  dc = (await call('discord:set', null, { enabled: false })).discord;
  assert.equal(dc.status, 'off');
  dc = (await call('discord:set', null, { enabled: true })).discord;
  assert.equal(dc.status, 'waiting');
  assert.equal(JSON.parse(fs.readFileSync(path.join(tmp, 'settings.json'), 'utf8')).discord.clientId, undefined, 'в настройки ID не пишется');
  console.log('✓ Discord: работает сразу, ID только в коде, показ выключается галочкой');

  // Строки поиска у торговца: окно по F9, копирование по клику и по F10 без окна
  const toastsNow = () => toast.sent.filter(([ch]) => ch === 'toast').map(([, p]) => p.cards);
  press('F9');
  assert.ok(win('search.html').visible);
  press('F9');
  let sl = await call('search:list');
  assert.equal(sl.selected, 'auto:all', 'по умолчанию — общая строка');
  assert.equal(sl.className, 'Marauder', 'класс того, кто последним получил уровень (Other/Marauder), а не билда');
  assert.equal(sl.items[0].text, '"-\\w-|movement sp|ted melee"');
  assert.deepEqual(sl.items.filter((x) => x.auto).map((x) => x.name).slice(1, 5), ['3-link', '4-link', '5-link', 'Movement speed']);
  sl = await call('search:copy', null, 'auto:3link');
  assert.equal(clip, '-\\w-');
  assert.equal(sl.selected, 'auto:3link', 'скопированная строка становится выбранной');
  assert.equal(toastsNow().at(-1)[0].kind, 'copy');
  sl = await call('search:save', null, { name: 'Rings', text: '"ring" "life"' });
  const mine = sl.items.find((x) => x.custom);
  assert.equal(sl.selected, mine.id, 'новая строка выбрана');
  press('F10');
  assert.equal(clip, '"ring" "life"', 'клавиша копирует выбранную без окна');
  await new Promise((r) => setTimeout(r, 60));
  assert.deepEqual(pasteClips, ['"ring" "life"'], 'и вставляет её в поиск торговца (Ctrl+F, Ctrl+A, Ctrl+V)');
  assert.equal(toastsNow().at(-1)[0].label, 'Pasted into the search box');
  assert.ok(!win('search.html').visible);
  await assert.rejects(() => call('search:save', null, { name: 'Long', text: 'x'.repeat(51) }), /up to 50/);
  sl = await call('search:save', null, { id: mine.id, name: 'Rings 2', text: 'ring' });
  assert.equal(sl.items.find((x) => x.id === mine.id).name, 'Rings 2');
  sl = await call('search:delete', null, mine.id);
  assert.ok(!sl.items.some((x) => x.custom));
  assert.equal(sl.selected, 'auto:all');
  // Зашли другим персонажем — строки подстраиваются под его класс (в журнале асценданси)
  log('[INFO Client 7] : Archer (Deadeye) is now level 25');
  await new Promise((r) => setTimeout(r, 900));
  sl = await call('search:list');
  assert.equal(sl.className, 'Ranger');
  assert.equal(sl.items[0].text, '"-\\w-|movement sp|ted bow"');
  press('F10');
  assert.equal(clip, '"-\\w-|movement sp|ted bow"', 'клавиша копирует общую строку уже под лучника');
  log('[INFO Client 7] : Hero (Witch) is now level 13');
  await new Promise((r) => setTimeout(r, 900));
  const savedS = JSON.parse(fs.readFileSync(path.join(tmp, 'settings.json'), 'utf8')).searches;
  assert.deepEqual(savedS.custom, []);
  console.log('✓ строки поиска: копирование кликом и клавишей, свои строки, предел 50 символов');

  // Relog: по умолчанию клавиши нет; назначили — /exit в чат, строка поиска в буфере;
  // второе нажатие на экране выбора — Enter (одно нажатие — одно действие)
  assert.equal((await call('lib:get')).hotkeys.relog, '');
  await call('hotkey:set', null, 'relog', 'F11');
  press('F6');
  assert.ok(win('build.html').visible);
  press('F11');
  await new Promise((r) => setTimeout(r, 450));
  assert.deepEqual(chatClips, ['/exit'], 'в момент нажатий в буфере команда');
  assert.equal(enters, 0, 'Enter сам по себе не нажимается');
  assert.ok(!win('build.html').visible, 'окна убраны, чтобы фокус был у игры');
  const selText = (await call('search:list')).items.find((x) => x.id === 'auto:all').text;
  assert.equal(clip, selText, 'после выхода в буфере выбранная строка поиска');
  assert.equal(toastsNow().at(-1)[0].label, 'Relog · search copied');
  assert.equal(toastsNow().at(-1)[0].title, 'Press F11 again to enter the game');
  press('F11');
  await new Promise((r) => setTimeout(r, 100));
  assert.equal(enters, 1, 'второе нажатие на экране выбора — Enter');
  assert.deepEqual(chatClips, ['/exit'], 'второй раз /exit не отправляется');
  press('F11');
  await new Promise((r) => setTimeout(r, 450));
  assert.deepEqual(chatClips, ['/exit', '/exit'], 'после входа — снова выход');
  log('[DEBUG Client 7] Generating level 17 area "1_2_9" with seed 70');
  log('[INFO Client 7] : You have entered The Western Forest.');
  await new Promise((r) => setTimeout(r, 900));
  press('F11');
  await new Promise((r) => setTimeout(r, 450));
  assert.equal(enters, 1, 'вошли в зону — нажатие снова выходит, а не жмёт Enter');
  assert.deepEqual(chatClips, ['/exit', '/exit', '/exit']);
  log('[DEBUG Client 7] Generating level 17 area "1_2_9" with seed 71');
  log('[INFO Client 7] : You have entered The Western Forest.');
  await new Promise((r) => setTimeout(r, 900));
  chatAnswer = 'NOTGAME';
  clip = '';
  press('F11');
  await new Promise((r) => setTimeout(r, 300));
  assert.equal(clip, selText, 'не вышли, но строку всё равно скопировали');
  assert.match(toastsNow().at(-1)[0].text, /game window was not in front/);
  press('F11');
  await new Promise((r) => setTimeout(r, 100));
  assert.equal(enters, 1, 'не вышли — следующее нажатие не жмёт Enter');
  chatAnswer = 'OK';
  console.log('✓ relog: /exit, затем второе нажатие — Enter на экране выбора; после входа в зону — снова выход');

  // Штраф опыта: персонаж 30 уровня (последнее повышение — Marauder 70 выше; задаём явно)
  log('[INFO Client 7] : Hero (Witch) is now level 30');
  await new Promise((r) => setTimeout(r, 900));
  log('[DEBUG Client 7] Generating level 17 area "1_2_9" with seed 77');
  log('[INFO Client 7] : You have entered The Western Forest.');
  await new Promise((r) => setTimeout(r, 1000));
  const xpc = toastsNow().at(-1).find((c) => c.kind === 'xp');
  assert.ok(xpc, 'карточка штрафа');
  assert.match(xpc.title, /13 levels above this area/);
  const nTo = toastsNow().length;
  log('[DEBUG Client 7] Generating level 23 area "1_2_town" with seed 78');
  log('[INFO Client 7] : You have entered The Forest Encampment.');
  await new Promise((r) => setTimeout(r, 1000));
  assert.ok(toastsNow().length === nTo || !toastsNow().at(-1).some((c) => c.kind === 'xp'), 'в городе штраф не показываем');
  await call('notify:set', null, 'xp', false);
  log('[DEBUG Client 7] Generating level 17 area "1_2_9" with seed 79');
  log('[INFO Client 7] : You have entered The Western Forest.');
  await new Promise((r) => setTimeout(r, 1000));
  assert.ok(!toastsNow().at(-1).some((c) => c.kind === 'xp'), 'выключено — не показываем');
  console.log('✓ штраф опыта при входе в зону; в городе и при выключенном — молчит');

  // Окно упало (видеодрайвер, память): убирается, по клавише создаётся заново, Esc отпускается
  await call('win:open', null, 'quests');
  const crashed = created.filter((w) => w.file === 'quests.html').at(-1);
  assert.ok(crashed.visible && shortcuts.has('Escape'));
  crashed.wcEvents['render-process-gone']({}, { reason: 'crashed' });
  assert.ok(crashed.destroyed);
  assert.ok(!shortcuts.has('Escape'), 'Esc отпущен — упавшее окно не считается открытым');
  await call('win:open', null, 'quests');
  const fresh = created.filter((w) => w.file === 'quests.html').at(-1);
  assert.ok(fresh !== crashed && fresh.visible, 'новое окно вместо упавшего');
  shortcuts.get('Escape')?.();
  assert.ok(fs.readFileSync(path.join(tmp, 'error.log'), 'utf8').includes('window quests gone: crashed'), 'причина записана в error.log');
  console.log('✓ упавшее окно создаётся заново, причина — в error.log');


  // Перезапуск с обновлением: сначала всё отпускаем, затем установщик в обычном режиме
  const installs = [];
  assert.equal((await call('lib:get')).update.status, 'idle');
  await call('update:install');
  assert.equal(installs.length, 0, 'обновление не скачано — ничего не делаем');
  // подменяем скачанное обновление
  {
    globalThis.__updater.auto = { quitAndInstall: (...a) => installs.push(a) };
    globalThis.__updater.set({ status: 'ready', latest: '9.9.9' });
    await call('update:install');
    await new Promise((r) => setImmediate(r));
    assert.deepEqual(installs, [[false, true]]);
    assert.ok(trayDestroyed, 'трей убран до установки');
    assert.equal(shortcuts.size, 0, 'клавиши отпущены до установки');
    console.log('✓ «Restart and update»: трей и клавиши отпущены, установщик запускается в обычном режиме');
  }

  console.log('\nСквозная проверка пройдена');
  process.exit(0);
})().catch((e) => {
  console.error('✗', e.stack || e.message);
  process.exit(1);
});
