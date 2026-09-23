# Auditoria técnica de migração — Ponte Social Consultoria

**Data:** 23/09/2026 · **Repositório:** `danielperini/ponte-social-copy` · **Escopo:** leitura do código, conciliação de inventário informado pelo proprietário e proposta técnica. Nenhuma migração ou publicação foi executada.

**Base examinada:** os 144 arquivos de ambos os ZIPs da cópia, idênticos por conteúdo entre si e comparados por SHA com os 144 arquivos da `main` em `danielperini/ponte-social-copy` (commit `25a1b6c5a0b6af79be138dd4beac9248e6d7be48`) e da `main` atual do projeto original (commit `edd18c6d3234a892db3bb4cdd1d35b0c96b4d80e`), sem diferenças. Contagem feita **antes** da inclusão deste relatório: **140 ocorrências textuais, sem distinguir maiúsculas, de “base44” em 28 arquivos**, incluindo 8 no `package-lock.json` e 53 em `README.md`/`AGENTS.md` (35 + 18). No diretório `src/` há **62 ocorrências em 20 arquivos**. “Ocorrência” aqui significa correspondência de texto, e não número de integrações distintas ou de recursos efetivamente usados. A leitura do ZIP não permite verificar configurações privadas, banco, usuários, funções hospedadas ou comportamento efetivo do painel Base44/Hostinger.

## 1. Arquitetura atual

| Camada | Estado constatado | Evidência |
| --- | --- | --- |
| Interface | SPA React 18; `react` declarado `^18.2.0`, versão resolvida no lock **18.3.1**. React Router 6 (`^6.26.0`), Tailwind 3, componentes Radix, Framer Motion, TanStack Query. | `package.json:18–79`; `src/main.jsx:1–8`; `src/App.jsx:1–96` |
| Build | Vite `^8.2.0` (lock **8.2.0**), `@vitejs/plugin-react` `^6.0.5`; `npm run build` gera `dist/`. Plugin Base44 integra a compilação e recursos do Builder. Configuração Base44 declara `npm install`, `npm run build` e `./dist`. | `package.json:6–12,81–99`; `vite.config.js:1–19`; `base44/config.jsonc:1–9` |
| Node para compilação | O projeto não declara `engines` nem `.nvmrc`. **Vite 8.2.0 e plugin React 6.0.5 exigem Node `^20.19.0` (série 20) ou `>=22.12.0`** no lock; escolher, por exemplo, Node 22.12+ no ambiente de build. Isso não implica Node rodando no servidor de produção. | `package-lock.json`, entradas `node_modules/vite` e `node_modules/@vitejs/plugin-react` |
| Rotas realmente registradas | `/` → Home; `/artigos/:slug` → ArticleDetail; `/conta/excluir` → AccountDeletion; `*` → PageNotFound. Navegação por seções na página inicial. As páginas `Login`, `Register`, `ForgotPassword`, `ResetPassword` e `OAuthConsent` existem, **mas não estão registradas** em `src/App.jsx`; `ProtectedRoute` também não é usado nas rotas. Não pressupor que essas telas sejam hoje acessíveis pelo React. | `src/App.jsx:16–17,32–43`; `src/components/ProtectedRoute.jsx:12–36` |
| Conteúdo | 12 artigos no código, traduções pt-BR/en/es e conteúdo das seções em arquivos JS/JSX; não são registros de um CMS ou consultas a entidades. A rota individual de artigo existe, mas os componentes `Articles` e `Trajectories` não aparecem na árvore de `Home.jsx`. Preferências de idioma/tema/escala usam `localStorage`; escolha da imagem de abertura usa `sessionStorage`. | `src/components/ponte/articles-data.js:1–45`; `src/components/ponte/articles/a1.js` a `a12.js`; `src/pages/Home.jsx:1–70`; `src/i18n/translations.js:1–5`; `src/i18n/LanguageProvider.jsx`; `src/i18n/ThemeProvider.jsx`; `src/components/ponte/Hero.jsx:23–30` |
| Backend atual | SDK no navegador chama autenticação, configurações públicas e envio de e-mail do Base44. Há duas chamadas HTTP relativas ao serviço de consentimento MCP; não há implementação desses endpoints no repositório. | `src/api/base44Client.js:1–12`; `src/lib/AuthContext.jsx`; `src/pages/OAuthConsent.jsx:39–41,90–95` |
| Operação | O README diz que o GitHub sincroniza com o Builder Base44 e que a publicação é feita no painel. Não há workflow GitHub Actions nem configuração de hospedagem independente no ZIP. | `README.md:1–5,46–55`; inventário de arquivos |

**Limite importante:** código presente no repositório e funcionalidades habilitadas em produção não são necessariamente a mesma coisa. É necessária conferência em painel/exportação na etapa seguinte, sem interromper o serviço atual.

### Referência da cópia de trabalho

Esta versão do relatório foi levada à branch isolada `migration/hostinger-premium` do repositório da cópia; a `main` da cópia e o repositório original permanecem sem alterações por esta preparação. Os dois ZIPs da cópia enviados em 23/09/2026 têm 144 arquivos e são idênticos entre si. A comparação por SHA mostrou que esses 144 arquivos são idênticos aos da `main` atual **de ambos os repositórios**. Em relação ao ZIP mais antigo que fundamentou a primeira versão da auditoria, houve apenas mudanças em `package.json`, `package-lock.json`, `src/App.jsx`, `src/components/ponte/Navbar.jsx` e `src/index.css`: atualização do SDK Base44 de 0.8.48 para 0.8.49 e do plugin Vite de 1.0.41 para 1.0.42; transição visual de página de 0,22 s para 0,4 s, fundo explícito, retirada de borda do cabeçalho e ajustes de overflow horizontal. As contagens continuam **140 menções em 28 arquivos; 62 em `src/`**.

