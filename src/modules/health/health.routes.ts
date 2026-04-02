import type { FastifyInstance } from "fastify";
import { HealthController } from "./health.controller.js";
import { HealthRepository } from "./health.repository.js";
import { HealthService } from "./health.service.js";

export async function healthRoutes(app: FastifyInstance) {
  const repository = new HealthRepository();
  const service = new HealthService(repository);
  const controller = new HealthController(service);

  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Health check da API com validação do banco de dados",
      },
    },
    controller.check,
  );
}
