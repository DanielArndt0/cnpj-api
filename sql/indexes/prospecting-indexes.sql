-- =========================================================
-- CNPJ API - Índices para prospecção e listas de empresas
-- =========================================================
-- Objetivo:
--   Melhorar o desempenho dos endpoints especializados de lista:
--   - GET /api/listas/empresas/cnae
--   - GET /api/listas/empresas/razaosocial
--   - GET /api/listas/empresas/socio
--
-- Observações:
--   1. Execute estes comandos diretamente no PostgreSQL, fora de transação,
--      porque CREATE INDEX CONCURRENTLY não pode rodar dentro de BEGIN/COMMIT.
--   2. Crie um índice por vez. A base CNPJ é grande, criar vários índices
--      simultaneamente pode causar contenção e lentidão.
--   3. Após concluir a criação, rode os comandos de ANALYZE do script
--      'Indexes/maintenance/refresh-planner-statistics.sql'.
--   4. Estes índices são focados nas consultas públicas da API, não na etapa
--      de staging. Para staging, o melhor é manter tabela simples e rápida.

create extension if not exists pg_trgm;

-- ---------------------------------------------------------
-- Busca de prospecção por lista de CNAEs no campo principal,
-- apenas para estabelecimentos ativos, com refinamento opcional
-- por UF e município.
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_active_main_cnaes
on establishments (main_cnae_code, state_code, city_code, cnpj_full)
include (cnpj_root, trade_name, branch_type_code)
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Busca de prospecção por lista de CNAEs secundários a partir da
-- tabela relacional de apoio por estabelecimento.
--
-- Observação:
--   A PK da tabela já é (cnpj_full, cnae_code). Por isso, não é necessário
--   criar outro índice apenas em (cnpj_full). O índice abaixo cobre o caminho
--   inverso: começar pelo código CNAE e chegar no CNPJ.
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishment_secondary_cnaes_cnae_code_cnpj_full
on establishment_secondary_cnaes (cnae_code, cnpj_full);

-- ---------------------------------------------------------
-- Resolução prévia de município por UF antes da query principal,
-- considerando apenas estabelecimentos ativos.
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_active_state_city_cnpj
on establishments (state_code, city_code, cnpj_full)
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Busca de prospecção por razão social.
--
-- Importante:
--   A API deve manter mínimo de caracteres no filtro textual.
--   Recomenda-se pelo menos 3 caracteres para evitar varreduras muito amplas.
-- ---------------------------------------------------------
create index concurrently if not exists idx_companies_company_name_trgm
on companies using gin (lower(company_name) gin_trgm_ops);

-- ---------------------------------------------------------
-- Busca de prospecção por sócio.
--
-- Importante:
--   A API deve manter mínimo de caracteres no filtro textual.
--   Recomenda-se pelo menos 3 caracteres para evitar varreduras muito amplas.
-- ---------------------------------------------------------
create index concurrently if not exists idx_partners_partner_name_trgm
on partners using gin (lower(partner_name) gin_trgm_ops);

-- ---------------------------------------------------------
-- Apoio ao refinamento por localização nas listas de empresas
-- por razão social e sócio, considerando apenas ativos.
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_active_root_state_city_cnpj
on establishments (cnpj_root, state_code, city_code, cnpj_full)
include (trade_name, main_cnae_code, branch_type_code)
where registration_status_code = '02';
