import { BadRequestError } from "../../shared/http/errors.js";
import {
  buildPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import {
  assertValidCnpjRoot,
  extractCnpjRootFromDocument,
} from "../../shared/utils/cnpj.js";
import {
  normalizeBrazilianStateCode,
  normalizeMainCnaeCode,
} from "../../shared/utils/filters.js";
import { presentEstablishmentSummary } from "../cnpj/cnpj.presenter.js";
import { EstablishmentRepository } from "./establishment.repository.js";

export class EstablishmentService {
  constructor(private readonly repository: EstablishmentRepository) {}

  async list(query: {
    page?: string;
    limit?: string;
    cnpjBasico?: string;
    cnpj?: string;
    uf?: string;
    codigoCnaePrincipal?: string;
  }) {
    const rawCnpj = query.cnpj ?? query.cnpjBasico;
    const cnpjRoot = rawCnpj
      ? query.cnpj
        ? extractCnpjRootFromDocument(query.cnpj)
        : assertValidCnpjRoot(query.cnpjBasico ?? "")
      : undefined;
    const stateCode = normalizeBrazilianStateCode(query.uf);
    const mainCnaeCode = normalizeMainCnaeCode(query.codigoCnaePrincipal);

    const hasSafeCombination = Boolean(stateCode && mainCnaeCode);

    if (!cnpjRoot && !hasSafeCombination) {
      throw new BadRequestError(
        "Informe cnpj ou combine uf com codigoCnaePrincipal para consultar estabelecimentos.",
      );
    }

    const pagination = parseSimplePagination(query);

    const [items, total] = await Promise.all([
      this.repository.findMany({
        skip: pagination.skip,
        take: pagination.limit,
        cnpjRoot,
        stateCode,
        mainCnaeCode,
      }),
      this.repository.count({
        cnpjRoot,
        stateCode,
        mainCnaeCode,
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
