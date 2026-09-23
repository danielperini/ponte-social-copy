import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

async function files(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? files(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const sources = ['index.html', ...(await files('src'))];
const contents = await Promise.all(sources.map(f => readFile(f, 'utf8')));
const urls = [...new Set(contents.flatMap(s => s.match(/https:\/\/media\.base44\.com\/images\/public\/[^"'\s]+/g) || []))];
if (urls.length !== 10) throw new Error(`Expected original 10 images, found ${urls.length}. One-time migration only.`);
await mkdir('public/images', { recursive: true });
await mkdir('docs', { recursive: true });
const manifest = [];
for (const url of urls) {
  const response = await fetch(url);
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Invalid image: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const local = `/images/${new URL(url).pathname.split('/').pop()}`;
  await writeFile(`public${local}`, bytes);
  manifest.push({ source: url, local, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
// Only replace source references once every original has been safely copied.
for (let i = 0; i < sources.length; i++) {
  let content = contents[i];
  for (const asset of manifest) content = content.replaceAll(asset.source, sources[i] === 'index.html' ? `%VITE_SITE_ORIGIN%${asset.local}` : asset.local);
  if (content !== contents[i]) await writeFile(sources[i], content);
}
await writeFile('docs/media-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Copied and checksummed ${manifest.length} original images.`);