**A cópia de código ainda não é um site independente.** Permanecem chamadas ao SDK, e-mail/identidade Base44, imagens em `media.base44.com` e links externos para outro produto hospedado no Base44. Antes de testar ações de conta ou envio em um ambiente de homologação, isolar suas configurações e verificar que não atingem dados ou e-mails da produção. Não há comprovação neste repositório de que ele esteja conectado a um aplicativo Base44 próprio, nem foi feito acesso ao hPanel.


### Complemento: inventário do painel fornecido em 23/09/2026

O proprietário trouxe um inventário produzido no Base44 após a auditoria do Git. Os dados de painel abaixo são **informados, não verificados diretamente nesta auditoria**. Quando o inventário interpreta o código, prevalece a conferência nos arquivos e no roteador versionados.

| Tema | Dado informado pelo inventário | Conciliação com o repositório e consequência |
| --- | --- | --- |
| Entidades e dados | Só a entidade embutida `User`, com **um registro de administrador**, sem entidades customizadas ou dados editoriais em tabelas. | Coerente com `base44/entities/User.jsonc` e conteúdo editorial em JS. Preparar exportação autorizada dos metadados da conta e conciliação do acesso; o Git não contém esse registro. |
| Login do administrador | O inventário informa senha hash nula e existência de chave de API no registro; sugere OAuth ou chave como método. | **Esses dois campos não provam como a pessoa entra.** Validar o método efetivamente utilizado antes de decidir Google OAuth, senha, reset ou revogação. Não copiar, divulgar ou usar a chave como credencial de migração. |
| Backend e conectores | Nenhuma function, automação, agente ou entidade customizada no painel; conector Google Drive registrado no workspace, sem uso aparente pelo app. | Condiz com a ausência de código servidor e chamadas a `base44.functions`/`base44.connectors`. O conector de workspace não justifica construir integração Google Drive para este site sem uso comprovado. |
| MCP | Inventário informa MCP não configurado e ausência do arquivo de configuração. | O código **contém** `src/pages/OAuthConsent.jsx:39–41,90–95` com requisições de consentimento MCP, mas a tela não tem rota e não há servidor/configuração versionada. Registrar como código sem uso demonstrado, não como ausência de referências. |
| E-mail | Formulário comercial oculto em `Constructions.jsx`; inventário conclui que nenhum envio acontece em produção. | A rota ativa `/conta/excluir` usa `Core.SendEmail` em `AccountDeletion.jsx:40–44`. Não é possível concluir que o envio esteja inativo; este fluxo permanece bloqueador para desligar Base44. O formulário comercial continua oculto. |
| Rotas de autenticação | Inventário descreve `/login`, `/register`, `/forgot-password` e `/reset-password` como rotas disponíveis. | Esses arquivos existem, mas **`src/App.jsx:39–42` não registra essas rotas React**. Se o painel oferecer login por páginas da plataforma, isso é distinto de rotas desta SPA; verificar como o administrador entra de fato. |
| Mídia e conteúdo | Dez imagens Base44 com URLs públicas; 12 imagens Unsplash; artigos e traduções em código. | Confirmam o inventário estático. As 12 URLs Unsplash estão nos arquivos `src/components/ponte/articles/a1.js` a `a12.js`; não atribuir seu uso às seções `Sectors` ou `Trajectories` sem referência no código. Antes do corte, guardar cópias autorizadas das dez imagens e verificar qualidade/licença. |
| Domínio e publicação | Inventário informa publicação em `inteligecia-social-ponte.base44.app` e presume que o domínio personalizado não está conectado, baseado em histórico. | Tratar o estado dos domínios como **não verificado ao vivo**. Canonical e metadados no `index.html` não comprovam conexão, e esta auditoria não consultou nem alterou DNS ou configuração do hPanel. |

Assim, o inventário reduz a **migração de dados conhecida** a uma conta, mas não elimina as dependências de autenticação, e-mail de exclusão, SDK/build e imagens.

## 2. Dependências Base44 encontradas

Nas tabelas, “desligamento” significa indisponibilidade do Base44 **hoje, sem modificações neste código**. Linhas próximas da mesma função foram agrupadas, mas todas as dependências funcionais foram incluídas.

