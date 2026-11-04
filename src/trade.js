// Сайт торговли pathofexile.com (без входа в аккаунт) и курсы валют poe.ninja.
// Лимиты: сами себя не ограничиваем — проверять можно сколько угодно. Ждём, только когда
// сайт сам сказал «подождите»: ответ 429 (Retry-After) или штраф в заголовках x-rate-limit-*-state.
'use strict';

const TRADE = 'https://www.pathofexile.com';
const NINJA = 'https://poe.ninja';
const DESYNC_S = 2; // запас к окну лимита, как в Awakened PoE Trade
const LISTINGS = 10; // сайт отдаёт не больше 10 лотов за один запрос

class RateLimitError extends Error {
  constructor(waitMs) {
    super(`Rate limited — wait ${Math.ceil(waitMs / 1000)} s`);
    this.waitMs = waitMs;
  }
}

class TradeError extends Error {}

// Окно лимита: не больше max запросов за windowS секунд
class Limiter {
  /** @param preemptive  true — не пускать запрос заранее, если окно лимита заполнено;
   *                     false — ждать только по прямому запрету сайта */
  constructor(rules, now, preemptive = true) {
    this.preemptive = preemptive;
    this.rules = rules; // [{ max, windowS }]
    this.log = []; // отметки времени запросов
    this.blockedUntil = 0;
    this.now = now;
  }

  waitMs() {
    const t = this.now();
    let wait = Math.max(0, this.blockedUntil - t);
    if (!this.preemptive) return wait;
    for (const r of this.rules) {
      const from = t - r.windowS * 1000;
      const inWindow = this.log.filter((x) => x > from);
      if (inWindow.length >= r.max) wait = Math.max(wait, inWindow[inWindow.length - r.max] + r.windowS * 1000 - t);
    }
    return wait;
  }

  take() {
    this.log.push(this.now());
    const keep = Math.max(...this.rules.map((r) => r.windowS), 0) * 1000;
    const from = this.now() - keep;
    this.log = this.log.filter((x) => x > from);
  }

  // x-rate-limit-rules: «Ip» → x-rate-limit-ip: «8:10:60,15:60:120», x-rate-limit-ip-state: «1:10:0,…»
  adjust(headers) {
    const get = (k) => (typeof headers.get === 'function' ? headers.get(k) : headers[k]);
    const names = get('x-rate-limit-rules');
    if (!names) return;
    const rules = [];
    for (const name of String(names).toLowerCase().split(',')) {
      const limits = String(get(`x-rate-limit-${name}`) || '').split(',').filter(Boolean);
      const states = String(get(`x-rate-limit-${name}-state`) || '').split(',').filter(Boolean);
      limits.forEach((l, i) => {
        const [max, windowS] = l.split(':').map(Number);
        const [count, , penaltyS] = (states[i] || '0:0:0').split(':').map(Number);
        if (!(max > 0 && windowS > 0)) return;
        rules.push({ max, windowS: windowS + DESYNC_S });
        // Сервер насчитал больше, чем мы, — догоняем (например, после перезапуска программы)
        const from = this.now() - windowS * 1000;
        const ours = this.log.filter((x) => x > from).length;
        for (let k = ours; k < count; k++) this.log.push(this.now());
        if (penaltyS > 0) this.blockedUntil = Math.max(this.blockedUntil, this.now() + penaltyS * 1000);
      });
    }
    if (rules.length) this.rules = rules;
  }

  block(seconds) {
    this.blockedUntil = Math.max(this.blockedUntil, this.now() + seconds * 1000);
  }
}

