// Проверка цены по клавише (Ctrl+D), как в Awakened PoE Trade: копирование предмета из игры,
// разбор, поиск на сайте торговли, окно цены поверх игры.
'use strict';

const { BrowserWindow, screen, clipboard, shell, net, app } = require('electron');
const fs = require('fs');
const path = require('path');

const core = require('../lib/core');
const rules = require('./rules');
const { TradeClient, RateLimitError, convert, tradeSiteUrl, CURRENCY_SHORT } = require('./trade');
const { withTimeout } = require('./store');

// То, что продаётся через обменник у NPC (Currency Exchange), а не на сайте: валюта,
// гадальные карты и прочие складываемые предметы без своей категории (фрагменты, скарабеи…)
const EXCHANGE_CATEGORIES = new Set(['Currency', 'Divination Card']);
const isExchangeItem = (item) => EXCHANGE_CATEGORIES.has(item.category) || (!item.category && !item.rarity);
const ITEM_TEXT = /^(Item Class|Rarity):/m;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class PriceCheck {
  /**
   * @param o {
   *   settings: () => settings.price ({ league, saleMode }),
   *   save: () => void,
   *   gameKeys: GameKeys,
   *   preload, rendererDir, dataDir,
   *   onVisible: (visible) => void — окно открылось/закрылось (для Esc),
   *   onChange: () => void — сменились лиги, лига или последняя проверка (для главного окна),
   * }
   */
  constructor(o) {
    this.o = o;
    this.win = null;
    this.current = null; // { item, preset, body, result, error, checkId, searching, wait }
    this.checks = 0;
    this.checking = false;
    this.quitting = false;
    this.leagues = [];
    this.leaguesError = '';
    this.last = null; // последняя удачная проверка для главного окна: { name, rarity, base, total, listings }
    // Как Awakened PoE Trade: сетевой модуль Electron с обычным User-Agent и cookies сессии
    this.client = new TradeClient({
      fetch: withTimeout((url, init) => (globalThis.__priceCheckFetch || net.fetch)(url, { ...init, credentials: 'include' }), 15000),
      get userAgent() { return app.userAgentFallback; },
    });
    o.gameKeys.on('outside', () => { if (this.visible()) this.hide(); });
  }

  get s() { return this.o.settings(); }

  init() {
    this.createWindow();
    this.loadLeagues();
    // Справочник предметов (~4 МБ) читаем чуть позже — не задерживаем запуск программы.
    // Если нажали клавишу раньше — загрузится сразу при проверке.
    const t = setTimeout(() => this.ensureCore(), 3000);
    t.unref?.();
  }

  ensureCore() {
    if (this.coreReady) return;
    core.init(
      fs.readFileSync(path.join(this.o.dataDir, 'en', 'items.ndjson'), 'utf8'),
      fs.readFileSync(path.join(this.o.dataDir, 'en', 'stats.ndjson'), 'utf8'),
    );
    this.coreReady = true;
  }

  // ------------------------------------------------------------ лиги

  async loadLeagues() {
    this.leaguesLoading = true;
    try {
      this.leagues = await this.client.leagues();
      this.leaguesError = '';
      if (!this.s.league || !this.leagues.some((l) => l.id === this.s.league)) {
        // По умолчанию — текущая лига испытаний (не Standard, не Hardcore, не SSF, не Ruthless)
        const challenge = this.leagues.find((l) => !/standard|hardcore|ssf|ruthless/i.test(l.id));
        this.s.league = (challenge || this.leagues[0])?.id || this.s.league || 'Standard';
        this.o.save();
      }
      this.leaguesRetry = 0;
    } catch {
      this.leaguesError = 'Could not load leagues from pathofexile.com';
      if (!this.s.league) this.s.league = 'Standard';
      // Нет интернета или сайт на обслуживании — попробуем ещё раз: через 1, 2, 4… минут (не чаще раза в 15 минут)
      clearTimeout(this.leaguesTimer);
      const delay = Math.min(15, 2 ** (this.leaguesRetry || 0)) * 60_000;
      this.leaguesRetry = (this.leaguesRetry || 0) + 1;
      this.leaguesTimer = setTimeout(() => this.loadLeagues(), delay);
      this.leaguesTimer.unref?.();
    }
    this.leaguesLoading = false;
    this.o.onChange();
  }

  setLeague(id) {
    if (this.leagues.length && !this.leagues.some((l) => l.id === id)) throw new Error('Unknown league');
    this.s.league = String(id);
    this.o.save();
    this.o.onChange();
  }

  setSaleMode(mode) {
    this.s.saleMode = mode === 'available' ? 'available' : 'securable';
    this.o.save();
    this.o.onChange();
  }

  // Для главного окна: лига, продавцы, последняя проверка
  summary() {
    return {
      league: this.s.league,
      leagues: this.leagues,
      leaguesError: this.leaguesError,
      saleMode: this.s.saleMode,
      last: this.last,
    };
  }

  // ------------------------------------------------------------ проверка

  readClipboardChange(before, timeoutMs = 700) {
    return new Promise((resolve) => {
      const start = Date.now();
      const tick = () => {
        const text = clipboard.readText();
        if (text && text !== before && ITEM_TEXT.test(text)) return resolve(text);
        if (Date.now() - start > timeoutMs) return resolve(null);
        setTimeout(tick, 25);
      };
      tick();
    });
  }

  // Клавиша: проверяем только то, что игра скопирует сейчас. Старый предмет из буфера не берём.
  // Если окно цены открыто — закрываем его (фокус возвращается игре) и проверяем предмет под курсором.
  async check() {
    if (this.checking) return;
    this.checking = true;
    try {
      if (this.visible()) {
        this.hide();
        await sleep(120);
      }
      const before = clipboard.readText();
      clipboard.writeText(''); // чтобы тот же предмет можно было проверить ещё раз
      const r = await this.o.gameKeys.copyItem();
      if (r !== 'OK') {
        clipboard.writeText(before);
        if (r === 'NOTGAME') return; // нажали не в игре — ничего не делаем
        this.show({ error: r === 'BLOCKED'
          ? 'Windows did not let Exile Compass send keys to the game (PowerShell is blocked, often by an antivirus). Allow Exile Compass in your antivirus and restart it.'
          : 'Could not copy the item from the game. If the game runs as administrator, run Exile Compass as administrator too.' });
        return;
      }
      const text = await this.readClipboardChange('');
      clipboard.writeText(before); // вернуть то, что было в буфере
      if (!text) { this.show({ error: 'No item under the cursor. Hover an item in the game and press the key again.' }); return; }
      await this.checkText(text);
    } finally {
      this.checking = false;
    }
  }

  // Предмет из буфера обмена (кнопка в главном окне)
  checkClipboard() {
    const text = clipboard.readText();
    if (!ITEM_TEXT.test(text)) throw new Error('Copy an item in the game first: hover it and press Ctrl+Alt+C');
    return this.checkText(text);
  }

  async checkText(text) {
    this.ensureCore();
    if (!this.leagues.length && !this.leaguesLoading) this.loadLeagues();
    let parsed;
    try {
      parsed = core.parseClipboard(text);
    } catch (e) {
      this.o.logError?.('parse item', e);
      this.show({ error: 'Could not read this item. Only the English game client is supported.' });
      return this.view();
    }
    if (!parsed.isOk()) {
      this.show({ error: parsed.error === 'item.unknown' ? 'This item is not known to the price checker.' : 'Could not read this item. Only the English game client is supported.' });
      return this.view();
    }
    const item = parsed.value;
    if (isExchangeItem(item)) {
      this.show({ error: `${item.info.name} is traded at the Currency Exchange, not on the trade site.`, title: item.info.name });
      return this.view();
    }
    let preset;
    try {
      preset = rules.presetFor(core, item, {
        league: this.s.league,
        merchantOnly: this.s.saleMode !== 'available',
        collapseListings: 'api',
        activateStockFilter: false,
        searchStatRange: 10,
        useEn: true,
        currency: undefined,
      });
      rules.applyDefaults(item, preset);
    } catch (e) {
      this.o.logError?.('filters', e);
      this.show({ error: 'The price checker cannot search for this item.' });
      return this.view();
    }
    this.current = { item, preset, body: null, result: null, error: '', checkId: ++this.checks };
    this.show({});
    return this.search({});
  }

  // Имя и база из текста предмета: строки сразу после «Rarity: …» до первого «--------»
  static itemTitle(item) {
    const lines = String(item.rawText || '').split(/\r?\n/);
    const i = lines.findIndex((l) => l.startsWith('Rarity: '));
    const head = [];
    for (let k = i + 1; i >= 0 && k < lines.length && !lines[k].startsWith('--------'); k++) if (lines[k].trim()) head.push(lines[k].trim());
    if (head.length >= 2) return { name: head[0], base: head[1] };
    return { name: head[0] || item.info.name, base: item.info.refName !== (head[0] || item.info.name) ? item.info.refName : '' };
  }

  static header(item) {
    const t = PriceCheck.itemTitle(item);
    return {
      name: t.name,
      base: t.base,
      rarity: item.rarity || 'Gem',
      category: item.category,
      itemLevel: item.itemLevel ?? null,
      weapon: rules.weaponInfo(item),
      highlights: rules.highlights(item),
      unknown: (item.unknownModifiers || []).map((m) => m.text),
    };
  }

  view() {
    const base = {
      league: this.s.league,
      leagues: this.leagues,
      saleMode: this.s.saleMode,
      waitMs: this.client.waitMs(),
    };
    const c = this.current;
    if (!c?.preset) return base;
    return {
      ...base,
      item: PriceCheck.header(c.item),
      chips: rules.chipsFor(c.item, c.preset),
      result: c.result,
      error: c.error,
      searching: !!c.searching,
      checkId: c.checkId,
    };
  }

  async search(edits) {
    const c = this.current;
    if (!c?.preset) return this.view();
    rules.applyEdits(c.preset, edits);
    c.preset.filters.trade.league = this.s.league;
    let body;
    try {
      body = rules.finalizeRequest(core.createTradeRequest(c.preset.filters, c.preset.stats), c.preset, this.s.saleMode);
    } catch (e) {
      this.o.logError?.('trade request', e);
      c.error = 'Could not build the search for this item.';
      this.push();
      return this.view();
    }
    c.body = body;
    c.error = '';
    c.wait = 0;
    c.searching = true;
    this.push();
    try {
      const [res, rates] = await Promise.all([this.client.price(this.s.league, body), this.client.currencyRates(this.s.league)]);
      c.result = {
        total: res.total,
        listings: res.listings.map((l) => ({
          ...l,
          short: CURRENCY_SHORT[l.currency] || l.currency,
          converted: convert(l.amount, l.currency, rates),
        })),
      };
      const h = PriceCheck.header(c.item);
      this.last = { name: h.name, base: h.base, rarity: h.rarity, total: c.result.total, listings: c.result.listings.slice(0, 3) };
      this.o.onChange();
    } catch (e) {
      c.result = null;
      c.error = e instanceof RateLimitError ? '' : (e.message || 'Search failed');
      c.wait = e instanceof RateLimitError ? e.waitMs : 0;
    } finally {
      c.searching = false;
    }
    this.push();
    return this.view();
  }

  async changeLeague(id) {
    this.setLeague(id);
    return this.current?.preset ? this.search({}) : this.view();
  }

  openTradeSite() {
    if (this.current?.body) shell.openExternal(tradeSiteUrl(this.s.league, this.current.body));
  }

  // Открыть последнюю проверку снова (кнопка в главном окне)
  reopen() {
    if (this.current?.preset) this.show({});
  }

  // ------------------------------------------------------------ окно

  // Экран, на котором мышь (там и игра)
  displayBounds() {
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds;
  }

  // Прозрачный слой на весь экран: светлая дымка поверх игры и панель посередине.
  createWindow() {
    const win = new BrowserWindow({
      ...this.displayBounds(),
      show: false,
      frame: false,
      transparent: true,
      resizable: false,
      movable: false,
      hasShadow: false,
      skipTaskbar: true,
      backgroundColor: '#00000000',
      webPreferences: { preload: this.o.preload, contextIsolation: true, sandbox: true, spellcheck: false },
    });
    this.win = win;
    win.setAlwaysOnTop(true, 'screen-saver');
    win.loadFile(path.join(this.o.rendererDir, 'price.html'));
    win.on('close', (e) => { if (!this.quitting) { e.preventDefault(); this.hide(); } });
    // Переключились в другое окно — закрываемся
    win.on('blur', () => { if (this.visible()) this.hide(); });
    // Окно упало — создадим заново при следующей проверке
    win.webContents.on?.('render-process-gone', (_e, d) => {
      this.o.logError?.('price window gone', d?.reason || 'unknown');
      try { if (!win.isDestroyed()) win.destroy(); } catch { /* уже нет */ }
      if (this.win === win) this.win = null;
      this.o.onVisible(false);
    });
  }

  visible() {
    return !!this.win && !this.win.isDestroyed() && this.win.isVisible();
  }

  show(extra) {
    if (extra.error) this.current = { error: extra.error, title: extra.title || '' };
    if (!this.win || this.win.isDestroyed()) this.createWindow();
    this.win.setBounds(this.displayBounds());
    this.push(extra.error ? { item: extra.title ? { name: extra.title } : null } : {});
    // Мимо панели окно «прозрачно» для мыши: клик проходит в игру. Над панелью — обычное окно
    // (окно цены само сообщает, когда мышь над панелью).
    this.win.setIgnoreMouseEvents(true, { forward: true });
    // Не забираем фокус у игры: окно получит его, только когда по нему кликнут
    if (!this.visible()) this.win.showInactive();
    this.o.onVisible(true);
  }

  hide() {
    if (!this.win || this.win.isDestroyed()) return;
    const hadFocus = this.win.isVisible() && this.win.isFocused();
    this.win.hide();
    this.o.gameKeys.unwatch();
    this.o.onVisible(false);
    // Кликали в окно (Esc, крестик) — вернуть фокус игре, чтобы клавиша сразу работала
    if (hadFocus) this.o.gameKeys.focusGame();
  }

  push(extra = {}) {
    if (!this.win || this.win.isDestroyed()) return;
    const v = this.current?.preset ? this.view() : { ...this.view(), error: this.current?.error || '', item: null, chips: [] };
    this.win.webContents.send('price', { ...v, ...extra, wait: this.current?.wait || 0 });
  }

  // Где панель (CSS-пиксели окна) — следим за кликами мимо неё
  watchPanel(r) {
    if (!this.visible() || !r) return;
    const b = this.win.getBounds();
    const dip = { x: b.x + r.x, y: b.y + r.y, width: r.width, height: r.height };
    const px = screen.dipToScreenRect ? screen.dipToScreenRect(this.win, dip) : dip;
    this.o.gameKeys.watch(px);
  }

  // Мышь над панелью — окно принимает клики, иначе они проходят в игру
  hover(over) {
    this.win?.setIgnoreMouseEvents(!over, { forward: true });
  }

  // IPC окна цены
  registerIpc(handle) {
    handle('price:get', () => this.view());
    handle('price:search', (_e, edits) => this.search(edits || {}));
    handle('price:league', (_e, id) => this.changeLeague(id));
    handle('price:open', () => this.openTradeSite());
    handle('price:close', () => this.hide());
    handle('price:panel', (_e, r) => this.watchPanel(r));
    handle('price:hover', (_e, over) => this.hover(!!over));
  }
}

module.exports = { PriceCheck, isExchangeItem };
