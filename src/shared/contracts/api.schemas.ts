import {
  domainPaginationQuerystringSchema,
  paginationQuerystringSchema,
} from "./pagination.contract.js";

export const successEnvelopeSchema = {
  type: "object",
  properties: {
    sucesso: { type: "boolean", example: true },
    dados: {},
  },
} as const;

export const errorEnvelopeSchema = {
  type: "object",
  properties: {
    sucesso: { type: "boolean", example: false },
    mensagem: { type: "string" },
  },
  required: ["sucesso", "mensagem"],
} as const;

const locationQuerystringProperties = {
  uf: {
    type: "string",
    description: "Sigla válida de unidade federativa brasileira.",
    examples: ["PR", "SP"],
  },
  municipio: {
    type: "string",
    description:
      "Nome parcial do município. Exige uf para evitar ambiguidades.",
  },
} as const;

export const companyListByCnaeQuerystringSchema = {
  ...paginationQuerystringSchema,
  description: "Busca paginada de empresas para prospecção por lista de CNAEs.",
  required: ["codigosCnae"],
  properties: {
    ...paginationQuerystringSchema.properties,
    codigosCnae: {
      type: "string",
      description:
        "Lista de códigos CNAE com 7 dígitos, separada por vírgula. A busca considera CNAE principal e CNAEs secundários.",
      examples: ["4120400,4211101,4299599"],
    },
    ...locationQuerystringProperties,
  },
} as const;

export const companyListByCompanyNameQuerystringSchema = {
  ...paginationQuerystringSchema,
  description: "Busca paginada de empresas para prospecção por razão social.",
  required: ["razaoSocial"],
  properties: {
    ...paginationQuerystringSchema.properties,
    razaoSocial: {
      type: "string",
      description:
        "Razão social parcial ou completa. Deve conter ao menos 3 caracteres úteis.",
    },
    ...locationQuerystringProperties,
  },
} as const;

export const companyListByPartnerNameQuerystringSchema = {
  ...paginationQuerystringSchema,
  description: "Busca paginada de empresas para prospecção por nome de sócio.",
  required: ["nomeSocio"],
  properties: {
    ...paginationQuerystringSchema.properties,
    nomeSocio: {
      type: "string",
      description:
        "Nome parcial do sócio. Deve conter ao menos 3 caracteres úteis.",
    },
    ...locationQuerystringProperties,
  },
} as const;

export const partnerQuerystringSchema = {
  ...paginationQuerystringSchema,
  description:
    "Consulta relacional controlada. Informe cnpj ou cnpjBasico para consultar sócios vinculados a uma empresa específica.",
  properties: {
    ...paginationQuerystringSchema.properties,
    cnpj: {
      type: "string",
      description: "CNPJ da empresa.",
      examples: ["12.345.678/0001-95"],
    },
    cnpjBasico: {
      type: "string",
      description:
        "Parâmetro legado equivalente à raiz do CNPJ com 8 dígitos. Prefira usar cnpj.",
      examples: ["12.345.678"],
    },
  },
} as const;

export const domainCodeParamsSchema = {
  type: "object",
  required: ["codigo"],
  properties: {
    codigo: {
      type: "string",
      description:
        "Código exato do registro dentro da tabela de domínio consultada.",
      examples: ["02"],
    },
  },
} as const;

export const domainListQuerystringSchema = {
  ...domainPaginationQuerystringSchema,
  description:
    "Permite listagem paginada dos domínios com busca textual opcional e filtro por código exato.",
  properties: {
    ...domainPaginationQuerystringSchema.properties,
    busca: {
      type: "string",
      description:
        "Busca textual opcional por código ou descrição. Não exige quantidade mínima de caracteres.",
      examples: ["ativa"],
    },
    codigo: {
      type: "string",
      description: "Filtro opcional por código exato do domínio.",
      examples: ["02"],
    },
  },
} as const;

export const infoRankingQuerystringSchema = {
  type: "object",
  properties: {
    limite: {
      type: "string",
      description:
        "Quantidade máxima de registros retornados no ranking. A API aplica limite máximo interno para preservar desempenho.",
      examples: ["10"],
    },
  },
} as const;

export const infoCityRankingQuerystringSchema = {
  type: "object",
  properties: {
    uf: {
      type: "string",
      description:
        "Sigla da unidade federativa usada para filtrar municípios. Quando omitida, retorna o ranking nacional.",
      examples: ["PR", "SP"],
    },
    limite: {
      type: "string",
      description:
        "Quantidade máxima de municípios retornados no ranking. A API aplica limite máximo interno para preservar desempenho.",
      examples: ["20"],
    },
  },
} as const;
