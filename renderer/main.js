'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const api = window.guide;
  let lib = null;
  let tab = 'leveling';
  let renaming = null; // id билда, который переименовывают
  let listening = null; // какая клавиша ждёт нажатия
  let keyError = {};
  let wStep = 1; // шаг первого запуска

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function btn(text, cls, onclick) {
    const b = el('button', `btn ${cls || ''}`.trim(), text);
    b.type = 'button';
    b.onclick = onclick;
    return b;
  }
  function keyChip(accel, cls = '') {
    return el('span', `key ${cls}`.trim(), accel || '');
  }
  async function act(fn) {
    try { lib = await fn(); render(); } catch (e) { console.error(e); }
  }

  // ------------------------------------------------------------ вкладки

  function setTab(t) {
    tab = t;
    try { localStorage.setItem('tab', t); } catch { /* не важно */ }
    $('app').dataset.tab = t;
    for (const b of document.querySelectorAll('.tab')) b.setAttribute('aria-selected', String(b.dataset.tab === t));
    for (const p of ['leveling', 'price', 'keys', 'settings']) $(`p-${p}`).hidden = p !== t;
    $('scroll').scrollTop = 0;
  }
  for (const b of document.querySelectorAll('.tab')) b.onclick = () => setTab(b.dataset.tab);
  try { tab = localStorage.getItem('tab') || 'leveling'; } catch { /* не важно */ }

  // ------------------------------------------------------------ шапка

  function renderStatus() {
    const st = $('status');
    const p = lib.playing || {};
    st.className = `status ${lib.log.ok ? 'ok' : 'bad'}`;
    $('statusText').textContent = !lib.log.ok
      ? 'Game log not found'
      : p.area ? `${p.cls || 'In game'}${p.level ? `, level ${p.level}` : ''} in ${p.area}` : 'Waiting for the game';
    const u = lib.update;
    const ready = u?.status === 'ready';
    $('updateBar').hidden = !ready;
    if (ready) {
      $('updateBarText').textContent = `Version ${u.latest} is ready.`;
      $('updateBarBtn').onclick = () => api.installUpdate();
    }
  }

  // ------------------------------------------------------------ прокачка

  const active = () => lib.builds.find((b) => b.id === lib.active) || null;

  function renderLeveling() {
    const b = active();
    $('hero').hidden = !b;
    $('noBuild').hidden = !!b;
    if (b) {
      const cls = b.ascendClassName || b.className || '';
      $('crest').textContent = (cls[0] || '?').toUpperCase();
      $('heroName').textContent = b.name;
      const ch = lib.character;
      const p = lib.playing || {};
      $('heroMeta').textContent = [
        cls,
        ch?.level ? `level ${ch.level}` : '',
        p.area ? `in ${p.area}` : '',
      ].filter(Boolean).join(', ');
      $('treeKey').textContent = lib.hotkeys.build || '';
      const stages = $('stages');
      stages.replaceChildren(...b.stages.map((s, i) => {
        const x = el('button', `stage${i < b.stage ? ' done' : ''}${i === b.stage ? ' now' : ''}`);
        x.type = 'button';
        x.append(el('span', null, s));
        x.title = s;
        x.setAttribute('aria-pressed', String(i === b.stage));
        x.onclick = () => act(async () => { await api.setStage(i); return api.library(); });
        return x;
      }));
    }

    // Переименование текущего билда — прямо в карточке
    const rn = $('heroRename');
    rn.replaceChildren();
    rn.hidden = !(b && renaming === b.id);
    if (b && renaming === b.id) rn.append(...buildRow(b).childNodes);
    $('heroTools').hidden = !b || renaming === b.id;

    // Другие билды
    const others = lib.builds.filter((x) => x.id !== lib.active);
    $('otherBuilds').replaceChildren(...others.map(buildRow));
    $('otherBox').hidden = !others.length;

    renderSwitches();
    $('vendorText').textContent = `Search strings for the vendor: links, movement speed, +1 gem weapons${lib.playing?.cls ? ` for the ${lib.playing.cls}` : ''}. ${lib.hotkeys.search || 'The window key'} opens the list, ${lib.hotkeys.copy || 'the paste key'} pastes the chosen one.`;
  }

  function buildRow(b) {
    const li = el('li', 'row');
    if (renaming === b.id) {
      const f = el('form', 'rename');
      const input = el('input');
      input.value = b.name;
      input.maxLength = 60;
      input.setAttribute('aria-label', 'Build name');
      const save = el('button', 'btn primary', 'Save');
      save.type = 'submit';
      f.append(input, save, btn('Cancel', 'quiet', () => { renaming = null; render(); }));
      f.onsubmit = (e) => { e.preventDefault(); renaming = null; act(() => api.renameBuild(b.id, input.value)); };
      li.append(f);
      setTimeout(() => input.select(), 0);
      return li;
    }
    const k = el('span', 'kind k-build');
    const info = el('div', 'grow');
    info.append(el('b', null, b.name), el('div', 'small', [b.ascendClassName || b.className, `${b.stages.length} stage${b.stages.length === 1 ? '' : 's'}`].filter(Boolean).join(', ')));
    li.append(k, info,
      btn('Play this build', 'quiet', () => act(() => api.activateBuild(b.id))),
      btn('Rename', 'quiet', () => { renaming = b.id; render(); }),
      btn('Delete', 'quiet danger', () => del(b)));
    return li;
  }

  function del(b) {
    if (!confirm(`Delete “${b.name}”?`)) return;
    act(() => api.deleteBuild(b.id));
  }

  const SWITCHES = [
    ['quests', 'Passive point quests'],
    ['lab', 'Labyrinth trials'],
    ['secrets', 'Secret rooms'],
    ['gems', 'Gems to take or buy'],
    ['xp', 'XP penalty'],
    ['near', 'Hint for the next area'],
    ['copy', '“Copied” card for vendor searches'],
  ];

  function renderSwitches() {
    $('switches').replaceChildren(...SWITCHES.map(([k, label]) => {
      const row = el('div', 'row');
      const sw = el('button', 'switch');
      sw.type = 'button';
      sw.setAttribute('role', 'switch');
      sw.setAttribute('aria-checked', String(!!lib.notify[k]));
      sw.setAttribute('aria-label', label);
      sw.onclick = () => act(() => api.setNotify(k, !lib.notify[k]));
      row.append(el('span', `kind k-${k}`), el('span', 'grow', label), sw);
      return row;
    }));
    const ch = lib.character;
    $('gemHint').textContent = ch
      ? `Gems are suggested in town once level ${ch.level} allows. A gem stops showing after 3 reminders or when you mark it bought in the tree window.`
      : 'Gem reminders start after your next level-up: the level is read from the game log.';
  }

  $('openTree').onclick = () => api.openWindow('build');
  $('renameActive').onclick = () => { renaming = lib.active; render(); };
  $('deleteActive').onclick = () => { const b = active(); if (b) del(b); };
  $('openQuests').onclick = () => api.openWindow('quests');
  $('openSecrets').onclick = () => api.openWindow('secrets');
  $('openSearch').onclick = () => api.openWindow('search');
  $('moveToast').onclick = () => api.moveToast();
  $('testNotify').onclick = () => api.testNotify();

  $('addForm').onsubmit = async (e) => {
    e.preventDefault();
    $('addError').hidden = true;
    $('addBtn').disabled = true;
    $('addBtn').textContent = 'Adding…';
    try {
      lib = await api.addBuild($('code').value, $('name').value);
      $('code').value = '';
      $('name').value = '';
      render();
    } catch (ex) {
      $('addError').textContent = ex.message;
      $('addError').hidden = false;
    } finally {
      $('addBtn').disabled = false;
      $('addBtn').textContent = 'Add build';
    }
  };

  // ------------------------------------------------------------ цены

  function leagueOptions(sel) {
    const p = lib.price;
    const list = p.leagues?.length ? p.leagues : [{ id: p.league, text: p.league || 'Loading…' }];
    sel.replaceChildren(...list.map((l) => { const o = el('option', null, l.text); o.value = l.id; return o; }));
    sel.value = p.league;
  }

  function renderPrice() {
    const p = lib.price;
    $('priceKeyInline').replaceChildren(keyChip(lib.hotkeys.price || 'your key'));
    $('priceKey').textContent = lib.hotkeys.price || 'Not set';
    leagueOptions($('league'));
    $('leaguesError').hidden = !p.leaguesError;
    $('leaguesError').textContent = p.leaguesError || '';
    for (const r of document.querySelectorAll('input[name=sale]')) r.checked = r.value === p.saleMode;

    const box = $('last');
    const l = p.last;
    $('reopen').disabled = !l;
    if (!l) {
      box.replaceChildren(el('p', 'small', `Nothing checked yet. Hover an item in the game and press ${lib.hotkeys.price || 'the price check key'}.`));
      return;
    }
    const head = el('div', 'mini-head');
    head.append(el('span', `mini-name r-${l.rarity}`, l.name), el('span', 'small', [l.base, `${l.total} listed`].filter(Boolean).join(', ')));
    const rows = l.listings.map((x) => {
      const r = el('div', 'mini-row');
      const price = el('span');
      price.append(el('span', 'amt', x.amount != null ? String(x.amount) : '—'), el('span', `cur c-${x.currency}`, x.short || ''));
      r.append(price, el('span', 'small', x.age || ''));
      return r;
    });
    box.replaceChildren(head, ...(rows.length ? rows : [el('p', 'small', 'Nothing listed with these filters.')]));
  }

  $('league').onchange = (e) => act(() => api.setPriceLeague(e.target.value));
  $('reload').onclick = () => act(() => api.reloadLeagues());
  for (const r of document.querySelectorAll('input[name=sale]')) r.onchange = () => act(() => api.setSaleMode(r.value));
  $('reopen').onclick = () => api.reopenPrice();
  $('goKeys').onclick = () => setTab('keys');
  $('clipboard').onclick = async () => {
    $('clipNote').hidden = true;
    try { lib = await api.checkClipboard(); render(); } catch (e) { $('clipNote').hidden = false; $('clipNote').textContent = e.message; }
  };

  // ------------------------------------------------------------ клавиши

  const KEY_GROUPS = [
    { title: 'Leveling', lamp: 'lamp', keys: [
      ['build', 'Passive tree and gems', ''],
      ['quests', 'Quests and Labyrinth', ''],
      ['secrets', 'Secret rooms', ''],
      ['search', 'Vendor search', 'Opens the list of search strings'],
      ['copy', 'Paste the search into the vendor', 'Works while the vendor window is open'],
    ] },
    { title: 'Price check', lamp: 'lamp blue', keys: [
      ['price', 'Check the price of the item under the cursor', ''],
    ] },
    { title: 'In the game and in the app', lamp: '', keys: [
      ['logout', 'Exit to character select', 'Sends /exit to the chat'],
      ['main', 'Open this window', ''],
    ] },
  ];
  const CLEARABLE = new Set(['quests', 'secrets', 'search', 'copy', 'logout']);

  function renderKeys() {
    $('keyGroups').replaceChildren(...KEY_GROUPS.map((g) => {
      const sec = el('section', 'key-group');
      const h = el('h2');
      if (g.lamp) h.append(el('span', g.lamp));
      h.append(g.title);
      const panel = el('div', 'panel');
      for (const [kind, label, sub] of g.keys) {
        const row = el('div', 'row');
        const what = el('div', 'what');
        what.append(label);
        if (sub) what.append(el('div', 'small', sub));
        const accel = lib.hotkeys[kind];
        const chip = listening === kind ? keyChip('Press a key…', 'big listen') : keyChip(accel || 'Not set', `big${accel ? '' : ' unset'}`);
        row.append(what, chip);
        if (listening === kind) row.append(btn('Cancel', 'quiet', () => stopListening()));
        else {
          row.append(btn('Change', 'quiet', () => startListening(kind)));
          if (accel && CLEARABLE.has(kind)) row.append(btn('Turn off', 'quiet', () => setKey(kind, '')));
        }
        const msg = keyError[kind] || lib.hotkeyErrors[kind] || (lib.risky[kind] ? 'A single key like this stops working in the game chat too.' : '');
        if (msg) row.append(el('div', 'key-note', msg));
        panel.append(row);
      }
      sec.append(h, panel);
      return sec;
    }));
  }

  async function setKey(kind, accel) {
    keyError = {};
    try { lib = await api.setHotkey(kind, accel); } catch (ex) { keyError[kind] = ex.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, ''); }
    render();
  }

  async function startListening(kind) {
    if (listening) await stopListening();
    listening = kind;
    keyError = {};
    await api.captureStart();
    renderKeys();
  }

  async function stopListening() {
    listening = null;
    lib = await api.captureEnd();
    render();
  }

  window.addEventListener('keydown', async (e) => {
    if (!listening) return;
    e.preventDefault();
    if (e.code === 'Escape') { await stopListening(); return; }
    const r = window.Hotkeys.accelFromEvent(e);
    if (r.pending) return;
    const kind = listening;
    if (r.error) { keyError[kind] = r.error; renderKeys(); return; }
    try { lib = await api.setHotkey(kind, r.accel); } catch (ex) { keyError[kind] = ex.message; }
    await stopListening();
  });
  window.addEventListener('blur', () => { if (listening) stopListening(); });

  // ------------------------------------------------------------ настройки

  const DC_STATUS = {
    off: 'Off.',
    waiting: 'Waiting for Path of Exile and Discord to be running.',
    on: 'Showing in Discord now.',
    error: 'Discord refused the connection.',
  };
  const WINDOWS = { build: 'Passive tree', quests: 'Quests', secrets: 'Secret rooms', search: 'Vendor search' };

  function renderSettings() {
    const u = lib.update || {};
    $('appVer').textContent = lib.version || u.current || '';
    $('treeVer').textContent = lib.treeVersion || '';
    $('upText').textContent = {
      ready: `Version ${u.latest} is ready. Restart to install it.`,
      downloading: `Downloading version ${u.latest || ''}… ${u.percent || 0}%`,
      available: `Version ${u.latest} is out.`,
      checking: 'Checking…',
    }[u.status] || `Version ${lib.version}. New versions download by themselves.`;
    const up = $('upCheck');
    if (u.status === 'ready') { up.textContent = 'Restart and update'; up.className = 'btn primary'; up.onclick = () => api.installUpdate(); }
    else if (u.status === 'available') { up.textContent = 'Download'; up.className = 'btn'; up.onclick = () => api.openUpdate(); }
    else { up.textContent = 'Check now'; up.className = 'btn quiet'; up.onclick = () => api.checkUpdate(); }

    const d = lib.discord || {};
    $('dcOn').setAttribute('role', 'switch');
    $('dcOn').setAttribute('aria-checked', String(!!d.enabled));
    $('dcState').textContent = `${DC_STATUS[d.status] || ''}${d.error ? ` ${d.error}` : ''}`;
    $('dcState').className = `hint full ${d.status === 'on' ? 'ok-text' : d.error || d.status === 'error' ? 'bad-text' : ''}`;

    $('logState').textContent = lib.log.ok ? `Reading ${lib.log.path}` : (lib.log.error || 'Client.txt not found');
    $('logState').className = `hint ${lib.log.ok ? '' : 'bad-text'}`;

    const box = $('winSettings');
    box.replaceChildren(...Object.entries(WINDOWS).map(([kind, label]) => {
      const row = el('div', 'win-row');
      const pct = el('span', 'pct', `${Math.round(lib.windows[kind].opacity * 100)}%`);
      const range = el('input');
      range.type = 'range';
      range.min = '40';
      range.max = '100';
      range.value = String(Math.round(lib.windows[kind].opacity * 100));
      range.setAttribute('aria-label', `${label}: how solid the window is`);
      range.oninput = () => { pct.textContent = `${range.value}%`; api.setOpacity(kind, Number(range.value) / 100); };
      row.append(el('span', 'name', label), range, pct, btn('Reset position', 'quiet', () => api.resetWindow(kind)));
      return row;
    }));

    const m = lib.migratedFrom || [];
    $('migrated').hidden = !m.length;
    $('migrated').textContent = m.length ? `Builds and settings were brought over from ${m.join(' and ')}. You can uninstall the old app${m.length > 1 ? 's' : ''}.` : '';
  }

  $('dcOn').onclick = () => act(() => api.setDiscord({ enabled: !lib.discord.enabled }));
  $('chooseLog').onclick = () => act(() => api.chooseLog());

  // ------------------------------------------------------------ первый запуск

  const W_TITLES = { 1: 'Set the game to Windowed Fullscreen', 2: 'Paste your leveling build', 3: 'Choose the league for prices' };

  function renderWelcome() {
    $('welcome').hidden = !!lib.welcomed;
    if (lib.welcomed) return;
    $('wCount').textContent = `Step ${wStep} of 3`;
    $('wTitle').textContent = W_TITLES[wStep];
    [...$('wSteps').children].forEach((li, i) => {
      li.className = `w-step${i + 1 < wStep ? ' done' : ''}${i + 1 === wStep ? ' on' : ''}`;
      li.firstChild.textContent = i + 1 < wStep ? '✓' : String(i + 1);
    });
    for (const n of [1, 2, 3]) $(`w${n}`).hidden = n !== wStep;
    $('wBack').hidden = wStep === 1;
    $('wSkip').hidden = wStep !== 2;
    $('wNext').textContent = { 1: 'It is set', 2: 'Add build', 3: 'Start playing' }[wStep];
    if (wStep === 3) leagueOptions($('wLeague'));
  }

  $('wBack').onclick = () => { wStep = Math.max(1, wStep - 1); renderWelcome(); };
  $('wSkip').onclick = () => { wStep = 3; renderWelcome(); };
  $('wNext').onclick = async () => {
    if (wStep === 1) { wStep = 2; renderWelcome(); return; }
    if (wStep === 2) {
      const code = $('wCode').value.trim();
      if (!code) { wStep = 3; renderWelcome(); return; }
      $('wError').hidden = true;
      $('wNext').disabled = true;
      $('wNext').textContent = 'Adding…';
      try {
        lib = await api.addBuild(code, '');
        wStep = 3;
      } catch (ex) {
        $('wError').textContent = ex.message;
        $('wError').hidden = false;
      } finally {
        $('wNext').disabled = false;
      }
      render();
      return;
    }
    if ($('wLeague').value) lib = await api.setPriceLeague($('wLeague').value);
    lib = await api.welcomed();
    setTab(active() ? 'leveling' : 'price');
    render();
  };

  // ------------------------------------------------------------ всё вместе

  function render() {
    if (!lib) return;
    renderStatus();
    // Пока переименовывают билд — не перерисовываем список, иначе поле ввода потеряет текст и фокус
    const typing = renaming && document.activeElement?.closest?.('.rename');
    if (!typing) renderLeveling();
    renderPrice();
    if (!listening) renderKeys();
    renderSettings();
    renderWelcome();
  }

  api.onLibrary((l) => { lib = l; render(); });
  api.library().then((l) => { lib = l; setTab(tab); render(); });
})();
