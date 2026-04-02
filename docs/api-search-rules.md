# Regras de busca da API

## Objetivo

Garantir consultas previsíveis, seguras e compatíveis com uso real em produção.

## Princípio adotado

Nenhuma rota de listagem deve aceitar consulta sem filtro mínimo útil.

## Regras por rota

### `GET /api/cnpjs/:cnpj`

- exige `cnpj` no path;
- aceita CNPJ básico com **8 dígitos** ou CNPJ completo com **14 dígitos**;
- sanitiza a entrada para considerar apenas dígitos;
- rejeita valores inválidos com `400 Bad Request`.

### `GET /api/empresas`

- exige `cnpjBasico` ou `razaoSocial`;
- `cnpjBasico` deve conter exatamente **8 dígitos** após sanitização;
- `razaoSocial` deve conter ao menos **3 caracteres úteis**;
- paginação simples com `limit` máximo de **50**.

### `GET /api/estabelecimentos`

- exige `cnpjBasico` ou a combinação `uf + codigoCnaePrincipal`;
- não aceita apenas `uf`;
- não aceita apenas `codigoCnaePrincipal`;
- `uf` deve ser uma sigla válida de unidade federativa brasileira;
- `codigoCnaePrincipal` deve conter exatamente **7 dígitos** após normalização;
- paginação simples com `limit` máximo de **50**.

### `GET /api/socios`

- exige `cnpjBasico`;
- não permite listagem aberta sem vínculo empresarial;
- paginação simples com `limit` máximo de **50**.

### `GET /api/dominios`

- permanece mais livre por se tratar de apoio a filtros e integrações;
- pode evoluir depois com paginação, cache e busca textual.

## Padrão de erro

Quando a entrada viola o contrato mínimo de busca, a API responde com envelope padronizado:

```json
{
  "sucesso": false,
  "mensagem": "Informe pelo menos um filtro obrigatório: cnpjBasico ou razaoSocial."
}
```
