// Run only for an explicitly authorized production release, after the Vite build.
import { readFile, writeFile } from 'node:fs/promises';
const origin = 'https://www.pontesocialconsultoria.com.br';
const html = await readFile('dist/index.html', 'utf8');
if (!html.includes(`${origin}/images/`) || html.includes('homologacao.example.invalid')) {
  throw new Error(`Rebuild with VITE_SITE_ORIGIN=${origin} before preparing production.`);
}
await writeFile('dist/.htaccess', `Options -Indexes -MultiViews
DirectoryIndex index.html
SetEnvIf Host "^maroon-boar-726759\\.hostingersite\\.com$" STAGING_HOST
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Robots-Tag "noindex, nofollow" env=STAGING_HOST
</IfModule>
RewriteEngine On
RewriteCond %{HTTP_HOST} !^(www\\.)?pontesocialconsultoria\\.com\\.br$ [NC]
RewriteCond %{HTTP_HOST} !^maroon-boar-726759\\.hostingersite\\.com$ [NC]
RewriteRule ^ - [F,L]
# Allow certificate issuance before redirecting HTTP to HTTPS.
RewriteRule ^\\.well-known/acme-challenge/[a-zA-Z0-9_-]+$ - [L]
RewriteCond %{HTTP_HOST} ^pontesocialconsultoria\\.com\\.br$ [NC]
RewriteRule ^ https://www.pontesocialconsultoria.com.br%{REQUEST_URI} [R=301,L,NE]
RewriteCond %{HTTP_HOST} ^www\\.pontesocialconsultoria\\.com\\.br$ [NC]
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://www.pontesocialconsultoria.com.br%{REQUEST_URI} [R=301,L,NE]
RewriteRule ^(?:private|server|src|base44|vendor|\\.git)(?:/|$) - [F,L]
RewriteRule (^|/)\\. - [F,L]
RewriteRule ^api/ - [L]
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule \\.[a-zA-Z0-9]+$ - [R=404,L]
RewriteRule ^ index.html [L]
`);
console.log('Prepared public production routing; temporary hostname stays noindex. No files uploaded.');
