import { query } from "../../shared/database/postgres.js";
import type {
  ActiveByCityRow,
  ActiveByCompanySizeRow,
  ActiveByMainCnaeRow,
  ActiveByStateRow,
  ActiveTotalRow,
} from "./info.types.js";

const ACTIVE_REGISTRATION_STATUS_CODE = "02";

export class InfoRepository {
  async countActiveEstablishments() {
    const result = await query<ActiveTotalRow>(
      `
      select count(*)::text as total
      from establishments
      where registration_status_code = $1
      `,
      [ACTIVE_REGISTRATION_STATUS_CODE],
    );

    return Number(result.rows[0]?.total ?? 0);
  }

  async countActiveEstablishmentsByState() {
    const result = await query<ActiveByStateRow>(
      `
      select
        state_code,
        count(*)::text as total
      from establishments
      where registration_status_code = $1
        and state_code is not null
        and state_code <> ''
      group by state_code
      order by state_code asc
      `,
      [ACTIVE_REGISTRATION_STATUS_CODE],
    );

    return result.rows;
  }

  async countActiveEstablishmentsByCompanySize() {
    const result = await query<ActiveByCompanySizeRow>(
      `
      select
        c.company_size_code,
        cs.description as company_size_description,
        count(*)::text as total
      from establishments e
      inner join companies c on c.cnpj_root = e.cnpj_root
      left join company_sizes cs on cs.code = c.company_size_code
      where e.registration_status_code = $1
      group by c.company_size_code, cs.description
      order by count(*) desc, c.company_size_code asc
      `,
      [ACTIVE_REGISTRATION_STATUS_CODE],
    );

    return result.rows;
  }

  async countActiveEstablishmentsByMainCnae(limit: number) {
    const result = await query<ActiveByMainCnaeRow>(
      `
      select
        e.main_cnae_code,
        cn.description as main_cnae_description,
        count(*)::text as total
      from establishments e
      left join cnaes cn on cn.code = e.main_cnae_code
      where e.registration_status_code = $1
      group by e.main_cnae_code, cn.description
      order by count(*) desc, e.main_cnae_code asc
      limit $2
      `,
      [ACTIVE_REGISTRATION_STATUS_CODE, limit],
    );

    return result.rows;
  }

  async countActiveEstablishmentsByCity(params: {
    stateCode?: string;
    limit: number;
  }) {
    const values: unknown[] = [ACTIVE_REGISTRATION_STATUS_CODE];
    const filters = [
      "e.registration_status_code = $1",
      "e.state_code is not null",
      "e.state_code <> ''",
      "e.city_code is not null",
      "e.city_code <> ''",
    ];

    if (params.stateCode) {
      values.push(params.stateCode);
      filters.push(`e.state_code = $${values.length}`);
    }

    values.push(params.limit);
    const limitPosition = values.length;

    const result = await query<ActiveByCityRow>(
      `
      select
        e.state_code,
        e.city_code,
        ci.description as city_description,
        count(*)::text as total
      from establishments e
      left join cities ci on ci.code = e.city_code
      where ${filters.join(" and ")}
      group by e.state_code, e.city_code, ci.description
      order by count(*) desc, e.state_code asc, ci.description asc
      limit $${limitPosition}
      `,
      values,
    );

    return result.rows;
  }
}
