import { query } from "../../shared/database/postgres.js";
import type { CompanyRow } from "../cnpj/cnpj.types.js";

export class CompanyRepository {
  async findMany(params: {
    skip: number;
    take: number;
    cnpjRoot?: string;
    companyName?: string;
  }) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (params.cnpjRoot) {
      values.push(params.cnpjRoot);
      where.push(`c.cnpj_root = $${values.length}`);
    }

    if (params.companyName) {
      values.push(`%${params.companyName}%`);
      where.push(`c.company_name ilike $${values.length}`);
    }

    values.push(params.take);
    const takePosition = values.length;
    values.push(params.skip);
    const skipPosition = values.length;

    const result = await query<CompanyRow>(
      `
      select
        c.cnpj_root,
        c.company_name,
        c.legal_nature_code,
        ln.description as legal_nature_description,
        c.responsible_qualification_code,
        pq.description as responsible_qualification_description,
        c.share_capital::text as share_capital,
        c.company_size_code,
        cs.description as company_size_description,
        c.responsible_federative_entity,
        c.created_at,
        c.updated_at
      from companies c
      left join legal_natures ln on ln.code = c.legal_nature_code
      left join partner_qualifications pq on pq.code = c.responsible_qualification_code
      left join company_sizes cs on cs.code = c.company_size_code
      ${where.length ? `where ${where.join(" and ")}` : ""}
      order by c.company_name asc
      limit $${takePosition}
      offset $${skipPosition}
      `,
      values,
    );

    return result.rows;
  }

  async count(params: { cnpjRoot?: string; companyName?: string }) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (params.cnpjRoot) {
      values.push(params.cnpjRoot);
      where.push(`c.cnpj_root = $${values.length}`);
    }

    if (params.companyName) {
      values.push(`%${params.companyName}%`);
      where.push(`c.company_name ilike $${values.length}`);
    }

    const result = await query<{ total: string }>(
      `
      select count(*)::text as total
      from companies c
      ${where.length ? `where ${where.join(" and ")}` : ""}
      `,
      values,
    );

    return Number(result.rows[0]?.total ?? 0);
  }
}
