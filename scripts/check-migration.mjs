import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const read = p => readFile(p, 'utf8');
const manifest = JSON.parse(await read('docs/media-manifest.json'));
assert.equal(manifest.length, 10);
for (const asset of manifest) {
  const data = await readFile(`public${asset.local}`);
  assert.equal(createHash('sha256').update(data).digest('hex'), asset.sha256);
}
const app = await read('src/App.jsx');
for (const route of ['/', '/artigos/:slug', '/conta/excluir', '*']) assert(app.includes(`path="${route}"`));
for (const screen of ['Login', 'Register', 'ForgotPassword', 'ResetPassword', 'OAuthConsent']) await read(`src/pages/${screen}.jsx`);
assert((await read('src/components/ponte/Constructions.jsx')).includes('items-start hidden'));
const articles = (await readdir('src/components/ponte/articles')).filter(f => /^a\d+\.js$/.test(f));
assert.equal(articles.length, 12);
const pkg = JSON.parse(await read('package.json'));
assert(!Object.keys(pkg.dependencies).some(k => k.startsWith('@base44/')));
for (const file of ['src/api/siteClient.js', 'src/lib/AuthContext.jsx', 'src/lib/PageNotFound.jsx', 'src/pages/AccountDeletion.jsx', 'vite.config.js']) {
  assert(!/base44|SendEmail/.test(await read(file)), `Platform call in migrated file: ${file}`);
}
assert(!(await read('index.html')).includes('media.base44.com'));
const dist = await read('dist/index.html');
assert(!dist.includes('%VITE_'));
for (const file of await readdir('dist/assets')) {
  if (!file.endsWith('.js')) continue;
  const js = await read(`dist/assets/${file}`);
  assert(!/media\.base44\.com|\/api\/apps\/|base44_access_token|@base44\/sdk/.test(js), `Platform runtime in ${file}`);
}
console.log('Verified routes, 12 articles, preserved dormant screens, hidden form, 10 image hashes and no platform API/media in build. External Scambio links retained.');
