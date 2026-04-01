import { BadRequestError } from "../../shared/http/errors.js";
import {
  buildPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import { sanitizeDigits } from "../../shared/utils/cnpj.js";
import { presentEstablishmentSummary } from "../cnpj/cnpj.presenter.js";
import { EstablishmentRepository } from "./establishment.repository.js";

export class EstablishmentService {
  constructor(private readonly repository: EstablishmentRepository) {}

  async list(query: {
    page?: string;
    limit?: string;
    cnpjBasico?: string;
    uf?: string;
    codigoCnaePrincipal?: string;
  }) {
    if (!query.cnpjBasico && !query.uf && !query.codigoCnaePrincipal) {
      throw new BadRequestError(
        "Informe pelo menos um filtro entre cnpjBasico, uf ou codigoCnaePrincipal para consultar estabelecimentos.",
      );
    }

    const pagination = parseSimplePagination(query);

    const [items, total] = await Promise.all([
      this.repository.findMany({
        skip: pagination.skip,
        take: pagination.limit,
        cnpjRoot: query.cnpjBasico
          ? sanitizeDigits(query.cnpjBasico)
          : undefined,
        stateCode: query.uf,
        mainCnaeCode: query.codigoCnaePrincipal,
      }),
      this.repository.count({
        cnpjRoot: query.cnpjBasico
          ? sanitizeDigits(query.cnpjBasico)
          : undefined,
        stateCode: query.uf,
        mainCnaeCode: query.codigoCnaePrincipal,
      }),
    ]);

    return buildPaginatedResponse({
      page: pagination.page,
      limit: pagination.limit,
      total,
      data: items.map(presentEstablishmentSummary),
    });
  }
}
