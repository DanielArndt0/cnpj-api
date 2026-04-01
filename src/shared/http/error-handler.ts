import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "./errors.js";

export function registerErrorHandler(app: {
  setErrorHandler: (
    handler: (
      error: Error,
      request: FastifyRequest,
      reply: FastifyReply,
    ) => void,
  ) => void;
}) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({
        sucesso: false,
        mensagem: error.message,
      });
    }

    return reply.status(500).send({
      sucesso: false,
      mensagem: "Erro interno do servidor.",
    });
  });
}
