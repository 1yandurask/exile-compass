'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const call = async (ch, ...args) => {
  const r = await ipcRenderer.invoke(ch, ...args);
  if (!r.ok) throw new Error(r.error);
  return r.result;
};

contextBridge.exposeInMainWorld('guide', {
  // окно билда
  getState: () => call('state:get'),
  setStage: (i) => call('stage:set', i),
  setOverride: (kind, idx) => call('override:set', kind, idx),
  onState: (cb) => ipcRenderer.on('state', (_e, s) => cb(s)),
  // любое окно-оверлей
  close: () => call('overlay:close'),
  getData: (kind) => call('data:get', kind),
  // квесты
  questsDone: () => call('quests:done'),
  markQuest: (id, done) => call('quests:mark', id, done),
  clearQuests: () => call('quests:clear'),
  labDone: () => call('lab:done'),
  markLab: (id, done) => call('lab:mark', id, done),
  clearLab: () => call('lab:clear'),
  onLabDone: (cb) => ipcRenderer.on('lab-done', (_e, d) => cb(d)),
  // камни: «куплен»
  markGem: (key, bought) => call('gems:mark', key, bought),
  setDiscord: (patch) => call('discord:set', patch),
  // строки поиска у торговца
  searchList: () => call('search:list'),
  selectSearch: (id) => call('search:select', id),
  copySearch: (id) => call('search:copy', id),
  saveSearch: (item) => call('search:save', item),
  deleteSearch: (id) => call('search:delete', id),
  onSearches: (cb) => ipcRenderer.on('searches', (_e, s) => cb(s)),
  // положение уведомления
  moveToast: () => call('toast:move'),
  placeToast: () => call('toast:place'),
  cancelToastMove: () => call('toast:cancel'),
  resetToast: () => call('toast:reset'),
  // уведомление
  onToast: (cb) => ipcRenderer.on('toast', (_e, p) => cb(p)),
  onToastHide: (cb) => ipcRenderer.on('toast-hide', () => cb()),
  toastSize: (h) => call('toast:size', h),
  // главное окно
  library: () => call('lib:get'),
  addBuild: (input, name) => call('lib:add', input, name),
  renameBuild: (id, name) => call('lib:rename', id, name),
  deleteBuild: (id) => call('lib:delete', id),
  activateBuild: (id) => call('lib:activate', id),
  captureStart: () => call('capture:start'),
  captureEnd: () => call('capture:end'),
  setHotkey: (kind, accel) => call('hotkey:set', kind, accel),
  setOpacity: (kind, v) => call('win:opacity', kind, v),
  resetWindow: (kind) => call('win:reset', kind),
  openWindow: (kind) => call('win:open', kind),
  setNotify: (kind, on) => call('notify:set', kind, on),
  testNotify: () => call('notify:test'),
  chooseLog: () => call('log:choose'),
  installUpdate: () => call('update:install'),
  checkUpdate: () => call('update:check'),
  openUpdate: () => call('update:open'),
  onLibrary: (cb) => ipcRenderer.on('library', (_e, s) => cb(s)),
  welcomed: () => call('app:welcomed'),
  // проверка цены — настройки в главном окне
  setPriceLeague: (id) => call('pc:league', id),
  setSaleMode: (m) => call('pc:saleMode', m),
  reloadLeagues: () => call('pc:reloadLeagues'),
  checkClipboard: () => call('pc:checkClipboard'),
  reopenPrice: () => call('pc:reopen'),
});

// Окно цены
contextBridge.exposeInMainWorld('pc', {
  getPrice: () => call('price:get'),
  search: (edits) => call('price:search', edits),
  setLeague: (id) => call('price:league', id),
  openTrade: () => call('price:open'),
  close: () => call('price:close'),
  panel: (rect) => call('price:panel', rect),
  hover: (over) => call('price:hover', over),
  onPrice: (cb) => ipcRenderer.on('price', (_e, v) => cb(v)),
});
