import type { FastifyReply, FastifyRequest } from "fastify";
import { DomainService } from "./domain.service.js";

export class DomainController {
  constructor(private readonly service: DomainService) {}

  summary = async (_request: FastifyRequest, reply: FastifyReply) => {
    const summary = await this.service.getSummary();

    return reply.send({
      sucesso: true,
      dados: {
        dominios: summary,
      },
    });
  };

  list = async (
    request: FastifyRequest<{
      Params: { domain: string };
      Querystring: { page?: string; limit?: string; q?: string; code?: string };
    }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.list(
      request.params.domain,
      request.query,
    );

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  findByCode = async (
    request: FastifyRequest<{
      Params: { domain: string; code: string };
    }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.findByCode(
      request.params.domain,
      request.params.code,
    );

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };
}
