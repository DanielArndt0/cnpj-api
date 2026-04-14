# Regras de busca da API

As rotas operacionais seguem contratos diferentes conforme o objetivo da consulta.

A consulta consolidada por CNPJ continua sendo a principal entrada para buscas pontuais, enquanto as listas de empresas foram separadas em rotas especializadas para prospecção.

## Consulta principal

### `GET /api/cnpjs/:cnpj`

Esse é o endpoint principal da API.

Use quando você já tem um CNPJ e quer uma visão consolidada do cadastro.

Aceita:

- CNPJ com **8 dígitos** para raiz
- CNPJ com **14 dígitos** para documento completo
- entrada formatada, porque a API **sanitiza** os dígitos

## Rotas especializadas

### `GET /api/socios`

Aceita consulta quando houver:

- `cnpj`
- `cnpjBasico`

Observações:

- a rota é relacional e sempre exige vínculo com uma empresa específica
- não permite listagem aberta

### `GET /api/listas/empresas/cnae`

Exige:

- `codigosCnae`

Aceita refinamento opcional com:

- `uf`
- `municipio`

Observações:

- a rota foi pensada para prospecção por atividade econômica em lista de CNAEs
- `municipio` exige `uf` para reduzir ambiguidades
- quando `municipio` é informado, a API resolve primeiro os códigos compatíveis antes da consulta principal
- a paginação continua disponível por `page` e `limit`
- a busca considera CNAE principal e CNAEs secundários
- a resposta retorna apenas estabelecimentos ativos

### `GET /api/listas/empresas/razaosocial`

Exige:

- `razaoSocial`

Aceita refinamento opcional com:

- `uf`
- `municipio`

Observações:

- a rota foi pensada para prospecção por nome empresarial
- `municipio` exige `uf` para reduzir ambiguidades
- filtros textuais exigem no mínimo **3 caracteres úteis**
- a resposta retorna apenas estabelecimentos ativos
- o filtro textual principal foi isolado da montagem final dos dados para reduzir custo nas tabelas grandes

### `GET /api/listas/empresas/socio`

Exige:

- `nomeSocio`

Aceita refinamento opcional com:

- `uf`
- `municipio`

Observações:

- a rota foi pensada para prospecção por vínculo societário
- `municipio` exige `uf` para reduzir ambiguidades
- filtros textuais exigem no mínimo **3 caracteres úteis**
- a busca textual de sócio é resolvida primeiro em `partners` e só depois materializa os estabelecimentos
- a resposta retorna apenas estabelecimentos ativos

## Rotas de domínio

### `GET /api/dominios`

Retorna o resumo dos domínios disponíveis.

### `GET /api/dominios/:domain`

Permite listagem paginada dos domínios com filtros leves.

Parâmetros suportados:

- `page`
- `limit`
- `q`
- `code`

### `GET /api/dominios/:domain/:code`

Recupera um item específico do domínio pelo código exato.

## Paginação

O limite máximo por página é **50 registros**.

Essa regra vale tanto para as rotas operacionais quanto para as rotas de domínio.
