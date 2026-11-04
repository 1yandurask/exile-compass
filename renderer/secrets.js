'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const api = window.guide;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function render(data) {
    const list = $('list');
    list.replaceChildren();
    if (!data?.acts?.length) {
      list.append(el('div', 'empty', 'No entries yet.'));
      return;
    }
    for (const act of data.acts) {
      list.append(el('div', 'act-head', `Act ${act.act}`));
      for (const s of act.entries) {
        const row = el('div', 'item no-check');
        row.append(el('span', 'item-name', s.title));
        row.append(el('span', 'badge', `Act ${act.act}`));
        if (s.area) row.append(el('div', 'item-meta', s.area));
        if (s.text) row.append(el('div', 'secret-text', s.text));
        list.append(row);
      }
    }
  }

  $('close').onclick = () => api.close();
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') api.close(); });
  api.getData('secrets').then(render);
})();
