import { paginationQuerystringSchema } from "./pagination.contract.js";

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

export const companyQuerystringSchema = {
  ...paginationQuerystringSchema,
  description:
    "Informe ao menos um filtro útil para evitar consultas amplas. Esta rota exige cnpjBasico ou razaoSocial.",
  properties: {
    ...paginationQuerystringSchema.properties,
    cnpj: {
      type: "string",
      description: "CNPJ da empresa.",
      examples: ["12.345.678/0001-95"],
    },
    cnpjBasico: {
      type: "string",
      description: "Parâmetro legado equivalente à raiz do CNPJ com 8 dígitos.",
      examples: ["12.345.678"],
    },
    razaoSocial: {
      type: "string",
      description:
        "Razão social parcial ou completa. Obrigatória quando cnpjBasico não for informado. Deve conter ao menos 3 caracteres úteis.",
    },
  },
  anyOf: [
    { required: ["cnpj"] },
    { required: ["cnpjBasico"] },
    { required: ["razaoSocial"] },
  ],
} as const;

export const establishmentQuerystringSchema = {
  ...paginationQuerystringSchema,
  description:
    "Informe cnpjBasico ou combine uf com codigoCnaePrincipal. Consultas apenas por UF ou apenas por CNAE não são aceitas.",
  properties: {
    ...paginationQuerystringSchema.properties,
    cnpj: {
      type: "string",
      description: "CNPJ da empresa.",
      examples: ["12.345.678/0001-95", "12.345.678"],
    },
    cnpjBasico: {
      type: "string",
      description: "Parâmetro legado equivalente à raiz do CNPJ com 8 dígitos.",
      examples: ["12.345.678"],
    },
    uf: {
      type: "string",
      description:
        "Sigla válida de unidade federativa brasileira. Obrigatória quando cnpjBasico não for informado.",
      examples: ["PR", "SP"],
    },
    codigoCnaePrincipal: {
      type: "string",
      description:
        "Código CNAE principal com 7 dígitos. Obrigatório quando cnpjBasico não for informado.",
      examples: ["6201501"],
    },
  },
  anyOf: [
    { required: ["cnpj"] },
    { required: ["cnpjBasico"] },
    { required: ["uf", "codigoCnaePrincipal"] },
  ],
} as const;

export const partnerQuerystringSchema = {
  ...paginationQuerystringSchema,
  description:
    "Consulta relacional controlada. Esta rota exige cnpjBasico para evitar listagens abertas.",
  properties: {
    ...paginationQuerystringSchema.properties,
    cnpj: {
      type: "string",
      description: "CNPJ da empresa.",
      examples: ["12.345.678/0001-95"],
    },
    cnpjBasico: {
      type: "string",
      description: "Parâmetro legado equivalente à raiz do CNPJ com 8 dígitos.",
      examples: ["12.345.678"],
    },
  },
  anyOf: [{ required: ["cnpj"] }, { required: ["cnpjBasico"] }],
} as const;

export const domainParamsSchema = {
  type: "object",
  required: ["domain"],
  properties: {
    domain: {
      type: "string",
      description: "Tipo de domínio consultado.",
      examples: [
        "cnaes",
        "cidades",
        "paises",
        "qualificacoes-de-socios",
        "naturezas-juridicas",
        "motivos-cadastrais",
        "portes",
        "tipos-de-estabelecimento",
        "situacoes-cadastrais",
        "tipos-de-socio",
        "faixas-etarias",
      ],
    },
  },
} as const;

export const domainCodeParamsSchema = {
  type: "object",
  required: ["domain", "code"],
  properties: {
    domain: domainParamsSchema.properties.domain,
    code: {
      type: "string",
      description:
        "Código exato do registro dentro da tabela de domínio selecionada.",
    },
  },
} as const;

export const domainListQuerystringSchema = {
  ...paginationQuerystringSchema,
  description:
    "Permite listagem paginada dos domínios com busca textual opcional e filtro por código exato.",
  properties: {
    ...paginationQuerystringSchema.properties,
    q: {
      type: "string",
      description:
        "Busca textual opcional. Deve conter ao menos 2 caracteres úteis.",
    },
    code: {
      type: "string",
      description: "Filtro opcional por código exato do domínio.",
    },
  },
} as const;
