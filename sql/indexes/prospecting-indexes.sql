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
--   2. Crie um índice por vez. A base CNPJ é grande, criar vários índices simultaneamente pode causar contenção e lentidão.
--   3. Após concluir a criação, rode os comandos de ANALYZE do script 'sql/refresh-planner-statistics.sql'.

create extension if not exists pg_trgm;

-- ---------------------------------------------------------
-- Busca de prospecção por CNAE principal, com refinamento por UF e município
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_prospect_cnae_state_city_cnpj
on establishments (main_cnae_code, state_code, city_code, cnpj_full)
include (cnpj_root, trade_name, registration_status_code, branch_type_code);

-- ---------------------------------------------------------
-- Resolução prévia de município por UF antes da query principal
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_state_city
on establishments (state_code, city_code);

-- ---------------------------------------------------------
-- Busca de prospecção por razão social
-- ---------------------------------------------------------
create index concurrently if not exists idx_companies_company_name_trgm
on companies using gin (lower(company_name) gin_trgm_ops);

-- ---------------------------------------------------------
-- Busca de prospecção por sócio
-- ---------------------------------------------------------
create index concurrently if not exists idx_partners_partner_name_trgm
on partners using gin (lower(partner_name) gin_trgm_ops);

-- ---------------------------------------------------------
-- Apoio ao join/location refinement em listas por razão social e sócio
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_root_state_city_cnpj
on establishments (cnpj_root, state_code, city_code, cnpj_full)
include (trade_name, main_cnae_code, registration_status_code, branch_type_code);

-- ---------------------------------------------------------
-- Apoio relacional para vínculos societários
-- ---------------------------------------------------------
create index concurrently if not exists idx_partners_cnpj_root
on partners (cnpj_root);
