-- =========================================================
-- CNPJ API - Exemplos de EXPLAIN ANALYZE
-- =========================================================
-- Objetivo:
--   Validar se o PostgreSQL passou a usar os índices esperados.
--
-- O ideal é observar a troca de Seq Scan por Index Scan, Bitmap Index Scan,
-- Bitmap Heap Scan ou planos mais seletivos nas tabelas grandes.
--
-- Observações:
--   1. Em bases muito grandes, rode primeiro em ambiente controlado.
--   2. EXPLAIN ANALYZE executa a consulta de verdade.
--   3. Para medir sem executar, use apenas EXPLAIN.

-- ---------------------------------------------------------
-- 1) Consulta direta por CNPJ completo.
-- Deve usar a PK de establishments(cnpj_full).
-- ---------------------------------------------------------
EXPLAIN (ANALYZE, BUFFERS)
select
  e.*
from establishments e
where e.cnpj_full = '00000000000191';

-- ---------------------------------------------------------
-- 2) Consulta por raiz de CNPJ com estabelecimentos ordenados.
-- Deve se beneficiar de idx_establishments_cnpj_root_order.
-- ---------------------------------------------------------
EXPLAIN (ANALYZE, BUFFERS)
select
  e.cnpj_full,
  e.cnpj_root,
  e.cnpj_order,
  e.cnpj_check_digits,
  e.trade_name,
  e.registration_status_code,
  e.main_cnae_code,
  e.state_code,
  e.city_code
from establishments e
where e.cnpj_root = '00000000'
order by e.cnpj_order asc, e.cnpj_check_digits asc;

-- ---------------------------------------------------------
-- 3) Sócios por raiz de CNPJ.
-- Deve se beneficiar de idx_partners_cnpj_root_id.
-- ---------------------------------------------------------
EXPLAIN (ANALYZE, BUFFERS)
select
  p.id,
  p.cnpj_root,
  p.partner_name,
  p.partner_type_code,
  p.partner_qualification_code,
  p.entry_date
from partners p
where p.cnpj_root = '00000000'
order by p.id asc;

-- ---------------------------------------------------------
-- 4) Prospecção por lista de CNAEs com CNAE principal e secundário.
-- Deve usar índices parciais de establishments ativos e índice por CNAE
-- secundário em establishment_secondary_cnaes.
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 5) Prospecção por razão social.
-- Deve usar GIN/trgm em lower(company_name), desde que o filtro não seja curto demais.
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 6) Prospecção por sócio.
-- Deve usar GIN/trgm em lower(partner_name), desde que o filtro não seja curto demais.
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 7) Endpoint informativo usando materialized view.
-- Deve ser praticamente instantâneo.
-- ---------------------------------------------------------
EXPLAIN (ANALYZE, BUFFERS)
select
  state_code,
  total
from mv_infos_empresas_ativas_por_uf
order by total desc;
