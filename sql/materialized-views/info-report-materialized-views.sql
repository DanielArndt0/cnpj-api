-- =========================================================
-- CNPJ API - Materialized views para endpoints informativos
-- =========================================================
-- Objetivo:
--   Evitar que endpoints públicos de relatórios façam COUNT/GROUP BY direto
--   em tabelas gigantes a cada requisição.
--
-- Recomendação:
--   Use estas materialized views como fonte principal dos endpoints /api/infos.
--   Para landing page, dashboard ou página pública, isso tende a ser melhor
--   do que depender apenas de índices e cache da aplicação.
--
-- Observações:
--   1. Rode este arquivo após a materialização das tabelas finais.
--   2. As views devem ser atualizadas após cada carga mensal da base.
--   3. Os índices únicos permitem REFRESH MATERIALIZED VIEW CONCURRENTLY
--      nas views agrupadas.
--   4. A view de total possui apenas uma linha e não precisa de índice único.

-- ---------------------------------------------------------
-- Total de empresas/estabelecimentos ativos.
-- ---------------------------------------------------------
create materialized view if not exists mv_infos_empresas_ativas_total as
select
  count(*)::bigint as total
from establishments
where registration_status_code = '02';

-- ---------------------------------------------------------
-- Empresas/estabelecimentos ativos por UF.
-- ---------------------------------------------------------
create materialized view if not exists mv_infos_empresas_ativas_por_uf as
select
  state_code,
  count(*)::bigint as total
from establishments
where registration_status_code = '02'
  and state_code is not null
  and state_code <> ''
group by state_code;

create unique index if not exists idx_mv_infos_empresas_ativas_por_uf
on mv_infos_empresas_ativas_por_uf (state_code);

-- ---------------------------------------------------------
-- Empresas/estabelecimentos ativos por município.
-- ---------------------------------------------------------
create materialized view if not exists mv_infos_empresas_ativas_por_municipio as
select
  state_code,
  city_code,
  count(*)::bigint as total
from establishments
where registration_status_code = '02'
  and state_code is not null
  and state_code <> ''
  and city_code is not null
  and city_code <> ''
group by state_code, city_code;

create unique index if not exists idx_mv_infos_empresas_ativas_por_municipio
on mv_infos_empresas_ativas_por_municipio (state_code, city_code);

-- ---------------------------------------------------------
-- Empresas/estabelecimentos ativos por CNAE principal.
-- ---------------------------------------------------------
create materialized view if not exists mv_infos_empresas_ativas_por_cnae_principal as
select
  main_cnae_code,
  count(*)::bigint as total
from establishments
where registration_status_code = '02'
  and main_cnae_code is not null
  and main_cnae_code <> ''
group by main_cnae_code;

create unique index if not exists idx_mv_infos_empresas_ativas_por_cnae_principal
on mv_infos_empresas_ativas_por_cnae_principal (main_cnae_code);

-- ---------------------------------------------------------
-- Empresas/estabelecimentos ativos por porte.
-- ---------------------------------------------------------
create materialized view if not exists mv_infos_empresas_ativas_por_porte as
select
  c.company_size_code,
  count(*)::bigint as total
from establishments e
inner join companies c on c.cnpj_root = e.cnpj_root
where e.registration_status_code = '02'
  and c.company_size_code is not null
  and c.company_size_code <> ''
group by c.company_size_code;

create unique index if not exists idx_mv_infos_empresas_ativas_por_porte
on mv_infos_empresas_ativas_por_porte (company_size_code);
