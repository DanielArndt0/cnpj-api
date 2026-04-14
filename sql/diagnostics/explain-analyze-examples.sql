-- =========================================================
-- CNPJ API - Exemplos de EXPLAIN ANALYZE
-- =========================================================
-- Objetivo:
--   Validar se o PostgreSQL passou a usar os índices esperados.
--
-- O ideal é observar a troca de Seq Scan por Index Scan, Bitmap Index Scan
-- ou outro plano mais seletivo nas tabelas grandes.

-- 1) Prospecção por lista de CNAEs com CNAE principal e secundário
EXPLAIN (ANALYZE, BUFFERS)
with matched_establishments as (
  select e.cnpj_full
  from establishments e
  where e.main_cnae_code = any(array['6201501', '4211101'])
    and e.registration_status_code = '02'
    and e.state_code = 'PR'

  union

  select esc.cnpj_full
  from establishment_secondary_cnaes esc
  inner join establishments e on e.cnpj_full = esc.cnpj_full
  where esc.cnae_code = any(array['6201501', '4211101'])
    and e.registration_status_code = '02'
    and e.state_code = 'PR'
),
filtered_establishments as (
  select
    e.cnpj_full,
    e.cnpj_root,
    e.trade_name,
    e.main_cnae_code,
    e.state_code,
    e.city_code,
    e.registration_status_code,
    e.branch_type_code
  from matched_establishments me
  inner join establishments e on e.cnpj_full = me.cnpj_full
  order by e.cnpj_full asc
  limit 20
  offset 0
)
select
  e.cnpj_full,
  e.cnpj_root,
  c.company_name,
  e.trade_name,
  e.main_cnae_code,
  cn.description as main_cnae_description,
  e.state_code,
  ci.description as city_description
from filtered_establishments e
inner join companies c on c.cnpj_root = e.cnpj_root
left join cnaes cn on cn.code = e.main_cnae_code
left join cities ci on ci.code = e.city_code
order by e.cnpj_full asc;

-- 2) Prospecção por razão social
EXPLAIN (ANALYZE, BUFFERS)
with filtered_establishments as (
  select
    e.cnpj_full,
    e.cnpj_root,
    c.company_name,
    e.trade_name,
    e.main_cnae_code,
    e.state_code,
    e.city_code,
    e.registration_status_code,
    e.branch_type_code,
    c.legal_nature_code,
    c.company_size_code
  from companies c
  inner join establishments e on e.cnpj_root = c.cnpj_root
  where lower(c.company_name) like '%tecnologia%'
    and e.registration_status_code = '02'
    and e.state_code = 'PR'
  order by c.company_name asc, e.cnpj_full asc
  limit 20
  offset 0
)
select
  e.cnpj_full,
  e.cnpj_root,
  e.company_name,
  e.trade_name,
  e.main_cnae_code,
  cn.description as main_cnae_description,
  e.state_code,
  ci.description as city_description
from filtered_establishments e
left join cnaes cn on cn.code = e.main_cnae_code
left join cities ci on ci.code = e.city_code
order by e.company_name asc, e.cnpj_full asc;

-- 3) Prospecção por sócio
EXPLAIN (ANALYZE, BUFFERS)
with matched_roots as (
  select distinct p.cnpj_root
  from partners p
  where lower(p.partner_name) like '%joao%'
),
filtered_establishments as (
  select
    e.cnpj_full,
    e.cnpj_root,
    c.company_name,
    e.trade_name,
    e.main_cnae_code,
    e.state_code,
    e.city_code,
    e.registration_status_code,
    e.branch_type_code,
    c.legal_nature_code,
    c.company_size_code
  from matched_roots mr
  inner join companies c on c.cnpj_root = mr.cnpj_root
  inner join establishments e on e.cnpj_root = mr.cnpj_root
  where e.registration_status_code = '02'
    and e.state_code = 'PR'
  order by c.company_name asc, e.cnpj_full asc
  limit 20
  offset 0
)
select
  e.cnpj_full,
  e.cnpj_root,
  e.company_name,
  e.trade_name,
  e.main_cnae_code,
  cn.description as main_cnae_description,
  e.state_code,
  ci.description as city_description
from filtered_establishments e
left join cnaes cn on cn.code = e.main_cnae_code
left join cities ci on ci.code = e.city_code
order by e.company_name asc, e.cnpj_full asc;
