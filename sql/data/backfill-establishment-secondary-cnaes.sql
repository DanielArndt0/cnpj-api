-- =========================================================
-- CNPJ API - Backfill da tabela de CNAEs secundários por estabelecimento
-- =========================================================
-- Objetivo:
--   Popular a tabela establishment_secondary_cnaes a partir do campo bruto
--   secondary_cnaes_raw já existente em establishments.
--
-- Observações:
--   1. Execute este script apenas quando a tabela ainda não estiver populada
--      ou quando houver necessidade controlada de reconstrução.
--   2. Em bases muito grandes, a recomendação é executar o backfill antes da
--      criação dos índices secundários dessa tabela.

insert into establishment_secondary_cnaes (
  cnpj_full,
  cnae_code
)
select distinct
  e.cnpj_full,
  btrim(cnae_code) as cnae_code
from establishments e
cross join lateral unnest(
  string_to_array(e.secondary_cnaes_raw, ',')
) as cnae_code
where e.secondary_cnaes_raw is not null
  and e.secondary_cnaes_raw <> ''
  and btrim(cnae_code) <> '';
