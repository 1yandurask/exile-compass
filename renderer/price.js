'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const api = window.pc;
  let state = null;
  let edits = {}; // id плашки → { enabled, min, max } — правки до нажатия Search
  let waitUntil = 0;
  let timer = null;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Плашка с учётом правок
  const chipState = (c) => ({ enabled: c.enabled, min: c.min, max: c.max, ...(edits[c.id] || {}) });
  const edit = (c, patch) => { edits[c.id] = { ...chipState(c), ...patch }; };

  function numberField(c, key, label) {
    const wrap = el('label', 'field');
    wrap.append(label);
    const input = el('input');
    input.type = 'number';
    input.step = 'any';
    const v = chipState(c)[key];
    input.value = v === '' || v == null ? '' : v;
    input.placeholder = key === 'max' ? '—' : '';
    input.setAttribute('aria-label', `${c.label} ${label}`);
    input.oninput = () => edit(c, { [key]: input.value === '' ? '' : Number(input.value), enabled: true });
    input.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };
    input.onfocus = () => { edit(c, { enabled: true }); paintToggle(c); };
    wrap.append(input);
    return wrap;
  }

  const SHOWN = 5; // строк свойств до «ящика»
  let checkId = null; // новый предмет — ящик снова свёрнут
  let order = []; // порядок строк для этого предмета: включённые сверху
  let drawerOpen = false;
  const subOpen = new Set(); // открытые шторки под суммой (id строки) — для нового предмета пусто

  const rows = new Map(); // id → элемент, чтобы перекрашивать без полной перерисовки

  function paintToggle(c) {
    const node = rows.get(c.id);
    if (!node) return;
    const on = chipState(c).enabled;
    node.classList.toggle('on', on);
    node.classList.toggle('off', !on);
    const t = node.querySelector('.toggle');
    if (t) { t.textContent = on ? '✓' : ''; t.setAttribute('aria-pressed', String(on)); }
  }

  function toggleBtn(c) {
    const b = el('button', 'toggle');
    b.type = 'button';
    b.title = 'Use in search';
    b.onclick = () => { edit(c, { enabled: !chipState(c).enabled }); paintToggle(c); };
    return b;
  }

  function renderItemChip(c) {
    const chip = el('span', 'chip');
    rows.set(c.id, chip);
    const label = el('button', 'chip-label', c.label);
    label.type = 'button';
    const inf = /^(\w+) influence$/.exec(c.label);
    if (inf) label.classList.add(`b-${inf[1]}`);
    if (c.id === 'corrupted' && /^Corrupted/.test(c.label)) label.classList.add('b-Corrupted');
    if (c.sockets) {
      // Цвета гнёзд кружками, связанные — через чёрточку
      label.textContent = '';
      label.title = c.label;
      label.setAttribute('aria-label', c.label);
      label.classList.add('sockets');
      c.sockets.forEach((g, gi) => {
        if (gi) label.append(el('span', 'sock-gap'));
        g.forEach((s, si) => {
          if (si) label.append(el('span', 'sock-link'));
          label.append(el('span', `sock s-${s}`));
        });
      });
    }
    label.onclick = () => { edit(c, { enabled: !chipState(c).enabled }); paintToggle(c); };
    chip.append(label);
    if (c.fields) {
      chip.append(numberField(c, 'min', 'min'));
      if (c.maxField) chip.append(numberField(c, 'max', 'max'));
    }
    paintToggle(c);
    return chip;
  }

  // Сумма сопротивлений + маленькая кнопка со шторкой отдельных сопротивлений (закрыта, пока не нажмут)
  const shown = (c) => ({ value: c.value, range: c.range, absent: c.absent });

  function renderGroup(c, children) {
    const box = el('div', 'stat-group');
    box.append(renderRow(c));
    const sub = el('div', 'sub-drawer');
    sub.hidden = !subOpen.has(c.id);
    sub.append(...children.map(renderRow));
    const btn = el('button', 'sub-btn');
    btn.type = 'button';
    const label = () => {
      const open = subOpen.has(c.id);
      const on = children.filter((k) => chipState(k).enabled).length;
      btn.textContent = open ? 'Hide single resistances ▴' : `Pick a single resistance${on ? ` (${on} in search)` : ''} ▾`;
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.onclick = () => {
      if (subOpen.has(c.id)) subOpen.delete(c.id); else subOpen.add(c.id);
      sub.hidden = !subOpen.has(c.id);
      label();
    };
    label();
    box.append(btn, sub);
    return box;
  }

  const ELEMENT_CLASS = (label) => (/Fire/.test(label) ? 'e-Fire' : /Cold/.test(label) ? 'e-Cold' : /Lightning/.test(label) ? 'e-Lightning' : '');

  function renderRow(c) {
    const row = el('div', 'stat');
    if (c.parent) row.classList.add('sub', ...[ELEMENT_CLASS(c.label)].filter(Boolean));
    rows.set(c.id, row);
    const v = shown(c);
    // Сопротивления, которого на предмете нет, — без числа: галочка и Min/Max по желанию
    const text = el('span', 'stat-text', !v.absent && v.value != null ? c.label.replace('#', String(v.value)) : c.label);
    if (v.absent) { row.classList.add('absent'); text.append(el('span', 'not-on', 'not on item')); }
    for (const b of c.badges || []) text.append(el('span', `badge b-${b}`, b));
    text.onclick = () => { edit(c, { enabled: !chipState(c).enabled }); paintToggle(c); };
    row.append(toggleBtn(c), text);
    row.append(el('span', 'stat-range', v.range && !v.absent ? `${v.range[0]}–${v.range[1]}` : ''));
    if (c.fields) {
      row.append(numberField(c, 'min', 'Min'), numberField(c, 'max', 'Max'));
    } else {
      row.append(el('span'), el('span'));
    }
    paintToggle(c);
    return row;
  }

  // Свойства: строго 5 на виду, остальные — в ящике (каждый новый предмет — свёрнут)
  function renderStats(stats, id) {
    if (id !== checkId) {
      checkId = id;
      drawerOpen = false;
      subOpen.clear();
      order = [...stats.filter((c) => c.enabled), ...stats.filter((c) => !c.enabled)].map((c) => c.id);
    }
    // Отдельные сопротивления живут в шторке под суммой и в счёт пяти строк не входят
    const kids = new Map();
    for (const c of stats) if (c.parent && stats.some((p) => p.id === c.parent)) kids.set(c.parent, [...(kids.get(c.parent) || []), c]);
    stats = stats.filter((c) => !(c.parent && kids.has(c.parent)));
    const renderStat = (c) => (kids.has(c.id) ? renderGroup(c, kids.get(c.id)) : renderRow(c));
    const byId = new Map(stats.map((c) => [c.id, c]));
    const list = [...order.filter((i) => byId.has(i)), ...stats.map((c) => c.id).filter((i) => !order.includes(i))].map((i) => byId.get(i));
    const shown = list.slice(0, SHOWN).map(renderStat);
    const rest = list.slice(SHOWN);
    if (!rest.length) { $('stats').replaceChildren(...shown); return; }
    const drawer = el('div', 'drawer');
    drawer.hidden = !drawerOpen;
    drawer.append(...rest.map(renderStat));
    const btn = el('button', 'drawer-btn');
    btn.type = 'button';
    const label = () => {
      const on = rest.filter((c) => chipState(c).enabled).length;
      btn.textContent = drawerOpen
        ? 'Hide ▴'
        : `Show ${rest.length} more mod${rest.length === 1 ? '' : 's'}${on ? ` (${on} in search)` : ''} ▾`;
      btn.setAttribute('aria-expanded', String(drawerOpen));
    };
    btn.onclick = () => { drawerOpen = !drawerOpen; drawer.hidden = !drawerOpen; label(); };
    label();
    $('stats').replaceChildren(...shown, drawer, btn);
  }

  // DPS оружия рядом с названием: физический и стихийный (по стихиям — своим цветом)
  const fmt = (v) => (v >= 100 ? String(Math.round(v)) : String(v));
  function renderWeapon(w) {
    const box = $('dps');
    box.hidden = !w || (!w.phys && !w.ele);
    if (box.hidden) { box.replaceChildren(); return; }
    const out = [];
    if (w.phys) {
      const p = el('span', 'dps-item dps-phys');
      p.append(el('span', 'dps-k', 'Phys DPS'), el('b', null, fmt(w.phys)));
      out.push(p);
    }
    if (w.ele) {
      const e = el('span', 'dps-item dps-ele');
      e.append(el('span', 'dps-k', 'Ele DPS'));
      if (w.parts.length === 1) e.append(el('b', `e-${w.parts[0].element}`, fmt(w.ele)));
      else {
        e.append(el('b', 'dps-ele-total', fmt(w.ele)));
        if (w.parts.length) {
          const parts = el('span', 'dps-parts');
          w.parts.forEach((p, i) => {
            if (i) parts.append(el('span', 'dps-plus', '+'));
            const b = el('b', `e-${p.element}`, fmt(p.dps));
            b.title = `${p.element} DPS`;
            parts.append(b);
          });
          e.append(parts);
        }
      }
      out.push(e);
    }
    if (w.phys && w.ele) {
      const t = el('span', 'dps-item dps-total');
      t.append(el('span', 'dps-k', 'Total'), el('b', null, fmt(Math.round((w.phys + w.ele) * 10) / 10)));
      out.push(t);
    }
    box.replaceChildren(...out);
  }

  function renderListings(result) {
    const box = $('results');
    const body = $('listings');
    body.replaceChildren();
    if (state.searching) {
      box.hidden = false;
      $('resultsHead').replaceChildren(el('span', 'searching', 'Searching…'));
      return;
    }
    if (!result) { box.hidden = true; return; }
    box.hidden = false;
    $('resultsHead').textContent = result.total
      ? `${result.total} listed · showing the ${result.listings.length} cheapest`
      : 'Nothing listed with these filters.';
    const gems = result.listings.some((l) => l.gem);
    $('gemCol').hidden = !gems;
    let prev = '';
    for (const l of result.listings) {
      const tr = el('tr');
      const price = el('td', 'price');
      price.append(el('span', 'amount', l.amount != null ? String(l.amount) : '—'), el('span', `cur c-${l.currency}`, l.short || ''));
      if (l.converted) price.append(el('span', 'conv', `≈ ${l.converted.amount} ${l.converted.currency}`));
      const age = el('td', `age${/just now|minute/.test(l.age) ? ' fresh' : ''}`, l.age || '');
      if (/just now|minute/.test(l.age)) age.title = 'Listed minutes ago — check it is not a price-fixing listing';
      const seller = el('td', 'seller', l.account || l.character || '');
      if (l.account && l.account === prev) seller.append(el('span', 'same', '(same seller)'));
      if (l.instant) seller.append(el('span', 'instant', 'instant'));
      prev = l.account;
      tr.append(price);
      if (gems) {
        const g = el('td', 'gem');
        if (l.gem) {
          g.append(el('span', 'gem-lv', `Lv ${l.gem.level ?? '?'}`), el('span', 'gem-q', `${l.gem.quality}%`));
          g.append(l.gem.corrupted ? el('span', 'gem-c b-Corrupted', 'Corrupted') : el('span', 'gem-nc', 'not corrupted'));
        }
        tr.append(g);
      }
      tr.append(age, seller);
      body.append(tr);
    }
  }

  function renderWait(ms) {
    waitUntil = ms > 0 ? Date.now() + ms : 0;
    clearInterval(timer);
    const tick = () => {
      const left = Math.ceil((waitUntil - Date.now()) / 1000);
      const busy = left > 0;
      $('wait').hidden = !busy;
      $('wait').textContent = busy ? `The trade site asks to wait ${left} s` : '';
      $('search').disabled = busy || !!state?.searching;
      if (!busy) clearInterval(timer);
    };
    tick();
    if (waitUntil) timer = setInterval(tick, 250);
  }

  function renderLeagues(s) {
    const sel = $('league');
    const list = s.leagues?.length ? s.leagues : [{ id: s.league, text: s.league }];
    if (sel.dataset.sig !== JSON.stringify(list) + s.league) {
      sel.replaceChildren(...list.map((l) => { const o = el('option', null, l.text); o.value = l.id; return o; }));
      sel.dataset.sig = JSON.stringify(list) + s.league;
    }
    sel.value = s.league;
  }

  function render(s, keepEdits) {
    state = s;
    if (!keepEdits) edits = {};
    rows.clear();
    renderLeagues(s);
    const it = s.item;
    $('item').hidden = !it;
    if (it) {
      $('itemName').className = `item-name r-${it.rarity}`;
      $('itemName').textContent = it.name;
      $('itemMeta').textContent = [it.base, it.category, it.itemLevel ? `item level ${it.itemLevel}` : ''].filter(Boolean).join(' · ');
      renderWeapon(it.weapon);
      $('highlights').hidden = !it.highlights?.length;
      $('highlights').replaceChildren(...(it.highlights || []).map((h) => el('span', 'hl', h)));
      $('unknown').hidden = !it.unknown?.length;
      $('unknown').textContent = it.unknown?.length ? `Not searchable: ${it.unknown.join('; ')}` : '';
    }
    $('error').hidden = !s.error;
    $('error').textContent = s.error || '';
    const chips = s.chips || [];
    $('filters').hidden = !chips.length;
    $('actions').hidden = !chips.length && !it;
    $('itemChips').replaceChildren(...chips.filter((c) => c.kind === 'item').map(renderItemChip));
    renderStats(chips.filter((c) => c.kind === 'stat'), s.checkId);
    renderListings(s.result);
    renderWait(s.wait || s.waitMs || 0);
  }

  async function doSearch() {
    if ($('search').disabled) return;
    const sent = edits;
    $('search').disabled = true;
    try {
      render(await api.search(sent));
    } catch (e) {
      $('error').hidden = false;
      $('error').textContent = e.message;
      $('search').disabled = false;
    }
  }

  $('search').onclick = doSearch;
  $('openTrade').onclick = () => api.openTrade();
  $('close').onclick = () => api.close();
  $('league').onchange = async (e) => render(await api.setLeague(e.target.value));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') api.close(); });
  // Клик мимо панели — по светлой дымке — закрывает окно (если клик всё-таки попал в окно)
  $('backdrop').addEventListener('mousedown', (e) => { if (e.target === e.currentTarget) api.close(); });

  // Мимо панели окно пропускает мышь в игру. Сообщаем, когда мышь над панелью,
  // и где панель — чтобы клик мимо неё закрывал окно.
  let over = null;
  document.addEventListener('mousemove', (e) => {
    const now = $('panel').contains(e.target);
    if (now !== over) { over = now; api.hover(now); }
  });
  document.addEventListener('mouseleave', () => { if (over) { over = false; api.hover(false); } });
  function sendPanel() {
    const r = $('panel').getBoundingClientRect();
    api.panel({ x: r.left, y: r.top, width: r.width, height: r.height });
  }
  new ResizeObserver(sendPanel).observe($('panel'));
  window.addEventListener('resize', sendPanel);

  api.onPrice((s) => { render(s, s.searching); over = null; sendPanel(); });
  api.getPrice().then((s) => render(s));
})();