| Arquivo | Linha ou função | Finalidade | Dependência do Base44 | Impacto se desligado hoje | Alternativa para independência |
| --- | --- | --- | --- | --- | --- |
| `package.json`; `package-lock.json` | `2,15–16`; entradas `@base44/sdk` e `@base44/vite-plugin` | Nome legado do pacote e dependências de runtime/build; lock fixa SDK **0.8.49** e plugin **1.0.42**. | Direta no SDK/plugin; nome é apenas rótulo. | Nova compilação pode exigir plugin disponível; chamadas do SDK deixam de funcionar. | Substituir cliente e plugin **depois** de implementar equivalentes; atualizar lock com `npm install` e conferir instalação reprodutível com `npm ci` em fase futura. |
| `vite.config.js` | `1,8–16` | Plugin para imports legados, HMR, navegação, analytics e editor visual Base44. | Direta no build e na edição pelo Builder; não há `resolve.alias` explícito no Vite, embora `jsconfig.json:4–6` defina `@/` para ferramentas de código. | A compilação independente continua vinculada ao plugin; recursos do editor deixam de ter serviço e imports `@/` podem falhar ao remover plugin sem substituto. | Manter React/Vite; configurar alias explícito e retirar plugin somente na fase de migração, verificando build, imagens e navegação. |
| `base44/config.jsonc` | `1–9` | Comandos de instalação, build, serve e saída para o CLI/Base44. | Configuração específica da plataforma. | Desenvolvimento/publicação pelo CLI deixam de operar; não é backend PHP. | Novo processo documentado de build para `dist/` e publicação controlada de seus artefatos. |
| `base44/entities/User.jsonc` | `2–16` | Declara `User.role`, string obrigatória `admin` ou `user`. | Esquema/identidade hospedados. | Papéis e usuários da plataforma deixam de estar disponíveis. | Esquema de usuários e papéis no MySQL, validação e autorização no servidor; exportar/conciliar usuários antes do corte. |
| `src/api/base44Client.js` | `1–12` | Cria cliente SDK com appId, token, versão de funções e URL. | Ponto central de todas as chamadas Base44. | APIs usadas pelos componentes deixam de responder. | Cliente próprio para uma API sob o domínio do site, servida por PHP; preservar interface visual. |
| `src/lib/app-params.js` | `1,5–22` | Lê token do SDK, remove token de `localStorage` se solicitado e lê três variáveis Vite. | Token/bootstrap do Base44. | Sessões não podem ser validadas; configurações de build podem apontar à plataforma. | Sessão própria segura por cookie e configuração pública mínima, sem credenciais no bundle. |
| `src/lib/AuthContext.jsx` | `20–38`, `getPublicSettings` | Busca configurações públicas antes das rotas. | API de aplicativo Base44. | Requisição falha. O `catch` cria erro `unknown` e `App.jsx` ainda tenta mostrar rotas; portanto **não é correto afirmar que toda a Home necessariamente desaparece**, mas a inicialização fica degradada e pode depender de detalhes do plugin/ambiente. | Configuração local pública/endpoint próprio somente se necessário; testar navegação anônima e autenticada. |
| `src/lib/AuthContext.jsx` | `80–103`, `auth.me` | Obtém usuário e determina login/erros 401/403. | Identidade e sessões Base44. | Checagem de usuário/papel e áreas protegidas falham. | Endpoint próprio `/api/me`, cookies de sessão, papéis no servidor. |
| `src/lib/AuthContext.jsx` | `105–121`, `logout` e `redirectToLogin` | Encerra sessão ou redireciona ao login. | Métodos do SDK. | Saída/redirecionamento deixam de funcionar para fluxos que os chamarem. | Logout com invalidação de sessão no servidor e rota de login definida localmente. |
| `src/App.jsx` | `49–73,77–93` | Envolve todas as rotas em `AuthProvider`; trata `auth_required` e `user_not_registered`. | Dependência indireta da consulta a configurações/autenticação. | Falha de login/autorizações; resultado da Home anônima requer teste, pois erro `unknown` não a bloqueia no código. | Adaptar o provider para API própria e preservar regras de acesso. |
| `src/components/ProtectedRoute.jsx` | `12–36` | Guarda rota usando `AuthContext`. | Indireta; componente **sem uso nas rotas atuais**. | Só afetaria rotas futuras/fora deste roteador. | Reaproveitar após migração, com proteção real também no backend. |
| `src/lib/PageNotFound.jsx` | `10–17,43–57` | Consulta `auth.me` para mostrar nota a administrador no 404. | Identidade Base44. | 404 continua, mas desaparece nota de admin. | Reusar `/api/me` ou contexto local. |
| `src/pages/Login.jsx` | `21–37` | Login com e-mail/senha e início de Google OAuth. | `auth.loginViaEmailPassword` e `auth.loginWithProvider`. | Esses fluxos param **se a página for ativada/acessada**; atualmente não existe rota React para ela. | Endpoints de login próprios; Google OAuth com callback no servidor e credenciais fora do frontend. |
| `src/pages/Register.jsx` | `23–72` | Cadastro, verificação/reenvio de OTP, gravação de token e Google OAuth. | `auth.register`, `verifyOtp`, `setToken`, `resendOtp`, `loginWithProvider`. | Cadastro/verificação param se usados; página sem rota atualmente. | Persistência MySQL; hash de senha, OTP expirável e uso único, limite de tentativas, e-mail transacional e OAuth próprio. |
| `src/pages/ForgotPassword.jsx` | `15–25` | Solicita recuperação por e-mail. | `auth.resetPasswordRequest`. | Pedido deixa de enviar e-mail se página for ativada; hoje sem rota. | Token de recuperação seguro, uso único e expirável, enviado pelo backend. |
| `src/pages/ResetPassword.jsx` | `11–29` | Aceita token da URL e define nova senha. | `auth.resetPassword`. | Redefinição falha se página for ativada; hoje sem rota. | Endpoint próprio, token armazenado por hash, expiração e invalidação de sessões. |
| `src/lib/authReturnTo.js` | `5–29` | Mantém retorno pós-login no mesmo domínio e remove parâmetros de token da URL. | Acoplamento aos parâmetros legados; validação em si é local. | O redirecionamento das telas órfãs perde o backend; não remover a proteção contra URL maliciosa. | Conservar/adequar validação ao novo fluxo OAuth e aos novos nomes de parâmetros. |
| `src/pages/OAuthConsent.jsx` | `7–13,23–135` | Cliente de consentimento MCP; GET `/api/apps/{appId}/mcp/consent-info` e POST `.../authorize-grant` com cookie/bearer. | Endpoints, sessão e `appId` hospedados no Base44, **sem implementação ou configuração `base44/mcp/config.json` no ZIP**. | Consentimento falharia se estiver habilitado fora do roteador; aqui a página não tem rota registrada. | Inventariar uso real de MCP; se necessário, implementar servidor OAuth/MCP, estado de consentimento e testes de segurança em infraestrutura compatível; não presumir que só a tela basta. |
| `src/pages/AccountDeletion.jsx` | `33–49`, `doDelete` | Envia por e-mail pedido manual de exclusão; **rota `/conta/excluir` está ativa**. | `integrations.Core.SendEmail`. | O formulário da página deixa de enviar; exclusão em si já é manual no painel Base44. | Endpoint PHP com SMTP autenticado e fila/registro seguro se necessário; procedimento manual independente de exclusão dos dados. |
| `src/components/ponte/Constructions.jsx` | `37–57,108–143`, `submit` | Envia contato comercial por e-mail; o contêiner do formulário tem classe CSS `hidden`. | `integrations.Core.SendEmail`. | Se exibido/acionado, envio falha; na interface atual, o formulário está oculto. | Endpoint PHP para contato, validação no servidor, antiabuso, SMTP; preservar decisão de visibilidade. |
| `src/components/ponte/Solutions.jsx` | `50,64` | Dois links para outro produto em `scambioia.base44.app`. | Domínio/hospedagem **de outro site**, não é backend deste repositório. | Links deixam de funcionar se esse outro site for desligado; esta migração não transfere o Scambio. | Planejar migração ou domínio próprio daquele produto separadamente; atualizar links depois de validado. |
| `README.md`; `AGENTS.md` | `README:1–5,10–60`; `AGENTS:5–33` | Descrevem CLI, desenvolvimento, sincronização Git/Builder e publicação Base44. | Operacional, não uma chamada em produção. | Instruções deixam de servir; push no GitHub pode sincronizar com Builder. | Atualizar instruções somente após a migração; controlar branches e evitar automação de publicação nesta fase. |
| `.npmrc`; `.gitignore` | `.npmrc:8–12`; `.gitignore:37` | Isenta escopo `@base44/*` da idade mínima de pacotes; ignora ponteiro local `base44/.app.jsonc`. | Configuração de desenvolvimento. | Sem impacto direto na interface; há vínculo residual com o CLI. | Revisar isenção e ignore após remover SDK/CLI; manter política geral de instalação segura. |

