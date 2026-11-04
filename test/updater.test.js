'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Updater, newer } = require('../src/updater');

test('сравнение версий', () => {
  assert.equal(newer('1.0.2', '1.0.1'), true);
  assert.equal(newer('1.0.10', '1.0.9'), true);
  assert.equal(newer('v1.1.0', '1.0.9'), true);
  assert.equal(newer('1.0.1', '1.0.1'), false);
  assert.equal(newer('1.0.0', '1.0.1'), false);
});

test('portable: находит новую версию на GitHub и даёт ссылку', async () => {
  const real = global.fetch;
  let asked = '';
  global.fetch = async (url) => { asked = url; return Response.json({ tag_name: 'v1.0.3', html_url: 'https://github.com/x/y/releases/tag/v1.0.3' }); };
  try {
    const u = new Updater({ version: '1.0.1', owner: 'x', repo: 'y', portable: true, packaged: true, userAgent: 't' });
    await u.check();
    assert.equal(asked, 'https://api.github.com/repos/x/y/releases/latest');
    assert.equal(u.state.status, 'available');
    assert.equal(u.state.latest, '1.0.3');
    assert.match(u.state.url, /v1\.0\.3/);
    global.fetch = async () => Response.json({ tag_name: 'v1.0.1' });
    await u.check();
    assert.equal(u.state.status, 'none');
    global.fetch = async () => new Response('', { status: 500 });
    await u.check();
    assert.equal(u.state.status, 'error', 'сбой сети не роняет программу');
  } finally {
    global.fetch = real;
  }
});

test('из исходников обновление не запускается', () => {
  const u = new Updater({ version: '1.0.1', owner: 'x', repo: 'y', portable: false, packaged: false });
  u.start();
  assert.equal(u.state.status, 'idle');
  u.stop();
});

test('перезапуск с обновлением: обычный режим установщика с запуском после установки', () => {
  const calls = [];
  const u = new Updater({ version: '1.0.6', owner: 'x', repo: 'y', portable: false, packaged: true, userAgent: 't' });
  u.auto = { quitAndInstall: (...a) => calls.push(a) };
  assert.equal(u.install(), false, 'пока не скачано — ничего');
  u.set({ status: 'ready', latest: '1.0.7' });
  assert.equal(u.install(), true);
  assert.deepEqual(calls, [[false, true]], 'не тихий режим (isSilent=false), запустить после (forceRunAfter=true)');
});
