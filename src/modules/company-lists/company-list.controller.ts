import type { FastifyReply, FastifyRequest } from "fastify";
import { CompanyListService } from "./company-list.service.js";

export class CompanyListController {
  constructor(private readonly service: CompanyListService) {}

  listByCnaes = async (
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        codigosCnae?: string;
        uf?: string;
        municipio?: string;
      };
    }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.listByCnaes(request.query);

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