**Referências em imagens e editor:**

| Arquivo | Linha ou função | Finalidade | Dependência do Base44 | Impacto se desligado hoje | Alternativa para independência |
| --- | --- | --- | --- | --- | --- |
| `index.html` | `31–32,40,57,106` | Imagem social OG/Twitter e marcação estruturada. | Mesmo URL de `media.base44.com` repetido cinco vezes. | Prévia em redes/buscadores pode perder imagem. | Copiar original validado para assets estáticos próprios e trocar URLs absolutos. |
| `src/components/ponte/Hero.jsx` | `7–11` | Cinco imagens rotativas da capa. | Cinco URLs da mídia Base44. | Capas podem ficar vazias/quebradas. | Hospedar cinco arquivos próprios preservando qualidade e proporção. |
| `src/components/ponte/Logo.jsx` | `3,7–8` | Marca do cabeçalho. | Um URL Base44. | Logo não carrega. | Asset local. |
| `src/components/ponte/Partners.jsx` | `9,14,19` | Três logos/imagens de parceiros. | Três URLs Base44. | Imagens faltantes. | Assets locais com direitos e licença conferidos. |
| `src/components/ponte/Solutions.jsx` | `52` | Imagem do cartão Scambio. | Um URL Base44. | Imagem do produto faltante. | Asset local. |
| `src/components/ponte/Seo.jsx` | `7,45,65–74` | Imagem padrão OG/Twitter atualizada no cliente. | Um URL Base44. | Prévia social perde padrão; o problema de metadados client-side merece validação à parte. | Asset público próprio com URL absoluta, preservando metadados. |
| `src/components/ui/image-helpers.js` | `1–3,34–87` | Identifica hosts de mídia Wix/Base44 e monta URLs `/v1/fill`/`fit` para redimensionamento. | Transformação remota da mídia Base44 para as imagens desse host. | Otimizações e originais deixam de carregar quando origem some. | Servir variantes locais pré-geradas ou imagem original estática, ajustando helper sem alterar proporção visual. |
| `src/components/ui/image.jsx` | `10–19,43–79` | Usa transformações Wix/Base44, fallback de `static.wixstatic.com`. | Dependência de mídia Base44 quando `src` usa esse host; fallback Wix externo. | Tentativas de imagem original e fallback; imagens desse host perdidas. | Ajustar suporte a assets locais, manter fallback próprio. |
| `src/components/ui/responsive-image.jsx` | `19–20,23–56` | Atributos e carregamento responsivo usados pelo editor/transformador. | `data-base44-image` e transformações da mídia. | Editor visual Base44 deixa de funcionar; imagens podem depender da transformação. | Remover acoplamento ao editor somente após validar imagens locais e responsividade. |
| `src/components/ui/use-responsive-image.jsx` | `14–21` | Escuta evento `base44:image-replace` do editor. | Editor visual Base44. | Substituição via Builder deixa de funcionar; visual normal não depende desse evento. | Retirar listener na fase de independência, mantendo comportamento de carregamento. |

São **16 menções de URL `media.base44.com` para 10 arquivos distintos** (5 em `index.html`, 11 em componentes). O parser do helper acrescenta outra referência textual ao host, sem acrescentar asset. O inventário acima distingue o link externo `*.base44.app` dos arquivos de mídia e da API de autenticação.

**Busca negativa com relevância técnica:** zero chamadas a `base44.entities`, `base44.functions` e `base44.connectors`; nenhum arquivo em `base44/functions/`, nenhum endpoint backend implementado em `src/`, nenhum esquema SQL, nenhum `FormData`/`FileReader`/upload de usuário. Não inferir que a instância hospedada não possua dados ou configuração adicionais só porque não vieram no Git.

## 3. Autenticação

O `AuthProvider` inicia buscando configurações públicas e, quando existe token, chama `auth.me` (`src/lib/AuthContext.jsx:20–37,80–103`). O SDK controla login, logout e token; `src/lib/app-params.js:8–21` lida com chaves de `localStorage`. Os papéis `admin`/`user` estão declarados em `base44/entities/User.jsonc:2–16`. A tela de 404 usa o papel para um aviso; nenhuma rota atualmente é protegida por `ProtectedRoute`.

