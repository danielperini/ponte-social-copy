# Estado da implementação — 23/09/2026

Preparação da cópia `danielperini/ponte-social-copy`, branch
`migration/hostinger-premium`, a partir de `ee16efa`. Nenhum deploy, DNS, publicação,
alteração na main ou no repositório original foi executado. `MIGRATION_AUDIT.md`
permanece intacto como relatório da situação anterior, não como descrição atual.

## Decisão sobre identidade

Na conversa, o proprietário corrigiu a resposta inicial e informou login Google nos
painéis Hostinger/Base44/GitHub, nenhum login ainda no próprio site e intenção de usar
Google nesse acesso futuro. Isso não comprova autenticação do site em produção, nem
transforma a chave API ou senha nula do inventário em método de acesso.

Foi preparado `/login` com Google **desativado por padrão**, sem login por senha novo.
Uma conta administradora será autorizada explicitamente em configuração privada.
Sem credenciais e reconciliação dessa identidade, o acesso continua indisponível.
Não existe painel administrativo novo nem vínculo automático com a conta do Builder.

## Arquivos e serviços substituídos

| Grupo | Mudança |
| --- | --- |
| `src/api/siteClient.js`, `src/lib/AuthContext.jsx`, `PageNotFound.jsx`, `app-params.js` | Cliente same-origin, configurações públicas mínimas, sessão PHP, retirada de tokens Base44/localStorage e bootstrap remoto. Home não depende de autenticação disponível. |
| `server/app.php`, `server/config.example.php`, Composer, `public/api/index.php` | Sessões privadas, me/logout, Google OAuth com state de uso único e PKCE, identidade por UserInfo HTTPS e allowlist no servidor; endpoint manual de exclusão via PHPMailer/SMTP. |
| `src/pages/AccountDeletion.jsx` | Envia apenas e-mail informado e confirmação; destinatário/assunto/corpo definidos no servidor; sucesso só após aceitação do transporte. Nenhuma exclusão de dados automática. |
| `src/pages/GoogleLogin.jsx`, `src/App.jsx` | Rota adicional `/login` para o acesso futuro pedido pelo proprietário, mantendo estilo AuthLayout; todas as rotas anteriores preservadas. |
| Login/Register/ForgotPassword/ResetPassword legados | Arquivos e interfaces mantidos, ainda sem rotas, com adaptador que rejeita fluxos não habilitados. Cadastro/OTP/senha/reset não foram implementados como novos serviços porque seu uso não foi demonstrado. Não são funcionalidade homologada. |
| `OAuthConsent.jsx` | Tela e protocolo legado preservados, sem rota; trava local antes de qualquer requisição. MCP continua sem servidor/configuração e não pode ser habilitado apenas trocando uma flag. |
| `Constructions.jsx` | Formulário comercial segue oculto; endpoint próprio rejeita acionamento. Sem envio para produção por código escondido. Habilitá-lo exigirá implementação e teste próprios. |
| `public/images`, `docs/media-manifest.json`, Hero/Logo/Partners/Solutions/Seo/index.html | Dez binários públicos copiados sem recompressão (13.581.183 bytes), origem, tamanho e SHA-256 registrados; referências locais, metadados absolutos da origem de build. Direitos de uso ainda precisam de conferência do proprietário. |
| Helpers de imagem | Retirados domínio de transformação Base44 e eventos/atributos exclusivos do editor; renderização de imagens locais preservada. |
| package/lock, Vite, `.nvmrc`, `.npmrc` | SDK e plugin removidos; alias `@` explícito; Node 24.19.0; lock atualizado; sem backend Node no servidor. Removida exceção de instalação do escopo Base44. |
| `.github/workflows/build-hostinger.yml`, scripts, `.htaccess` | Build/checagens e artefato tar para instalação manual. Nenhuma credencial ou etapa de deploy. Fallback SPA separado de API/assets, diretório privado fora da raiz e noindex de homologação. |
| README/AGENTS/runbook | Operação independente e limites de publicação documentados, sem instruções de deploy Base44. |

