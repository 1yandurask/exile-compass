// Нажатия клавиш в игру и слежение за мышью — один постоянный процесс PowerShell с user32
// (без сторонних библиотек), запускается один раз, поэтому команды уходят без задержки.
// - COPY  — Ctrl+Alt+C: расширенное копирование предмета под курсором (проверка цены)
// - CHAT  — Enter → Ctrl+V → Enter: команда чата из буфера (/exit)
// - ENTER — Enter: вход персонажем с экрана выбора (второе нажатие клавиши relog)
// - PASTE — Ctrl+F → Ctrl+A → Ctrl+V: строка поиска у торговца (только интерфейс)
// - WATCH x0 y0 x1 y1 / UNWATCH — сообщить «OUTSIDE» о клике левой кнопкой мимо прямоугольника
// - FOCUS — вернуть фокус окну игры
// Одно нажатие бинда = одна команда, как разрешают правила игры для макросов.
// Перед нажатиями проверяется, что на переднем плане окно Path of Exile.
'use strict';

const { spawn } = require('child_process');
const { EventEmitter } = require('events');

const PS_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
public static class CompassKeys {
  [DllImport("user32.dll")] static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
  [DllImport("user32.dll")] static extern uint MapVirtualKey(uint code, uint mapType);
  [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
  [DllImport("user32.dll")] static extern short GetAsyncKeyState(int vk);
  [DllImport("user32.dll")] static extern bool GetCursorPos(out POINT p);
  [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] static extern bool SetProcessDPIAware();
  [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X; public int Y; }
  static volatile int watchId = 0;
  const uint UP = 2;
  static void Key(byte vk, bool down) { keybd_event(vk, (byte)MapVirtualKey(vk, 0), down ? 0 : UP, UIntPtr.Zero); }
  static void Tap(byte vk) { Key(vk, true); System.Threading.Thread.Sleep(15); Key(vk, false); }
  public static string Foreground() {
    uint pid; GetWindowThreadProcessId(GetForegroundWindow(), out pid);
    try { return Process.GetProcessById((int)pid).ProcessName; } catch { return ""; }
  }
  static bool InGame() { return Foreground().StartsWith("PathOfExile", StringComparison.OrdinalIgnoreCase); }
  static void Release() { foreach (byte m in new byte[] { 0x10, 0x11, 0x12, 0x5B, 0x5C }) Key(m, false); } // отпустить Shift/Ctrl/Alt/Win бинда
  static void Ctrl(byte vk) { Key(0x11, true); Tap(vk); Key(0x11, false); System.Threading.Thread.Sleep(40); }
  // Следить за левой кнопкой: нажатие за пределами прямоугольника (экранные пиксели) → «OUTSIDE»
  public static void Watch(int x0, int y0, int x1, int y1) {
    // Координаты мыши — в настоящих пикселях экрана (как у окна цены), даже при масштабе 125–150%
    SetProcessDPIAware();
    int id = ++watchId;
    var t = new System.Threading.Thread(() => {
      bool wasDown = (GetAsyncKeyState(0x01) & 0x8000) != 0;
      while (watchId == id) {
        bool down = (GetAsyncKeyState(0x01) & 0x8000) != 0;
        if (down && !wasDown) {
          POINT p; GetCursorPos(out p);
          if (p.X < x0 || p.X > x1 || p.Y < y0 || p.Y > y1) { Console.Out.WriteLine("OUTSIDE"); watchId++; return; }
        }
        wasDown = down;
        System.Threading.Thread.Sleep(15);
      }
    });
    t.IsBackground = true;
    t.Start();
  }
  public static void Unwatch() { watchId++; }
  // Вернуть фокус окну игры
  public static string FocusGame() {
    foreach (var p in Process.GetProcesses()) {
      try {
        if (p.ProcessName.StartsWith("PathOfExile", StringComparison.OrdinalIgnoreCase) && p.MainWindowHandle != IntPtr.Zero) {
          // Windows отдаёт фокус чужому окну только «после ввода» — короткое нажатие Alt снимает запрет
          keybd_event(0x12, 0, 0, UIntPtr.Zero);
          SetForegroundWindow(p.MainWindowHandle);
          keybd_event(0x12, 0, 2, UIntPtr.Zero);
          return "OK";
        }
      } catch { }
    }
    return "NOTGAME";
  }
  // Ctrl+Alt+C — расширенное копирование предмета под курсором
  public static string Copy() {
    if (!InGame()) return "NOTGAME";
    Release();
    Key(0x11, true); Key(0x12, true); Tap(0x43); Key(0x12, false); Key(0x11, false);
    return "OK";
  }
  // Ctrl+F — курсор в поле поиска, Ctrl+A — выделить старое, Ctrl+V — вставить из буфера
  public static string Paste() {
    if (!InGame()) return "NOTGAME";
    Release();
    Ctrl(0x46); Ctrl(0x41); Ctrl(0x56);
    return "OK";
  }
  // Enter → Ctrl+V → Enter: открыть чат, вставить команду из буфера, отправить
  public static string Chat() {
    if (!InGame()) return "NOTGAME";
    Release();
    Tap(0x0D); System.Threading.Thread.Sleep(40);
    Ctrl(0x56);
    Tap(0x0D);
    return "OK";
  }

  // Enter — на экране выбора персонажа: войти выбранным персонажем
  public static string Enter() {
    if (!InGame()) return "NOTGAME";
    Release();
    Tap(0x0D);
    return "OK";
  }
}
'@
[Console]::Out.WriteLine('READY')
while ($true) {
  $line = [Console]::In.ReadLine()
  if ($line -eq $null) { break }
  $p = $line.Split(' ')
  if ($line -eq 'COPY') { [Console]::Out.WriteLine([CompassKeys]::Copy()) }
  elseif ($line -eq 'CHAT') { [Console]::Out.WriteLine([CompassKeys]::Chat()) }
  elseif ($line -eq 'ENTER') { [Console]::Out.WriteLine([CompassKeys]::Enter()) }
  elseif ($line -eq 'PASTE') { [Console]::Out.WriteLine([CompassKeys]::Paste()) }
  elseif ($p[0] -eq 'WATCH') { [CompassKeys]::Watch([int]$p[1], [int]$p[2], [int]$p[3], [int]$p[4]) }
  elseif ($line -eq 'UNWATCH') { [CompassKeys]::Unwatch() }
  elseif ($line -eq 'FOCUS') { [Console]::Out.WriteLine([CompassKeys]::FocusGame()) }
  else { [Console]::Out.WriteLine('UNKNOWN') }
}
`;

class GameKeys extends EventEmitter {
  /** @param o { spawn?: fn } — подмена для тестов */
  constructor(o = {}) {
    super();
    this.o = o;
    this.proc = null;
    this.ready = false;
    this.queue = [];
    this.buf = '';
  }

  available() {
    return process.platform === 'win32' || !!this.o.spawn;
  }

  start() {
    if (this.proc || !this.available()) return;
    this.startedAt = Date.now();
    const run = this.o.spawn || spawn;
    // Скрипт передаётся через -EncodedCommand (UTF-16LE base64), а stdin остаётся для команд
    const encoded = Buffer.from(PS_SCRIPT, 'utf16le').toString('base64');
    const p = run('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', encoded], { windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'] });
    this.proc = p;
    this.ready = false;
    p.stdout.on('data', (d) => this.onData(String(d)));
    p.on('exit', () => {
      // Закрылся, так и не запустившись, — скорее всего PowerShell заблокирован (антивирус, политика)
      if (!this.ready) this.fails = (this.fails || 0) + 1;
      this.proc = null;
      this.ready = false;
      for (const q of this.queue.splice(0)) q(this.blocked() ? 'BLOCKED' : 'FAILED');
    });
    p.on('error', () => {
      this.fails = (this.fails || 0) + 1;
      this.proc = null;
      this.ready = false;
      for (const q of this.queue.splice(0)) q(this.blocked() ? 'BLOCKED' : 'FAILED');
    });
  }

  onData(text) {
    this.buf += text;
    const lines = this.buf.split(/\r?\n/);
    this.buf = lines.pop();
    for (const l of lines.map((x) => x.trim()).filter(Boolean)) {
      if (l === 'READY') { this.ready = true; this.fails = 0; continue; }
      if (l === 'OUTSIDE') { this.emit('outside'); continue; } // не ответ на команду — событие
      const cb = this.queue.shift();
      if (cb) cb(l);
    }
  }

  // Отправить в чат игры то, что сейчас лежит в буфере обмена. → 'OK' | 'NOTGAME' | 'FAILED' | 'UNAVAILABLE'
  chat(timeoutMs = 3000) {
    return this.send('CHAT', timeoutMs);
  }

  // Нажать Enter в окне игры (вход персонажем с экрана выбора)
  enter(timeoutMs = 3000) {
    return this.send('ENTER', timeoutMs);
  }

  // Вставить буфер обмена в поле поиска открытого окна торговца
  paste(timeoutMs = 3000) {
    return this.send('PASTE', timeoutMs);
  }

  // Скопировать предмет под курсором (Ctrl+Alt+C). → 'OK' | 'NOTGAME' | 'FAILED' | 'UNAVAILABLE'
  copyItem(timeoutMs = 3000) {
    return this.send('COPY', timeoutMs);
  }

  // Следить за кликом мимо панели (прямоугольник в экранных пикселях) — придёт событие 'outside'
  watch(r) {
    this.fire(`WATCH ${Math.round(r.x)} ${Math.round(r.y)} ${Math.round(r.x + r.width)} ${Math.round(r.y + r.height)}`);
  }

  unwatch() {
    this.fire('UNWATCH');
  }

  // Вернуть фокус окну игры. → 'OK' | 'NOTGAME' | …
  focusGame(timeoutMs = 2000) {
    return this.send('FOCUS', timeoutMs);
  }

  // Команда без ответа
  fire(cmd) {
    if (!this.available() || this.blocked()) return;
    if (!this.proc) this.start();
    try { this.proc.stdin.write(`${cmd}\n`); } catch { /* процесс закрыт */ }
  }

  // Три запуска подряд закончились ничем — больше не пытаемся, пока программу не перезапустят
  blocked() {
    return (this.fails || 0) >= 3;
  }

  send(cmd, timeoutMs) {
    if (!this.available()) return Promise.resolve('UNAVAILABLE');
    if (this.blocked()) return Promise.resolve('BLOCKED');
    if (!this.proc) this.start();
    // Первый запуск PowerShell на медленном компьютере может занять несколько секунд
    const wait = this.ready ? timeoutMs : Math.max(timeoutMs, 10000);
    return new Promise((resolve) => {
      let done = false;
      const finish = (r) => { if (!done) { done = true; resolve(r); } };
      setTimeout(() => finish('FAILED'), wait);
      this.queue.push(finish);
      try { this.proc.stdin.write(`${cmd}\n`); } catch { finish('FAILED'); }
    });
  }

  stop() {
    try { this.proc?.stdin.end(); this.proc?.kill(); } catch { /* уже закрыт */ }
    this.proc = null;
  }
}

module.exports = { GameKeys, PS_SCRIPT };
