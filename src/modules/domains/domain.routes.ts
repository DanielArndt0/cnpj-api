import type { FastifyInstance } from "fastify";
import { DomainController } from "./domain.controller.js";
import { DomainRepository } from "./domain.repository.js";

export async function domainRoutes(app: FastifyInstance) {
  const repository = new DomainRepository();
  const controller = new DomainController(repository);

  app.get(
    "/dominios",
    {
      schema: {
        tags: ["Domínios"],
        summary: "Resumo das tabelas de domínio",
      },
    },
    controller.summary,
  );
}
