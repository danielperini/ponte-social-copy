# Homologação instalada — 23/09/2026

Esta etapa foi autorizada posteriormente pelo proprietário: **somente homologação
separada**, preservando DNS/produção, a main e o repositório original.

Endereço: https://maroon-boar-726759.hostingersite.com/

## Atualização: Google configurado

Após a instalação inicial descrita abaixo, o proprietário criou um cliente OAuth Web
no projeto separado `ponte-social-homologacao` e disponibilizou o JSON localmente.
Projeto, tipo de cliente e callback foram validados. As credenciais foram transferidas
por SSH diretamente para a configuração privada, com backup privado e substituição
atômica; nenhum segredo foi incluído em código, Git ou frontend.

Google está agora habilitado na homologação. Foram testados o bootstrap público com
Google habilitado, redirecionamento HTTPS com client/callback corretos, state e PKCE,
rejeição de callback inválido e ausência de sessão autenticada sem login real.
**A entrada real e o logout com a conta autorizada ainda dependem do teste interativo
do proprietário.** A inclusão da conta entre os usuários de teste no Google também
precisa estar correta. SMTP permanece desativado por decisão do proprietário.

As menções a Google desativado nas seções seguintes registram o estado da instalação
inicial. Esta atualização não altera DNS, produção, proteção da homologação ou titularidade
do projeto Google anteriormente existente.

## Instalação e isolamento

- O painel informado pelo proprietário mostra **Business Web Hosting**. Via SSH foram
  confirmados PHP 8.3.33, curl, openssl e mbstring. A premissa inicial de Premium foi
  substituída pela configuração efetivamente disponível, sem upgrade ou contratação.
- A URL temporária foi conciliada com o document root por arquivo de prova descartável,
  removido após verificação HTTPS. O destino continha somente `default.php`.
- O domínio principal e www apontavam para outro IP antes da instalação. Nenhum registro
  DNS foi alterado. Não foram usados comandos de deploy ou APIs do Base44.
- Instalado código do commit `1a125f3`, recompilado com a origem temporária correta;
  dependências Composer de produção e hashes do pacote verificados no servidor.
- `public_html` contém apenas estáticos, imagens, `.htaccess` e front controller PHP.
  Código servidor, configuração e sessões ficam no diretório irmão `private`.
- A senha de homologação é independente do Google/Hostinger. Foi gerada localmente,
  com hash bcrypt no servidor e arquivo de acesso fora do Git. Nenhum valor foi escrito
  no relatório, no chat ou no artefato de distribuição.
- Overlay de homologação no `.htaccess`: Basic Auth, `AuthUserFile` no diretório privado,
  `Require valid-user`, restrição de Host ao endereço temporário e `X-Robots-Tag: noindex`.
  Esse overlay deve ser preservado em qualquer substituição futura de arquivos.
- LiteSpeed precisou de permissão de travessia `711` no diretório `private` e leitura
  `644` somente no arquivo de **hash** `.htpasswd`. Configuração e demais arquivos
  privados continuam `600`, subdiretórios privados `700`; públicos `644`/`755`.
- Google e SMTP estão **desativados**. A allowlist de administrador informada pelo
  proprietário foi preenchida somente na configuração privada. Nenhum dado Base44
  foi exportado ou alterado e não foi criado banco MySQL.

## Testes executados na Hostinger

- HTTPS: acesso sem senha retorna 401; acesso autorizado retorna o frontend e noindex.
- URLs profundas Home, `/conta/excluir`, `/login` e artigo: fallback SPA responde.
- As dez imagens locais responderam com status 200 e tipo de conteúdo de imagem.
- Asset e endpoint inexistentes retornam 404; caminhos de config privada e Git são negados.
- API PHP: bootstrap de sessão anônima; cookie Secure, HttpOnly, SameSite=Lax; me sem
  sessão autenticada retorna 401; Google desativado retorna 503.
- Pedido de exclusão com CSRF inválido ou origem diferente retorna 403; pedido sintético
  válido retorna 503 porque SMTP permanece desativado. Nenhum e-mail foi enviado.
- Navegador isolado com senha de homologação: Home, exclusão, login Google desativado e
  um artigo real renderizados; viewport de 390 px sem overflow horizontal; nenhum erro
  JavaScript ou pedido Base44. Recursos externos foram bloqueados nessa inspeção visual.

## Próximas etapas que dependem do proprietário

1. Criar cliente Google OAuth Web para esta homologação, configurar público/conta de
   teste e callback exato:
   `https://maroon-boar-726759.hostingersite.com/api/index.php?action=google-callback`.
2. Preencher Client ID e Client Secret diretamente na configuração privada; conferir a
   identidade autorizada e o subject Google. Ativar e testar login permitido/negado,
   cancelamento, expiração e logout. Não houve login Google real nesta etapa.
3. Confirmar caixa SMTP existente, remetente e destinatário de teste pertencente ao
   proprietário. Preencher credenciais privadamente e realizar envio controlado.
   Transporte SMTP real e entrega ainda não foram testados.
4. Conferir fontes/Unsplash, idiomas, visual completo, logs do provedor sem dados
   sensíveis e política de retenção. Backup da página padrão foi criado; restauração
   ainda não foi exercitada. Não há autorização de publicação em produção.

## Backup e rollback desta instalação

O backup inicial fica fora do document root em
`$HOME/ponte-staging/backups/initial-20260923/public_html`.
O pacote e checksums ficam em `$HOME/ponte-staging/releases/1a125f3-20260923`.

Para rollback futuro autorizado, verificar primeiro os caminhos reais; desativar apenas
o acesso ao ambiente temporário, preservar a instalação atual em outra pasta privada
e restaurar a pasta pública do backup. Manter ou reaplicar a proteção de homologação,
caso o endereço deva continuar restrito. Não alterar DNS ou dados do Base44. Guardar
configuração privada separadamente; nunca enviar backup com credenciais para o Git.

Os documentos `MIGRATION_AUDIT.md` e `MIGRATION_STATUS.md` descrevem etapas anteriores.
Este relatório registra o que mudou após a autorização de instalação.
