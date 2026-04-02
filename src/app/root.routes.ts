import type { FastifyInstance } from "fastify";

export async function rootRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        tags: ["Root"],
        summary: "Informações básicas da API",
      },
    },
    async () => ({
      sucesso: true,
      dados: {
        nome: "cnpj-api",
        versao: "1.0.0",
        status: "running",
        documentacao: "/docs",
      },
    }),
  );
}
