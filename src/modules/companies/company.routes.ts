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
        summary: "Busca especializada de empresas",
        description:
          "Busca entidades jurídicas raiz da base de CNPJ. Use esta rota quando quiser pesquisar por razão social ou pela raiz do CNPJ. Para visão consolidada de um documento específico, prefira /api/cnpjs/:cnpj.",
        querystring: companyQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.list,
  );
}
