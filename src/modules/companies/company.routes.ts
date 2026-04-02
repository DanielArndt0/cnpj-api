import type { FastifyInstance } from "fastify";
import {
  companyQuerystringSchema,
  errorEnvelopeSchema,
} from "../../shared/contracts/api.schemas.js";
import { CompanyController } from "./company.controller.js";
import { CompanyRepository } from "./company.repository.js";
import { CompanyService } from "./company.service.js";

export async function companyRoutes(app: FastifyInstance) {
  const repository = new CompanyRepository();
  const service = new CompanyService(repository);
  const controller = new CompanyController(service);

  app.get(
    "/empresas",
    {
      schema: {
        tags: ["Empresas"],
        summary: "Lista controlada de empresas",
        description:
          "Lista empresas com consulta mínima útil. Informe cnpjBasico ou razaoSocial para evitar consultas amplas e custosas.",
        querystring: companyQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.list,
  );
}
