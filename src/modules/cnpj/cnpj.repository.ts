import { query } from "../../shared/database/postgres.js";
import type {
  CompanyRow,
  EstablishmentDetailRow,
  EstablishmentSummaryRow,
  PartnerRow,
  SimplesOptionRow,
} from "./cnpj.types.js";

export class CnpjRepository {
  async findCompanyByRoot(cnpjRoot: string) {
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
      where c.cnpj_root = $1
      limit 1
      `,
      [cnpjRoot],
    );

    return result.rows[0] ?? null;
  }

  async findEstablishmentByFull(cnpjFull: string) {
    const result = await query<EstablishmentDetailRow>(
      `
      select
        e.cnpj_full,
        e.cnpj_root,
        e.cnpj_order,
        e.cnpj_check_digits,
        e.branch_type_code,
        bt.description as branch_type_description,
        e.trade_name,
        e.registration_status_code,
        rs.description as registration_status_description,
        e.registration_status_date,
        e.registration_status_reason_code,
        r.description as registration_reason_description,
        e.foreign_city_name,
        e.country_code,
        c.description as country_description,
        e.activity_start_date,
        e.main_cnae_code,
        cn.description as main_cnae_description,
        e.secondary_cnaes_raw,
        e.street_type,
        e.street_name,
        e.street_number,
        e.address_complement,
        e.district,
        e.postal_code,
        e.state_code,
        e.city_code,
        ci.description as city_description,
        e.phone_area_code_1,
        e.phone_number_1,
        e.phone_area_code_2,
        e.phone_number_2,
        e.fax_area_code,
        e.fax_number,
        e.email,
        e.special_status,
        e.special_status_date,
        e.created_at,
        e.updated_at
      from establishments e
      left join branch_types bt on bt.code = e.branch_type_code
      left join registration_statuses rs on rs.code = e.registration_status_code
      left join reasons r on r.code = e.registration_status_reason_code
      left join countries c on c.code = e.country_code
      left join cnaes cn on cn.code = e.main_cnae_code
      left join cities ci on ci.code = e.city_code
      where e.cnpj_full = $1
      limit 1
      `,
      [cnpjFull],
    );

    return result.rows[0] ?? null;
  }

  async findEstablishmentsByRoot(cnpjRoot: string) {
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
      where e.cnpj_root = $1
      order by e.cnpj_order asc, e.cnpj_check_digits asc
      limit 50
      `,
      [cnpjRoot],
    );

    return result.rows;
  }

  async findPartnersByRoot(cnpjRoot: string) {
    const result = await query<PartnerRow>(
      `
      select
        p.id::text as id,
        p.cnpj_root,
        p.partner_type_code,
        pt.description as partner_type_description,
        p.partner_name,
        p.partner_document,
        p.partner_qualification_code,
        pq.description as partner_qualification_description,
        p.entry_date,
        p.country_code,
        c.description as country_description,
        p.legal_representative_document,
        p.legal_representative_name,
        p.legal_representative_qualification_code,
        lpq.description as legal_representative_qualification_description,
        p.age_group_code,
        ag.description as age_group_description
      from partners p
      left join partner_types pt on pt.code = p.partner_type_code
      left join partner_qualifications pq on pq.code = p.partner_qualification_code
      left join countries c on c.code = p.country_code
      left join partner_qualifications lpq on lpq.code = p.legal_representative_qualification_code
      left join age_groups ag on ag.code = p.age_group_code
      where p.cnpj_root = $1
      order by p.id asc
      limit 100
      `,
      [cnpjRoot],
    );

    return result.rows;
  }

  async findSimplesByRoot(cnpjRoot: string) {
    const result = await query<SimplesOptionRow>(
      `
      select
        cnpj_root,
        simples_option_flag,
        simples_option_date,
        simples_exclusion_date,
        mei_option_flag,
        mei_option_date,
        mei_exclusion_date,
        created_at,
        updated_at
      from simples_options
      where cnpj_root = $1
      limit 1
      `,
      [cnpjRoot],
    );

    return result.rows[0] ?? null;
  }
}
