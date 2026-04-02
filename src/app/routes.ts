import type { FastifyInstance } from "fastify";
import { rootRoutes } from "./root.routes.js";
import { cnpjRoutes } from "../modules/cnpj/cnpj.routes.js";
import { companyRoutes } from "../modules/companies/company.routes.js";
import { establishmentRoutes } from "../modules/establishments/establishment.routes.js";
import { partnerRoutes } from "../modules/partners/partner.routes.js";
import { domainRoutes } from "../modules/domains/domain.routes.js";
import { healthRoutes } from "../modules/health/health.routes.js";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(rootRoutes);
  await app.register(healthRoutes);
  await app.register(cnpjRoutes, { prefix: "/api" });
  await app.register(companyRoutes, { prefix: "/api" });
  await app.register(establishmentRoutes, { prefix: "/api" });
  await app.register(partnerRoutes, { prefix: "/api" });
  await app.register(domainRoutes, { prefix: "/api" });
}
