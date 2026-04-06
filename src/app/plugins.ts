import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerPlugins(app: FastifyInstance) {
  await app.register(cors, {
    origin: false,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "CNPJ API",
        description:
          "API para consulta de dados de CNPJ com foco em consultas controladas e seguras por padrão.",
        version: process.env.npm_package_version ?? "1.0.0",
      },
      servers: [{ url: "http://localhost:3000", description: "Local" }],
      tags: [
        { name: "Root", description: "Rotas básicas da aplicação" },
        {
          name: "Health",
          description: "Verificações de saúde e disponibilidade da aplicação",
        },
        {
          name: "Consulta por CNPJ",
          description: "Consulta consolidada por CNPJ",
        },
        {
          name: "Listas de Empresas",
          description:
            "Consultas paginadas de empresas com filtros compostos e uso para prospecção",
        },
        { name: "Sócios", description: "Consultas de sócios" },
        { name: "Domínios", description: "Consultas de tabelas de domínio" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
    theme: {
      css: [
        {
          filename: "swagger-overrides.css",
          content: `
          .swagger-ui td.parameters-col_description > div.renderedMarkdown:nth-of-type(2) {
            display: none !important;
          }
        `,
        },
      ],
    },
  });
}
