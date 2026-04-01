import type { FastifyReply, FastifyRequest } from "fastify";
import { DomainRepository } from "./domain.repository.js";

export class DomainController {
  constructor(private readonly repository: DomainRepository) {}

  summary = async (_request: FastifyRequest, reply: FastifyReply) => {
    const summary = await this.repository.getSummary();

    return reply.send({
      sucesso: true,
      dados: {
        dominios: summary,
      },
    });
  };
}
