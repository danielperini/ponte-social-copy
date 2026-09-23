// Focused local HTTP checks. Never connects to Google or sends SMTP messages.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, copyFile, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const root = await mkdtemp(join(tmpdir(), 'ponte-endpoints-'));
await mkdir(join(root, 'public_html/api'), { recursive: true });
await mkdir(join(root, 'private'));
await copyFile('server/app.php', join(root, 'private/app.php'));
await cp('public/api', join(root, 'public_html/api'), { recursive: true });
const config = await readFile('server/config.example.php', 'utf8');
const configure = async (mode, google = false) => writeFile(join(root, 'private/config.php'), config
  .replace("'https://homologacao.example.invalid'", "'http://127.0.0.1:8080'")
  .replace("'environment' => 'staging'", "'environment' => 'test'")
  .replace("'allow_local_http' => false", "'allow_local_http' => true")
  .replace("'rate_key' => ''", "'rate_key' => 'synthetic-test-key-with-at-least-32-characters'")
  .replace("'mail_mode' => 'disabled'", `'mail_mode' => '${mode}'`)
  .replace("'enabled' => false, 'client_id' => '', 'client_secret' => ''", `'enabled' => ${google}, 'client_id' => 'fake-id', 'client_secret' => 'fake-secret'`)
  .replace("'admin_email' => ''", "'admin_email' => 'admin@example.invalid'"));
await configure('disabled');
const php = spawn(process.env.PHP_BINARY || 'php', ['-S', '127.0.0.1:8080', '-t', join(root, 'public_html')], { stdio: 'ignore' });
let startupError;
php.on('error', e => { startupError = e; });
let cookie = '', csrf = '';
const origin = 'http://127.0.0.1:8080';
async function call(action, options = {}) {
  const res = await fetch(`${origin}/api/index.php?action=${action}`, { redirect: 'manual', ...options,
    headers: { Cookie: cookie, ...options.headers } });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  return res;
}
const post = (action, body, headers = {}) => call(action, { method: 'POST', headers: {
  Origin: origin, 'Content-Type': 'application/json', 'X-CSRF-Token': csrf, ...headers,
}, body: JSON.stringify(body) });
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    if (startupError) throw startupError;
    if (php.exitCode !== null) throw new Error('PHP server failed to start; port may be occupied.');
    try { const res = await call('session'); if (res.status === 200) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  assert(ready, 'PHP did not become ready');
  const session = await call('session');
  const data = await session.json(); csrf = data.csrf;
  assert.equal(data.user, null); assert.equal(data.settings.google_enabled, false);
  assert.match(session.headers.get('cache-control'), /no-store/);
  assert.equal((await call('me')).status, 401);
  assert.equal((await call('me', { headers: { Authorization: 'Bearer forged', Cookie: cookie + '; role=admin' } })).status, 401);
  assert.equal((await call('deletion')).status, 405);
  assert.equal((await call('unknown')).status, 404);
  assert.equal((await call('google-start')).status, 503);
  assert.equal((await post('deletion', { email: 'test@example.invalid', confirmed: true }, { 'X-CSRF-Token': '' })).status, 403);
  assert.equal((await post('deletion', { email: 'test@example.invalid', confirmed: true }, { Origin: 'https://evil.invalid' })).status, 403);
  assert.equal((await post('deletion', { email: 'bad\r\nBcc:other@example.invalid', confirmed: true })).status, 422);
  assert.equal((await post('deletion', { email: 'test@example.invalid', confirmed: false })).status, 422);
  assert.equal((await post('deletion', { email: 'test@example.invalid', confirmed: true })).status, 503);
  assert.equal((await post('contact', {})).status, 404);
  await configure('test', true);
  const start = await call('google-start&returnTo=https://evil.invalid');
  assert.equal(start.status, 302);
  const google = new URL(start.headers.get('location'));
  assert.equal(google.origin, 'https://accounts.google.com');
  assert.equal(google.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(google.searchParams.get('state').length, 64);
  assert.equal((await call('google-callback&state=wrong&code=fake')).status, 400);
  assert.equal((await call('google-callback&state=' + google.searchParams.get('state') + '&code=fake')).status, 400);
  for (let i = 0; i < 4; i++) assert.equal((await post('deletion', { email: 'test@example.invalid', confirmed: true })).status, 202);
  cookie = ''; csrf = (await (await call('session')).json()).csrf;
  assert.equal((await post('deletion', { email: 'test@example.invalid', confirmed: true })).status, 429);
  assert.equal((await readFile(join(root, 'private/var/test-mail-count'), 'utf8')).trim().split('\n').length, 4);
  assert.equal((await post('logout', {})).status, 200);
  assert.equal((await call('me')).status, 401);
  console.log('PASS: anonymous session, forged auth, method/origin/CSRF/validation, disabled SMTP/Google, PKCE/state/replay, local fake mail, rate limit across sessions, logout. No external authentication or SMTP performed.');
} finally {
  if (php.exitCode === null && php.pid) { const closed = once(php, 'exit'); php.kill(); await closed; }
  await rm(root, { recursive: true, force: true }); // Only the mkdtemp directory created above.
}
