-- =========================================================
-- CNPJ API - Atualização de estatísticas após criação de índices
-- =========================================================
-- Objetivo:
--   Atualizar as estatísticas do planner após mudanças estruturais,
--   principalmente em bases grandes carregadas por lote.
--
-- Quando executar:
--   - Após criar índices.
--   - Após materializar uma carga grande.
--   - Após refresh das materialized views.

analyze establishments;
analyze establishment_secondary_cnaes;
analyze companies;
analyze partners;
analyze cities;
analyze cnaes;
analyze registration_statuses;
analyze branch_types;
analyze legal_natures;
analyze company_sizes;

-- Materialized views informativas
analyze mv_infos_empresas_ativas_total;
analyze mv_infos_empresas_ativas_por_uf;
analyze mv_infos_empresas_ativas_por_municipio;
analyze mv_infos_empresas_ativas_por_cnae_principal;
analyze mv_infos_empresas_ativas_por_porte;
