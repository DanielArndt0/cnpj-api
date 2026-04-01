import {
  buildPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import { sanitizeDigits } from "../../shared/utils/cnpj.js";
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
    const pagination = parseSimplePagination(query);
    const cnpjRoot = query.cnpjBasico
      ? sanitizeDigits(query.cnpjBasico)
      : undefined;

    const [items, total] = await Promise.all([
      this.repository.findMany({
        skip: pagination.skip,
        take: pagination.limit,
        cnpjRoot,
        companyName: query.razaoSocial,
      }),
      this.repository.count({
        cnpjRoot,
        companyName: query.razaoSocial,
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
