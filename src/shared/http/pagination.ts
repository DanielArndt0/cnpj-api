import { BadRequestError } from "./errors.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_MAX_LIMIT = 1000;
const DEFAULT_MAX_OFFSET = 100000;

export interface SimplePagination {
  page: number;
  limit: number;
  skip: number;
}

interface SimplePaginationOptions {
  defaultLimit?: number;
  maxLimit?: number | null;
  maxOffset?: number | null;
}

export function parseSimplePagination(
  query: {
    page?: string | number;
    limit?: string | number;
  },
  options: SimplePaginationOptions = {},
): SimplePagination {
  const defaultLimit = normalizePositiveInteger(
    options.defaultLimit,
    DEFAULT_LIMIT,
  );
  const maxLimit =
    options.maxLimit === undefined ? DEFAULT_MAX_LIMIT : options.maxLimit;
  const maxOffset =
    options.maxOffset === undefined ? DEFAULT_MAX_OFFSET : options.maxOffset;

  const rawPage = Number(query.page ?? DEFAULT_PAGE);
  const rawLimit = Number(query.limit ?? defaultLimit);

  const page =
    Number.isFinite(rawPage) && rawPage > 0
      ? Math.trunc(rawPage)
      : DEFAULT_PAGE;
  const normalizedLimit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.trunc(rawLimit)
      : defaultLimit;
  const limit =
    maxLimit && maxLimit > 0
      ? Math.min(normalizedLimit, maxLimit)
      : normalizedLimit;
  const skip = (page - 1) * limit;

  if (maxOffset && maxOffset > 0 && skip > maxOffset) {
    throw new BadRequestError(
      `Paginação muito alta para paginação simples. Use uma página menor por enquanto. Máximo de offset suportado: ${maxOffset}.`,
    );
  }

  return { page, limit, skip };
}

function normalizePositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  if (!Number.isFinite(value) || !value || value <= 0) {
    return fallback;
  }

  return Math.trunc(value);
}

export interface PaginatedResponse<T> {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
  dados: T[];
}

export function buildPaginatedResponse<T>(params: {
  page: number;
  limit: number;
  total: number;
  data: T[];
}): PaginatedResponse<T> {
  const totalPages = Math.max(1, Math.ceil(params.total / params.limit));

  return {
    pagina: params.page,
    limite: params.limit,
    total: params.total,
    totalPaginas: totalPages,
    dados: params.data,
  };
}

export interface WindowedPaginatedResponse<T> {
  pagina: number;
  limite: number;
  hasNextPage: boolean;
  dados: T[];
}

export function buildWindowedPaginatedResponse<T>(params: {
  page: number;
  limit: number;
  data: T[];
  hasNextPage: boolean;
}): WindowedPaginatedResponse<T> {
  return {
    pagina: params.page,
    limite: params.limit,
    dados: params.data,
    hasNextPage: params.hasNextPage,
  };
}