| Fluxo | Arquivos/funções | Situação no roteador atual | Substituição exigida antes de desligar a plataforma |
| --- | --- | --- | --- |
| E-mail/senha | `src/pages/Login.jsx:21–33` | Tela sem rota registrada; método Base44 presente. | Servidor PHP com credenciais verificadas, hash forte de senha, sessão segura e limite de tentativas. |
| Google OAuth | `src/pages/Login.jsx:35–37`; `src/pages/Register.jsx:70–72` | Telas sem rota; provedor/callback externos ao ZIP. | Configurar OAuth no Google e callback próprio no servidor; conciliar contas existentes. |
| Cadastro e OTP por e-mail | `src/pages/Register.jsx:23–72` | Tela sem rota. OTP é confirmação de cadastro, não prova de MFA. | Usuário no MySQL, token/código expirável, uso único, envio autenticado e proteção contra abuso. |
| Recuperação | `src/pages/ForgotPassword.jsx:15–25`; `src/pages/ResetPassword.jsx:11–29` | Telas sem rotas. | Fluxo de redefinição independente, e-mail e invalidar tokens usados. |
| Logout/redirecionamento | `src/lib/AuthContext.jsx:105–121`; `src/lib/authReturnTo.js:5–29` | Provider montado; `navigateToLogin` invocado para erro `auth_required`. | Cookies `HttpOnly`, `Secure`, `SameSite`, proteção CSRF e retorno seguro. |
| Consentimento MCP | `src/pages/OAuthConsent.jsx:23–135` | Sem rota e sem servidor/config MCP no ZIP. | Validar se há serviço real; só implementar se requerido, mantendo semântica de sessão, handle de uso único e consentimento. |

**Migração de contas:** o ZIP não contém lista de usuários, hashes ou configuração Google. O inventário fornecido pelo proprietário informa uma conta admin e hash de senha nulo, mas não estabelece o método real de acesso. Confirmar exportação permitida pelo Base44 e testar, em momento apropriado, o fluxo efetivamente usado; se senhas/hashes não puderem ser migrados com segurança, planejar redefinição de senha controlada. Não transportar chaves de API, tokens ou senhas para Git ou frontend. O status real do login em produção depende também das configurações privadas do Builder.

## 4. Dados e entidades

Existe **uma** declaração de entidade versionada: `base44/entities/User.jsonc` com campo `role` obrigatório (valores `admin` e `user`). Não há código de CRUD dessa entidade e não há tabela própria versionada. Artigos, perfis, parceiros e traduções estão no código (`src/components/ponte/articles-data.js`, `articles/a1.js` a `a12.js`, `src/i18n/translations.js`), logo sua leitura não requer MySQL. Preferências de interface ficam no navegador e não são dados do servidor.

O inventário de painel fornecido pelo proprietário informa **um usuário admin, nenhuma entidade customizada e nenhum outro dado de negócio no banco**; são dados operacionais ainda sem exportação conferida. MySQL do plano Hostinger é adequado para **usuários, sessões/recuperação/OTP e eventual registro de contatos/pedidos**, se esses fluxos forem confirmados como necessários. Senhas devem ser hashes e a regra `role` precisa ser imposta no backend. Exportar e inventariar os dados pela interface/recursos autorizados antes de desenhar migração de dados; não criar tabelas desnecessárias apenas para artigos estáticos. O perfil do usuário deve ser conciliado com o login de destino sem pressupor que senhas ou chaves de API sejam transferíveis.

## 5. Backend/functions

Não existem funções Deno/Node versionadas nem chamadas a `base44.functions`. O inventário informado pelo proprietário acrescenta que também **não há functions, workflows nem agentes no painel**. O README (`12–13,31–34`) descreve Deno e um backend local Base44 com entidades em memória, além de integrações/OAuth encaminhadas ao aplicativo hospedado: é documentação do ambiente Base44, não um backend independente incluído no ZIP.

Endpoints efetivamente **chamados pelo frontend**: configurações públicas (`AuthContext`), autenticação (`Login`/`Register`/`ForgotPassword`/`ResetPassword`/`AuthContext`/`PageNotFound`), envio Core de e-mail (`Constructions`/`AccountDeletion`) e GET/POST de consentimento MCP em `OAuthConsent.jsx:39–41,90–95`. Estes últimos não têm servidor neste repositório e a tela não está ligada ao roteador. Um serviço MCP completo pode exigir emissão de tokens, callbacks, conexões de longa duração, SSE ou processos persistentes; **tais requisitos não estão demonstrados pelo código entregue**. Se existirem na instância, a versão atual do Premium não deve ser presumida compatível com um servidor Deno/Node persistente. Os fluxos HTTP curtos comprovados (contato, exclusão, login e recuperação) podem ser implementados em PHP sem VPS.

## 6. E-mail

- `src/pages/AccountDeletion.jsx:40–44`: pedido de exclusão por `base44.integrations.Core.SendEmail`; ação acessível pela rota ativa, não exclui automaticamente os dados.
- `src/components/ponte/Constructions.jsx:45–49`: contato comercial pelo mesmo serviço, mas o formulário está oculto por `hidden` em `108`. Não apagar esse código na migração sem decidir o futuro do formulário.
- `src/pages/Register.jsx:32–64` e `ForgotPassword.jsx:19`: envio de OTP e recuperação depende do serviço de autenticação Base44, sem SMTP próprio.
- `src/components/ponte/Footer.jsx:21–24`: `mailto:` abre o cliente de e-mail do visitante; é independente do SDK, mas a caixa de destino deve permanecer ativa.

Alternativa econômica: endpoints PHP enviando pelo **SMTP autenticado de uma caixa Hostinger já incluída e ativa**, com credenciais só no servidor, limite de envio verificado no hPanel, validação/antiabuso e SPF/DKIM/DMARC para o domínio. Não assumir que uma caixa gratuita ou promocional permaneça disponível após renovação. A Hostinger documenta limite de **10 mensagens/minuto e 100/dia** para envio pelo servidor com scripts, recomendando SMTP; os limites da caixa contratada devem ser conferidos separadamente. Fontes: https://www.hostinger.com/br/support/6976044-parametros-e-limites-dos-planos-de-hospedagem-na-hostinger/ e https://www.hostinger.com/support/4625828-parameters-and-limits-of-hostinger-email/.

## 7. Ficheiros e imagens

