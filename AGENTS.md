# Regras para esta cópia de migração

- Trabalhar somente em danielperini/ponte-social-copy, branch migration/hostinger-premium.
- Ler MIGRATION_AUDIT.md e docs/MIGRATION_STATUS.md antes de alterar escopo.
- Não tocar main, repositório original, produção, DNS ou deploy sem autorização explícita.
- React/Vite gera estáticos; PHP atende endpoints curtos. Não requerer Node persistente.
- Não reintroduzir SDK/plugin Base44 nem encaminhar testes a serviços de produção.
- Preservar layout, conteúdo, traduções, artigos, rotas e telas legadas sem uso comprovado.
- Formulário comercial continua oculto e endpoint indisponível; MCP não habilitado.
- Segredos, allowlist de identidade e config.php ficam privados, fora de Git e public_html.
- Testes devem tratar riscos concretos; usar transporte local e dados sintéticos.
- Build/empacotamento documentados em README.md; instalação só no runbook futuro.
