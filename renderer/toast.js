'use strict';

(function () {
  const stack = document.getElementById('stack');
  const api = window.guide;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function show({ cards }) {
    stack.classList.remove('out');
    stack.replaceChildren(...cards.map((c) => {
      const card = el('div', `card ${c.kind}${c.near ? ' near' : ''}`);
      card.append(el('div', 'label', c.label), el('div', 'title', c.title));
      if (c.text) card.append(el('div', 'text', c.text));
      return card;
    }));
    // Сообщаем высоту, чтобы окно подстроилось под число карточек
    requestAnimationFrame(() => api.toastSize(Math.ceil(stack.getBoundingClientRect().height)));
  }

  api.onToast(show);
  api.onToastHide(() => stack.classList.add('out'));
  window.__toast = { show };
})();
