import type { FastifyInstance } from "fastify";
import packageJson from "../../package.json" with { type: "json" };

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
        nome: packageJson.name,
        versao: packageJson.version,
        status: "running",
        documentacao: "/docs",
      },
    }),
  );
}
