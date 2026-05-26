-- =========================================================
-- CNPJ API - Índices recomendados para endpoints informativos
-- =========================================================
-- Objetivo:
--   Melhorar o desempenho dos endpoints de leitura estatística:
--   - GET /api/infos/empresas/ativas/total
--   - GET /api/infos/empresas/ativas/por-uf
--   - GET /api/infos/empresas/ativas/por-regiao
--   - GET /api/infos/empresas/ativas/por-porte
--   - GET /api/infos/empresas/ativas/por-cnae-principal
--   - GET /api/infos/empresas/ativas/por-municipio
--
-- Observações:
--   1. Execute fora de transação, pois CREATE INDEX CONCURRENTLY
--      não pode rodar dentro de BEGIN/COMMIT.
--   2. Estes índices não mudam o modelo de dados; apenas adicionam
--      estruturas auxiliares de leitura para consultas agregadas.
--   3. Para landing page e dashboards públicos, a melhor otimização é usar
--      materialized views. Estes índices ajudam quando a API ainda consulta
--      as tabelas finais diretamente ou no refresh das views.
--   4. Se você já aplicou 'Indexes/indexes/prospecting-indexes.sql', alguns
--      índices podem ficar parecidos. Evite duplicar sem medir com EXPLAIN.
--   5. Após criar, rode ANALYZE establishments; ANALYZE companies;

-- ---------------------------------------------------------
-- Totalização e agrupamento por UF/município de CNPJs ativos.
-- ---------------------------------------------------------
create index concurrently if not exists idx_infos_establishments_active_state_city
on establishments (state_code, city_code)
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Ranking por CNAE principal de CNPJs ativos.
-- ---------------------------------------------------------
create index concurrently if not exists idx_infos_establishments_active_main_cnae
on establishments (main_cnae_code)
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Junção com companies para relatórios por porte, mantendo apenas ativos.
-- ---------------------------------------------------------
create index concurrently if not exists idx_infos_establishments_active_cnpj_root
on establishments (cnpj_root)
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Apoio ao agrupamento por porte da empresa.
-- ---------------------------------------------------------
create index concurrently if not exists idx_infos_companies_company_size_root
on companies (company_size_code, cnpj_root);
