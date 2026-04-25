import type { CompanyListRow } from "./company-list.types.js";

export function presentCompanyListItem(item: CompanyListRow) {
  return {
    cnpj: item.cnpj_full,
    razaoSocial: item.company_name,
    nomeFantasia: item.trade_name,
    codigoCnaePrincipal: item.main_cnae_code,
    descricaoCnaePrincipal: item.main_cnae_description,
    uf: item.state_code,
    municipio: item.city_description,
    codigoSituacaoCadastral: item.registration_status_code,
    descricaoSituacaoCadastral: item.registration_status_description,
    codigoTipoEstabelecimento: item.branch_type_code,
    descricaoTipoEstabelecimento: item.branch_type_description,
    codigoNaturezaJuridica: item.legal_nature_code,
    descricaoNaturezaJuridica: item.legal_nature_description,
    codigoPorteEmpresa: item.company_size_code,
    descricaoPorteEmpresa: item.company_size_description,
    endereco: {
      tipoLogradouro: item.street_type,
      logradouro: item.street_name,
      numero: item.street_number,
      complemento: item.address_complement,
      bairro: item.district,
      cep: item.postal_code,
    },
    contato: {
      telefone1: item.phone_number_1
        ? { ddd: item.phone_area_code_1, numero: item.phone_number_1 }
        : null,
      telefone2: item.phone_number_2
        ? { ddd: item.phone_area_code_2, numero: item.phone_number_2 }
        : null,
      fax: item.fax_number
        ? { ddd: item.fax_area_code, numero: item.fax_number }
        : null,
      email: item.email,
    },
  };
}
