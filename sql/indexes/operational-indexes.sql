-- =========================================================
-- CNPJ API - Índices operacionais
-- =========================================================
-- Objetivo:
--   Melhorar consultas operacionais diretas da API e do loader,
--   principalmente buscas por raiz de CNPJ, listagem de estabelecimentos
--   de uma empresa e listagem de sócios.
--
-- Quando usar:
--   - Após a criação/materialização das tabelas finais.
--   - Preferencialmente após a carga dos dados, não antes da ingestão staging.
--
-- Observações:
--   1. Este arquivo usa CREATE INDEX IF NOT EXISTS dentro de transação,
--      seguindo o padrão operacional mais simples do schema atual.
--   2. Para bases muito grandes e ambiente em produção, prefira criar
--      índices grandes com CREATE INDEX CONCURRENTLY, um por vez,
--      fora de transação.
--   3. A PK de establishments(cnpj_full), companies(cnpj_root) e
--      simples_options(cnpj_root) já cobre a busca direta principal.

begin;

-- ---------------------------------------------------------
-- Tabelas operacionais finais
-- ---------------------------------------------------------

-- Apoio geral para joins e consultas por raiz.
-- Observação: pode ficar redundante se você mantiver idx_establishments_cnpj_root_order,
-- mas é leve conceitualmente e já existe no schema base.
create index if not exists idx_establishments_cnpj_root
  on establishments (cnpj_root);

-- Consulta de estabelecimentos de uma mesma raiz, já na ordem natural
-- de CNPJ: raiz + ordem + dígitos verificadores.
-- Útil para endpoints de detalhe por CNPJ raiz.
create index if not exists idx_establishments_cnpj_root_order
  on establishments (cnpj_root, cnpj_order, cnpj_check_digits);

-- Apoio geral para joins e consultas por raiz em sócios.
create index if not exists idx_partners_cnpj_root
  on partners (cnpj_root);

-- Consulta de sócios por raiz com ordenação estável por id.
-- Útil para detalhes de empresa e listagem de sócios.
create index if not exists idx_partners_cnpj_root_id
  on partners (cnpj_root, id);

-- Apoio para CNAE secundário por código.
-- O schema base já possui PK (cnpj_full, cnae_code), então este índice cobre
-- o caminho inverso: buscar primeiro pelo CNAE.
create index if not exists idx_establishment_secondary_cnaes_cnae_code
  on establishment_secondary_cnaes (cnae_code);

-- ---------------------------------------------------------
-- Tabelas de controle de importação
-- ---------------------------------------------------------

create index if not exists idx_import_plans_status
  on import_plans (status);

create index if not exists idx_import_plans_load_status
  on import_plans (load_status);

create index if not exists idx_import_plans_materialization_status
  on import_plans (materialization_status);

create index if not exists idx_import_plan_files_plan_id
  on import_plan_files (plan_id);

create index if not exists idx_import_plan_files_dataset
  on import_plan_files (dataset);

create index if not exists idx_import_checkpoints_status
  on import_checkpoints (status);

create index if not exists idx_import_checkpoints_dataset
  on import_checkpoints (dataset);

create index if not exists idx_import_materialization_checkpoints_status
  on import_materialization_checkpoints (status);

create index if not exists idx_import_materialization_checkpoints_plan_id
  on import_materialization_checkpoints (plan_id);

create index if not exists idx_import_materialization_checkpoints_dataset
  on import_materialization_checkpoints (dataset);

create index if not exists idx_import_quarantine_dataset
  on import_quarantine (dataset);

create index if not exists idx_import_quarantine_file_path
  on import_quarantine (file_path);

create index if not exists idx_import_quarantine_error_category
  on import_quarantine (error_category);

create index if not exists idx_import_quarantine_can_retry_later
  on import_quarantine (can_retry_later);

commit;
