import type { FastifyInstance } from "fastify";
import {
  errorEnvelopeSchema,
  partnerQuerystringSchema,
} from "../../shared/contracts/api.schemas.js";
import { PartnerController } from "./partner.controller.js";
import { PartnerRepository } from "./partner.repository.js";
import { PartnerService } from "./partner.service.js";

export async function partnerRoutes(app: FastifyInstance) {
  const repository = new PartnerRepository();
  const service = new PartnerService(repository);
  const controller = new PartnerController(service);

  app.get(
    "/socios",
    {
      schema: {
        tags: ["Sócios"],
        summary: "Busca especializada de sócios",
        description:
          "Busca vínculos societários associados a uma empresa. Esta rota sempre exige vínculo com CNPJ para evitar listagens abertas.",
        querystring: partnerQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.list,
  );
}
