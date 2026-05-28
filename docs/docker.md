# Docker

## Imagem da API

A imagem da CNPJ API é construída a partir do Dockerfile:

```txt
infra/docker/api.Dockerfile
```

A imagem publicada no GitHub Container Registry usa o repositório:

```txt
ghcr.io/danielarndt0/cnpj-api
```

## Variáveis de ambiente

As variáveis de ambiente devem ser injetadas em tempo de execução, pelo Docker Compose ou pelo ambiente do container.

A imagem não copia arquivos `.env` para dentro do container.

Exemplo mínimo de `.env` para Docker:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/cnpj
DATABASE_POOL_MAX=10
DATABASE_IDLE_TIMEOUT_MS=30000
DATABASE_CONNECTION_TIMEOUT_MS=5000
DATABASE_QUERY_TIMEOUT_MS=90000
DATABASE_STATEMENT_TIMEOUT_MS=90000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3010
REQUEST_TIMEOUT_MS=90000
CONNECTION_TIMEOUT_MS=5000
KEEP_ALIVE_TIMEOUT_MS=5000
```

Se o PostgreSQL estiver em outro container da mesma rede Docker, use o nome do serviço como host:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/cnpj
```

Se o PostgreSQL estiver instalado diretamente na máquina host, em Docker Desktop para Windows/macOS normalmente use:

```env
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/cnpj
```

## Build local

```bash
docker build -f infra/docker/api.Dockerfile -t cnpj-api:local .
```

## Execução local com Docker

```bash
docker run --rm \
  --env-file .env \
  -p 3000:3000 \
  cnpj-api:local
```

## Execução com Docker Compose

Copie o arquivo de exemplo:

```bash
cp compose.example.yml compose.yml
```

Depois execute:

```bash
docker compose up --build
```

O Compose injeta as variáveis do `.env` no container usando `env_file`.

## Publicação da imagem

O workflow de publicação fica em:

```txt
.github/workflows/docker-publish.yml
```

Ele roda somente em tags no padrão:

```txt
v*.*.*
```

Exemplo:

```bash
git tag v1.7.0
git push origin v1.7.0
```

O workflow publica as tags:

```txt
ghcr.io/danielarndt0/cnpj-api:v1.7.0
ghcr.io/danielarndt0/cnpj-api:latest
```