Os 12 artigos, traduções, conteúdo da Home e CSS não foram alterados. Não houve
exportação de dados pessoais. MySQL não foi introduzido: conteúdo é estático e a única
identidade prevista usa Google com allowlist privada. Sessões e contadores antiabuso
ficam em arquivos privados; e-mails ficam na caixa operacional configurada.

## Validação efetivamente realizada

- `npm ci` com Node 24.19.0/npm 11.6.0: instalação a partir do lock concluída.
- Composer install a partir do lock: PHPMailer 7.1.1 e autoload de produção; PHP 8.4.26
  local. CI foi configurada para PHP 8.2; não confundir configuração com execução local.
- Build Vite 8.2.0 concluído. Foi repetido uma vez após a checagem detectar domínio
  Base44 residual no helper de imagens; segunda checagem aprovada. Avisos: bundle
  principal acima de 500 kB, caniuse-lite antigo e npm sem suporte à opção herdada
  `min-release-age`. Não foi feita atualização geral de dependências.
- Lint geral encontrou um import React não usado em Seo; corrigido e checagem pontual
  desse arquivo aprovada. Nenhuma suíte extensa adicionada.
- `check:migration`: rotas originais, 12 artigos, telas preservadas, formulário oculto,
  dez hashes e ausência de API/mídia Base44 no bundle aprovados.
- PHP syntax check e `scripts/test-endpoints.mjs`: sessão anônima, credencial forjada,
  me/logout, método inválido, endpoint ausente, origem/CSRF, validação de e-mail e
  confirmação, SMTP/Google desabilitados, início OAuth com PKCE, state incorreto e
  reutilizado, quatro mensagens em transporte falso local e limite entre sessões.
  Nenhuma autenticação Google real e nenhum envio SMTP foram realizados.
- Smoke em Edge headless local: Home, exclusão, login, 404 e os 12 artigos por URL
  direta; nenhum erro JS ou requisição Base44; formulário comercial invisível; ausência
  de overflow horizontal em 390 px; dez imagens decodificadas. API foi deliberadamente
  indisponibilizada para verificar navegação pública. Recursos externos foram bloqueados.
  Capturas locais desktop/mobile inspecionadas; isso não substitui comparação visual
  completa com produção nem teste de fontes/Unsplash reais.
- Revisão do diff e varredura de padrões de credenciais realizada antes do commit.
  Configuração preenchida, dependências, release e dados de teste ficam fora do Git.

## Dependências restantes e impedimentos à publicação

1. Links externos para `scambioia.base44.app` mantidos; o outro produto não foi migrado.
2. Código MCP legado, `base44/config.jsonc` e esquema User permanecem como histórico,
   fora do artefato de instalação. Não há SDK nem chamada à plataforma nos fluxos ativos.
3. A operação manual sobre dados ainda existentes no Base44 continua dependendo de
   acesso ao painel até uma decisão de migração/encerramento separada. Esta entrega não
   apaga nem exporta a conta da plataforma.
4. Proprietário precisa fornecer/configurar privadamente origem de homologação,
   credenciais OAuth Web e callback, conta autorizada e subject Google reconciliado,
   SMTP, remetente, destinatário de teste próprio e destinatário operacional.
5. Site temporário, HTTPS, PHP/extensões, permissões, logs sem query/corpos sensíveis,
   `.htaccess` real, SMTP real, Google real, backup e restauração **não homologados na
   Hostinger**. Não houve acesso SSH/hPanel nem instalação remota nesta tarefa.
6. Pacote local usa origem `.invalid` segura. Deve ser recompilado com a origem real de
   homologação antes de instalar. Noindex deve permanecer até publicação autorizada.
7. Cadastro aberto, OTP, senha/reset, MCP e contato comercial não devem ser anunciados
   como migrados/habilitados. Suas telas foram preservadas e suas decisões registradas.

Passos SSH futuros, configuração, critérios de homologação e rollback estão em
[`HOSTINGER_RUNBOOK.md`](HOSTINGER_RUNBOOK.md). A preparação não autoriza desligar Base44.
