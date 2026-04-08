-- =========================================================
-- CNPJ API - Índices para prospecção e listas de empresas
-- =========================================================
-- Objetivo:
--   Melhorar o desempenho dos endpoints especializados de lista:
--   - GET /api/listas/empresas/cnae
--   - GET /api/listas/empresas/razaosocial
--   - GET /api/listas/empresas/socio
--
-- Regra de negócio:
--   Todas as listas de prospecção devem retornar apenas
--   estabelecimentos ativos (registration_status_code = '02').
--
-- Observações:
--   1. Execute estes comandos diretamente no PostgreSQL, fora de transação,
--      porque CREATE INDEX CONCURRENTLY não pode rodar dentro de BEGIN/COMMIT.
--   2. Crie um índice por vez. A base CNPJ é grande, então criar vários
--      índices simultaneamente pode causar contenção e lentidão.
--   3. Após concluir a criação, rode os comandos de ANALYZE do script
--      de manutenção de estatísticas do planner.

create extension if not exists pg_trgm;

-- ---------------------------------------------------------
-- Busca de prospecção por lista de CNAEs no campo principal,
-- apenas para estabelecimentos ativos, com refinamento opcional
-- por UF e município
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_active_prospect_main_cnaes
on establishments (main_cnae_code, state_code, city_code, cnpj_full)
include (cnpj_root, trade_name, registration_status_code, branch_type_code)
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Busca de prospecção por lista de CNAEs no campo de CNAEs secundários,
-- apenas para estabelecimentos ativos
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_active_prospect_secondary_cnaes
on establishments
using gin (string_to_array(coalesce(secondary_cnaes_raw, ''), ','))
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Resolução prévia de município por UF antes da query principal,
-- apenas para estabelecimentos ativos
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_active_state_city
on establishments (state_code, city_code)
where registration_status_code = '02';

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
-- Apoio ao refinamento por localização e paginação das listas
-- de empresas já filtradas como ativas
-- ---------------------------------------------------------
create index concurrently if not exists idx_establishments_active_root_state_city_cnpj
on establishments (cnpj_root, state_code, city_code, cnpj_full)
include (trade_name, main_cnae_code, registration_status_code, branch_type_code)
where registration_status_code = '02';