import type { FastifyReply, FastifyRequest } from "fastify";
import { HealthService } from "./health.service.js";

export class HealthController {
  constructor(private readonly service: HealthService) {}

  check = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.check();
    const isHealthy = result.status === "healthy";

    return reply.status(isHealthy ? 200 : 503).send({
      sucesso: isHealthy,
      dados: result,
    });
  };
}
