# Ponte Social — cópia independente em preparação

Branch de trabalho: `migration/hostinger-premium`, somente no repositório
`danielperini/ponte-social-copy`. Produção continua no Base44. Não fazer deploy,
alterar DNS, habilitar auto deploy ou modificar a main sem uma tarefa autorizada.

Leia `MIGRATION_AUDIT.md` (auditoria histórica), `docs/MIGRATION_STATUS.md`
(implementação e limites atuais) e `docs/HOSTINGER_RUNBOOK.md` (passos futuros).

## Build local

Node da `.nvmrc` (24.19.0), npm e PHP 8.2+ com Composer:

```sh
npm ci --no-audit --no-fund
composer install --working-dir=server --no-dev --prefer-dist --classmap-authoritative
# Variável pública, sem barra final; nunca colocar credenciais VITE_*:
export VITE_SITE_ORIGIN=https://SEU-DOMINIO-TEMPORARIO
npm run build
npm run check:migration
node scripts/test-endpoints.mjs
npm run package:hostinger
```

No PowerShell, definir a variável com `$env:VITE_SITE_ORIGIN='https://...'`.
`PHP_BINARY` pode indicar o executável PHP fora do PATH. O teste cria ambiente
local temporário e não envia e-mails nem autentica em serviços reais.

`release/` deve não existir antes do empacotamento. O pacote contém apenas
`public_html/`, `private/`, instruções e checksums, sem config privada. Não copiar
o repositório para public_html. O workflow somente produz artefatos; a instalação
é manual e está fora desta tarefa. `.htaccess` inclui noindex de homologação.

`npm run dev` serve o frontend; `/api` é encaminhada a localhost:8080, que precisa
servir o PHP numa estrutura com private fora do document root. Sem API, a navegação
pública continua disponível, mas conta/e-mail não simulam sucesso.

Os dez binários originais estão em public/images, com inventário SHA-256 em
`docs/media-manifest.json`. `scripts/migrate-assets.mjs` registra a importação
única e não deve ser executado novamente sobre referências já migradas.
