# Instalação futura e controlada — NÃO executada nesta tarefa

Este pacote é para homologação separada. Não aponta DNS, não publica automaticamente,
não modifica o Base44 e não deve ser colocado sobre o site existente.

## Antes de qualquer instalação

1. Escolher no hPanel um site/domínio temporário **separado**, com HTTPS. Confirmar o
   document root exato e que não atende produção. Proteger homologação com senha no
   servidor (noindex não é controle de acesso). Não habilitar Git auto deploy.
2. Confirmar PHP 8.2+ e extensões curl/openssl/mbstring, permissões de sessões e saída
   HTTPS/SMTP. MySQL não é necessário para conteúdo estático e uma conta Google
   explicitamente autorizada. Cadastro aberto/múltiplas contas exigirão projeto próprio.
3. Configurar a variável pública de build `HOMOLOGATION_ORIGIN` no repositório da cópia
   com a origem HTTPS exata, sem barra final. O valor padrão `.invalid` impede tratar o
   pacote inicial como pronto para publicação. Canonical permanece o domínio original;
   imagens OG/JSON-LD usam a origem de build. Nunca usar variáveis `VITE_*` para segredos.
4. Gerar novo artefato manualmente em Actions, na branch de migração, depois de revisar
   o commit. O workflow também compila pushes dessa branch e PRs, **sem deploy**.
   Baixar `hostinger-staging-<SHA>`; dentro está `hostinger-staging.tar.gz`.
5. Guardar backup privado do destino separado antes de instalar, caso não esteja vazio.

## Conteúdo e comandos SSH (somente quando a instalação for autorizada)

O arquivo tar contém `public_html/` (Vite + imagens + front controller PHP),
`private/` (API e dependências Composer), `INSTALL.md` e `SHA256SUMS`.
Não enviar `src/`, Git, npm, testes, relatório ou configuração privada ao document root.
O diretório `private` deve ser irmão de `public_html`, nunca seu filho. O front controller
usa esse caminho fixo; adaptar e revisar se o hPanel tiver uma estrutura diferente.

Substituir os caminhos de exemplo **somente após conferir o document root no hPanel**.
Estes comandos não foram executados:

```sh
php -v
php -m
umask 077
mkdir -p "$HOME/ponte-staging-incoming"
cd "$HOME/ponte-staging-incoming"
# Enviar o tar para este diretório por SFTP/SCP, sem segredos.
tar -tzf hostinger-staging.tar.gz
mkdir release-COMMIT
tar -xzf hostinger-staging.tar.gz -C release-COMMIT
cd release-COMMIT
sha256sum -c SHA256SUMS
php -l private/app.php
php -l public_html/api/index.php

# Usar APENAS o site separado já criado e conferido no hPanel:
STAGING_ROOT="$HOME/domains/SEU-DOMINIO-TEMPORARIO"
realpath "$STAGING_ROOT"
test -d "$STAGING_ROOT/public_html" || exit 1
# Inspecionar manualmente: parar se corresponder à produção.
ls -la "$STAGING_ROOT/public_html"
# Para a primeira instalação, exigir destino vazio (ou mover o conteúdo para backup
# privado sob supervisão). Não sobrescrever silenciosamente uma instalação anterior.
test -z "$(ls -A "$STAGING_ROOT/public_html")" || exit 1
test ! -e "$STAGING_ROOT/private" || exit 1
cp -R private "$STAGING_ROOT/private"
cp -R public_html/. "$STAGING_ROOT/public_html/"
chmod 700 "$STAGING_ROOT/private"
cp "$STAGING_ROOT/private/config.example.php" "$STAGING_ROOT/private/config.php"
chmod 600 "$STAGING_ROOT/private/config.php"
mkdir -p "$STAGING_ROOT/private/var/sessions"
chmod 700 "$STAGING_ROOT/private/var" "$STAGING_ROOT/private/var/sessions"
# Editar localmente no servidor com editor seguro; nunca colar credenciais no chat.
nano "$STAGING_ROOT/private/config.php"
php -l "$STAGING_ROOT/private/config.php"
```

Não é necessário npm, Composer ou processo Node persistente no servidor: dependências
Composer de produção já vêm no pacote. Adaptar permissões à identidade PHP efetiva do
plano, sem usar 777. Arquivos públicos precisam ser legíveis pelo servidor web.

