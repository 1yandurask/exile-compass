// Перевод нажатия клавиши в строку Electron (accelerator).
// Один файл для основного процесса (require) и окна настроек (<script>).
(function (root) {
'use strict';

const CODE_MAP = {
  Backquote: '`', Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Backslash: '\\',
  Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', Space: 'Space', Tab: 'Tab',
  Insert: 'Insert', Delete: 'Delete', Home: 'Home', End: 'End', PageUp: 'PageUp', PageDown: 'PageDown',
  ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right', Enter: 'Enter', Backspace: 'Backspace',
  NumpadAdd: 'numadd', NumpadSubtract: 'numsub', NumpadMultiply: 'nummult', NumpadDivide: 'numdiv', NumpadDecimal: 'numdec',
  Pause: 'Pause', ScrollLock: 'Scrolllock', PrintScreen: 'PrintScreen',
};

const MODS = new Set(['ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight']);

/**
 * @param {{code:string, ctrlKey:boolean, altKey:boolean, shiftKey:boolean}} e
 * @returns {{accel?:string, error?:string, pending?:boolean}}
 */
function accelFromEvent(e) {
  if (MODS.has(e.code)) return { pending: true };
  let key = null;
  if (/^Key[A-Z]$/.test(e.code)) key = e.code.slice(3);
  else if (/^Digit\d$/.test(e.code)) key = e.code.slice(5);
  else if (/^F([1-9]|1\d|2[0-4])$/.test(e.code)) key = e.code;
  else if (/^Numpad\d$/.test(e.code)) key = `num${e.code.slice(6)}`;
  else if (CODE_MAP[e.code]) key = CODE_MAP[e.code];
  if (e.code === 'Escape') return { error: 'Esc closes the windows — pick another key' };
  if (!key) return { error: 'This key cannot be used' };
  const mods = [];
  if (e.ctrlKey) mods.push('Ctrl');
  if (e.altKey) mods.push('Alt');
  if (e.shiftKey) mods.push('Shift');
  return { accel: [...mods, key].join('+') };
}

// Одиночная буква или цифра без модификаторов перестанет печататься в чате игры
function isRisky(accel) {
  return /^[A-Z0-9`\-=[\]\\;',./]$|^Space$|^Enter$|^Tab$|^Backspace$/.test(accel);
}

const api = { accelFromEvent, isRisky };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else root.Hotkeys = api;
})(typeof window !== 'undefined' ? window : globalThis);
