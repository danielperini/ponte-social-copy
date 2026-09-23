# Corte para o domínio definitivo — 23/09/2026

## Autorização e estado

O proprietário autorizou posteriormente concluir a migração no domínio definitivo,
com site público sem login obrigatório e independente do Base44, exceto os links do
Scambio. Também escolheu explicitamente abrir o aplicativo de e-mail do visitante
para pedidos em `/conta/excluir`, sem SMTP/envio automático.

**Migração pública validada em 23/09/2026: DNS na Hostinger e HTTPS válido nos dois hosts, sem login obrigatório.**

## Alterações finais

- `/conta/excluir` mantém interface, confirmação e três idiomas. Prepara um `mailto`
  para o contato já existente, com assunto/corpo codificados, sem API de envio. O texto
  explica que o visitante precisa revisar/enviar e que nada foi enviado ou excluído
  automaticamente. Há link para reabrir a mensagem e destinatário visível como alternativa.
- Código de SMTP foi preservado no servidor, mas continua desativado e fora desse fluxo.
  Não houve teste ou envio real de e-mail. A entrega depende do aplicativo/caixa do
  visitante e da caixa destinatária; registros DNS preservados não comprovam entrega.
- Build final usa `VITE_SITE_ORIGIN=https://www.pontesocialconsultoria.com.br`.
- `scripts/prepare-production.mjs`, executado após o build, prepara `.htaccess` público:
  sem Basic Auth; domínio raiz redireciona para www; HTTPS no domínio definitivo;
  hostname temporário continua permitido e noindex; caminhos privados são negados;
  ACME pode validar certificados; API/assets ficam fora do fallback SPA.
- A configuração privada mantém o Google opcional apenas no hostname temporário.
  Para os hosts definitivos, origem/ambiente são de produção e Google fica desativado,
  pois não foi cadastrado callback de produção e o site não exige login. A conta
  administrativa autorizada e as credenciais existentes foram preservadas privadamente.
- Google na homologação foi testado com sucesso pelo proprietário, conforme relato.
  Nenhum conteúdo editorial, CSS de layout ou artigo foi reescrito.

## DNS verificado após a alteração pelo proprietário

Os servidores de nomes permanecem `a.sec.dns.br` e `b.sec.dns.br`.

| Registro | Valor anterior | Valor novo |
| --- | --- | --- |
| A `pontesocialconsultoria.com.br` | `179.197.232.253` | `89.117.7.182` |
| A `www.pontesocialconsultoria.com.br` | `179.197.232.253` | `89.117.7.182` |

Os dois novos A foram confirmados por consulta ao DNS autoritativo. O IP novo também
foi confirmado pelo `SERVER_ADDR` da própria hospedagem, e não apenas pelo acesso SSH.
TTL publicado: 3600 s. Caches de clientes podem continuar usando o destino anterior.

Preservados e conferidos: MX 10 `mx.zoho.com`, MX 20 `mx2.zoho.com`, MX 50
`mx3.zoho.com`, SPF `v=spf1 include:zohomail.com ~all`, verificação Zoho e a chave DKIM
em `zmail._domainkey`. Não foram alterados contatos, titularidade ou provedor de serviços.

## Validação executada e pendente

- Build final e checagem de dependências/rotas/imagens aprovados; lint pontual aprovado.
- Verificado que o `mailto` mantém destinatário fixo, codifica corretamente assunto/corpo
  e rejeita quebra de linha no e-mail. Nenhum aplicativo externo foi usado para enviar.
- No endereço temporário real: páginas abrem sem senha, confirmação do pedido por e-mail
  renderiza em mobile, nenhuma chamada de envio ou Base44 é disparada na preparação.
- No IP web real: HTTP do domínio raiz redireciona para a URL www correspondente.
- Após ativação do SSL, HTTPS sem ignorar certificados confirmou raiz → www com 301
  e www com 200, inclusive na rota de exclusão. Home, login e exclusão responderam.
- Metadados finais usam a origem correta; produção não possui noindex de homologação.
  Sessão pública indica Google desativado; me anônimo retorna 401 e caminhos privados
  ou API inexistente retornam 403/404.
- Edge headless mobile confirmou home, artigo por URL direta e exclusão, sem erros JS
  nem chamadas Base44. Exclusão sem overflow. Um seletor inicial de artigos na home
  expirou: a home original não inclui Articles. O teste corrigido acessou a rota diretamente.
- DNS público confirmou ambos os A e MX/SPF/verificação/DKIM Zoho preservados.
  Nenhum envio real ou teste de entrega de e-mail foi realizado.
