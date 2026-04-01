import { BadRequestError } from "../../shared/http/errors.js";
import {
  buildPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import { sanitizeDigits } from "../../shared/utils/cnpj.js";
import { presentPartner } from "../cnpj/cnpj.presenter.js";
import { PartnerRepository } from "./partner.repository.js";

export class PartnerService {
  constructor(private readonly repository: PartnerRepository) {}

  async list(query: { page?: string; limit?: string; cnpjBasico?: string }) {
    if (!query.cnpjBasico) {
      throw new BadRequestError(
        "Informe cnpjBasico para consultar sócios de forma segura.",
      );
    }

    const pagination = parseSimplePagination(query);
    const cnpjRoot = sanitizeDigits(query.cnpjBasico);

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
