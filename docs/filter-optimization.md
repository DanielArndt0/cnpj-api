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

- busca por lista de CNAEs, considerando o campo principal e os CNAEs secundários;
- busca por razão social;
- busca por sócio;
- refinamento por UF e município;
- apoio aos joins usados pelas listas.

### `sql/maintenance/refresh-planner-statistics.sql`

Atualiza as estatísticas do PostgreSQL depois de mudanças grandes na estrutura ou na distribuição dos dados.

### `sql/diagnostics/explain-analyze-examples.sql`

Serve para validar se o banco deixou de usar `Seq Scan` nas tabelas grandes quando a busca é seletiva.

## Estratégia atual para listas por CNAE

A rota `GET /api/listas/empresas/cnae` agora aceita uma lista de códigos CNAE separada por vírgula e aplica a busca em duas frentes:

1. CNAE principal (`main_cnae_code`);
2. CNAEs secundários armazenados em `secondary_cnaes_raw`.

No banco, a estratégia recomendada combina:

- índice B-tree para o campo principal com refinamento por localização;
- índice GIN baseado em array para o campo bruto de CNAEs secundários;
- resolução prévia de município para códigos compatíveis antes da query principal.

## Views, functions e triggers

Não foram criadas views, functions ou triggers novas nesta etapa.

Motivo:

- view comum não melhora desempenho por si só;
- function/procedure não corrige plano ruim automaticamente;
- trigger adicionaria custo de manutenção e não resolve o gargalo principal;
- o problema identificado foi de índice e plano de execução.

Se no futuro a prospecção virar um fluxo muito central, aí pode fazer sentido avaliar:

- materialized views;
- tabelas desnormalizadas para leitura;
- rotinas controladas de refresh.
