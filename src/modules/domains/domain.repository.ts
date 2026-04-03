import { query } from "../../shared/database/postgres.js";
import { DOMAIN_DEFINITIONS } from "./domain.catalog.js";

interface DomainRow {
  code: string;
  description: string;
}

interface DomainSearchParams {
  tableName: string;
  search?: string;
  code?: string;
  skip?: number;
  take?: number;
}

function assertSafeDomainTableName(tableName: string) {
  const supportedTables = new Set(
    DOMAIN_DEFINITIONS.map((definition) => definition.tableName),
  );

  if (!supportedTables.has(tableName)) {
    throw new Error(`Unsupported domain table: ${tableName}`);
  }
}

export class DomainRepository {
  async getSummary() {
    const entries = await Promise.all(
      DOMAIN_DEFINITIONS.map(async (definition) => {
        const result = await query<{ total: string }>(
          `select count(*)::text as total from ${definition.tableName}`,
        );

        return [
          definition.tableName,
          Number(result.rows[0]?.total ?? 0),
        ] as const;
      }),
    );

    return Object.fromEntries(entries);
  }

  async findMany(params: DomainSearchParams) {
    assertSafeDomainTableName(params.tableName);

    const where: string[] = [];
    const values: unknown[] = [];

    if (params.code) {
      values.push(params.code);
      where.push(`cast(code as text) = $${values.length}`);
    }

    if (params.search) {
      values.push(`%${params.search}%`);
      where.push(
        `(cast(code as text) ilike $${values.length} or description ilike $${values.length})`,
      );
    }

    if (typeof params.take === "number") {
      values.push(params.take);
    }

    const takePosition = values.length;

    if (typeof params.skip === "number") {
      values.push(params.skip);
    }

    const skipPosition = values.length;

    const result = await query<DomainRow>(
      `
      select
        cast(code as text) as code,
        description
      from ${params.tableName}
      ${where.length ? `where ${where.join(" and ")}` : ""}
      order by description asc, cast(code as text) asc
      ${takePosition ? `limit $${takePosition}` : ""}
      ${skipPosition ? `offset $${skipPosition}` : ""}
      `,
      values,
    );

    return result.rows;
  }

  async count(params: Omit<DomainSearchParams, "skip" | "take">) {
    assertSafeDomainTableName(params.tableName);

    const where: string[] = [];
    const values: unknown[] = [];

    if (params.code) {
      values.push(params.code);
      where.push(`cast(code as text) = $${values.length}`);
    }

    if (params.search) {
      values.push(`%${params.search}%`);
      where.push(
        `(cast(code as text) ilike $${values.length} or description ilike $${values.length})`,
      );
    }

    const result = await query<{ total: string }>(
      `
      select count(*)::text as total
      from ${params.tableName}
      ${where.length ? `where ${where.join(" and ")}` : ""}
      `,
      values,
    );

    return Number(result.rows[0]?.total ?? 0);
  }

  async findByCode(tableName: string, code: string) {
    assertSafeDomainTableName(tableName);

    const result = await query<DomainRow>(
      `
      select
        cast(code as text) as code,
        description
      from ${tableName}
      where cast(code as text) = $1
      limit 1
      `,
      [code],
    );

    return result.rows[0] ?? null;
  }

  async findFirst(tableName: string) {
    assertSafeDomainTableName(tableName);

    const result = await query<DomainRow>(
      `
      select
        cast(code as text) as code,
        description
      from ${tableName}
      order by description asc, cast(code as text) asc
      limit 1
      `,
    );

    return result.rows[0] ?? null;
  }
}