Não há upload de usuário nem armazenamento de ficheiros no backend deste repositório. Há **10 imagens distintas** em mídia Base44 distribuídas entre capa (5), marca (1), parceiros (3) e cartão Scambio (1); o mesmo arquivo da capa reaparece em OG/Twitter/JSON-LD. Não há cópias desses binários no ZIP. `src/components/ui/image-helpers.js:34–87` calcula variantes remotas Wix/Base44; `src/components/ui/image.jsx:10–19` usa ainda um fallback em `static.wixstatic.com`. Artigos têm 12 fotos externas de `images.unsplash.com` (`src/components/ponte/articles/a1.js` a `a12.js`, cabeçalho de cada arquivo). O componente `src/components/ponte/Trajectories.jsx:57,79–96` poderia carregar favicons de `www.google.com/s2/favicons`, mas não está montado na Home atual.

Antes do corte, obter originais autorizados de todas as imagens Base44, conferir licença, qualidade, dimensões e tamanho; copiá-los para diretório público do site Hostinger e atualizar código, metadados e comportamento responsivo. Arquivos privados futuros, caso existam fora do Git, devem ficar fora de `public_html` com entrega autorizada por backend, limites de tipo/tamanho e backup. Esta auditoria **não baixou** imagens nem modificou URLs.

## 8. Integrações externas

| Integração | Arquivo/local | Uso e estado | Base44 / alternativa |
| --- | --- | --- | --- |
| Google OAuth | `src/pages/Login.jsx:35–37`; `Register.jsx:70–72` | Autenticação declarada em telas sem rotas. | Depende da implementação Base44; configurar credenciais e callback próprios apenas se o fluxo estiver em uso. |
| Google Favicons | `src/components/ponte/Trajectories.jsx:57` | Imagens de logos institucionais se esse componente, hoje não montado, vier a ser usado. | Externa, independente do Base44; pode continuar, sujeito a disponibilidade do terceiro. |
| Google Fonts | `index.html:45–48` | Tipografia. | Externa, independente; opcionalmente hospedar fontes localmente depois. |
| Unsplash | `src/components/ponte/articles/a1.js` a `a12.js` | 12 fotos de artigo. | Externa, independente; verificar licença/disponibilidade. |
| Scambio | `src/components/ponte/Solutions.jsx:50,64` | Link para outro produto em `*.base44.app`. | Esse destino continua dependente do Base44 até sua própria migração. |
| WhatsApp, LinkedIn e referências de artigos | `src/i18n/translations.js:453,872,1291`; `src/components/ponte/Footer.jsx:26,39`; `src/components/ponte/articles/a12.js` | Links externos, sem chamadas de backend da Ponte. | Mantê-los se destinos continuarem válidos. |
| Stripe | `package.json:46–47`; `package-lock.json` | Bibliotecas instaladas **sem import, checkout, endpoint, chave ou webhook encontrado**. | Não há funcionalidade de pagamento demonstrada para migrar; candidatas à remoção futura, após confirmar operação real. |

**Dependências a manter na arquitetura proposta:** `react`/`react-dom`, `react-router-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss`/`postcss`/`autoprefixer` e bibliotecas realmente importadas pela interface (por exemplo Framer Motion, Lucide, Radix, React Markdown e TanStack Query). **Candidatas a remoção depois da substituição:** `@base44/sdk`, `@base44/vite-plugin` e entradas transitivas exclusivas deles. `@stripe/react-stripe-js`, `@stripe/stripe-js` e `nitro` (`package.json:46–47,95`) não têm uso direto identificado no código e merecem revisão, sem remoção nesta etapa. As demais dependências genéricas só devem ser removidas após análise de imports/compilação; não há necessidade de “limpar” pacotes para executar a auditoria.

## 9. Variáveis de ambiente

| Nome/local | Uso | Tratamento futuro |
| --- | --- | --- |
| `VITE_BASE44_APP_ID` — `src/lib/app-params.js:18` | Identifica aplicativo no SDK/URL MCP. | Remover da configuração de build só após substituir os usos; variável `VITE_` é pública no JS compilado, nunca guardar segredo nela. |
| `VITE_BASE44_FUNCTIONS_VERSION` — `src/lib/app-params.js:20` | Versão das funções do cliente SDK. | Deixar de usar ao remover SDK. |
| `VITE_BASE44_APP_BASE_URL` — `src/lib/app-params.js:21` | Origem do aplicativo Base44. | Substituir por URL/configuração própria quando necessária. |
| `BASE44_LEGACY_SDK_IMPORTS` — `vite.config.js:11` | Ativa compatibilidade de imports legados do plugin. | Retirar com o plugin após confirmar imports. |
| `.env` / `.env.*` — `.gitignore:1–3` | Arquivos locais ignorados. | Manter segredo somente no servidor/CI seguro, fora de `public_html` e do controle de versão. |

Não existe `.env` versionado no snapshot, nem credencial, API key, token de provedor ou password **com valor identificável** nos 144 arquivos examinados por inspeção estática. Referências a nomes de token e à chave de `localStorage` não são credenciais versionadas. Isto **não cobre histórico Git, secrets no Builder, hPanel, imagens remotas ou configuração de serviços**. Caso seja encontrada credencial em qualquer desses lugares, registrar apenas localização em relatórios e fazer rotação, sem divulgar valor.

## 10. Compatibilidade com Hostinger Premium