// Валюты сайта торговли → названия на poe.ninja
const CURRENCY_NAMES = {
  chaos: 'Chaos Orb', divine: 'Divine Orb', exalted: 'Exalted Orb', mirror: 'Mirror of Kalandra',
  alch: 'Orb of Alchemy', alt: 'Orb of Alteration', fusing: 'Orb of Fusing', chrome: 'Chromatic Orb',
  jewellers: "Jeweller's Orb", vaal: 'Vaal Orb', regal: 'Regal Orb', chance: 'Orb of Chance',
  gcp: "Gemcutter's Prism", annul: 'Orb of Annulment', scour: 'Orb of Scouring', regret: 'Orb of Regret',
  blessed: 'Blessed Orb', transmute: 'Orb of Transmutation', aug: 'Orb of Augmentation',
  wisdom: 'Scroll of Wisdom', portal: 'Portal Scroll', bauble: "Glassblower's Bauble", whetstone: "Blacksmith's Whetstone",
  scrap: "Armourer's Scrap",
};
const CURRENCY_SHORT = { chaos: 'c', divine: 'div', exalted: 'ex', mirror: 'mirror' };

// Камень: уровень, качество, осквернён ли. Не камень — null.
// В ответе сайта: frameType 4, properties [{ name: 'Level', values: [['20 (Max)', 0]] }, { name: 'Quality', values: [['+20%', 1]] }]
function gemInfo(item) {
  if (!item) return null;
  const prop = (name) => (item.properties || []).find((p) => p.name === name)?.values?.[0]?.[0];
  const level = prop('Level');
  if (item.frameType !== 4 && level == null) return null;
  const n = (v) => { const m = /-?\d+/.exec(String(v ?? '')); return m ? Number(m[0]) : null; };
  return { level: n(level), quality: n(prop('Quality')) ?? 0, corrupted: !!item.corrupted };
}

// «2 hours ago»
function relativeTime(iso, now = Date.now()) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  const s = Math.max(0, Math.round((now - t) / 1000));
  const units = [['year', 365 * 86400], ['month', 30 * 86400], ['week', 7 * 86400], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [u, sec] of units) {
    if (s >= sec) { const n = Math.floor(s / sec); return `${n} ${u}${n === 1 ? '' : 's'} ago`; }
  }
  return 'just now';
}

// Курсы из ответа poe.ninja: { 'Divine Orb': 180, … } — к хаосам. Формат разбирается терпимо.
function parseNinjaRates(text) {
  const rates = { 'Chaos Orb': 1 };
  let data;
  try { data = JSON.parse(text); } catch { data = null; }
  const visit = (o, inCurrency) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (const x of o) visit(x, inCurrency); return; }
    const isCurrency = inCurrency || o.type === 'Currency';
    if (isCurrency && typeof o.name === 'string' && typeof o.chaos === 'number') rates[o.name] = o.chaos;
    for (const v of Object.values(o)) visit(v, isCurrency);
  };
  if (data) visit(data, false);
  else {
    // Запасной путь: искать пары name/chaos прямо в тексте
    for (const m of String(text).matchAll(/"name":"([^"]+)"[^{}]*?"chaos":([\d.]+)/g)) rates[m[1]] ??= Number(m[2]);
  }
  return rates;
}

class TradeClient {
  /**
   * @param o { fetch(url, init) → Response-like, userAgent, now? }
   */
  constructor(o) {
    this.o = o;
    this.now = o.now || Date.now;
    // Только запреты сайта — свои паузы между проверками не делаем
    this.search = new Limiter([{ max: 1, windowS: 5 }], this.now, false);
    this.fetchL = new Limiter([{ max: 1, windowS: 5 }], this.now, false);
    this.rates = new Map(); // лига → { at, rates }
  }

  headers(extra = {}) {
    return { Accept: 'application/json', 'User-Agent': this.o.userAgent, ...extra };
  }

  // Сколько ждать до следующей проверки цены (поиск + загрузка лотов)
  waitMs() {
    return Math.max(this.search.waitMs(), this.fetchL.waitMs());
  }

