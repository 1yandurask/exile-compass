// Автообновление через GitHub Releases.
// Установщик: electron-updater тихо скачивает новую версию и ставит её при перезапуске.
// Portable-версия заменить себя не может — для неё только проверяем, вышла ли новая,
// и даём ссылку на страницу релиза.
'use strict';

const { withTimeout } = require('./store');

const { EventEmitter } = require('events');

const CHECK_EVERY = 4 * 3600_000;

// '1.2.10' > '1.2.9'
function newer(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map((x) => parseInt(x, 10) || 0);
  const pb = String(b).replace(/^v/, '').split('.').map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  }
  return false;
}

class Updater extends EventEmitter {
  /**
   * @param {object} o { version, owner, repo, portable, packaged, userAgent }
   */
  constructor(o) {
    super();
    this.o = o;
    // status: idle | checking | downloading | ready | available (portable) | none | error
    this.state = { status: 'idle', current: o.version, latest: null, percent: 0, url: null };
    this.auto = null;
    this.timer = null;
  }

  set(patch) {
    this.state = { ...this.state, ...patch };
    this.emit('state', this.state);
  }

  get releasesUrl() {
    return `https://github.com/${this.o.owner}/${this.o.repo}/releases/latest`;
  }

  start() {
    if (!this.o.packaged) return; // при запуске из исходников обновляться нечему
    if (!this.o.portable) this.setupAuto();
    this.check();
    this.timer = setInterval(() => this.check(), CHECK_EVERY);
  }

  stop() {
    clearInterval(this.timer);
  }

  setupAuto() {
    try {
      // eslint-disable-next-line global-require
      this.auto = require('electron-updater').autoUpdater;
    } catch {
      this.auto = null;
      return;
    }
    const au = this.auto;
    au.autoDownload = true;
    au.autoInstallOnAppQuit = true; // если не нажать «Restart», поставится при выходе
    au.on('checking-for-update', () => this.set({ status: 'checking' }));
    au.on('update-available', (info) => this.set({ status: 'downloading', latest: info.version, percent: 0 }));
    au.on('update-not-available', () => this.set({ status: 'none' }));
    au.on('download-progress', (p) => this.set({ status: 'downloading', percent: Math.round(p.percent || 0) }));
    au.on('update-downloaded', (info) => this.set({ status: 'ready', latest: info.version, percent: 100 }));
    au.on('error', () => this.set({ status: this.state.status === 'ready' ? 'ready' : 'error' }));
  }

  async check() {
    if (this.state.status === 'ready' || this.state.status === 'downloading') return;
    if (this.auto) {
      try { await this.auto.checkForUpdates(); } catch { this.set({ status: 'error' }); }
      return;
    }
    // Portable: смотрим последний релиз на GitHub
    try {
      this.set({ status: 'checking' });
      const res = await withTimeout((u, i) => fetch(u, i), 20000)(`https://api.github.com/repos/${this.o.owner}/${this.o.repo}/releases/latest`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': this.o.userAgent },
      });
      if (!res.ok) throw new Error(String(res.status));
      const rel = await res.json();
      const latest = String(rel.tag_name || '').replace(/^v/, '');
      if (latest && newer(latest, this.o.version)) {
        this.set({ status: 'available', latest, url: rel.html_url || this.releasesUrl });
      } else {
        this.set({ status: 'none', latest });
      }
    } catch {
      this.set({ status: 'error' });
    }
  }

  // Перезапуск с установкой скачанной версии.
  // Не «тихий» режим: в тихом установщик NSIS ставит обновление, но часто не запускает
  // программу заново. Обычный режим на пару секунд показывает окошко установки
  // и затем запускает новую версию (runAfterFinish в package.json).
  install() {
    if (this.state.status !== 'ready' || !this.auto) return false;
    this.auto.quitAndInstall(false, true);
    return true;
  }
}

module.exports = { Updater, newer };
