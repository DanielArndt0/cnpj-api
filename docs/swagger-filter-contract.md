# Alinhamento entre Swagger e regra de negócio

## Problema resolvido

Antes desta atualização, parte das rotas já possuía restrições na camada de serviço, mas o Swagger ainda apresentava filtros como opcionais sem deixar explícitas as combinações mínimas aceitas.

Isso gerava uma documentação menos fiel ao comportamento real da API.

## Ajustes aplicados

### 1. Descrições mais claras por endpoint

As rotas de listagem agora descrevem explicitamente a regra mínima de busca aceita.

### 2. Querystring documentada com combinações válidas

Foram adicionadas regras de contrato diretamente no schema do Swagger:

- `/api/empresas`: `cnpjBasico` **ou** `razaoSocial`;
- `/api/estabelecimentos`: `cnpjBasico` **ou** `uf + codigoCnaePrincipal`;
- `/api/socios`: `cnpjBasico` obrigatório.

### 3. Exemplos de entrada

Os parâmetros receberam exemplos práticos para melhorar a leitura da documentação.

### 4. Respostas de erro documentadas

As rotas principais agora exibem resposta `400` padronizada para violações de contrato.

## Resultado esperado

Com isso, o consumidor passa a enxergar no Swagger um contrato mais próximo do comportamento real da API, reduzindo ambiguidades e consultas indevidas.
