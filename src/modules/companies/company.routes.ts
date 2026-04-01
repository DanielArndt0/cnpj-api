import type { FastifyInstance } from "fastify";
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
        querystring: {
          type: "object",
          properties: {
            page: { type: "string" },
            limit: { type: "string" },
            cnpjBasico: { type: "string" },
            razaoSocial: { type: "string" },
          },
        },
      },
    },
    controller.list,
  );
}
