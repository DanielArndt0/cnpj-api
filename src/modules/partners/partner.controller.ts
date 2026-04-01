import type { FastifyReply, FastifyRequest } from "fastify";
import { PartnerService } from "./partner.service.js";

export class PartnerController {
  constructor(private readonly service: PartnerService) {}

  list = async (
    request: FastifyRequest<{
      Querystring: { page?: string; limit?: string; cnpjBasico?: string };
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