  async request(limiter, url, init) {
    const wait = limiter.waitMs();
    if (wait > 0) throw new RateLimitError(wait);
    limiter.take();
    const res = await this.o.fetch(url, { ...init, headers: this.headers(init?.headers) });
    limiter.adjust(res.headers);
    if (res.status === 429) {
      const retry = Number((res.headers.get?.('retry-after')) || 60);
      limiter.block(retry);
      throw new RateLimitError(retry * 1000);
    }
    let data;
    try { data = await res.json(); } catch { throw new TradeError(`The trade site answered ${res.status}`); }
    if (!res.ok || data?.error) throw new TradeError(data?.error?.message || `The trade site answered ${res.status}`);
    return data;
  }

  // Лиги ПК: [{ id, text }]
  async leagues() {
    const res = await this.o.fetch(`${TRADE}/api/trade/data/leagues`, { headers: this.headers() });
    const data = await res.json();
    return (data.result || []).filter((l) => !l.realm || l.realm === 'pc').map((l) => ({ id: l.id, text: l.text || l.id }));
  }

  /**
   * Поиск и первые 10 лотов (от дешёвых к дорогим).
   * @returns { id, total, listings: [...] }
   */
  async price(league, body) {
    const wait = this.waitMs();
    if (wait > 0) throw new RateLimitError(wait);
    const found = await this.request(this.search, `${TRADE}/api/trade/search/${encodeURIComponent(league)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const ids = (found.result || []).slice(0, LISTINGS);
    if (!ids.length) return { id: found.id, total: found.total || 0, listings: [] };
    const fetched = await this.request(this.fetchL, `${TRADE}/api/trade/fetch/${ids.join(',')}?query=${found.id}`, { method: 'GET' });
    const listings = (fetched.result || []).filter(Boolean).map((r) => this.listing(r));
    return { id: found.id, total: found.total || 0, listings };
  }

  listing(r) {
    const l = r.listing || {};
    const p = l.price || {};
    return {
      id: r.id,
      amount: p.amount ?? null,
      currency: p.currency || null,
      indexed: l.indexed || null,
      age: relativeTime(l.indexed, this.now()),
      account: l.account?.name || '',
      character: l.account?.lastCharacterName || '',
      instant: l.fee != null, // мгновенный выкуп
      online: l.fee != null || !!l.account?.online,
      itemLevel: r.item?.ilvl ?? null,
      corrupted: !!r.item?.corrupted,
      gem: gemInfo(r.item),
    };
  }

  // Курсы валют лиги к хаосам (кэш 15 минут). При ошибке — пусто, пересчёт просто не покажется.
  async currencyRates(league) {
    const cached = this.rates.get(league);
    if (cached && this.now() - cached.at < 15 * 60_000) return cached.rates;
    try {
      const res = await this.o.fetch(`${NINJA}/poe1/api/economy/current/dense/overviews?league=${encodeURIComponent(league)}&language=en`, { headers: this.headers() });
      const rates = parseNinjaRates(await res.text());
      this.rates.set(league, { at: this.now(), rates });
      return rates;
    } catch {
      return {};
    }
  }
}

// Пересчёт цены лота: «≈ 12.5 c» или «≈ 0.4 div»
function convert(amount, currency, rates) {
  const name = CURRENCY_NAMES[currency];
  const per = name && rates[name];
  const div = rates['Divine Orb'];
  if (!per || amount == null) return null;
  const chaos = amount * per;
  if (currency === 'chaos') return div && chaos >= div * 0.2 ? { amount: round(chaos / div), currency: 'div' } : null;
  if (currency === 'divine') return { amount: round(chaos), currency: 'c' };
  return div && chaos >= div ? { amount: round(chaos / div), currency: 'div' } : { amount: round(chaos), currency: 'c' };
}

function round(v) {
  return v >= 100 ? Math.round(v) : v >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100;
}

function tradeSiteUrl(league, body) {
  return `${TRADE}/trade/search/${encodeURIComponent(league)}?q=${encodeURIComponent(JSON.stringify(body))}`;
}

module.exports = { gemInfo, TradeClient, Limiter, RateLimitError, TradeError, relativeTime, parseNinjaRates, convert, tradeSiteUrl, CURRENCY_NAMES, CURRENCY_SHORT, LISTINGS };
