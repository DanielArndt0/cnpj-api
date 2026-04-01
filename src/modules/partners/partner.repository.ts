import { query } from "../../shared/database/postgres.js";
import type { PartnerRow } from "../cnpj/cnpj.types.js";

export class PartnerRepository {
  async findMany(params: { skip: number; take: number; cnpjRoot: string }) {
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
      limit $2
      offset $3
      `,
      [params.cnpjRoot, params.take, params.skip],
    );

    return result.rows;
  }

  async count(cnpjRoot: string) {
    const result = await query<{ total: string }>(
      `select count(*)::text as total from partners where cnpj_root = $1`,
      [cnpjRoot],
    );

    return Number(result.rows[0]?.total ?? 0);
  }
}
