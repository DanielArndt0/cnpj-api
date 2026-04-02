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
        summary: "Lista controlada de sócios",
        description:
          "Lista sócios vinculados a um CNPJ básico específico. Não permite listagem aberta sem vínculo empresarial.",
        querystring: partnerQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.list,
  );
}
