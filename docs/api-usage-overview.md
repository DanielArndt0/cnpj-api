# Visão de uso da API

## Qual endpoint usar

A API foi organizada em três grupos principais de consulta.

### 1. Consulta principal por CNPJ

Use `GET /api/cnpjs/:cnpj` quando você já tem um CNPJ e quer uma visão consolidada do cadastro.

Esse é o endpoint mais direto para integrações que precisam de uma resposta mais completa em uma única chamada.

Ele foi pensado para reunir, sempre que possível:

- dados da empresa
- dados do estabelecimento
- informações societárias
- enquadramento no Simples
- descrições de tabelas auxiliares relacionadas

### 2. Consultas especializadas

Use os endpoints especializados quando a intenção for pesquisar ou filtrar conjuntos de registros.

#### `GET /api/empresas`

Use quando quiser pesquisar a entidade jurídica raiz da empresa.

Exemplos de uso:

- busca por razão social
- busca por raiz de CNPJ
- filtros para processos de prospecção e enriquecimento cadastral

#### `GET /api/estabelecimentos`

Use quando quiser pesquisar unidades cadastrais específicas, como matriz e filial.

Exemplos de uso:

- filtro por UF e CNAE principal
- busca por grupo empresarial
- consultas operacionais com foco em localização e atividade principal

#### `GET /api/socios`

Use quando quiser consultar vínculos societários de uma empresa específica.

Essa rota não permite listagem aberta e sempre exige vínculo com um CNPJ.

### 3. Domínios

Use os endpoints de domínio para popular filtros, select boxes, autocomplete e validações de interface.

Exemplos:

- `GET /api/dominios/cnaes`
- `GET /api/dominios/cidades`
- `GET /api/dominios/paises`
- `GET /api/dominios/naturezas-juridicas`

Esses endpoints aceitam paginação e filtros leves, porque trabalham com tabelas auxiliares menores do que as tabelas operacionais.

## Observação sobre CNPJ e CNPJ básico

Na experiência pública da API, a preferência é pelo uso do parâmetro `cnpj` sempre que fizer sentido.

Quando uma rota especializada trabalha com a raiz do documento, a API normaliza automaticamente:

- 8 dígitos: trata como raiz do CNPJ
- 14 dígitos: extrai a raiz do CNPJ para aplicar a busca especializada

O parâmetro `cnpjBasico` continua aceito por compatibilidade, mas não é a forma preferencial para uso público da API.
