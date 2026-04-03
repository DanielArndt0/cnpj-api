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
        summary: "Busca especializada de estabelecimentos",
        description:
          "Busca unidades cadastrais específicas, como matriz e filial. Use esta rota para filtros operacionais, como UF e CNAE principal. Para visão consolidada de um documento específico, prefira /api/cnpjs/:cnpj.",
        querystring: establishmentQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.list,
  );
}
