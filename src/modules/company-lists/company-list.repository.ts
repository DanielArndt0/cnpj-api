import { query } from "../../shared/database/postgres.js";
import type { CompanyListRow } from "./company-list.types.js";

interface CompanyListLocationFilters {
  stateCode?: string;
  cityCodes?: string[];
}

interface CompanyListSearchParams extends CompanyListLocationFilters {
  skip: number;
  take: number;
}

interface CompanyListQueryExecutionParams {
  text: string;
  values: unknown[];
}

const ACTIVE_REGISTRATION_STATUS_CODE = "02";

export class CompanyListRepository {
  async findCityCodesByStateAndName(params: {
    stateCode: string;
    cityName: string;
  }) {
    const result = await query<{ city_code: string }>(
      `
      select distinct e.city_code::text as city_code
      from establishments e
      inner join cities ci on ci.code = e.city_code
      where e.state_code = $1
        and lower(ci.description) like $2
      order by e.city_code asc
      `,
      [params.stateCode, `%${params.cityName.toLowerCase()}%`],
    );

    return result.rows.map((row) => row.city_code);
  }

  async findByCnaeCodes(
    params: CompanyListSearchParams & { cnaeCodes: string[] },
  ) {
    const values: unknown[] = [
      params.cnaeCodes,
      ACTIVE_REGISTRATION_STATUS_CODE,
    ];
    const locationFilters: string[] = [];

    this.appendLocationFilters(params, locationFilters, values, "e");

    const locationClause = locationFilters.length
      ? ` and ${locationFilters.join(" and ")}`
      : "";

    values.push(params.take);
    const takePosition = values.length;

    values.push(params.skip);
    const skipPosition = values.length;

    return this.executeListQuery({
      text: `
        with matched_establishments as (
          select
            e.cnpj_full,
            e.cnpj_root,
            e.trade_name,
            e.main_cnae_code,
            e.state_code,
            e.city_code,
            e.registration_status_code,
            e.branch_type_code
          from establishments e
          where e.main_cnae_code = any($1)
            and e.registration_status_code = $2
          ${locationClause}

          union

          select
            e.cnpj_full,
            e.cnpj_root,
            e.trade_name,
            e.main_cnae_code,
            e.state_code,
            e.city_code,
            e.registration_status_code,
            e.branch_type_code
          from establishments e
          where string_to_array(coalesce(e.secondary_cnaes_raw, ''), ',') && $1::text[]
            and e.registration_status_code = $2
          ${locationClause}
        ),
        filtered_establishments as (
          select
            e.cnpj_full,
            e.cnpj_root,
            e.trade_name,
            e.main_cnae_code,
            e.state_code,
            e.city_code,
            e.registration_status_code,
            e.branch_type_code
          from matched_establishments e
          order by e.cnpj_full asc
          limit $${takePosition}
          offset $${skipPosition}
        )
        select
          e.cnpj_full,
          e.cnpj_root,
          c.company_name,
          e.trade_name,
          e.main_cnae_code,
          cn.description as main_cnae_description,
          e.state_code,
          ci.description as city_description,
          e.registration_status_code,
          rs.description as registration_status_description,
          e.branch_type_code,
          bt.description as branch_type_description,
          c.legal_nature_code,
          ln.description as legal_nature_description,
          c.company_size_code,
          cs.description as company_size_description
        from filtered_establishments e
        inner join companies c on c.cnpj_root = e.cnpj_root
        left join cnaes cn on cn.code = e.main_cnae_code
        left join cities ci on ci.code = e.city_code
        left join registration_statuses rs on rs.code = e.registration_status_code
        left join branch_types bt on bt.code = e.branch_type_code
        left join legal_natures ln on ln.code = c.legal_nature_code
        left join company_sizes cs on cs.code = c.company_size_code
        order by e.cnpj_full asc
      `,
      values,
    });
  }

