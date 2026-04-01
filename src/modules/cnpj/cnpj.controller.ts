import type { FastifyReply, FastifyRequest } from "fastify";
import { CnpjService } from "./cnpj.service.js";

export class CnpjController {
  constructor(private readonly service: CnpjService) {}

  findByDocument = async (
    request: FastifyRequest<{ Params: { cnpj: string } }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.findByDocument(request.params.cnpj);

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };
}