## Configuração privada e habilitação gradual

Em `private/config.php`: origem exata de homologação; `environment=staging`;
`allow_local_http=false`; gerar `rate_key` aleatória de pelo menos 32 caracteres.
Não versionar esse arquivo. O pacote não possui credenciais nem usuários reais.

SMTP: informar host/porta/TLS da caixa contratada, usuário, senha e remetente permitido.
Informar `staging_recipient` de propriedade do testador; em staging esse destino é
obrigatório e substitui o destinatário de operação. `mail_mode=smtp` só após revisar os
destinos. Em produção futura, usar `recipient` da equipe (atualmente o fluxo apontava
para comercial@pontesocialconsultoria.com.br). O navegador não escolhe destinatário,
assunto ou corpo. Sucesso significa aceitação SMTP, não confirmação de entrega.
O modo `test` funciona apenas com environment=test e localhost explicitamente permitido.

Google: criar cliente OAuth Web separado para homologação; configurar consentimento e
usuário de teste. Callback exato:
`https://SEU-DOMINIO-TEMPORARIO/api/index.php?action=google-callback`.
Guardar client ID/secret apenas no PHP privado. Informar `admin_email` autorizado,
reconciliar a identidade e preencher `admin_sub` assim que confirmado por meio seguro.
Não copiar senha, token nem chave API do Base44. Só então usar `enabled=true`.
O acesso é restrito a essa conta; não há cadastro automático. A conta dos painéis não
é migrada por associação: a identidade do site é validada diretamente no Google.
Tokens Google não são persistidos; cookie HttpOnly/Secure/SameSite=Lax; sessão expira
após 30 min sem atividade ou 8 h absolutas; logout destrói sessão. Configurar logs do
servidor para não registrar query strings do callback, cookies, corpos ou cabeçalhos de
autorização; isso requer validação no hPanel, fora do controle do PHP.

## Homologação que ainda precisa acontecer

- Navegação desktop/mobile, três idiomas, tema, escala, todas as seções, 12 artigos,
  404, reload de `/artigos/:slug` e `/conta/excluir`; comparar visual com produção.
- Verificar as dez imagens locais, OG/Twitter/JSON-LD e URLs absolutas da origem correta.
  Unsplash, fontes e links de terceiros permanecem externos. Confirmar direitos das imagens.
- Verificar `.htaccess` no Apache/LiteSpeed real: `/api/inexistente` e assets ausentes não
  podem retornar HTML da SPA; Git, private e dotfiles devem ser inacessíveis.
- Login Google permitido e negado, cancelamento, state expirado/reutilizado, troca de
  sessão, retorno seguro, expiração e logout. Validar cookies via HTTPS real.
- Enviar pedido **somente à caixa do próprio testador**, confirmar recepção e tratamento
  manual. Testar indisponibilidade SMTP, CSRF e limite (5 pedidos/IP/h, 100 globais/h).
  Não existe exclusão automática nem confirmação de propriedade do e-mail informado:
  a equipe deve verificar identidade e escopo antes de atuar, inclusive no Base44.
- Proteger e revisar retenção da caixa postal e sessões. Não criar backups públicos.
- Verificar artefato, backup/restauração e ausência de segredos no bundle e nos logs.

## Rollback

Enquanto não há instalação, rollback é abandonar o artefato/branch; produção permanece
no Base44. Para reverter código, criar commit de reversão na branch de migração, nunca
resetar ou forçar a main. Base de auditoria: `ee16efa5303d3707eeafce894c0868635f4dc5b7`.

Na homologação futura: bloquear tráfego do ambiente separado, guardar diagnóstico sem
dados pessoais, restaurar os arquivos públicos e privados do backup anterior juntos.
Preservar config privada compatível e invalidar sessões após mudança de versão de auth.
Se for primeira instalação, desativar somente o site temporário. Não há migração SQL
nem alteração de DNS a desfazer nesta entrega. Um eventual corte de produção exige
plano e autorização próprios, com retorno ao Base44 mantido até aprovação final.

Referências de implementação: [Google OAuth Web Server](https://developers.google.com/identity/protocols/oauth2/web-server),
[PHPMailer](https://github.com/PHPMailer/PHPMailer).
