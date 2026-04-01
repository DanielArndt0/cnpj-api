import { BadRequestError } from "./errors.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MAX_OFFSET = 5000;

export interface SimplePagination {
  page: number;
  limit: number;
  skip: number;
}

export function parseSimplePagination(query: {
  page?: string | number;
  limit?: string | number;
}): SimplePagination {
  const rawPage = Number(query.page ?? DEFAULT_PAGE);
  const rawLimit = Number(query.limit ?? DEFAULT_LIMIT);

  const page =
    Number.isFinite(rawPage) && rawPage > 0
      ? Math.trunc(rawPage)
      : DEFAULT_PAGE;
  const normalizedLimit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.trunc(rawLimit)
      : DEFAULT_LIMIT;
  const limit = Math.min(normalizedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  if (skip > MAX_OFFSET) {
    throw new BadRequestError(
      `Paginação muito alta para paginação simples. Use uma página menor por enquanto. Máximo de offset suportado: ${MAX_OFFSET}.`,
    );
  }

  return { page, limit, skip };
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
