export interface DomainDefinition {
  slug: string;
  tableName: string;
  title: string;
  summary: string;
  description: string;
  examples: {
    query?: string;
    code?: string;
  };
}

export const DOMAIN_DEFINITIONS: readonly DomainDefinition[] = [
  {
    slug: "cnaes",
    tableName: "cnaes",
    title: "CNAEs",
    summary: "Classificação Nacional de Atividades Econômicas",
    description:
      "Tabela de apoio para classificação das atividades econômicas principais e secundárias de empresas e estabelecimentos.",
    examples: {
      query: "software",
      code: "6201501",
    },
  },
  {
    slug: "cidades",
    tableName: "cities",
    title: "Cidades",
    summary: "Municípios utilizados nos registros cadastrais",
    description:
      "Tabela de apoio com municípios utilizados pelas estruturas cadastrais do CNPJ.",
    examples: {
      query: "londrina",
      code: "6901",
    },
  },
  {
    slug: "paises",
    tableName: "countries",
    title: "Países",
    summary: "Países referenciados nos registros cadastrais",
    description:
      "Tabela de apoio com países utilizados em registros cadastrais e societários.",
    examples: {
      query: "brasil",
      code: "105",
    },
  },
  {
    slug: "qualificacoes-de-socios",
    tableName: "partner_qualifications",
    title: "Qualificações de sócios",
    summary: "Qualificações cadastrais associadas a sócios e responsáveis",
    description:
      "Tabela de apoio para qualificação do sócio ou do responsável informado nas bases do CNPJ.",
    examples: {
      query: "socio",
      code: "49",
    },
  },
  {
    slug: "naturezas-juridicas",
    tableName: "legal_natures",
    title: "Naturezas jurídicas",
    summary: "Natureza jurídica da pessoa jurídica",
    description:
      "Tabela de apoio com a natureza jurídica da empresa, útil para filtros, relatórios e enriquecimento cadastral.",
    examples: {
      query: "sociedade",
      code: "2062",
    },
  },
  {
    slug: "motivos-cadastrais",
    tableName: "reasons",
    title: "Motivos cadastrais",
    summary: "Motivos associados a situações cadastrais",
    description:
      "Tabela de apoio com motivos de situação cadastral utilizados em estabelecimentos.",
    examples: {
      query: "extincao",
      code: "01",
    },
  },
  {
    slug: "portes",
    tableName: "company_sizes",
    title: "Portes de empresa",
    summary: "Portes ou enquadramentos de porte empresarial",
    description: "Tabela de apoio com a classificação de porte da empresa.",
    examples: {
      query: "micro",
      code: "01",
    },
  },
  {
    slug: "tipos-de-estabelecimento",
    tableName: "branch_types",
    title: "Tipos de estabelecimento",
    summary: "Tipos cadastrais de estabelecimento, como matriz e filial",
    description:
      "Tabela de apoio com o tipo de estabelecimento utilizado nas consultas operacionais.",
    examples: {
      query: "matriz",
      code: "1",
    },
  },
  {
    slug: "situacoes-cadastrais",
    tableName: "registration_statuses",
    title: "Situações cadastrais",
    summary: "Situações cadastrais do estabelecimento",
    description: "Tabela de apoio com o status cadastral do estabelecimento.",
    examples: {
      query: "ativa",
      code: "02",
    },
  },
  {
    slug: "tipos-de-socio",
    tableName: "partner_types",
    title: "Tipos de sócio",
    summary: "Tipos de vínculo societário",
    description:
      "Tabela de apoio com o tipo de sócio informado nos registros societários.",
    examples: {
      query: "pessoa",
      code: "1",
    },
  },
  {
    slug: "faixas-etarias",
    tableName: "age_groups",
    title: "Faixas etárias",
    summary: "Faixas etárias derivadas para uso societário",
    description:
      "Tabela de apoio com faixas etárias utilizadas na apresentação de dados societários.",
    examples: {
      query: "31",
      code: "4",
    },
  },
] as const;

const domainDefinitionMap = new Map(
  DOMAIN_DEFINITIONS.map((definition) => [definition.slug, definition]),
);

export function getDomainDefinition(
  slug: string,
): DomainDefinition | undefined {
  return domainDefinitionMap.get(slug);
}
