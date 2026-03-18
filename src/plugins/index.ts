import { FastifyInstance } from "fastify";
import { registerCors } from "./cors.js";

export async function registerPlugins(app: FastifyInstance) {
  await registerCors(app);
}