| Recurso necessário | Compatibilidade e condição |
| --- | --- |
| Frontend React/Vite | Compatível como **arquivos estáticos gerados em `dist/`**. Compilar fora do servidor Premium com Node compatível e servir HTML/CSS/JS. Configurar fallback SPA para `index.html` nas rotas `/artigos/:slug` e `/conta/excluir`, sem interceptar `/api/*` nem arquivos estáticos. |
| API para contato, conta e autenticação | PHP por requisição é adequado aos fluxos HTTP curtos identificados. Requer implementação, logs, sessões, proteção contra abuso e HTTPS; não está presente hoje. |
| Banco | MySQL oferecido no plano, adequado ao `User` e tokens/estados necessários. Conferir limites **do plano efetivo no hPanel**, inclusive armazenamento e número de conexões; a tabela pública da Hostinger pode diferir de contratos antigos ou novos. Não inferir do termo “Premium” uma quota de 50 GB para esta conta. |
| Ficheiros | Diretório público para imagens do site; privados fora da raiz pública e servidos por PHP autorizado. Backups do plano devem ser conferidos e cópia própria de dados essenciais mantida. |
| E-mail | SMTP da caixa existente se ativa; limites e eventual fim da gratuidade promocional devem ser verificados. |
| Processos persistentes Node/Deno | **Não pressupor disponibilidade no Premium.** A documentação específica de hospedagem gerenciada Node.js lista Business/Cloud, embora páginas comerciais possam usar linguagem mais ampla. Não desenhar backend desta migração dependente de `node server.js`, Deno persistente, WebSocket/SSE contínuo ou workers residentes no Premium. |
| GitHub | Continua fonte principal. Publicar **artefatos compilados**, não clonar a raiz inteira do código (incluindo arquivos de configuração) para `public_html`. O recurso Git do hPanel pode sincronizar repositórios/branches e oferecer auto deploy; manter desativado até testes e autorização para publicação. |

