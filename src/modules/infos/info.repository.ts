import { query } from "../../shared/database/postgres.js";
import type {
  ActiveByCityRow,
  ActiveByCompanySizeRow,
  ActiveByMainCnaeRow,
  ActiveByStateRow,
  ActiveTotalRow,
} from "./info.types.js";

export class InfoRepository {
  async countActiveEstablishments() {
    const result = await query<ActiveTotalRow>(
      `
      select total::text as total
      from mv_infos_empresas_ativas_total
      `,
    );

    return Number(result.rows[0]?.total ?? 0);
  }

  async countActiveEstablishmentsByState() {
    const result = await query<ActiveByStateRow>(
      `
      select
        state_code,
        total::text as total
      from mv_infos_empresas_ativas_por_uf
      order by state_code asc
      `,
    );

    return result.rows;
  }

  async countActiveEstablishmentsByCompanySize() {
    const result = await query<ActiveByCompanySizeRow>(
      `
      select
        mv.company_size_code,
        cs.description as company_size_description,
        mv.total::text as total
      from mv_infos_empresas_ativas_por_porte mv
      left join company_sizes cs on cs.code = mv.company_size_code
      order by mv.total desc, mv.company_size_code asc
      `,
    );

    return result.rows;
  }

  async countActiveEstablishmentsByMainCnae(limit: number) {
    const result = await query<ActiveByMainCnaeRow>(
      `
      select
        mv.main_cnae_code,
        cn.description as main_cnae_description,
        mv.total::text as total
      from mv_infos_empresas_ativas_por_cnae_principal mv
      left join cnaes cn on cn.code = mv.main_cnae_code
      order by mv.total desc, mv.main_cnae_code asc
      limit $1
      `,
      [limit],
    );

    return result.rows;
  }

  async countActiveEstablishmentsByCity(params: {
    stateCode?: string;
    limit: number;
  }) {
    const values: unknown[] = [];
    const filters: string[] = [];

    if (params.stateCode) {
      values.push(params.stateCode);
      filters.push(`mv.state_code = $${values.length}`);
    }

    values.push(params.limit);
    const limitPosition = values.length;
    const whereClause =
      filters.length > 0 ? `where ${filters.join(" and ")}` : "";

    const result = await query<ActiveByCityRow>(
      `
      select
        mv.state_code,
        mv.city_code,
        ci.description as city_description,
        mv.total::text as total
      from mv_infos_empresas_ativas_por_municipio mv
      left join cities ci on ci.code = mv.city_code
      ${whereClause}
      order by mv.total desc, mv.state_code asc, ci.description asc
      limit $${limitPosition}
      `,
      values,
    );

    return result.rows;
  }
}
