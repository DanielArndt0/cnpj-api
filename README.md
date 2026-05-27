# CNPJ API

O **CNPJ API** é um projeto criado para expor, por meio de uma API REST, os dados do **Cadastro Nacional da Pessoa Jurídica** de forma simples, organizada e pronta para consumo por aplicações externas.

A proposta do projeto é permitir que você monte sua própria API de consulta de CNPJ sobre uma base local, utilizando como referência o conjunto de dados públicos disponibilizado pela **Receita Federal** no **Portal Brasileiro de Dados Abertos**.

Em vez de depender diretamente de arquivos brutos ou de rotinas internas de carga, esta API trabalha sobre um banco já preparado, com foco exclusivo em **leitura, consulta e exposição de dados via REST**.

## Fonte oficial dos dados

A base pública utilizada como referência neste ecossistema é a disponibilizada no **Portal Brasileiro de Dados Abertos**. Esse conjunto de dados reúne os arquivos públicos relacionados ao CNPJ, usados como base para processamento, transformação e posterior disponibilização via banco de dados local. As informações do conjunto são mantidas pelo governo federal no portal [dados.gov.br](https://dados.gov.br/dados/conjuntos-dados/cadastro-nacional-da-pessoa-juridica---cnpj)

## Relação com o CNPJ DB Loader

O projeto **CNPJ API** faz parte de um fluxo maior.

A preparação dos dados não acontece neste repositório. Antes de usar a API, é necessário que o banco tenha sido previamente montado e populado por uma aplicação separada responsável por:

- importar os arquivos brutos;
- higienizar os dados;
- estruturar tabelas;
- materializar os dados finais;
- executar controles operacionais do processo de carga.

Esse papel é realizado pelo projeto [CNPJ DB Loader](https://github.com/DanielArndt0/cnpj-db-loader)

Em resumo:

- **CNPJ DB Loader** prepara o banco para PostgreSQL;
- **CNPJ API** consome esse banco já pronto e expõe os dados para consulta.

## Escopo da API

Atualmente, a API foi adaptada para consumir apenas:

- tabelas finais de negócio;
- tabelas auxiliares de domínio.

Ela não depende das etapas de staging, importação, checkpoints ou controle operacional para funcionar em tempo de consulta.

## O que esta API oferece

De forma geral, o projeto foi pensado para oferecer uma camada de consulta organizada sobre a base de CNPJ, permitindo:

- consultar informações por CNPJ;
- acessar dados consolidados por CNPJ, listas de empresas e vínculos societários;
- consultar tabelas auxiliares e domínios separadamente, com endpoints explícitos, paginação e filtros leves;
- expor endpoints informativos para indicadores públicos, cards de landing page e relatórios simples;
- separar com clareza a aplicação de leitura da aplicação de carga;
- servir de base para integrações, sistemas internos, dashboards e automações.

## Tabelas lidas pela API

### Tabelas de domínio

- `countries`
- `cities`
- `partner_qualifications`
- `legal_natures`
- `cnaes`
- `reasons`
- `company_sizes`
- `branch_types`
- `registration_statuses`
- `partner_types`
- `age_groups`

### Tabelas finais

- `companies`
- `establishments`
- `establishment_secondary_cnaes`
- `partners`
- `simples_options`

### Materialized views informativas

Os endpoints `/api/infos` leem dados pré-calculados nas seguintes materialized views:

- `mv_infos_empresas_ativas_total`
- `mv_infos_empresas_ativas_por_uf`
- `mv_infos_empresas_ativas_por_municipio`
- `mv_infos_empresas_ativas_por_cnae_principal`
- `mv_infos_empresas_ativas_por_porte`

Essas views devem ser criadas após a materialização das tabelas finais e atualizadas após cada nova carga mensal da base.

> A API ignora propositalmente estruturas internas de processamento utilizadas pelo [CNPJ DB Loader](https://github.com/DanielArndt0/cnpj-db-loader)

## Contrato atual de busca

Regras atuais:

- `GET /api/cnpjs/:cnpj`: exige `cnpj` no path e é o endpoint principal para visão consolidada;
- `GET /api/socios`: exige `cnpj` ou `cnpjBasico` para consultar vínculos societários;
- `GET /api/listas/empresas/cnae`: exige `codigosCnae` e aceita refinamento opcional por `uf` e `municipio`; `municipio` exige `uf`; a busca considera CNAE principal e CNAEs secundários e retorna apenas estabelecimentos ativos;
- `GET /api/listas/empresas/razaosocial`: exige `razaoSocial` e aceita refinamento opcional por `uf` e `municipio`; `municipio` exige `uf`; a resposta retorna apenas estabelecimentos ativos;
- `GET /api/listas/empresas/socio`: exige `nomeSocio` e aceita refinamento opcional por `uf` e `municipio`; `municipio` exige `uf`; a resposta retorna apenas estabelecimentos ativos.

As rotas de domínio possuem endpoints explícitos por domínio, paginação e filtros leves para apoio a interfaces e integrações auxiliares. Nelas, `busca` não exige quantidade mínima de caracteres e `limit` não possui teto máximo interno.

As rotas operacionais/listas aceitam até 1000 registros por página. As rotas informativas ficam em `/api/infos` e expõem indicadores prontos para consumo, como total de CNPJs ativos, ativos por UF, ativos por região, ativos por porte, ativos por CNAE principal e ativos por município. Esses endpoints usam materialized views para evitar contagens e agrupamentos diretos nas tabelas gigantes a cada requisição.

## Documentação adicional

Arquivos complementares foram adicionados em [`/docs`](./docs):

- [`Regras de pesquisa da API`](./docs/api-search-rules.md)
- [`Visão geral de uso da API`](./docs/api-usage-overview.md)
- [`Visão geral do modelo de dados`](./docs/data-model-overview.md)
- [`Referência de domínio`](./docs/domain-reference.md)
- [`Endpoints informativos`](./docs/info-endpoints.md)

## Observação importante

A importação, higienização, staging, materialização e controle operacional dos dados **não fazem parte desta API**.

Essas etapas pertencem ao fluxo de preparação do banco e devem ser executadas previamente pelo [CNPJ DB Loader](https://github.com/DanielArndt0/cnpj-db-loader) ou por outra ferramenta compatível com o mesmo modelo de dados final.

## Execução do projeto

Instale as dependências:

```bash
npm install
npm run dev
```

Execute em modo de produção:

```bash
npm run build
npm start
```

## Configuração de CORS

A lista de origens autorizadas para consumo da API em navegadores fica no `.env`, por meio da variável `CORS_ORIGINS`.

Exemplo para desenvolvimento local:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3010
```

Exemplo para produção:

```env
CORS_ORIGINS=https://seudominio.com.br,https://app.seudominio.com.br
```

Quando `CORS_ORIGINS` estiver vazia ou ausente, a API não libera CORS para origens externas. O valor `*` também é aceito, mas deve ser usado apenas em ambiente controlado, porque libera qualquer origem.

## Scripts úteis

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run format`
- `npm run format:check`
