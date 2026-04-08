# Visão de uso da API

## Qual endpoint usar

A API foi organizada em quatro grupos principais de consulta.

### 1. Consulta principal por CNPJ

Use `GET /api/cnpjs/:cnpj` quando você já tem um CNPJ e quer uma visão consolidada do cadastro.

Esse é o endpoint mais direto para integrações que precisam de uma resposta mais completa em uma única chamada.

Ele foi pensado para reunir, sempre que possível:

- dados da empresa
- dados do estabelecimento
- informações societárias
- enquadramento no Simples
- descrições de tabelas auxiliares relacionadas

### 2. Listas de empresas para prospecção

Use uma das rotas especializadas abaixo quando a intenção for montar segmentos paginados para prospecção.

#### `GET /api/listas/empresas/cnae`

Use quando quiser encontrar empresas por uma lista de CNAEs relacionados à mesma área de atuação.

Parâmetros principais:

- `codigosCnae` em formato de lista separada por vírgula
- `uf` opcional
- `municipio` opcional, sempre com `uf`

Observação importante:

- a busca considera CNAE principal e CNAEs secundários do estabelecimento

#### `GET /api/listas/empresas/razaosocial`

Use quando quiser encontrar empresas por razão social.

Parâmetros principais:

- `razaoSocial`
- `uf` opcional
- `municipio` opcional, sempre com `uf`

#### `GET /api/listas/empresas/socio`

Use quando quiser encontrar empresas por nome de sócio.

Parâmetros principais:

- `nomeSocio`
- `uf` opcional
- `municipio` opcional, sempre com `uf`

Observações gerais:

- todas as rotas aceitam `page` e `limit`
- `municipio` exige `uf`
- filtros textuais exigem comprimento mínimo quando enviados
- a resposta foi simplificada para navegação operacional por página, sem depender de contagem total exata em tempo real
- em bases grandes, essas rotas podem se beneficiar dos scripts SQL documentados em `docs/filter-optimization.md`

### 3. Sócios

Use `GET /api/socios` quando quiser consultar vínculos societários de uma empresa específica.

Essa rota continua exigindo vínculo com um CNPJ.

### 4. Domínios

Use os endpoints de domínio para popular filtros, select boxes, autocomplete e validações de interface.

Exemplos:

- `GET /api/dominios/cnaes`
- `GET /api/dominios/cidades`
- `GET /api/dominios/paises`
- `GET /api/dominios/naturezas-juridicas`

Esses endpoints aceitam paginação e filtros leves, porque trabalham com tabelas auxiliares menores do que as tabelas operacionais.

## Observação sobre CNPJ e CNPJ básico

Na experiência pública da API, a preferência é pelo uso do parâmetro `cnpj` sempre que fizer sentido.

Quando uma rota trabalha com a raiz do documento, a API normaliza automaticamente:

- 8 dígitos: trata como raiz do CNPJ
- 14 dígitos: extrai a raiz do CNPJ para aplicar a busca relacional

O parâmetro `cnpjBasico` continua aceito apenas nas rotas em que ele ainda existe por compatibilidade.
