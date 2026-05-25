import type { FastifyReply, FastifyRequest } from "fastify";
import { DomainService, type DomainListQuery } from "./domain.service.js";

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

  listBySlug(domainSlug: string) {
    return async (
      request: FastifyRequest<{
        Querystring: DomainListQuery;
      }>,
      reply: FastifyReply,
    ) => {
      const result = await this.service.list(domainSlug, request.query);

      return reply.send({
        sucesso: true,
        dados: result,
      });
    };
  }

  findBySlugAndCode(domainSlug: string) {
    return async (
      request: FastifyRequest<{
        Params: { codigo: string };
      }>,
      reply: FastifyReply,
    ) => {
      const result = await this.service.findByCode(
        domainSlug,
        request.params.codigo,
      );

      return reply.send({
        sucesso: true,
        dados: result,
      });
    };
  }
}