Fontes oficiais consultadas em 23/09/2026: [limites e MySQL/PHP/e-mail](https://www.hostinger.com/br/support/6976044-parametros-e-limites-dos-planos-de-hospedagem-na-hostinger/), [SSH Premium](https://www.hostinger.com/br/support/1583645-como-habilitar-o-acesso-ssh-no-hostinger/), [processos em segundo plano e cron](https://www.hostinger.com/br/support/1583713-posso-executar-processos-em-segundo-plano-via-ssh-no-hostinger/), [planos de Web Apps Node.js](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/), [Git no hPanel e implantação automática](https://www.hostinger.com/br/support/1583302-como-implantar-fazer-o-deploy-de-um-repositorio-git-hostinger/). A URL de login do hPanel fornecida não oferece acesso aos detalhes privados do contrato; não foram alterados painel, DNS nem domínio.

## 11. Dependências que impedem desligar o Base44

1. **Funcionalidade ativa comprovada:** `/conta/excluir` chama `Core.SendEmail` e perderia o envio. O fluxo de exclusão hoje também pressupõe trabalho manual no painel da plataforma (`AccountDeletion.jsx:33–49`).
2. **Camada compartilhada da SPA:** o carregamento de configurações públicas e checagem de sessão passa pelo SDK; login, permissões, redirecionamento e nota de administrador do 404 não têm substitutos (`AuthContext.jsx`, `App.jsx`, `PageNotFound.jsx`). O efeito exato sobre Home anônima após perda da API precisa ser testado.
3. **Identidade/dados:** usuários e papéis hospedados não estão exportados nem modelados em banco próprio (`base44/entities/User.jsonc`). Não se pode desligar a autenticação usada fora do roteador sem inventário do painel.
4. **Visual e compartilhamento:** 10 imagens distintas na mídia Base44 sustentam capa, marca, parceiros e cartão; OG/SEO usa a mesma origem (`index.html` e componentes).
5. **Código disponível, porém sem rota/oculto:** login, cadastro, OTP, Google, recuperação e consentimento MCP precisam de decisão explícita baseada no uso em produção; contato (`Constructions.jsx`) está oculto. Mantê-los no escopo de preservação sem afirmar que estejam ativos.
6. **Outro produto:** links para `scambioia.base44.app` continuam dependentes da hospedagem daquele produto, fora do backend da Ponte.
7. **Build e operação:** plugin Vite, configuração CLI, documentação e sincronização Git/Builder precisam ser desacoplados no momento apropriado. Somente exportar `dist/` com o código atual não torna APIs ou imagens independentes.

## 12. Arquitetura independente recomendada

`GitHub (fonte) → build React/Vite em ambiente Node compatível → arquivos estáticos na Hostinger Premium → endpoints PHP por HTTPS → MySQL Hostinger quando houver usuários/estado; PHP → SMTP de caixa já disponível.` Imagens públicas próprias na mesma hospedagem. Nenhuma VPS e nenhum serviço pago novo **como premissa**.

- Preservar componentes, artigos, traduções, URLs e aparência; trocar apenas integrações com Base44 quando existir substituto testado.
- Expor rotas `/api/*` via PHP, com segredos fora da raiz pública. Se a aplicação de fato não oferecer login a visitantes, confirmar regras de produto antes de escolher quais fluxos de conta disponibilizar; não apagar suas telas nesta fase.
- MySQL para identidade/estado, se o uso em produção confirmar necessidade. Backup/exportação e testes de restauração; arquivos públicos servidos como estáticos.
- SMTP autenticado para e-mails. Endpoint de contato com validação e medidas antiabuso; pedido de exclusão com processamento e registro seguros.
- Criar ambiente de teste separado sem tocar no domínio em produção; auditar integrações da instância antes da decisão de corte. Se MCP real exigir conexões persistentes ou outras funções não suportadas pelo Premium, estudar arquitetura separada **somente para esse requisito comprovado**, com custo decidido depois.

## 13. Plano de migração em etapas

| Etapa futura | Ações e critério de conclusão | Produção |
| --- | --- | --- |
| 1. Inventário operacional | Confrontar o inventário de painel já fornecido com exportação/fluxos efetivos: confirmar a conta admin e seu método de login, disponibilidade de e-mail de exclusão, MCP e estado do domínio; verificar contrato Premium, MySQL e caixa de e-mail no hPanel. | Apenas leitura. |
| 2. Preparação isolada | Criar branch de trabalho e ambiente de build Node compatível; copiar imagens autorizadas; comparar visuais, responsividade, SEO e rotas. | Base44 permanece intacto. |
| 3. Backend mínimo | Implementar PHP para serviços efetivamente usados, MySQL só quando necessário, sessão segura e SMTP; reconciliar dados/contas. | Teste sem tráfego real de produção. |
| 4. Substituição do cliente | Trocar chamadas SDK/plugin após testes; preservar componentes e fluxos; registrar/examinar rotas de autenticação hoje órfãs e opção MCP. | Sem alteração no domínio. |
| 5. Homologação | Build reproducível; testar Home, artigos, rota profunda/reload, exclusão, contato se habilitado, login/cadastro/recuperação/OAuth se usados, imagens, backup/restore, segurança, e-mails e rollback. | Usar domínio temporário/subdomínio somente em fase autorizada. |
| 6. Corte controlado | Após aprovação e backups, publicar artefatos e API, executar migração final de dados e **só então** planejar DNS/domínio; monitorar erros e manter retorno ao Base44 até estabilidade. | Fora do escopo desta auditoria. |

## 14. Riscos

| Risco | Severidade | Evidência e mitigação futura |
| --- | --- | --- |
| Dados/identidade fora do ZIP | Alta | `User` declarado, mas nenhum dump; inventário/exportação e plano de reset de senha podem ser necessários. |
| Dependência visual da mídia | Alta | 10 binários ausentes do Git; obter cópias antes de desligar CDN e verificar licenças. |
| Perda dos e-mails de exclusão | Alta | Rota ativa usa `Core.SendEmail`; construir e testar SMTP/endpoint antes do corte. |
| Comportamento real das telas de autenticação/MCP desconhecido | Alta | Arquivos presentes, rotas ausentes e configuração privada não acessível; validar contra produção sem alterar dados. |
| Serviços de longa duração incompatíveis com Premium | Condicional alta | Apenas endpoints cliente MCP aparecem; se houver servidor SSE/WebSocket/workers no Base44, PHP compartilhado não equivale a esses serviços. |
| Exposição de código ou segredos | Alta | Git do hPanel pode copiar raiz inteira; publicar só `dist/` e `api/` necessários, segredos fora de `public_html`; auditar histórico Git e configurações. |
| Limite de e-mail/abuso de formulário | Média | Scripts do plano têm limites; usar SMTP existente e rate limiting, validar mailbox real. |
| Rotas diretas/SEO | Média | `BrowserRouter` requer fallback para caminhos profundos; `Seo.jsx` altera metadados no cliente; verificar prévias sociais no ambiente futuro. |
| Alias de import na retirada do plugin | Média | `vite.config.js` não declara `resolve.alias` para `@/`; `jsconfig.json` sozinho não configura Vite. Definir alias independente e verificar build antes de remover plugin. |
| Divergência entre GitHub, Builder e hospedagem | Média | README indica sincronização Git → Base44; documentar origem de cada ambiente, trabalhar em branch, evitar auto deploy/corte prematuro. |
| Testes limitados pela etapa | Média | Auditoria estática sem login no painel, build, testes de requisição ou runtime; resultado em produção precisa homologação posterior. |

## 15. Checklist final

**Concluído nesta tarefa**

- [x] Comparados 144 arquivos de cada ZIP da cópia com as branches `main` da cópia e do projeto original, conteúdo idêntico por SHA; varridas referências, domínios, importações, dependências, rotas e nomes de variáveis.
- [x] Contadas 140 menções textuais a Base44 no snapshot original; localizadas integrações funcionais, imagens e referências de operação.
- [x] Identificados framework/versões, build/Node exigido, entidade `User`, chamadas backend, e-mails, terceiros, variáveis e dependências instaladas sem uso demonstrado.
- [x] Feita verificação estática de credenciais no snapshot, sem valor identificável versionado; nenhum segredo reproduzido.
- [x] Proposta arquitetura que cabe em estáticos + PHP + MySQL/SMTP condicionais ao contrato efetivo.

**Pendente para a próxima fase (não executado)**

- [ ] Verificar/exportar os dados informados pelo inventário de painel (um admin, sem entidades customizadas), método real de login, envio de e-mail de exclusão, domínio e MCP; conferir plano e caixa Hostinger.
- [ ] Obter/autorizar cópia das 10 imagens, inventariar outros arquivos que só existam na plataforma.
- [ ] Decidir e implementar substitutos de autenticação, e-mail, configurações e eventuais endpoints MCP; preservar funcionalidades existentes.
- [ ] Validar `npm ci`/build, caminhos profundos, visual, segurança, e-mails, backup/restore e rollback em ambiente isolado.
- [ ] Preparar publicação futura sem tocar DNS ou desligar Base44 enquanto não houver autorização para o corte.

**Arquivos existentes previstos para alteração na fase de implementação:** `package.json`, `package-lock.json`, `vite.config.js`, `src/api/base44Client.js`, `src/lib/app-params.js`, `src/lib/AuthContext.jsx`, `src/App.jsx`, `src/lib/PageNotFound.jsx`, `src/lib/authReturnTo.js`, `src/components/ProtectedRoute.jsx` se usado, `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/pages/ForgotPassword.jsx`, `src/pages/ResetPassword.jsx`, `src/pages/AccountDeletion.jsx`, `src/pages/OAuthConsent.jsx` **se MCP estiver em uso**, `src/components/ponte/Constructions.jsx`, `src/components/ponte/Hero.jsx`, `src/components/ponte/Logo.jsx`, `src/components/ponte/Partners.jsx`, `src/components/ponte/Solutions.jsx`, `src/components/ponte/Seo.jsx`, `src/components/ui/image-helpers.js`, `src/components/ui/image.jsx`, `src/components/ui/responsive-image.jsx`, `src/components/ui/use-responsive-image.jsx`, `index.html` e depois `README.md`/`AGENTS.md`/`.npmrc`/`.gitignore`/`base44/*`. Novos arquivos de API PHP, esquemas MySQL, configuração de roteamento e imagens seriam necessários em etapa futura. **Nenhum desses arquivos existentes foi modificado nesta auditoria.**