- GitHub Actions aprovou o código 9084014: https://github.com/danielperini/ponte-social-copy/actions/runs/35907895601

## Dependências Base44 verificadas no site publicado

- package.json e lock sem SDK/plugin Base44; Vite usa plugin React e alias local.
- JavaScript e CSS baixados do domínio final possuem somente duas referências Base44:
  links externos https://scambioia.base44.app, preservados por decisão do proprietário.
- Nenhum SDK, media.base44.com, token Base44 ou endpoint /api/apps/ no bundle publicado.
  As dez imagens migradas são locais. PHP atende a API da própria hospedagem.
- OAuthConsent.jsx preserva chamadas MCP antigas no código-fonte, mas a tela não tem
  rota e mcpEnabled é falso; essas chamadas não estão no bundle publicado. Não é um
  fluxo migrado ou habilitado. Telas legadas de cadastro/OTP/recuperação permanecem
  preservadas e indisponíveis, sem fallback ao Base44.
- Arquivos base44/, relatórios históricos, manifesto de imagens e script de migração
  retêm referências de origem no repositório; não são dependências do site instalado.
- A integração externa Scambio continua dependente do serviço de destino ao clicar.
  O Base44 original não foi desligado. OAuth definitivo segue desativado por opção;
  SMTP não é necessário ao pedido manual via aplicativo de e-mail escolhido.

## Reprodução e rollback

Em um checkout limpo, com dependências já instaladas:

```sh
VITE_SITE_ORIGIN=https://www.pontesocialconsultoria.com.br npm run build
npm run check:migration
node scripts/prepare-production.mjs
npm run package:hostinger
```

O workflow padrão continua gerando homologação e não faz deploy. O pacote de produção
exige a etapa explícita acima; não publicar um artefato padrão por engano. Configurações
privadas não são incluídas no pacote.

Instalação pública preparada em `$HOME/ponte-staging/releases/public-ready-20260923`.
Antes da substituição foram guardados os arquivos públicos e a configuração privada em
`$HOME/ponte-staging/backups/pre-public-20260923`, fora da raiz web.

Rollback DNS: restaurar **apenas os dois A** para `179.197.232.253`, sem modificar os
registros Zoho. Rollback de arquivos: após validar caminhos, preservar a versão atual
privadamente e restaurar public_html/config.php do backup correspondente. O backup
anterior é a homologação protegida; ele não substitui o retorno DNS à produção anterior.
O Base44 não foi desligado e o repositório original não foi modificado.

## Correção de rolagem — 23/09/2026

Relato do proprietário reproduzido no domínio publicado: rodinha deixava scrollY em
zero nas larguras 1440 e 900. overflow-x:hidden em html/body criava um contêiner de
rolagem no body; com overscroll-behavior:none a rolagem não chegava ao documento.
Alterado para overflow-x:clip, mantendo corte horizontal sem esse contêiner.
Build e check:migration passaram. Após instalar os assets e substituir index.html,
Edge headless confirmou scrollY=900 com a rodinha nas duas larguras.
Backup: $HOME/ponte-staging/backups/pre-wheel-fix-20260923/index.html.
Assets anteriores foram mantidos; rollback consiste em restaurar esse index.html.
Não houve alteração de DNS, configuração privada ou layout nesta correção.

## Ajuste de toque Android — 23/09/2026

Proprietário relata toque travado em Android inclusive em aba anônima. O problema não
foi reproduzido em Edge com emulação móvel: gesto CDP já deslocava scrollY para 435.
Como ajuste de compatibilidade, removida a supressão global de overscroll vertical e
explicitamente permitidos pan-y e pinch-zoom em html/body. Build aprovado; alteração
publicada com backup do index em pre-touch-scroll-20260923 (mesma pasta de backups).
Validação física no aparelho afetado ainda depende do proprietário; não declarar
resolução confirmada apenas pelo teste emulado.

## Verificação WebKit e menu móvel — 23/09/2026

WebKit 26.5 no Windows, emulação iPhone 13 (390 px, toque), abriu o domínio real.
Detectado que o painel do menu cobria o botão de fechar e interceptava seu toque.
Corrigido o empilhamento da barra superior com relative z-50. Após publicação,
testes aprovaram abrir/fechar via toque, liberação do bloqueio do body, rolagem
programática, ausência de erros JS e ausência de overflow horizontal.
Isso não é teste de gesto físico em iPhone/iOS: essa validação permanece não executada.
Backup de index: $HOME/ponte-staging/backups/pre-mobile-menu-20260923/index.html;
assets anteriores mantidos para rollback. Build aprovado; sem alteração de DNS/config.
