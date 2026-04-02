import {
  buildPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import { assertValidCnpjRoot } from "../../shared/utils/cnpj.js";
import { presentPartner } from "../cnpj/cnpj.presenter.js";
import { PartnerRepository } from "./partner.repository.js";

export class PartnerService {
  constructor(private readonly repository: PartnerRepository) {}

  async list(query: { page?: string; limit?: string; cnpjBasico?: string }) {
    const cnpjRoot = assertValidCnpjRoot(query.cnpjBasico ?? "");
    const pagination = parseSimplePagination(query);

    const [items, total] = await Promise.all([
      this.repository.findMany({
        skip: pagination.skip,
        take: pagination.limit,
        cnpjRoot,
      }),
      this.repository.count(cnpjRoot),
    ]);

    return buildPaginatedResponse({
      page: pagination.page,
      limit: pagination.limit,
      total,
      data: items.map(presentPartner),
    });
  }
}
