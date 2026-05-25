import type { FastifyReply, FastifyRequest } from "fastify";
import { InfoService } from "./info.service.js";

interface RankingQuery {
  limite?: string;
}

interface CityRankingQuery extends RankingQuery {
  uf?: string;
}

export class InfoController {
  constructor(private readonly service: InfoService) {}

  overview = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      sucesso: true,
      dados: this.service.getOverview(),
    });
  };

  landingSummary = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getLandingSummary();

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  activeTotal = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getActiveTotal();

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  activeByState = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getActiveByState();

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  activeByRegion = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getActiveByRegion();

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  activeByCompanySize = async (
    _request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const result = await this.service.getActiveByCompanySize();

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  activeByMainCnae = async (
    request: FastifyRequest<{ Querystring: RankingQuery }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.getActiveByMainCnae(request.query);

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };

  activeByCity = async (
    request: FastifyRequest<{ Querystring: CityRankingQuery }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.getActiveByCity(request.query);

    return reply.send({
      sucesso: true,
      dados: result,
    });
  };
}
