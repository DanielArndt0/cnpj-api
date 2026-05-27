import { BadRequestError, NotFoundError } from "../../shared/http/errors.js";
import {
  buildPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import { normalizeOptionalText } from "../../shared/utils/filters.js";
import {
  DOMAIN_DEFINITIONS,
  getDomainDefinition,
  type DomainDefinition,
} from "./domain.catalog.js";
import {
  presentDomainItem,
  presentDomainMetadata,
  presentDomainSummaryItem,
} from "./domain.presenter.js";
import { DomainRepository } from "./domain.repository.js";

export interface DomainListQuery {
  page?: string;
  limit?: string;
  busca?: string;
  codigo?: string;
  q?: string;
  code?: string;
}

export class DomainService {
  constructor(private readonly repository: DomainRepository) {}

  async getSummary() {
    const [totals, examples] = await Promise.all([
      this.repository.getSummary(),
      Promise.all(
        DOMAIN_DEFINITIONS.map(async (definition) => ({
          slug: definition.slug,
          exemplo: await this.repository.findFirst(definition.tableName),
        })),
      ),
    ]);

    return DOMAIN_DEFINITIONS.map((definition) =>
      presentDomainSummaryItem({
        definition,
        total: totals[definition.tableName] ?? 0,
        example:
          examples.find((item) => item.slug === definition.slug)?.exemplo ??
          null,
      }),
    );
  }

  async list(domainSlug: string, query: DomainListQuery) {
    const definition = this.resolveDomainDefinition(domainSlug);
    const search = normalizeOptionalText(query.busca ?? query.q);
    const code = normalizeOptionalText(query.codigo ?? query.code);

    const pagination = parseSimplePagination(query, {
      maxLimit: null,
      maxOffset: null,
    });

    const [items, total] = await Promise.all([
      this.repository.findMany({
        tableName: definition.tableName,
        skip: pagination.skip,
        take: pagination.limit,
        search,
        code,
      }),
      this.repository.count({
        tableName: definition.tableName,
        search,
        code,
      }),
    ]);

    return {
      dominio: presentDomainMetadata(definition),
      filtrosAplicados: {
        busca: search ?? null,
        codigo: code ?? null,
      },
      resultado: buildPaginatedResponse({
        page: pagination.page,
        limit: pagination.limit,
        total,
        data: items.map((item) => presentDomainItem(definition, item)),
      }),
    };
  }

  async findByCode(domainSlug: string, code: string) {
    const definition = this.resolveDomainDefinition(domainSlug);
    const normalizedCode = normalizeOptionalText(code);

    if (!normalizedCode) {
      throw new BadRequestError(
        "Informe um código válido para consultar o domínio.",
      );
    }

    const item = await this.repository.findByCode(
      definition.tableName,
      normalizedCode,
    );

    if (!item) {
      throw new NotFoundError(
        `Nenhum registro foi encontrado em ${definition.title.toLowerCase()} para o código informado.`,
      );
    }

    return {
      dominio: presentDomainMetadata(definition),
      dados: presentDomainItem(definition, item),
    };
  }

  private resolveDomainDefinition(domainSlug: string): DomainDefinition {
    const definition = getDomainDefinition(domainSlug);

    if (!definition) {
      throw new NotFoundError("Domínio não encontrado.");
    }

    return definition;
  }
}