  async findByCompanyName(
    params: CompanyListSearchParams & { companyName: string },
  ) {
    const values: unknown[] = [
      `%${params.companyName.toLowerCase()}%`,
      ACTIVE_REGISTRATION_STATUS_CODE,
    ];
    const filters = [
      `lower(c.company_name) like $1`,
      `e.registration_status_code = $2`,
    ];

    this.appendLocationFilters(params, filters, values, "e");

    values.push(params.take);
    const takePosition = values.length;

    values.push(params.skip);
    const skipPosition = values.length;

    return this.executeListQuery({
      text: `
        with filtered_establishments as (
          select
            e.cnpj_full,
            e.cnpj_root,
            c.company_name,
            e.trade_name,
            e.main_cnae_code,
            e.state_code,
            e.city_code,
            e.registration_status_code,
            e.branch_type_code,
            c.legal_nature_code,
            c.company_size_code
          from companies c
          inner join establishments e on e.cnpj_root = c.cnpj_root
          where ${filters.join(" and ")}
          order by c.company_name asc, e.cnpj_full asc
          limit $${takePosition}
          offset $${skipPosition}
        )
        select
          e.cnpj_full,
          e.cnpj_root,
          e.company_name,
          e.trade_name,
          e.main_cnae_code,
          cn.description as main_cnae_description,
          e.state_code,
          ci.description as city_description,
          e.registration_status_code,
          rs.description as registration_status_description,
          e.branch_type_code,
          bt.description as branch_type_description,
          e.legal_nature_code,
          ln.description as legal_nature_description,
          e.company_size_code,
          cs.description as company_size_description
        from filtered_establishments e
        left join cnaes cn on cn.code = e.main_cnae_code
        left join cities ci on ci.code = e.city_code
        left join registration_statuses rs on rs.code = e.registration_status_code
        left join branch_types bt on bt.code = e.branch_type_code
        left join legal_natures ln on ln.code = e.legal_nature_code
        left join company_sizes cs on cs.code = e.company_size_code
        order by e.company_name asc, e.cnpj_full asc
      `,
      values,
    });
  }

  async findByPartnerName(
    params: CompanyListSearchParams & { partnerName: string },
  ) {
    const values: unknown[] = [
      `%${params.partnerName.toLowerCase()}%`,
      ACTIVE_REGISTRATION_STATUS_CODE,
    ];
    const filters: string[] = [`e.registration_status_code = $2`];

    this.appendLocationFilters(params, filters, values, "e");

    values.push(params.take);
    const takePosition = values.length;

    values.push(params.skip);
    const skipPosition = values.length;

    const whereClause = filters.length ? `where ${filters.join(" and ")}` : "";

    return this.executeListQuery({
      text: `
        with matched_roots as (
          select distinct p.cnpj_root
          from partners p
          where lower(p.partner_name) like $1
        ),
        filtered_establishments as (
          select
            e.cnpj_full,
            e.cnpj_root,
            c.company_name,
            e.trade_name,
            e.main_cnae_code,
            e.state_code,
            e.city_code,
            e.registration_status_code,
            e.branch_type_code,
            c.legal_nature_code,
            c.company_size_code
          from matched_roots mr
          inner join companies c on c.cnpj_root = mr.cnpj_root
          inner join establishments e on e.cnpj_root = mr.cnpj_root
          ${whereClause}
          order by c.company_name asc, e.cnpj_full asc
          limit $${takePosition}
          offset $${skipPosition}
        )
        select
          e.cnpj_full,
          e.cnpj_root,
          e.company_name,
          e.trade_name,
          e.main_cnae_code,
          cn.description as main_cnae_description,
          e.state_code,
          ci.description as city_description,
          e.registration_status_code,
          rs.description as registration_status_description,
          e.branch_type_code,
          bt.description as branch_type_description,
          e.legal_nature_code,
          ln.description as legal_nature_description,
          e.company_size_code,
          cs.description as company_size_description
        from filtered_establishments e
        left join cnaes cn on cn.code = e.main_cnae_code
        left join cities ci on ci.code = e.city_code
        left join registration_statuses rs on rs.code = e.registration_status_code
        left join branch_types bt on bt.code = e.branch_type_code
        left join legal_natures ln on ln.code = e.legal_nature_code
        left join company_sizes cs on cs.code = e.company_size_code
        order by e.company_name asc, e.cnpj_full asc
      `,
      values,
    });
  }

  private appendLocationFilters(
    params: CompanyListLocationFilters,
    filters: string[],
    values: unknown[],
    establishmentAlias: string,
  ) {
    if (params.stateCode) {
      values.push(params.stateCode);
      filters.push(`${establishmentAlias}.state_code = $${values.length}`);
    }

    if (params.cityCodes?.length) {
      values.push(params.cityCodes);
      filters.push(`${establishmentAlias}.city_code = any($${values.length})`);
    }
  }

  private async executeListQuery(params: CompanyListQueryExecutionParams) {
    const result = await query<CompanyListRow>(params.text, params.values);

    return result.rows;
  }
}
