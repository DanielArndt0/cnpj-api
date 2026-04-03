import type { FastifyReply, FastifyRequest } from "fastify";
import { EstablishmentService } from "./establishment.service.js";

export class EstablishmentController {
  constructor(private readonly service: EstablishmentService) {}

  list = async (
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        cnpjBasico?: string;
        cnpj?: string;
        uf?: string;
        codigoCnaePrincipal?: string;
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
