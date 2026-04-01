import type { FastifyInstance } from "fastify";
import { EstablishmentController } from "./establishment.controller.js";
import { EstablishmentRepository } from "./establishment.repository.js";
import { EstablishmentService } from "./establishment.service.js";

export async function establishmentRoutes(app: FastifyInstance) {
  const repository = new EstablishmentRepository();
  const service = new EstablishmentService(repository);
  const controller = new EstablishmentController(service);

  app.get(
    "/estabelecimentos",
    {
      schema: {
        tags: ["Estabelecimentos"],
        summary: "Lista controlada de estabelecimentos",
        querystring: {
          type: "object",
          properties: {
            page: { type: "string" },
            limit: { type: "string" },
            cnpjBasico: { type: "string" },
            uf: { type: "string" },
            codigoCnaePrincipal: { type: "string" },
          },
        },
      },
    },
    controller.list,
  );
}
