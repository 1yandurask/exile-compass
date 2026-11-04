'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { TradeClient, Limiter, RateLimitError, relativeTime, parseNinjaRates, convert, tradeSiteUrl } = require('../src/trade');

function res(status, body, headers = {}) {
  const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return { status, ok: status < 400, headers: { get: (k) => h[k.toLowerCase()] ?? null }, json: async () => body, text: async () => JSON.stringify(body) };
}

test('лимит: 1 запрос в 5 с по умолчанию, дальше — по заголовкам сайта', () => {
  let t = 0;
  const l = new Limiter([{ max: 1, windowS: 5 }], () => t);
  assert.equal(l.waitMs(), 0);
  l.take();
  assert.equal(l.waitMs(), 5000);
  t = 5001;
  assert.equal(l.waitMs(), 0);
  l.adjust({ get: (k) => ({ 'x-rate-limit-rules': 'Ip', 'x-rate-limit-ip': '3:10:60,8:60:120', 'x-rate-limit-ip-state': '3:10:0,3:60:0' })[k] });
  assert.ok(l.waitMs() > 0, 'сервер насчитал 3 из 3 — ждём');
  t += 12_001;
  assert.equal(l.waitMs(), 0);
  l.adjust({ get: (k) => ({ 'x-rate-limit-rules': 'Ip', 'x-rate-limit-ip': '3:10:60', 'x-rate-limit-ip-state': '1:10:30' })[k] });
  assert.ok(l.waitMs() >= 29_000, 'штраф от сайта');
});

test('поиск и 10 самых дешёвых лотов', async () => {
  const calls = [];
  const ids = Array.from({ length: 30 }, (_, i) => `id${i}`);
  const fetch = async (url, init) => {
    calls.push([init?.method || 'GET', url, init?.body ? JSON.parse(init.body) : null, init?.headers]);
    if (url.includes('/search/')) return res(200, { id: 'Q1', total: 30, result: ids });
    return res(200, { result: ids.slice(0, 10).map((id, i) => ({ id, listing: { price: { amount: i + 1, currency: i < 5 ? 'chaos' : 'divine' }, indexed: new Date(Date.now() - 3600_000 * (i + 1)).toISOString(), account: { name: i === 1 ? 'A0' : `A${i}`, online: { league: 'Mirage' } }, fee: i === 0 ? 5 : undefined }, item: { ilvl: 84 } })) });
  };
  const c = new TradeClient({ fetch, userAgent: 'UA' });
  const r = await c.price('Mirage League', { query: {} });
  assert.equal(calls[0][0], 'POST');
  assert.equal(calls[0][1], 'https://www.pathofexile.com/api/trade/search/Mirage%20League');
  assert.equal(calls[0][3]['User-Agent'], 'UA');
  assert.match(calls[1][1], /\/api\/trade\/fetch\/id0,id1,.*,id9\?query=Q1$/);
  assert.equal(r.total, 30);
  assert.equal(r.listings.length, 10);
  assert.deepEqual([r.listings[0].amount, r.listings[0].currency, r.listings[0].instant], [1, 'chaos', true]);
  assert.equal(r.listings[1].age, '2 hours ago');
  assert.equal(r.listings[0].gem, null, 'не камень — без уровня');
  const again = await c.price('Mirage', { query: {} });
  assert.equal(again.total, 30, 'второй поиск сразу — без своей паузы');
  assert.equal(c.waitMs(), 0);
});

test('429 от сайта — ждать столько, сколько сказано', async () => {
  const c = new TradeClient({ fetch: async () => res(429, {}, { 'Retry-After': '42' }), userAgent: 'UA' });
  await assert.rejects(() => c.price('Mirage', {}), (e) => e instanceof RateLimitError && e.waitMs === 42_000);
  assert.ok(c.waitMs() > 40_000);
});

test('ошибка сайта показывается текстом', async () => {
  const c = new TradeClient({ fetch: async () => res(400, { error: { code: 2, message: 'Invalid query' } }), userAgent: 'UA' });
  await assert.rejects(() => c.price('Mirage', {}), /Invalid query/);
});

test('лиги ПК', async () => {
  const c = new TradeClient({ fetch: async () => res(200, { result: [{ id: 'Mirage', realm: 'pc', text: 'Mirage' }, { id: 'Standard', realm: 'pc', text: 'Standard' }, { id: 'X', realm: 'xbox', text: 'X' }] }), userAgent: 'UA' });
  assert.deepEqual((await c.leagues()).map((l) => l.id), ['Mirage', 'Standard']);
});

test('курсы poe.ninja и пересчёт рядом с ценой', () => {
  const rates = parseNinjaRates(JSON.stringify({ overviews: [{ type: 'Currency', lines: [{ name: 'Divine Orb', chaos: 200 }, { name: 'Exalted Orb', chaos: 15 }] }, { type: 'UniqueArmour', lines: [{ name: 'Divine Orb', chaos: 999 }] }] }));
  assert.equal(rates['Divine Orb'], 200, 'берём из раздела валюты');
  assert.deepEqual(convert(2, 'divine', rates), { amount: 400, currency: 'c' });
  assert.deepEqual(convert(100, 'chaos', rates), { amount: 0.5, currency: 'div' });
  assert.equal(convert(10, 'chaos', rates), null, 'мелкие суммы в хаосах не пересчитываем');
  assert.deepEqual(convert(20, 'exalted', rates), { amount: 1.5, currency: 'div' });
  assert.equal(convert(1, 'unknown', rates), null);
  assert.deepEqual(parseNinjaRates('not json'), { 'Chaos Orb': 1 });
});

test('время лота и ссылка на сайт', () => {
  const now = Date.parse('2026-11-04T12:00:00Z');
  assert.equal(relativeTime('2026-11-04T11:59:40Z', now), 'just now');
  assert.equal(relativeTime('2026-11-04T11:55:00Z', now), '5 minutes ago');
  assert.equal(relativeTime('2026-11-03T12:00:00Z', now), '1 day ago');
  assert.match(tradeSiteUrl('Mirage', { query: { type: 'Vaal Regalia' } }), /^https:\/\/www\.pathofexile\.com\/trade\/search\/Mirage\?q=%7B/);
});

test('камень у лота: уровень, качество, осквернение', () => {
  const { gemInfo } = require('../src/trade');
  assert.deepEqual(gemInfo({ frameType: 4, corrupted: true, properties: [{ name: 'Vaal, Spell', values: [] }, { name: 'Level', values: [['21 (Max)', 0]] }, { name: 'Quality', values: [['+23%', 1]] }] }), { level: 21, quality: 23, corrupted: true });
  assert.deepEqual(gemInfo({ frameType: 4, properties: [{ name: 'Level', values: [['1', 0]] }] }), { level: 1, quality: 0, corrupted: false });
  assert.equal(gemInfo({ frameType: 2, properties: [{ name: 'Quality', values: [['+20%', 1]] }] }), null);
});
