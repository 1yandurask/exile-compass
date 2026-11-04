'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const api = window.guide;
  let quests = null;
  let done = new Set();
  let lab = null;
  let labDone = new Set();
  let tab = 'points';

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderPoints() {
    const box = $('points');
    box.replaceChildren();
    let total = 0;
    let got = 0;
    for (const act of quests.acts) {
      const actPts = act.quests.reduce((s, q) => s + q.points, 0);
      const head = el('div', 'act-head', `Act ${act.act}`);
      head.append(el('small', null, `${actPts} point${actPts === 1 ? '' : 's'}`));
      box.append(head);
      for (const q of act.quests) {
        const key = `${act.act}:${q.name}`;
        total += q.points;
        if (done.has(key)) got += q.points;
        const row = el('label', `item${done.has(key) ? ' done' : ''}`);
        const cb = el('input');
        cb.type = 'checkbox';
        cb.checked = done.has(key);
        cb.onchange = async () => {
          done = new Set(await api.markQuest(key, cb.checked));
          renderPoints();
        };
        row.append(cb, el('span', 'item-name', q.name), el('span', 'badge', `+${q.points}`));
        const meta = el('div', 'item-meta');
        meta.append(el('span', 'where', q.area));
        meta.append(el('span', null, `${q.task}. Reward from ${q.reward}.`));
        row.append(meta);
        if (q.tip) row.append(el('div', 'item-tip', q.tip));
        box.append(row);
      }
    }
    const p = $('progress');
    p.replaceChildren(el('b', null, `${got} / ${total}`), ' passive points from quests');
  }

  // Лабиринт: сначала где и в каком акте, потом ловушки. Галочки глушат уведомления.
  function renderLab() {
    const box = $('lab');
    box.replaceChildren();
    if (lab.entry) box.append(el('div', 'lab-entry', lab.entry));
    for (const t of lab.trials) {
      const id = `${t.act}:${t.trial}`;
      const row = el('label', `item${labDone.has(id) ? ' done' : ''}`);
      const cb = el('input');
      cb.type = 'checkbox';
      cb.checked = labDone.has(id);
      cb.onchange = async () => {
        labDone = new Set(await api.markLab(id, cb.checked));
        renderLab();
      };
      row.append(cb, el('span', 'item-name', t.zone), el('span', 'badge lab', `Act ${t.act}`));
      const meta = el('div', 'item-meta');
      if (t.traps) meta.append(el('span', null, t.traps));
      meta.append(el('span', 'faint', `Trial of ${t.trial}`));
      row.append(meta);
      box.append(row);
    }
    renderSummary();
  }

  function renderSummary() {
    const p = $('progress');
    if (tab === 'lab') {
      const n = lab ? lab.trials.filter((t) => labDone.has(`${t.act}:${t.trial}`)).length : 0;
      p.replaceChildren(el('b', null, `${n} / ${lab ? lab.trials.length : 0}`), ' trials done');
    } else if (quests) {
      renderPoints();
    }
  }

  document.querySelectorAll('.tab').forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll('.tab').forEach((x) => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-selected', String(x === b));
      });
      $('points').hidden = b.dataset.tab !== 'points';
      $('lab').hidden = b.dataset.tab !== 'lab';
      tab = b.dataset.tab;
      renderSummary();
    };
  });
  $('reset').onclick = async () => {
    if (tab === 'lab') { labDone = new Set(await api.clearLab()); renderLab(); } else { done = new Set(await api.clearQuests()); renderPoints(); }
  };
  api.onLabDone((d) => { labDone = new Set(d); if (lab) renderLab(); });
  $('close').onclick = () => api.close();
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') api.close(); });

  Promise.all([api.getData('quests'), api.getData('labyrinth'), api.questsDone(), api.labDone()]).then(([q, l, d, ld]) => {
    quests = q;
    lab = l;
    done = new Set(d);
    labDone = new Set(ld);
    renderPoints();
    renderLab();
  });
})();
