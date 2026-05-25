import type { FastifyInstance } from "fastify";
import {
  errorEnvelopeSchema,
  infoCityRankingQuerystringSchema,
  infoRankingQuerystringSchema,
} from "../../shared/contracts/api.schemas.js";
import { InfoController } from "./info.controller.js";
import { InfoRepository } from "./info.repository.js";
import { InfoService } from "./info.service.js";

export async function infoRoutes(app: FastifyInstance) {
  const repository = new InfoRepository();
  const service = new InfoService(repository);
  const controller = new InfoController(service);

  app.get(
    "/infos",
    {
      schema: {
        tags: ["Informações"],
        summary: "Resumo dos endpoints informativos",
        description:
          "Lista endpoints de leitura simples para estatísticas e indicadores públicos da base CNPJ.",
      },
    },
    controller.overview,
  );

  app.get(
    "/infos/empresas/ativas/resumo",
    {
      schema: {
        tags: ["Informações"],
        summary: "Resumo de empresas ativas para landing pages",
        description:
          "Retorna indicadores consolidados e leves para cards de landing page. Considera CNPJs completos/estabelecimentos com situação cadastral ativa.",
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.landingSummary,
  );

  app.get(
    "/infos/empresas/ativas/total",
    {
      schema: {
        tags: ["Informações"],
        summary: "Total de empresas ativas",
        description:
          "Retorna o total de CNPJs completos/estabelecimentos com situação cadastral ativa, código 02.",
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.activeTotal,
  );

  app.get(
    "/infos/empresas/ativas/por-uf",
    {
      schema: {
        tags: ["Informações"],
        summary: "Empresas ativas por UF",
        description:
          "Retorna a quantidade de CNPJs completos/estabelecimentos ativos agrupados por unidade federativa.",
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.activeByState,
  );

  app.get(
    "/infos/empresas/ativas/por-regiao",
    {
      schema: {
        tags: ["Informações"],
        summary: "Empresas ativas por região",
        description:
          "Retorna a quantidade de CNPJs completos/estabelecimentos ativos agrupados por região brasileira.",
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.activeByRegion,
  );

  app.get(
    "/infos/empresas/ativas/por-porte",
    {
      schema: {
        tags: ["Informações"],
        summary: "Empresas ativas por porte",
        description:
          "Retorna a quantidade de CNPJs completos/estabelecimentos ativos agrupados por porte da empresa.",
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.activeByCompanySize,
  );

  app.get(
    "/infos/empresas/ativas/por-cnae-principal",
    {
      schema: {
        tags: ["Informações"],
        summary: "Empresas ativas por CNAE principal",
        description:
          "Retorna um ranking dos CNAEs principais com maior quantidade de CNPJs completos/estabelecimentos ativos.",
        querystring: infoRankingQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.activeByMainCnae,
  );

  app.get(
    "/infos/empresas/ativas/por-municipio",
    {
      schema: {
        tags: ["Informações"],
        summary: "Empresas ativas por município",
        description:
          "Retorna um ranking de municípios com maior quantidade de CNPJs completos/estabelecimentos ativos. Aceita filtro opcional por UF.",
        querystring: infoCityRankingQuerystringSchema,
        response: {
          400: errorEnvelopeSchema,
        },
      },
    },
    controller.activeByCity,
  );
}
