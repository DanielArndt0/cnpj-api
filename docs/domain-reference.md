# Referência dos domínios

## Objetivo

Os endpoints de domínio existem para suportar filtros, preenchimento de interfaces, autocomplete e tradução de códigos em descrições legíveis.

Todos os endpoints de domínio aceitam paginação simples.

Parâmetros suportados:

- `page`
- `limit`
- `q`
- `code`

## Endpoints disponíveis

| Rota                                         | Descrição                                                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `GET /api/dominios`                          | Resumo dos domínios disponíveis, com tabela de origem e quantidade total estimada de registros. |
| `GET /api/dominios/cnaes`                    | Consulta CNAEs por paginação, descrição ou código.                                              |
| `GET /api/dominios/cidades`                  | Consulta cidades utilizadas nos registros cadastrais.                                           |
| `GET /api/dominios/paises`                   | Consulta países referenciados na base.                                                          |
| `GET /api/dominios/qualificacoes-de-socios`  | Consulta qualificações de sócios e responsáveis.                                                |
| `GET /api/dominios/naturezas-juridicas`      | Consulta naturezas jurídicas.                                                                   |
| `GET /api/dominios/motivos-cadastrais`       | Consulta motivos associados a situações cadastrais.                                             |
| `GET /api/dominios/portes`                   | Consulta portes de empresa.                                                                     |
| `GET /api/dominios/tipos-de-estabelecimento` | Consulta tipos cadastrais de estabelecimento, como matriz e filial.                             |
| `GET /api/dominios/situacoes-cadastrais`     | Consulta situações cadastrais de estabelecimentos.                                              |
| `GET /api/dominios/tipos-de-socio`           | Consulta tipos de sócio.                                                                        |
| `GET /api/dominios/faixas-etarias`           | Consulta faixas etárias derivadas utilizadas na apresentação de sócios.                         |

## Consulta por código

Cada domínio também aceita recuperação por código exato no formato:

`GET /api/dominios/:domain/:code`

Exemplos:

- `GET /api/dominios/cnaes/6201501`
- `GET /api/dominios/paises/105`
- `GET /api/dominios/situacoes-cadastrais/02`

## Observações de uso

- Domínios são rotas de apoio e podem ser usados de forma mais livre do que as rotas operacionais.
- Mesmo assim, a API mantém paginação e limite máximo para preservar previsibilidade.
- A busca textual em `q` é opcional e aplicada sobre código e descrição.
