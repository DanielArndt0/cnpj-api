export const paginationQuerystringSchema = {
  type: "object",
  properties: {
    page: {
      type: "string",
      description: "Página desejada.",
      examples: ["1"],
    },
    limit: {
      type: "string",
      description:
        "Quantidade de itens por página. O limite máximo aplicado pela API nas rotas operacionais é 1000.",
      examples: ["20"],
    },
  },
} as const;

export const domainPaginationQuerystringSchema = {
  type: "object",
  properties: {
    page: {
      type: "string",
      description: "Página desejada.",
      examples: ["1"],
    },
    limit: {
      type: "string",
      description:
        "Quantidade de itens por página. As rotas de domínio não aplicam teto máximo interno para este parâmetro.",
      examples: ["100"],
    },
  },
} as const;
