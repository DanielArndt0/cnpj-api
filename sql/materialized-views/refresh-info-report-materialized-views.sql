-- =========================================================
-- CNPJ API - Refresh das materialized views informativas
-- =========================================================
-- Objetivo:
--   Atualizar os dados pré-calculados usados pelos endpoints /api/infos.
--
-- Quando executar:
--   - Após cada carga mensal da Receita Federal.
--   - Após materialização completa das tabelas finais.
--   - Antes de liberar a API/landing page para leitura dos novos dados.
--
-- Observações:
--   1. REFRESH MATERIALIZED VIEW CONCURRENTLY exige índice único na view.
--   2. A view de total tem apenas uma linha. Por simplicidade, ela usa refresh
--      normal. Se precisar de zero bloqueio, pode trocar por tabela de resumo.
--   3. Em base muito grande, rode fora do horário de pico.

refresh materialized view mv_infos_empresas_ativas_total;

refresh materialized view concurrently mv_infos_empresas_ativas_por_uf;
refresh materialized view concurrently mv_infos_empresas_ativas_por_municipio;
refresh materialized view concurrently mv_infos_empresas_ativas_por_cnae_principal;
refresh materialized view concurrently mv_infos_empresas_ativas_por_porte;

analyze mv_infos_empresas_ativas_total;
analyze mv_infos_empresas_ativas_por_uf;
analyze mv_infos_empresas_ativas_por_municipio;
analyze mv_infos_empresas_ativas_por_cnae_principal;
analyze mv_infos_empresas_ativas_por_porte;
