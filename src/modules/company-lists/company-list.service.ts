import { BadRequestError } from "../../shared/http/errors.js";
import {
  buildWindowedPaginatedResponse,
  parseSimplePagination,
} from "../../shared/http/pagination.js";
import {
  normalizeBrazilianStateCode,
  normalizeMainCnaeCode,
  normalizeOptionalText,
  validateMinimumTextLength,
} from "../../shared/utils/filters.js";
import { presentCompanyListItem } from "./company-list.presenter.js";
import { CompanyListRepository } from "./company-list.repository.js";
import type { CompanyListRow } from "./company-list.types.js";

interface CompanyListLocationQuery {
  page?: string;
  limit?: string;
  uf?: string;
  municipio?: string;
}

interface CompanyListByMainCnaeQuery extends CompanyListLocationQuery {
  codigoCnaePrincipal?: string;
}

interface CompanyListByCompanyNameQuery extends CompanyListLocationQuery {
  razaoSocial?: string;
}

interface CompanyListByPartnerNameQuery extends CompanyListLocationQuery {
  nomeSocio?: string;
}

interface ResolvedLocationFilters {
  stateCode?: string;
  cityCodes?: string[];
}

export class CompanyListService {
  constructor(private readonly repository: CompanyListRepository) {}

  async listByMainCnae(query: CompanyListByMainCnaeQuery) {
    const mainCnaeCode = normalizeMainCnaeCode(query.codigoCnaePrincipal);

    if (!mainCnaeCode) {
      throw new BadRequestError(
        "codigoCnaePrincipal é obrigatório para a prospecção por CNAE.",
      );
    }

    const pagination = parseSimplePagination(query);
    const locationFilters = await this.resolveLocationFilters(query);

    if (query.municipio && locationFilters.cityCodes?.length === 0) {
      return this.buildListResponse({
        page: pagination.page,
        limit: pagination.limit,
        items: [],
      });
    }

    const items = await this.repository.findByMainCnaeCode({
      mainCnaeCode,
      ...locationFilters,
      skip: pagination.skip,
      take: pagination.limit + 1,
    });

    return this.buildListResponse({
      page: pagination.page,
      limit: pagination.limit,
      items,
    });
  }

  async listByCompanyName(query: CompanyListByCompanyNameQuery) {
    const companyName = normalizeOptionalText(query.razaoSocial);

    validateMinimumTextLength(companyName, "razaoSocial", 3);

    if (!companyName) {
      throw new BadRequestError(
        "razaoSocial é obrigatória para a prospecção por razão social.",
      );
    }

    const pagination = parseSimplePagination(query);
    const locationFilters = await this.resolveLocationFilters(query);

    if (query.municipio && locationFilters.cityCodes?.length === 0) {
      return this.buildListResponse({
        page: pagination.page,
        limit: pagination.limit,
        items: [],
      });
    }

    const items = await this.repository.findByCompanyName({
      companyName,
      ...locationFilters,
      skip: pagination.skip,
      take: pagination.limit + 1,
    });

    return this.buildListResponse({
      page: pagination.page,
      limit: pagination.limit,
      items,
    });
  }

  async listByPartnerName(query: CompanyListByPartnerNameQuery) {
    const partnerName = normalizeOptionalText(query.nomeSocio);

    validateMinimumTextLength(partnerName, "nomeSocio", 3);

    if (!partnerName) {
      throw new BadRequestError(
        "nomeSocio é obrigatório para a prospecção por sócio.",
      );
    }

    const pagination = parseSimplePagination(query);
    const locationFilters = await this.resolveLocationFilters(query);

    if (query.municipio && locationFilters.cityCodes?.length === 0) {
      return this.buildListResponse({
        page: pagination.page,
        limit: pagination.limit,
        items: [],
      });
    }

    const items = await this.repository.findByPartnerName({
      partnerName,
      ...locationFilters,
      skip: pagination.skip,
      take: pagination.limit + 1,
    });

    return this.buildListResponse({
      page: pagination.page,
      limit: pagination.limit,
      items,
    });
  }

  private async resolveLocationFilters(
    query: CompanyListLocationQuery,
  ): Promise<ResolvedLocationFilters> {
    const stateCode = normalizeBrazilianStateCode(query.uf);
    const cityName = normalizeOptionalText(query.municipio);

    validateMinimumTextLength(cityName, "municipio", 3);

    if (cityName && !stateCode) {
      throw new BadRequestError(
        "municipio exige uf para evitar ambiguidades na geração da lista.",
      );
    }

    let cityCodes: string[] | undefined;

    if (stateCode && cityName) {
      cityCodes = await this.repository.findCityCodesByStateAndName({
        stateCode,
        cityName,
      });
    }

    return {
      stateCode,
      cityCodes,
    };
  }

  private buildListResponse(params: {
    page: number;
    limit: number;
    items: CompanyListRow[];
  }) {
    const hasNextPage = params.items.length > params.limit;
    const visibleItems = params.items.slice(0, params.limit);

    return buildWindowedPaginatedResponse({
      page: params.page,
      limit: params.limit,
      hasNextPage,
      data: visibleItems.map(presentCompanyListItem),
    });
  }
}
