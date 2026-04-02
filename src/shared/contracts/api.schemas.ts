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
    cnpjBasico: {
      type: "string",
      description:
        "CNPJ básico da empresa. Obrigatório quando razaoSocial não for informado. Aceita entrada formatada, mas a API normaliza e exige exatamente 8 dígitos.",
      examples: ["12345678", "12.345.678"],
    },
    razaoSocial: {
      type: "string",
      description:
        "Razão social parcial ou completa. Obrigatória quando cnpjBasico não for informado. Deve conter ao menos 3 caracteres úteis.",
      examples: ["mercado", "tecnologia"],
    },
  },
  anyOf: [{ required: ["cnpjBasico"] }, { required: ["razaoSocial"] }],
} as const;

export const establishmentQuerystringSchema = {
  ...paginationQuerystringSchema,
  description:
    "Informe cnpjBasico ou combine uf com codigoCnaePrincipal. Consultas apenas por UF ou apenas por CNAE não são aceitas.",
  properties: {
    ...paginationQuerystringSchema.properties,
    cnpjBasico: {
      type: "string",
      description:
        "CNPJ básico do grupo empresarial. Obrigatório quando a combinação uf + codigoCnaePrincipal não for informada. Aceita entrada formatada, mas a API normaliza e exige exatamente 8 dígitos.",
      examples: ["12345678", "12.345.678"],
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
        "Código CNAE principal com 7 dígitos. Obrigatório quando cnpjBasico não for informado. A API aceita formato pontuado e normaliza a entrada.",
      examples: ["6201501", "62.01-5-01"],
    },
  },
  anyOf: [
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
    cnpjBasico: {
      type: "string",
      description:
        "CNPJ básico vinculado aos sócios consultados. Aceita entrada formatada, mas a API normaliza e exige exatamente 8 dígitos.",
      examples: ["12345678", "12.345.678"],
    },
  },
  required: ["cnpjBasico"],
} as const;
