import type { FastifyReply, FastifyRequest } from "fastify";
import { CompanyService } from "./company.service.js";

export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  list = async (
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        cnpjBasico?: string;
        razaoSocial?: string;
      };
    }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.list(request.query);

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };
}
