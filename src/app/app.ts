import Fastify from "fastify";
import { registerErrorHandler } from "../shared/http/error-handler.js";
import { registerPlugins } from "./plugins.js";
import { registerRoutes } from "./routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
    bodyLimit: 1024 * 1024,
    requestTimeout: Number(process.env.REQUEST_TIMEOUT_MS ?? 10000),
    connectionTimeout: Number(process.env.CONNECTION_TIMEOUT_MS ?? 5000),
    keepAliveTimeout: Number(process.env.KEEP_ALIVE_TIMEOUT_MS ?? 5000),
  });

  registerErrorHandler(app);
  await registerPlugins(app);
  await registerRoutes(app);

  return app;
}
