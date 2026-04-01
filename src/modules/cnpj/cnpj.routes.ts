import type { FastifyInstance } from "fastify";
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
        params: {
          type: "object",
          required: ["cnpj"],
          properties: {
            cnpj: {
              type: "string",
              description:
                "CNPJ básico com 8 dígitos ou CNPJ completo com 14 dígitos.",
            },
          },
        },
      },
    },
    controller.findByDocument,
  );
}
