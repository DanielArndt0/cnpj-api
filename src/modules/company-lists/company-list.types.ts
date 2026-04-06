export interface CompanyListRow {
  cnpj_full: string;
  cnpj_root: string;
  company_name: string;
  trade_name: string | null;
  main_cnae_code: string;
  main_cnae_description: string | null;
  state_code: string | null;
  city_description: string | null;
  registration_status_code: string;
  registration_status_description: string | null;
  branch_type_code: string;
  branch_type_description: string | null;
  legal_nature_code: string;
  legal_nature_description: string | null;
  company_size_code: string;
  company_size_description: string | null;
}
