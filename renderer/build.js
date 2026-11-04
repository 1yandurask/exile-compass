'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const api = window.guide;
  const T = window.TREE_DATA;

  let view = null; // данные этапа от основного процесса
  let main = null;
  let ascView = null;
  let ascName = null;
  let shownBuild = null; // для какого билда камера уже подогнана
  let shop = {}; // имя камня → { key, bought } — камни, которые этот класс может купить

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // В текстах дерева встречается разметка [Ключ|Текст]
  const clean = (s) => String(s).replace(/\[([^\]|]+)\|([^\]]+)\]/g, '$2').replace(/\[([^\]]+)\]/g, '$1');

  // ------------------------------------------------------------ подсказка

  function showTip(info, x, y) {
    const tip = $('tip');
    if (!info) { tip.hidden = true; return; }
    tip.replaceChildren();
    tip.append(el('div', 'tip-name', info.name || info.kind));
    tip.append(el('div', 'tip-kind', info.kind));
    if (info.fresh) tip.append(el('div', 'tip-state fresh', 'New this stage'));
    else if (info.taken) tip.append(el('div', 'tip-state', 'Taken'));
    if (info.stats.length) {
      const ul = el('ul');
      for (const s of info.stats) for (const line of clean(s).split('\n')) ul.append(el('li', null, line));
      tip.append(ul);
    } else if (info.kind === 'Mastery') {
      tip.append(el('div', 'tip-kind', info.taken ? 'Effect not chosen in this build' : 'Not taken'));
    }
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    const left = Math.min(x + 16, window.innerWidth - r.width - 8);
    const top = y + 16 + r.height > window.innerHeight ? y - r.height - 12 : y + 16;
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top = `${Math.max(8, top)}px`;
  }

  // ------------------------------------------------------------ рендер

  // Камень с отметкой «куплен» — по ней программа перестаёт напоминать о покупке в городе
  function gemRow(tag, cls, gem) {
    const info = shop[gem.name];
    const row = el(tag, `${cls}${info?.bought ? ' bought' : ''}`);
    row.append(el('span', 'gem-name', gem.name));
    if (info) {
      const b = el('button', 'buy no-drag', info.bought ? '✓ bought' : 'buy');
      b.title = info.bought
        ? 'Marked as bought — no reminders in town. Click to undo.'
        : 'You will be reminded in town until this is marked (it is marked automatically after 3 reminders).';
      b.setAttribute('aria-pressed', String(!!info.bought));
      b.onclick = async () => render(await api.markGem(info.key, !info.bought));
      row.append(b);
    }
    return row;
  }

  function renderGems(v) {
    const box = $('gems');
    box.replaceChildren();
    if (!v.groups.length) { box.append(el('div', 'none', 'No gems in this set')); return; }
    for (const g of v.groups) {
      const wrap = el('div', 'group');
      if (g.slot || g.label) wrap.append(el('div', 'group-slot', [g.slot, g.label].filter(Boolean).join(' — ')));
      const [first, ...rest] = g.gems;
      if (!first.support) wrap.append(gemRow('div', `gem gem-main c-${first.colour || 'X'}`, first));
      const supports = first.support ? g.gems : rest;
      if (supports.length) {
        const ul = el('ul', 'supports');
        for (const s of supports) ul.append(gemRow('li', `gem c-${s.colour || 'X'}`, s));
        wrap.append(ul);
      }
      box.append(wrap);
    }
  }

  function setOptions(select, titles, current, label, allowNone) {
    select.hidden = titles.length < (allowNone ? 1 : 2);
    const opts = titles.map((t, i) => {
      const o = el('option', null, t || `${label} ${i + 1}`);
      o.value = String(i);
      return o;
    });
    if (allowNone) {
      const none = el('option', null, 'None');
      none.value = '-1';
      opts.unshift(none);
    }
    select.replaceChildren(...opts);
    select.value = String(current);
  }

  function ascOf(v) {
    // Асцендант берём по взятым узлам; иначе — по классу этапа
    const counts = {};
    for (const id of v.nodes) {
      const n = T.nodes[id];
      if (n?.asc) counts[n.asc] = (counts[n.asc] || 0) + 1;
    }
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (best) return best[0];
    const cls = T.classes[v.classId];
    return v.ascendClassId && cls ? cls.asc[v.ascendClassId - 1] : null;
  }

  function render(state) {
    const v = state?.stage;
    $('noBuild').hidden = !!v;
    $('body').hidden = !v;
    $('stageBox').hidden = !v;
    $('buildName').textContent = state?.buildName || 'No build';
    if (!v) return;
    view = v;
    shop = state.shop || {};

    // Этапы
    const sel = $('stageSelect');
    sel.replaceChildren(...state.stageTitles.map((t, i) => {
      const o = el('option', null, t);
      o.value = String(i);
      return o;
    }));
    sel.value = String(v.index);
    $('prev').disabled = v.index === 0;
    $('next').disabled = v.index >= v.count - 1;

    // Дерево
    const refit = state.buildId !== shownBuild;
    shownBuild = state.buildId;
    if (!main) main = new window.TreeView($('tree'), T, { onHover: showTip });
    main.setStage(v, refit);

    const asc = ascOf(v);
    $('ascBox').hidden = !asc;
    if (asc) {
      const newAsc = asc !== ascName;
      if (newAsc) {
        ascName = asc;
        ascView = new window.TreeView($('ascTree'), T, { asc, onHover: showTip });
      }
      $('ascName').textContent = asc;
      ascView.setStage(v, refit || newAsc);
    }

    const pts = $('points');
    pts.replaceChildren();
    pts.append(el('b', null, String(main.takenCount)), ' points');
    if (main.freshCount) pts.append(', ', el('em', null, `+${main.freshCount}`), ' this stage');
    if (ascView && asc) pts.append(`, ascendancy ${ascView.takenCount}`);

    const missing = v.nodes.filter((id) => !T.nodes[id]).length;
    const warn = $('treeWarn');
    const ver = v.treeVersion ? v.treeVersion.replace('_', '.') : '';
    warn.hidden = !missing;
    warn.textContent = missing
      ? `${missing} node(s) from this build are not on the ${T.version} tree${ver ? ` (the build uses ${ver})` : ''} and are not shown.`
      : '';

    // Камни и уники
    setOptions($('skillSet'), state.skillSetTitles, v.skillSet, 'Set');
    renderGems(v);
  }

  // ------------------------------------------------------------ управление

  const go = (i) => api.setStage(i).then(render);
  $('prev').onclick = () => view && go(view.index - 1);
  $('next').onclick = () => view && go(view.index + 1);
  $('stageSelect').onchange = (e) => go(Number(e.target.value));
  $('skillSet').onchange = (e) => api.setOverride('skillSet', Number(e.target.value)).then(render);
  $('fit').onclick = () => { main?.fit(); ascView?.fit(); };
  $('close').onclick = () => api.close();

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowLeft' && view && view.index > 0) go(view.index - 1);
    if (e.key === 'ArrowRight' && view && view.index < view.count - 1) go(view.index + 1);
    if (e.key === 'Escape') api.close();
  });

  api.onState(render);
  api.getState().then(render);
})();
