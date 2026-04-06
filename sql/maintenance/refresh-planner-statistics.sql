-- =========================================================
-- CNPJ API - Atualização de estatísticas após criação de índices
-- =========================================================
-- Objetivo:
--   Atualizar as estatísticas do planner após mudanças estruturais,
--   principalmente em bases grandes carregadas por lote.

analyze establishments;
analyze companies;
analyze partners;
analyze cities;
analyze cnaes;
analyze registration_statuses;
analyze branch_types;
analyze legal_natures;
analyze company_sizes;
