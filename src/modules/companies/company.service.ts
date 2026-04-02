import { BadRequestError } from "../../shared/http/errors.js";
import {
  buildPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import { assertValidCnpjRoot } from "../../shared/utils/cnpj.js";
import {
  normalizeOptionalText,
  validateMinimumTextLength,
} from "../../shared/utils/filters.js";
import { presentCompanyListItem } from "./company.presenter.js";
import { CompanyRepository } from "./company.repository.js";

export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  async list(query: {
    page?: string;
    limit?: string;
    cnpjBasico?: string;
    razaoSocial?: string;
  }) {
    const cnpjRoot = query.cnpjBasico
      ? assertValidCnpjRoot(query.cnpjBasico)
      : undefined;
    const companyName = normalizeOptionalText(query.razaoSocial);

    if (!cnpjRoot && !companyName) {
      throw new BadRequestError(
        "Informe pelo menos um filtro obrigatório: cnpjBasico ou razaoSocial.",
      );
    }

    validateMinimumTextLength(companyName, "razaoSocial", 3);

    const pagination = parseSimplePagination(query);

    const [items, total] = await Promise.all([
      this.repository.findMany({
        skip: pagination.skip,
        take: pagination.limit,
        cnpjRoot,
        companyName,
      }),
      this.repository.count({
        cnpjRoot,
        companyName,
      }),
    ]);

    return buildPaginatedResponse({
      page: pagination.page,
      limit: pagination.limit,
      total,
      data: items.map(presentCompanyListItem),
    });
  }
}
