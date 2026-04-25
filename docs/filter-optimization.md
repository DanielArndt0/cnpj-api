# Organização SQL e estratégia de desempenho

## Visão geral

O esquema principal do banco continua consolidado em `sql/schema.sql`.

A organização adicional foi separada por finalidade para reduzir acoplamento entre:

- criação estrutural do banco;
- carga massiva do CNPJ DB Loader;
- índices avançados voltados para leitura da CNPJ API;
- manutenção das estatísticas do planner;
- diagnóstico com `EXPLAIN (ANALYZE, BUFFERS)`.

## Por que separar os índices avançados

Os índices avançados de prospecção não precisam existir antes da carga inicial. Pelo contrário: em bases muito grandes, criar esses índices durante ou antes da carga pode aumentar o custo do processo.

Por isso, a recomendação é:

1. criar o esquema;
2. popular o banco;
3. aplicar os índices de prospecção posteriormente.

## O que já existe no esquema principal

O esquema base já mantém índices operacionais mínimos que fazem sentido como parte do modelo estrutural do banco, como apoio por `cnpj_root` e índices de tabelas de controle.

## O que foi separado

### `sql/indexes/prospecting-indexes.sql`

Índices voltados aos endpoints de prospecção da API:

- busca por lista de CNAEs considerando CNAE principal e CNAEs secundários;
- busca por razão social;
- busca por sócio;
- refinamento por UF e município;
- apoio aos joins usados pelas listas.
- tabela relacional auxiliar para CNAEs secundários por estabelecimento.

### `sql/maintenance/refresh-planner-statistics.sql`

Atualiza as estatísticas do PostgreSQL depois de mudanças grandes na estrutura ou na distribuição dos dados.

### `sql/data/backfill-establishment-secondary-cnaes.sql`

Executa o backfill inicial da tabela relacional de CNAEs secundários por estabelecimento a partir do campo bruto `secondary_cnaes_raw`.

### `sql/diagnostics/explain-analyze-examples.sql`

Serve para validar se o banco deixou de usar `Seq Scan` nas tabelas grandes quando a busca é seletiva.

## Backfill de CNAEs secundários

Quando a tabela `establishment_secondary_cnaes` ainda não estiver populada, a recomendação é executar um backfill controlado a partir de `establishments.secondary_cnaes_raw` e, depois, atualizar o fluxo do loader para popular essa estrutura no processo normal de carga.
