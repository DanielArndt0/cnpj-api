import type { FastifyInstance } from "fastify";
import {
  companyListByCompanyNameQuerystringSchema,
  companyListByCnaesQuerystringSchema,
  companyListByPartnerNameQuerystringSchema,
  errorEnvelopeSchema,
} from "../../shared/contracts/api.schemas.js";
import { CompanyListController } from "./company-list.controller.js";
import { CompanyListRepository } from "./company-list.repository.js";
import { CompanyListService } from "./company-list.service.js";

export async function companyListRoutes(app: FastifyInstance) {
  const repository = new CompanyListRepository();
  const service = new CompanyListService(repository);
  const controller = new CompanyListController(service);

  app.get(
    "/listas/empresas/cnae",
    {
      schema: {
        tags: ["Listas de Empresas"],
        summary: "Prospecção de empresas por lista de CNAEs",
        description:
          "Busca paginada de empresas para prospecção a partir de uma lista de CNAEs. A busca considera CNAE principal e CNAEs secundários, com refinamento opcional por uf e municipio.",
        querystring: companyListByCnaesQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.listByCnaes,
  );

  app.get(
    "/listas/empresas/razaosocial",
    {
      schema: {
        tags: ["Listas de Empresas"],
        summary: "Prospecção de empresas por razão social",
        description:
          "Busca paginada de empresas para prospecção a partir da razão social, com refinamento opcional por uf e municipio.",
        querystring: companyListByCompanyNameQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.listByCompanyName,
  );

  app.get(
    "/listas/empresas/socio",
    {
      schema: {
        tags: ["Listas de Empresas"],
        summary: "Prospecção de empresas por sócio",
        description:
          "Busca paginada de empresas para prospecção a partir do nome do sócio, com refinamento opcional por uf e municipio.",
        querystring: companyListByPartnerNameQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.listByPartnerName,
  );
}
