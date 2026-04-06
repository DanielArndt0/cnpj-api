import type { FastifyInstance } from "fastify";
import { rootRoutes } from "./root.routes.js";
import { cnpjRoutes } from "../modules/cnpj/cnpj.routes.js";
import { companyListRoutes } from "../modules/company-lists/company-list.routes.js";
import { partnerRoutes } from "../modules/partners/partner.routes.js";
import { domainRoutes } from "../modules/domains/domain.routes.js";
import { healthRoutes } from "../modules/health/health.routes.js";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(rootRoutes);
  await app.register(healthRoutes);
  await app.register(cnpjRoutes, { prefix: "/api" });
  await app.register(companyListRoutes, { prefix: "/api" });
  await app.register(partnerRoutes, { prefix: "/api" });
  await app.register(domainRoutes, { prefix: "/api" });
}
