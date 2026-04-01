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

  app.get(
    "/health",
    {
      schema: {
        tags: ["Root"],
        summary: "Health check da API",
      },
    },
    async () => ({
      sucesso: true,
      dados: {
        servico: "cnpj-api",
        status: "healthy",
      },
    }),
  );
}
