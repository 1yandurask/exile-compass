'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const api = window.guide;
  let data = null;
  let editing = null; // id своей строки, которую сейчас правим

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function render() {
    const box = $('list');
    box.replaceChildren();
    for (const it of data.items) {
      const row = el('div', `s-item${it.id === data.selected ? ' selected' : ''}`);
      row.setAttribute('role', 'button');
      row.tabIndex = 0;
      row.title = 'Select — the copy hotkey copies the selected search';
      row.onclick = async () => { data = await api.selectSearch(it.id); render(); };
      row.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); } };
      const name = el('span', 's-name', it.name);
      if (it.auto) name.append(el('small', null, 'auto'));
      row.append(el('span', 's-dot'), name);

      const btns = el('span', 's-btns');
      const copy = el('button', 'copy', 'Copy');
      copy.onclick = async (e) => {
        e.stopPropagation();
        data = await api.copySearch(it.id);
        render();
        const b = [...document.querySelectorAll('.s-item')][data.items.findIndex((x) => x.id === it.id)]?.querySelector('.copy');
        if (b) { b.textContent = 'Copied'; b.classList.add('done'); }
      };
      btns.append(copy);
      if (it.custom) {
        const edit = el('button', 'mini', 'Edit');
        edit.onclick = (e) => { e.stopPropagation(); startEdit(it); };
        const del = el('button', 'mini', 'Delete');
        del.onclick = async (e) => { e.stopPropagation(); data = await api.deleteSearch(it.id); if (editing === it.id) stopEdit(); render(); };
        btns.append(edit, del);
      }
      row.append(btns, el('span', 's-text', it.text));
      if (it.note) row.append(el('span', 's-note', it.note));
      box.append(row);
    }
    $('hint').textContent = data.copyKey
      ? `With a vendor open, ${data.copyKey} pastes the selected search into its search box. Copy here puts it on the clipboard.`
      : 'Click Copy, then Ctrl+V in the vendor\'s search box. Set a “Paste selected search” hotkey in the main window to paste it straight into the search box.';
  }

  function count() {
    const n = $('fText').value.length;
    $('fCount').textContent = `${n}/${data?.max || 50}`;
    $('fCount').classList.toggle('over', n > (data?.max || 50));
  }

  function startEdit(it) {
    editing = it.id;
    $('formTitle').textContent = `Edit “${it.name}”`;
    $('fName').value = it.name;
    $('fText').value = it.text;
    $('fSave').textContent = 'Save';
    $('fCancel').hidden = false;
    $('fError').hidden = true;
    count();
    $('fName').focus();
  }

  function stopEdit() {
    editing = null;
    $('formTitle').textContent = 'Add your own search';
    $('fName').value = '';
    $('fText').value = '';
    $('fSave').textContent = 'Add';
    $('fCancel').hidden = true;
    $('fError').hidden = true;
    count();
  }

  $('fText').oninput = count;
  $('fCancel').onclick = stopEdit;
  $('form').onsubmit = async (e) => {
    e.preventDefault();
    try {
      data = await api.saveSearch({ id: editing, name: $('fName').value, text: $('fText').value });
      stopEdit();
      render();
    } catch (ex) {
      $('fError').textContent = ex.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, '');
      $('fError').hidden = false;
    }
  };
  $('close').onclick = () => api.close();
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') api.close();
  });

  api.onSearches((d) => { data = d; render(); });
  api.searchList().then((d) => { data = d; render(); count(); });
})();
