export interface ActiveTotalRow {
  total: string;
}

export interface ActiveByStateRow {
  state_code: string;
  total: string;
}

export interface ActiveByCompanySizeRow {
  company_size_code: string | null;
  company_size_description: string | null;
  total: string;
}

export interface ActiveByMainCnaeRow {
  main_cnae_code: string;
  main_cnae_description: string | null;
  total: string;
}

export interface ActiveByCityRow {
  state_code: string;
  city_code: string;
  city_description: string | null;
  total: string;
}
