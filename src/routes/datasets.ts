import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function datasetRoutes(app: FastifyInstance) {
  app.get("/datasets", async () => {
    const datasets = await prisma.datasetVersion.findMany({
      orderBy: {
        importedAt: "desc",
      },
    });

    return {
      ok: true,
      data: datasets,
    };
  });
}
