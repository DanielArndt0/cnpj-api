import type { FastifyInstance } from "fastify";
import {
  errorEnvelopeSchema,
  establishmentQuerystringSchema,
} from "../../shared/contracts/api.schemas.js";
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
        description:
          "Lista estabelecimentos com filtros mínimos obrigatórios. Informe cnpjBasico ou combine uf com codigoCnaePrincipal.",
        querystring: establishmentQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.list,
  );
}
