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
        "Quantidade de itens por página. O limite máximo aplicado pela API é 50.",
      examples: ["20"],
    },
  },
} as const;
