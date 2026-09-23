# Corte para o domínio definitivo — 23/09/2026

## Autorização e estado

O proprietário autorizou posteriormente concluir a migração no domínio definitivo,
com site público sem login obrigatório e independente do Base44, exceto os links do
Scambio. Também escolheu explicitamente abrir o aplicativo de e-mail do visitante
para pedidos em `/conta/excluir`, sem SMTP/envio automático.

**DNS atualizado; HTTPS do domínio definitivo ainda pendente de ativação/validação
na Hostinger. A migração não deve ser declarada concluída enquanto essa verificação
não passar.**

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
- O proxy de prévia da Hostinger reescreve URLs do domínio no HTML servido pelo endereço
  temporário. Por isso as URLs finais de SEO devem ser validadas no domínio definitivo,
  quando HTTPS estiver disponível; o build contém a origem final correta.
- TLS direto para raiz/www ainda retornou erro de handshake (`EPROTO` / alerta TLS 80)
  após a mudança DNS. É necessário ativar/aguardar o SSL gratuito no hPanel e testar os
  dois hosts, redirects, assets, API e URLs profundas no endereço definitivo.

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
