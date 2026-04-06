import type { FastifyReply, FastifyRequest } from "fastify";
import { CompanyListService } from "./company-list.service.js";

export class CompanyListController {
  constructor(private readonly service: CompanyListService) {}

  listByMainCnae = async (
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        codigoCnaePrincipal?: string;
        uf?: string;
        municipio?: string;
      };
    }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.listByMainCnae(request.query);

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  listByCompanyName = async (
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        razaoSocial?: string;
        uf?: string;
        municipio?: string;
      };
    }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.listByCompanyName(request.query);

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  listByPartnerName = async (
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        nomeSocio?: string;
        uf?: string;
        municipio?: string;
      };
    }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.listByPartnerName(request.query);

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };
}
