import type { FastifyInstance } from "fastify";
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
        querystring: {
          type: "object",
          properties: {
            page: { type: "string" },
            limit: { type: "string" },
            cnpjBasico: { type: "string" },
          },
        },
      },
    },
    controller.list,
  );
}
