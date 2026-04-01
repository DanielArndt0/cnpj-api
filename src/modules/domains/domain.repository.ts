import { query } from "../../shared/database/postgres.js";

export class DomainRepository {
  async getSummary() {
    const [
      countries,
      cities,
      partnerQualifications,
      legalNatures,
      cnaes,
      reasons,
      companySizes,
      branchTypes,
      registrationStatuses,
      partnerTypes,
      ageGroups,
    ] = await Promise.all([
      query<{ total: string }>(`select count(*)::text as total from countries`),
      query<{ total: string }>(`select count(*)::text as total from cities`),
      query<{ total: string }>(
        `select count(*)::text as total from partner_qualifications`,
      ),
      query<{ total: string }>(
        `select count(*)::text as total from legal_natures`,
      ),
      query<{ total: string }>(`select count(*)::text as total from cnaes`),
      query<{ total: string }>(`select count(*)::text as total from reasons`),
      query<{ total: string }>(
        `select count(*)::text as total from company_sizes`,
      ),
      query<{ total: string }>(
        `select count(*)::text as total from branch_types`,
      ),
      query<{ total: string }>(
        `select count(*)::text as total from registration_statuses`,
      ),
      query<{ total: string }>(
        `select count(*)::text as total from partner_types`,
      ),
      query<{ total: string }>(
        `select count(*)::text as total from age_groups`,
      ),
    ]);

    return {
      countries: Number(countries.rows[0]?.total ?? 0),
      cities: Number(cities.rows[0]?.total ?? 0),
      partnerQualifications: Number(partnerQualifications.rows[0]?.total ?? 0),
      legalNatures: Number(legalNatures.rows[0]?.total ?? 0),
      cnaes: Number(cnaes.rows[0]?.total ?? 0),
      reasons: Number(reasons.rows[0]?.total ?? 0),
      companySizes: Number(companySizes.rows[0]?.total ?? 0),
      branchTypes: Number(branchTypes.rows[0]?.total ?? 0),
      registrationStatuses: Number(registrationStatuses.rows[0]?.total ?? 0),
      partnerTypes: Number(partnerTypes.rows[0]?.total ?? 0),
      ageGroups: Number(ageGroups.rows[0]?.total ?? 0),
    };
  }
}
