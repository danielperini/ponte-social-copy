import { mkdir, cp, copyFile, access, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Refuse overwrites: don't risk replacing a private configuration or a prior release.
try { await access('release'); throw new Error('release/ already exists; choose a fresh checkout to package again.'); }
catch (e) { if (e.code !== 'ENOENT') throw e; }
await access('server/vendor/autoload.php');
await access('dist/index.html');
await mkdir('release/private', { recursive: true });
await cp('dist', 'release/public_html', { recursive: true });
for (const f of ['app.php', 'config.example.php']) await copyFile(`server/${f}`, `release/private/${f}`);
await cp('server/vendor', 'release/private/vendor', { recursive: true });
await copyFile('docs/HOSTINGER_RUNBOOK.md', 'release/INSTALL.md');
async function walk(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const checksums = [];
for (const file of await walk('release')) checksums.push(`${createHash('sha256').update(await readFile(file)).digest('hex')}  ${path.relative('release', file).replaceAll('\\', '/')}`);
await writeFile('release/SHA256SUMS', checksums.join('\n') + '\n');
console.log('Prepared public_html/ + private/; configuration and source repository excluded.');
