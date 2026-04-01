import { query } from "../../shared/database/postgres.js";
import type { EstablishmentSummaryRow } from "../cnpj/cnpj.types.js";

export class EstablishmentRepository {
  async findMany(params: {
    skip: number;
    take: number;
    cnpjRoot?: string;
    stateCode?: string;
    mainCnaeCode?: string;
  }) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (params.cnpjRoot) {
      values.push(params.cnpjRoot);
      where.push(`e.cnpj_root = $${values.length}`);
    }

    if (params.stateCode) {
      values.push(params.stateCode.toUpperCase());
      where.push(`e.state_code = $${values.length}`);
    }

    if (params.mainCnaeCode) {
      values.push(params.mainCnaeCode);
      where.push(`e.main_cnae_code = $${values.length}`);
    }

    values.push(params.take);
    const takePosition = values.length;
    values.push(params.skip);
    const skipPosition = values.length;

    const result = await query<EstablishmentSummaryRow>(
      `
      select
        e.cnpj_full,
        e.cnpj_root,
        e.branch_type_code,
        bt.description as branch_type_description,
        e.trade_name,
        e.registration_status_code,
        rs.description as registration_status_description,
        e.registration_status_date,
        e.main_cnae_code,
        cn.description as main_cnae_description,
        e.state_code,
        e.city_code
      from establishments e
      left join branch_types bt on bt.code = e.branch_type_code
      left join registration_statuses rs on rs.code = e.registration_status_code
      left join cnaes cn on cn.code = e.main_cnae_code
      ${where.length ? `where ${where.join(" and ")}` : ""}
      order by e.cnpj_full asc
      limit $${takePosition}
      offset $${skipPosition}
      `,
      values,
    );

    return result.rows;
  }

  async count(params: {
    cnpjRoot?: string;
    stateCode?: string;
    mainCnaeCode?: string;
  }) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (params.cnpjRoot) {
      values.push(params.cnpjRoot);
      where.push(`e.cnpj_root = $${values.length}`);
    }

    if (params.stateCode) {
      values.push(params.stateCode.toUpperCase());
      where.push(`e.state_code = $${values.length}`);
    }

    if (params.mainCnaeCode) {
      values.push(params.mainCnaeCode);
      where.push(`e.main_cnae_code = $${values.length}`);
    }

    const result = await query<{ total: string }>(
      `
      select count(*)::text as total
      from establishments e
      ${where.length ? `where ${where.join(" and ")}` : ""}
      `,
      values,
    );

    return Number(result.rows[0]?.total ?? 0);
  }
}
