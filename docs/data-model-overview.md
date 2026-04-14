# Visão do modelo de dados

## Empresa

A entidade de empresa representa a base jurídica do cadastro.

Ela corresponde à raiz do CNPJ e concentra informações estruturais da pessoa jurídica, como:

- razão social
- natureza jurídica
- porte
- capital social
- qualificação do responsável

Em termos de negócio, a empresa é a entidade jurídica principal à qual estabelecimentos e sócios se vinculam.

## Estabelecimento

O estabelecimento representa uma unidade cadastral específica vinculada a uma empresa.

É nesse nível que normalmente aparecem dados como:

- matriz ou filial
- endereço
- município
- UF
- situação cadastral
- CNAE principal
- nome fantasia

Em termos práticos, o estabelecimento é a melhor referência para filtros operacionais e segmentações por localização ou atividade.

## CNAEs secundários por estabelecimento

A estrutura `establishment_secondary_cnaes` representa a relação entre um estabelecimento e seus CNAEs secundários.

Ela existe para evitar consultas pesadas em tempo real sobre o campo bruto `secondary_cnaes_raw` e permitir prospecção mais eficiente por atividade econômica secundária.

Em termos práticos, ela ajuda principalmente as listas de empresas por CNAE, sem substituir o campo original mantido em `establishments`.

## Sócio

O sócio representa o vínculo societário associado à empresa.

Esse conjunto de dados costuma incluir:

- tipo de sócio
- nome do sócio ou razão social vinculada
- qualificação
- país
- representante legal, quando houver
- faixa etária derivada

## Simples

A estrutura de Simples concentra o enquadramento tributário simplificado quando esse dado está disponível na base final.

Ela é útil para compor respostas consolidadas e enriquecer integrações cadastrais.

## Domínios

Os domínios são tabelas auxiliares usadas para traduzir códigos em descrições legíveis e padronizar filtros.

Exemplos de domínios disponíveis:

- CNAEs
- cidades
- países
- naturezas jurídicas
- portes
- situações cadastrais
- tipos de sócio
- qualificações de sócios

Essas tabelas ajudam front-ends, integrações e sistemas analíticos a montar filtros mais completos e previsíveis.
