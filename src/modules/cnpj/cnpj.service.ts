import { BadRequestError, NotFoundError } from "../../shared/http/errors.js";
import {
  isCnpjFull,
  isCnpjRoot,
  sanitizeDigits,
} from "../../shared/utils/cnpj.js";
import {
  presentCompany,
  presentEstablishmentDetail,
  presentEstablishmentSummary,
  presentPartner,
  presentSimplesOption,
} from "./cnpj.presenter.js";
import { CnpjRepository } from "./cnpj.repository.js";

export class CnpjService {
  constructor(private readonly repository: CnpjRepository) {}

  async findByDocument(document: string) {
    const normalized = sanitizeDigits(document);

    if (!isCnpjRoot(normalized) && !isCnpjFull(normalized)) {
      throw new BadRequestError(
        "Informe um CNPJ básico com 8 dígitos ou um CNPJ completo com 14 dígitos.",
      );
    }

    if (isCnpjRoot(normalized)) {
      return this.findByRoot(normalized);
    }

    return this.findByFull(normalized);
  }

  private async findByRoot(cnpjRoot: string) {
    const [company, establishments, partners, simples] = await Promise.all([
      this.repository.findCompanyByRoot(cnpjRoot),
      this.repository.findEstablishmentsByRoot(cnpjRoot),
      this.repository.findPartnersByRoot(cnpjRoot),
      this.repository.findSimplesByRoot(cnpjRoot),
    ]);

    if (!company) {
      throw new NotFoundError("CNPJ básico não encontrado.");
    }

    return {
      tipoConsulta: "cnpjBasico",
      documentoConsultado: cnpjRoot,
      empresa: presentCompany(company),
      estabelecimentos: establishments.map(presentEstablishmentSummary),
      socios: partners.map(presentPartner),
      simples: presentSimplesOption(simples),
    };
  }

  private async findByFull(cnpjFull: string) {
    const establishment =
      await this.repository.findEstablishmentByFull(cnpjFull);

    if (!establishment) {
      throw new NotFoundError("CNPJ completo não encontrado.");
    }

    const [company, establishments, partners, simples] = await Promise.all([
      this.repository.findCompanyByRoot(establishment.cnpj_root),
      this.repository.findEstablishmentsByRoot(establishment.cnpj_root),
      this.repository.findPartnersByRoot(establishment.cnpj_root),
      this.repository.findSimplesByRoot(establishment.cnpj_root),
    ]);

    if (!company) {
      throw new NotFoundError(
        "Empresa vinculada ao CNPJ informado não encontrada.",
      );
    }

    return {
      tipoConsulta: "cnpjCompleto",
      documentoConsultado: cnpjFull,
      empresa: presentCompany(company),
      estabelecimentoConsultado: presentEstablishmentDetail(establishment),
      estabelecimentosRelacionados: establishments.map(
        presentEstablishmentSummary,
      ),
      socios: partners.map(presentPartner),
      simples: presentSimplesOption(simples),
    };
  }
}
