# Endpoints informativos

## Objetivo

Os endpoints informativos foram criados para expor números simples, indicadores e rankings da base CNPJ sem obrigar outras aplicações a montar consultas pesadas ou conhecer a estrutura interna do banco.

Eles são úteis para:

- cards de landing page;
- dashboards simples;
- páginas comerciais;
- integrações que precisam exibir estatísticas prontas;
- relatórios rápidos por região, UF, município, porte ou CNAE.

## Critério de empresa ativa

Na base da Receita Federal, a situação cadastral fica na tabela `establishments`. Por isso, os indicadores de empresas ativas consideram:

```sql
registration_status_code = '02'
```

A API apresenta esse critério em português na resposta:

```json
{
  "codigoSituacaoCadastral": "02",
  "descricaoSituacaoCadastral": "Ativa",
  "escopo": "CNPJs completos/estabelecimentos ativos. Uma mesma empresa pode possuir mais de um estabelecimento ativo."
}
```

> Para evitar ambiguidade, os totais representam CNPJs completos/estabelecimentos ativos. Uma empresa com matriz e filiais ativas pode aparecer mais de uma vez.

## Cache

Os endpoints de `/api/infos` usam cache em memória por padrão para reduzir carga em páginas públicas.

Variável de ambiente:

```env
INFO_CACHE_TTL_SECONDS=300
```

- `300`: mantém cache por 5 minutos.
- `0`: desativa cache em memória.

Como a base CNPJ não muda a cada segundo, esse cache é recomendado para landing pages e páginas públicas.

## Endpoints disponíveis

| Rota                                                | Descrição                                                            |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| `GET /api/infos`                                    | Lista os endpoints informativos disponíveis.                         |
| `GET /api/infos/empresas/ativas/resumo`             | Resumo pronto para cards de landing page.                            |
| `GET /api/infos/empresas/ativas/total`              | Total de CNPJs completos/estabelecimentos ativos.                    |
| `GET /api/infos/empresas/ativas/por-uf`             | Quantidade de CNPJs ativos agrupados por UF.                         |
| `GET /api/infos/empresas/ativas/por-regiao`         | Quantidade de CNPJs ativos agrupados por região brasileira.          |
| `GET /api/infos/empresas/ativas/por-porte`          | Quantidade de CNPJs ativos agrupados por porte da empresa.           |
| `GET /api/infos/empresas/ativas/por-cnae-principal` | Ranking de CNPJs ativos por CNAE principal.                          |
| `GET /api/infos/empresas/ativas/por-municipio`      | Ranking de CNPJs ativos por município, com filtro opcional por `uf`. |

## Parâmetros

### Ranking por CNAE principal

`GET /api/infos/empresas/ativas/por-cnae-principal`

| Parâmetro | Descrição                                          |
| --------- | -------------------------------------------------- |
| `limite`  | Quantidade máxima de itens retornados. Máximo: 50. |

Exemplo:

```http
GET /api/infos/empresas/ativas/por-cnae-principal?limite=10
```

### Ranking por município

`GET /api/infos/empresas/ativas/por-municipio`

| Parâmetro | Descrição                                                |
| --------- | -------------------------------------------------------- |
| `uf`      | Filtro opcional por unidade federativa.                  |
| `limite`  | Quantidade máxima de municípios retornados. Máximo: 100. |

Exemplo:

```http
GET /api/infos/empresas/ativas/por-municipio?uf=PR&limite=20
```

## Índices recomendados

A implementação não exige alteração estrutural no banco. Porém, para bases grandes, recomenda-se aplicar os índices de leitura em:

```text
sql/indexes/info-report-indexes.sql
```

Esses índices são opcionais, não alteram tabelas e servem apenas para acelerar agrupamentos e rankings.

Depois de criar os índices, execute:

```sql
ANALYZE establishments;
ANALYZE companies;
```

## Exemplo de resposta: total de empresas ativas

```json
{
  "sucesso": true,
  "dados": {
    "totalCnpjsAtivos": 21453210,
    "criterio": {
      "tabelaBase": "establishments",
      "campoSituacaoCadastral": "registration_status_code",
      "codigoSituacaoCadastral": "02",
      "descricaoSituacaoCadastral": "Ativa",
      "escopo": "CNPJs completos/estabelecimentos ativos. Uma mesma empresa pode possuir mais de um estabelecimento ativo."
    },
    "geradoEm": "2026-05-25T15:00:00.000Z"
  }
}
```

## Exemplo de resposta: empresas ativas por região

```json
{
  "sucesso": true,
  "dados": {
    "criterio": {
      "codigoSituacaoCadastral": "02",
      "descricaoSituacaoCadastral": "Ativa"
    },
    "totalCnpjsAtivos": 21453210,
    "resultado": [
      {
        "regiao": "Sudeste",
        "total": 10500000,
        "percentual": 48.94
      }
    ],
    "geradoEm": "2026-05-25T15:00:00.000Z"
  }
}
```
