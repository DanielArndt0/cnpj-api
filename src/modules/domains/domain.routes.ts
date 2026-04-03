import type { FastifyInstance } from "fastify";
import {
  domainCodeParamsSchema,
  domainListQuerystringSchema,
  domainParamsSchema,
  errorEnvelopeSchema,
} from "../../shared/contracts/api.schemas.js";
import { DomainController } from "./domain.controller.js";
import { DomainRepository } from "./domain.repository.js";
import { DomainService } from "./domain.service.js";

export async function domainRoutes(app: FastifyInstance) {
  const repository = new DomainRepository();
  const service = new DomainService(repository);
  const controller = new DomainController(service);

  app.get(
    "/dominios",
    {
      schema: {
        tags: ["Domínios"],
        summary: "Resumo das tabelas de domínio",
        description:
          "Apresenta uma visão geral dos domínios disponíveis para filtros, autocomplete e integrações auxiliares da API.",
      },
    },
    controller.summary,
  );

  app.get(
    "/dominios/:domain",
    {
      schema: {
        tags: ["Domínios"],
        summary: "Lista registros de uma tabela de domínio",
        description:
          "Consulta paginada de uma tabela de domínio específica. Aceita listagem aberta controlada e filtros por texto livre ou código.",
        params: domainParamsSchema,
        querystring: domainListQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
          404: errorEnvelopeSchema,
        },
      },
    },
    controller.list,
  );

  app.get(
    "/dominios/:domain/:code",
    {
      schema: {
        tags: ["Domínios"],
        summary: "Consulta um registro específico de domínio por código",
        description:
          "Recupera um item de domínio pelo código exato. Útil para hidratar formulários, filtros e referências internas.",
        params: domainCodeParamsSchema,
        response: {
          400: errorEnvelopeSchema,
          404: errorEnvelopeSchema,
        },
      },
    },
    controller.findByCode,
  );
}
