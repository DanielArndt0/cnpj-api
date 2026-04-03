# Regras de busca da API

As rotas **operacionais** de listagem não aceitam consulta aberta sem filtro mínimo útil.

Esse princípio reduz consultas pesadas, melhora previsibilidade e deixa a API mais segura para uso externo.

## Consulta principal

### `GET /api/cnpjs/:cnpj`

Esse é o endpoint principal da API.

Use quando você já tem um CNPJ e quer uma visão consolidada do cadastro.

Aceita:

- CNPJ com **8 dígitos** para raiz
- CNPJ com **14 dígitos** para documento completo
- entrada formatada, porque a API **sanitiza** os dígitos

## Rotas especializadas

### `GET /api/empresas`

Exige pelo menos um dos filtros abaixo:

- `cnpj`
- `cnpjBasico`
- `razaoSocial`

Observações:

- `cnpj` pode ser enviado com **8** ou **14 dígitos**
- quando `cnpj` tem **14 dígitos**, a API utiliza a raiz para a busca especializada
- `cnpjBasico` continua aceito por compatibilidade, mas a preferência pública é pelo uso de `cnpj`
- `razaoSocial` exige no mínimo **3 caracteres úteis**

### `GET /api/estabelecimentos`

Aceita consulta quando houver:

- `cnpj`
- `cnpjBasico`
- ou a combinação `uf + codigoCnaePrincipal`

Observações:

- `cnpj` pode ser enviado com **8** ou **14 dígitos**
- quando `cnpj` tem **14 dígitos**, a API utiliza a raiz para a busca especializada do grupo empresarial
- consultas apenas por `uf` ou apenas por `codigoCnaePrincipal` não são aceitas

### `GET /api/socios`

Aceita consulta quando houver:

- `cnpj`
- `cnpjBasico`

Observações:

- a rota é relacional e sempre exige vínculo com uma empresa específica
- não permite listagem aberta

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
