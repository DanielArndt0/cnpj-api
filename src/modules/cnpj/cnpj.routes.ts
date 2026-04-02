import type { FastifyInstance } from "fastify";
import { errorEnvelopeSchema } from "../../shared/contracts/api.schemas.js";
import { CnpjController } from "./cnpj.controller.js";
import { CnpjRepository } from "./cnpj.repository.js";
import { CnpjService } from "./cnpj.service.js";

export async function cnpjRoutes(app: FastifyInstance) {
  const repository = new CnpjRepository();
  const service = new CnpjService(repository);
  const controller = new CnpjController(service);

  app.get(
    "/cnpjs/:cnpj",
    {
      schema: {
        tags: ["Consulta por CNPJ"],
        summary: "Consulta consolidada por CNPJ",
        description:
          "Consulta consolidada por CNPJ básico ou completo. A API sanitiza a entrada para aceitar apenas dígitos úteis antes de aplicar as regras de negócio.",
        params: {
          type: "object",
          required: ["cnpj"],
          properties: {
            cnpj: {
              type: "string",
              description:
                "CNPJ básico com 8 dígitos ou CNPJ completo com 14 dígitos. A entrada pode ser enviada com pontuação.",
              examples: ["12345678", "12.345.678/0001-95"],
            },
          },
        },
        response: {
          400: errorEnvelopeSchema,
          404: errorEnvelopeSchema,
        },
      },
    },
    controller.findByDocument,
  );
}
