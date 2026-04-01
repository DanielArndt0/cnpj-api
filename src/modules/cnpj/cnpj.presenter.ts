import { toIsoDate } from "../../shared/presentation/date.js";
import type {
  CompanyRow,
  EstablishmentDetailRow,
  EstablishmentSummaryRow,
  PartnerRow,
  SimplesOptionRow,
} from "./cnpj.types.js";

export function presentCompany(company: CompanyRow) {
  return {
    cnpjBasico: company.cnpj_root,
    razaoSocial: company.company_name,
    codigoNaturezaJuridica: company.legal_nature_code,
    descricaoNaturezaJuridica: company.legal_nature_description,
    codigoQualificacaoResponsavel: company.responsible_qualification_code,
    descricaoQualificacaoResponsavel:
      company.responsible_qualification_description,
    capitalSocial: company.share_capital,
    codigoPorteEmpresa: company.company_size_code,
    descricaoPorteEmpresa: company.company_size_description,
    enteFederativoResponsavel: company.responsible_federative_entity,
    criadoEm: company.created_at.toISOString(),
    atualizadoEm: company.updated_at.toISOString(),
  };
}

export function presentEstablishmentSummary(
  establishment: EstablishmentSummaryRow,
) {
  return {
    cnpjCompleto: establishment.cnpj_full,
    cnpjBasico: establishment.cnpj_root,
    codigoTipoEstabelecimento: establishment.branch_type_code,
    descricaoTipoEstabelecimento: establishment.branch_type_description,
    nomeFantasia: establishment.trade_name,
    codigoSituacaoCadastral: establishment.registration_status_code,
    descricaoSituacaoCadastral: establishment.registration_status_description,
    dataSituacaoCadastral: toIsoDate(establishment.registration_status_date),
    codigoCnaePrincipal: establishment.main_cnae_code,
    descricaoCnaePrincipal: establishment.main_cnae_description,
    uf: establishment.state_code,
    municipioCodigo: establishment.city_code,
  };
}

export function presentEstablishmentDetail(
  establishment: EstablishmentDetailRow,
) {
  return {
    cnpjCompleto: establishment.cnpj_full,
    cnpjBasico: establishment.cnpj_root,
    ordemCnpj: establishment.cnpj_order,
    digitosVerificadoresCnpj: establishment.cnpj_check_digits,
    codigoTipoEstabelecimento: establishment.branch_type_code,
    descricaoTipoEstabelecimento: establishment.branch_type_description,
    nomeFantasia: establishment.trade_name,
    codigoSituacaoCadastral: establishment.registration_status_code,
    descricaoSituacaoCadastral: establishment.registration_status_description,
    dataSituacaoCadastral: toIsoDate(establishment.registration_status_date),
    codigoMotivoSituacaoCadastral:
      establishment.registration_status_reason_code,
    descricaoMotivoSituacaoCadastral:
      establishment.registration_reason_description,
    nomeCidadeExterior: establishment.foreign_city_name,
    codigoPais: establishment.country_code,
    descricaoPais: establishment.country_description,
    dataInicioAtividade: toIsoDate(establishment.activity_start_date),
    codigoCnaePrincipal: establishment.main_cnae_code,
    descricaoCnaePrincipal: establishment.main_cnae_description,
    cnaesSecundariosBrutos: establishment.secondary_cnaes_raw,
    tipoLogradouro: establishment.street_type,
    logradouro: establishment.street_name,
    numero: establishment.street_number,
    complemento: establishment.address_complement,
    bairro: establishment.district,
    cep: establishment.postal_code,
    uf: establishment.state_code,
    codigoMunicipio: establishment.city_code,
    descricaoMunicipio: establishment.city_description,
    dddTelefone1: establishment.phone_area_code_1,
    telefone1: establishment.phone_number_1,
    dddTelefone2: establishment.phone_area_code_2,
    telefone2: establishment.phone_number_2,
    dddFax: establishment.fax_area_code,
    fax: establishment.fax_number,
    email: establishment.email,
    situacaoEspecial: establishment.special_status,
    dataSituacaoEspecial: toIsoDate(establishment.special_status_date),
    criadoEm: establishment.created_at.toISOString(),
    atualizadoEm: establishment.updated_at.toISOString(),
  };
}

export function presentPartner(partner: PartnerRow) {
  return {
    id: partner.id,
    cnpjBasico: partner.cnpj_root,
    codigoTipoSocio: partner.partner_type_code,
    descricaoTipoSocio: partner.partner_type_description,
    nomeSocio: partner.partner_name,
    documentoSocio: partner.partner_document,
    codigoQualificacaoSocio: partner.partner_qualification_code,
    descricaoQualificacaoSocio: partner.partner_qualification_description,
    dataEntradaSociedade: toIsoDate(partner.entry_date),
    codigoPais: partner.country_code,
    descricaoPais: partner.country_description,
    documentoRepresentanteLegal: partner.legal_representative_document,
    nomeRepresentanteLegal: partner.legal_representative_name,
    codigoQualificacaoRepresentanteLegal:
      partner.legal_representative_qualification_code,
    descricaoQualificacaoRepresentanteLegal:
      partner.legal_representative_qualification_description,
    codigoFaixaEtaria: partner.age_group_code,
    descricaoFaixaEtaria: partner.age_group_description,
  };
}

export function presentSimplesOption(option: SimplesOptionRow | null) {
  if (!option) {
    return null;
  }

  return {
    cnpjBasico: option.cnpj_root,
    opcaoSimples: option.simples_option_flag,
    dataOpcaoSimples: toIsoDate(option.simples_option_date),
    dataExclusaoSimples: toIsoDate(option.simples_exclusion_date),
    opcaoMei: option.mei_option_flag,
    dataOpcaoMei: toIsoDate(option.mei_option_date),
    dataExclusaoMei: toIsoDate(option.mei_exclusion_date),
    criadoEm: option.created_at.toISOString(),
    atualizadoEm: option.updated_at.toISOString(),
  };
}
