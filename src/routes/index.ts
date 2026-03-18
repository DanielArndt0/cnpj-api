import { FastifyInstance } from "fastify";
import { healthRoutes } from "./health.js";
import { rootRoutes } from "./root.js";
import { datasetRoutes } from "./datasets.js";

export async function registerRoutes(app: FastifyInstance) {
  app.register(rootRoutes);
  app.register(healthRoutes);
  app.register(datasetRoutes);
}
