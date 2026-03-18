import { FastifyInstance } from "fastify";

export async function rootRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      name: "cnpj-api",
      version: "1.0.0",
      status: "running",
    };
  });
}
