// Небольшой разборщик XML — без зависимостей. Хватает для файлов Path of Building:
// элементы, атрибуты, текст, комментарии, CDATA, стандартные сущности.
'use strict';

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENT[e] ?? m;
  });
}

function parseXml(text) {
  const root = { name: '#root', attrs: {}, children: [], text: '' };
  const stack = [root];
  let i = 0;
  const n = text.length;
  while (i < n) {
    const lt = text.indexOf('<', i);
    if (lt < 0) { stack.at(-1).text += decode(text.slice(i)); break; }
    if (lt > i) stack.at(-1).text += decode(text.slice(i, lt));
    if (text.startsWith('<!--', lt)) { i = text.indexOf('-->', lt) + 3; if (i < 3) break; continue; }
    if (text.startsWith('<![CDATA[', lt)) {
      const end = text.indexOf(']]>', lt);
      stack.at(-1).text += text.slice(lt + 9, end < 0 ? n : end);
      i = end < 0 ? n : end + 3;
      continue;
    }
    if (text[lt + 1] === '?' || text[lt + 1] === '!') { i = text.indexOf('>', lt) + 1; if (i <= 0) break; continue; }
    if (text[lt + 1] === '/') {
      const gt = text.indexOf('>', lt);
      const name = text.slice(lt + 2, gt).trim();
      // Закрываем до совпадающего элемента (терпимо к ошибкам разметки)
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].name === name) { stack.length = k; break; }
      }
      i = gt + 1;
      continue;
    }
    // Открывающий тег: ищем конец с учётом кавычек
    let j = lt + 1;
    let q = null;
    while (j < n) {
      const c = text[j];
      if (q) { if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === '>') break;
      j++;
    }
    let inner = text.slice(lt + 1, j);
    const selfClose = inner.endsWith('/');
    if (selfClose) inner = inner.slice(0, -1);
    const m = /^([^\s/>]+)/.exec(inner);
    const el = { name: m ? m[1] : '', attrs: {}, children: [], text: '' };
    const attrRe = /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let a;
    while ((a = attrRe.exec(inner))) el.attrs[a[1]] = decode(a[3] ?? a[4] ?? '');
    stack.at(-1).children.push(el);
    if (!selfClose) stack.push(el);
    i = j + 1;
  }
  return root;
}

// Помощники для обхода
function child(el, name) {
  return el?.children.find((c) => c.name === name) || null;
}

function childrenOf(el, name) {
  return el ? el.children.filter((c) => c.name === name) : [];
}

module.exports = { parseXml, child, childrenOf };
