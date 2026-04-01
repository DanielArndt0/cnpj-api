import type { CompanyRow } from "../cnpj/cnpj.types.js";
import { presentCompany } from "../cnpj/cnpj.presenter.js";

export function presentCompanyListItem(company: CompanyRow) {
  const base = presentCompany(company);

  return {
    cnpjBasico: base.cnpjBasico,
    razaoSocial: base.razaoSocial,
    codigoNaturezaJuridica: base.codigoNaturezaJuridica,
    descricaoNaturezaJuridica: base.descricaoNaturezaJuridica,
    codigoPorteEmpresa: base.codigoPorteEmpresa,
    descricaoPorteEmpresa: base.descricaoPorteEmpresa,
  };
}
