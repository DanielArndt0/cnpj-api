-- =========================================================
-- CNPJ API - Exemplos de consultas otimizadas para a API
-- =========================================================
-- Objetivo:
--   Servir como referência para ajustar os repositories da API.
--
-- Observação:
--   Estes exemplos são modelos. Adapte os parâmetros para o padrão usado
--   no projeto Node/Fastify.

-- ---------------------------------------------------------
-- 1) Resolver município por nome começando pela tabela pequena cities.
-- Evita começar a busca varrendo establishments.
-- ---------------------------------------------------------
select
  ci.code::text as city_code,
  ci.description as city_name
from cities ci
where lower(ci.description) like lower($1)
  and exists (
    select 1
    from establishments e
    where e.city_code = ci.code
      and e.state_code = $2
      and e.registration_status_code = '02'
  )
order by ci.code asc;

-- ---------------------------------------------------------
-- 2) Ranking por CNAE principal agregando antes do join.
-- Primeiro agrupa na tabela grande, depois cruza com a tabela pequena cnaes.
-- ---------------------------------------------------------
with grouped as (
  select
    main_cnae_code,
    count(*)::bigint as total
  from establishments
  where registration_status_code = '02'
  group by main_cnae_code
  order by count(*) desc
  limit $1
)
select
  g.main_cnae_code,
  cn.description as main_cnae_description,
  g.total
from grouped g
left join cnaes cn on cn.code = g.main_cnae_code
order by g.total desc;

-- ---------------------------------------------------------
-- 3) Ranking por município usando materialized view.
-- Ideal para /api/infos/empresas/ativas/por-municipio.
-- ---------------------------------------------------------
select
  mv.state_code,
  mv.city_code,
  ci.description as city_name,
  mv.total
from mv_infos_empresas_ativas_por_municipio mv
left join cities ci on ci.code = mv.city_code
where ($1::text is null or mv.state_code = $1)
order by mv.total desc
limit $2;

-- ---------------------------------------------------------
-- 4) Empresas ativas por UF usando materialized view.
-- Ideal para landing page ou dashboard.
-- ---------------------------------------------------------
select
  state_code,
  total
from mv_infos_empresas_ativas_por_uf
order by total desc;

-- ---------------------------------------------------------
-- 5) Empresas ativas por CNAE principal usando materialized view.
-- ---------------------------------------------------------
select
  mv.main_cnae_code,
  cn.description as main_cnae_description,
  mv.total
from mv_infos_empresas_ativas_por_cnae_principal mv
left join cnaes cn on cn.code = mv.main_cnae_code
order by mv.total desc
limit $1;

-- ---------------------------------------------------------
-- 6) Empresas ativas por porte usando materialized view.
-- ---------------------------------------------------------
select
  mv.company_size_code,
  cs.description as company_size_description,
  mv.total
from mv_infos_empresas_ativas_por_porte mv
left join company_sizes cs on cs.code = mv.company_size_code
order by mv.total desc;
