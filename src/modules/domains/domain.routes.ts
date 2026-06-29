import type { FastifyInstance } from "fastify";
import {
  cityDomainListQuerystringSchema,
  domainCodeParamsSchema,
  domainListQuerystringSchema,
  errorEnvelopeSchema,
} from "../../shared/contracts/api.schemas.js";
import { DOMAIN_DEFINITIONS } from "./domain.catalog.js";
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
        summary: "Resumo dos domínios disponíveis",
        description:
          "Apresenta uma visão geral dos domínios disponíveis para filtros, autocomplete e integrações auxiliares da API. Os campos da resposta são apresentados em português.",
      },
    },
    controller.summary,
  );

  for (const definition of DOMAIN_DEFINITIONS) {
    app.get(
      `/dominios/${definition.slug}`,
      {
        schema: {
          tags: ["Domínios"],
          summary: `Lista ${definition.title.toLowerCase()}`,
          description: `${definition.description} Aceita paginação, busca textual pelo parâmetro busca e filtro por código exato pelo parâmetro codigo.`,
          querystring:
            definition.slug === "cidades"
              ? cityDomainListQuerystringSchema
              : domainListQuerystringSchema,
          response: {
            400: errorEnvelopeSchema,
            404: errorEnvelopeSchema,
          },
        },
      },
      controller.listBySlug(definition.slug),
    );

    app.get(
      `/dominios/${definition.slug}/:codigo`,
      {
        schema: {
          tags: ["Domínios"],
          summary: `Consulta ${definition.title.toLowerCase()} por código`,
          description: `Recupera um registro específico de ${definition.title.toLowerCase()} pelo código exato.`,
          params: domainCodeParamsSchema,
          response: {
            400: errorEnvelopeSchema,
            404: errorEnvelopeSchema,
          },
        },
      },
      controller.findBySlugAndCode(definition.slug),
    );
  }
}
