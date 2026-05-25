# Referência dos domínios

## Objetivo

Os endpoints de domínio existem para suportar filtros, preenchimento de interfaces, autocomplete e tradução de códigos em descrições legíveis.

A partir desta versão, cada domínio é documentado no Swagger como um endpoint próprio. Isso deixa a integração mais clara para front-ends, aplicações externas e clientes que precisam consumir apenas uma tabela de apoio específica.

## Campos retornados

Todos os itens de domínio são retornados com campos em português:

| Campo       | Descrição                                                   |
| ----------- | ----------------------------------------------------------- |
| `codigo`    | Código original do registro na base de domínio.             |
| `descricao` | Descrição legível do registro, traduzida quando necessário. |

> O banco ainda mantém nomes internos em inglês, como `code` e `description`, mas a API apresenta o contrato público em português.

## Parâmetros suportados

Todos os endpoints de listagem aceitam paginação simples e filtros leves:

| Parâmetro | Descrição                                                                          |
| --------- | ---------------------------------------------------------------------------------- |
| `page`    | Página desejada.                                                                   |
| `limit`   | Quantidade de itens por página. O limite máximo aplicado pela API é 50.            |
| `busca`   | Busca textual opcional por código ou descrição. Exige ao menos 2 caracteres úteis. |
| `codigo`  | Filtro opcional por código exato do domínio.                                       |

Os parâmetros antigos `q` e `code` continuam aceitos internamente por compatibilidade, mas o contrato recomendado para novas integrações é `busca` e `codigo`.

## Endpoints disponíveis

| Rota                                         | Descrição                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| `GET /api/dominios`                          | Resumo dos domínios disponíveis e seus endpoints.                       |
| `GET /api/dominios/cnaes`                    | Consulta CNAEs por paginação, descrição ou código.                      |
| `GET /api/dominios/cidades`                  | Consulta cidades utilizadas nos registros cadastrais.                   |
| `GET /api/dominios/paises`                   | Consulta países referenciados na base.                                  |
| `GET /api/dominios/qualificacoes-de-socios`  | Consulta qualificações de sócios e responsáveis.                        |
| `GET /api/dominios/naturezas-juridicas`      | Consulta naturezas jurídicas.                                           |
| `GET /api/dominios/motivos-cadastrais`       | Consulta motivos associados a situações cadastrais.                     |
| `GET /api/dominios/portes`                   | Consulta portes de empresa.                                             |
| `GET /api/dominios/tipos-de-estabelecimento` | Consulta tipos cadastrais de estabelecimento, como matriz e filial.     |
| `GET /api/dominios/situacoes-cadastrais`     | Consulta situações cadastrais de estabelecimentos.                      |
| `GET /api/dominios/tipos-de-socio`           | Consulta tipos de sócio.                                                |
| `GET /api/dominios/faixas-etarias`           | Consulta faixas etárias derivadas utilizadas na apresentação de sócios. |

## Consulta por código

Cada domínio também aceita recuperação por código exato no formato:

`GET /api/dominios/{dominio}/{codigo}`

Exemplos:

- `GET /api/dominios/cnaes/6201501`
- `GET /api/dominios/paises/105`
- `GET /api/dominios/situacoes-cadastrais/02`
- `GET /api/dominios/portes/01`

## Exemplo de resposta de listagem

```json
{
  "sucesso": true,
  "dados": {
    "dominio": {
      "identificador": "situacoes-cadastrais",
      "titulo": "Situações cadastrais",
      "resumo": "Situações cadastrais do estabelecimento",
      "endpoint": "/api/dominios/situacoes-cadastrais"
    },
    "filtrosAplicados": {
      "busca": "ativa",
      "codigo": null
    },
    "resultado": {
      "pagina": 1,
      "limite": 20,
      "total": 1,
      "totalPaginas": 1,
      "dados": [
        {
          "codigo": "02",
          "descricao": "Ativa"
        }
      ]
    }
  }
}
```

## Observações de uso

- Domínios são rotas de apoio e podem ser usados de forma mais livre do que as rotas operacionais.
- Mesmo assim, a API mantém paginação e limite máximo para preservar previsibilidade.
- A busca textual em `busca` é opcional e aplicada sobre código e descrição.
- O Swagger agora exibe cada domínio como rota própria, sem depender visualmente de `:domain`.
