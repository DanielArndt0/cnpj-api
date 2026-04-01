export interface CompanyRow {
  cnpj_root: string;
  company_name: string;
  legal_nature_code: string;
  legal_nature_description: string | null;
  responsible_qualification_code: string;
  responsible_qualification_description: string | null;
  share_capital: string;
  company_size_code: string;
  company_size_description: string | null;
  responsible_federative_entity: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface EstablishmentSummaryRow {
  cnpj_full: string;
  cnpj_root: string;
  branch_type_code: string;
  branch_type_description: string | null;
  trade_name: string | null;
  registration_status_code: string;
  registration_status_description: string | null;
  registration_status_date: Date | null;
  main_cnae_code: string;
  main_cnae_description: string | null;
  state_code: string | null;
  city_code: string | null;
}

export interface EstablishmentDetailRow extends EstablishmentSummaryRow {
  cnpj_order: string;
  cnpj_check_digits: string;
  registration_status_reason_code: string | null;
  registration_reason_description: string | null;
  foreign_city_name: string | null;
  country_code: string | null;
  country_description: string | null;
  activity_start_date: Date | null;
  secondary_cnaes_raw: string | null;
  street_type: string | null;
  street_name: string | null;
  street_number: string | null;
  address_complement: string | null;
  district: string | null;
  postal_code: string | null;
  city_description: string | null;
  phone_area_code_1: string | null;
  phone_number_1: string | null;
  phone_area_code_2: string | null;
  phone_number_2: string | null;
  fax_area_code: string | null;
  fax_number: string | null;
  email: string | null;
  special_status: string | null;
  special_status_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface PartnerRow {
  id: string;
  cnpj_root: string;
  partner_type_code: string;
  partner_type_description: string | null;
  partner_name: string;
  partner_document: string | null;
  partner_qualification_code: string;
  partner_qualification_description: string | null;
  entry_date: Date | null;
  country_code: string | null;
  country_description: string | null;
  legal_representative_document: string | null;
  legal_representative_name: string | null;
  legal_representative_qualification_code: string | null;
  legal_representative_qualification_description: string | null;
  age_group_code: string | null;
  age_group_description: string | null;
}

export interface SimplesOptionRow {
  cnpj_root: string;
  simples_option_flag: string | null;
  simples_option_date: Date | null;
  simples_exclusion_date: Date | null;
  mei_option_flag: string | null;
  mei_option_date: Date | null;
  mei_exclusion_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
