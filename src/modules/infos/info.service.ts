import { BadRequestError } from "../../shared/http/errors.js";
import { translateDomainDescription } from "../domains/domain.translation.js";
import { InfoRepository } from "./info.repository.js";
import {
  BRAZILIAN_STATES,
  getBrazilianStateInfo,
  isValidBrazilianState,
  type BrazilianRegion,
} from "./state-region.catalog.js";

interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

interface RankingQuery {
  limite?: string;
}

interface CityRankingQuery extends RankingQuery {
  uf?: string;
}

const DEFAULT_CACHE_TTL_SECONDS = 300;
const DEFAULT_RANKING_LIMIT = 10;
const DEFAULT_CITY_LIMIT = 20;
const MAX_RANKING_LIMIT = 50;
const MAX_CITY_LIMIT = 100;
const ACTIVE_REGISTRATION_STATUS_CODE = "02";

export class InfoService {
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly repository: InfoRepository) {}

  getOverview() {
    return {
      descricao:
        "Endpoints de leitura otimizados para cards, indicadores, landing pages e integrações que precisam exibir estatísticas simples da base CNPJ.",
      observacoes: [
        "Os indicadores de empresas ativas consideram registros da tabela establishments com situation cadastral ativa, código 02.",
        "As respostas usam campos em português, mesmo quando o banco utiliza nomes de colunas em inglês.",
        "Os resultados possuem cache em memória por padrão para reduzir carga em páginas públicas.",
      ],
      endpoints: [
        {
          metodo: "GET",
          rota: "/api/infos/empresas/ativas/resumo",
          descricao: "Resumo pronto para cards de landing page.",
        },
        {
          metodo: "GET",
          rota: "/api/infos/empresas/ativas/total",
          descricao: "Total de CNPJs completos com situação cadastral ativa.",
        },
        {
          metodo: "GET",
          rota: "/api/infos/empresas/ativas/por-uf",
          descricao: "Quantidade de CNPJs ativos agrupados por estado.",
        },
        {
          metodo: "GET",
          rota: "/api/infos/empresas/ativas/por-regiao",
          descricao:
            "Quantidade de CNPJs ativos agrupados por região brasileira.",
        },
        {
          metodo: "GET",
          rota: "/api/infos/empresas/ativas/por-porte",
          descricao:
            "Quantidade de CNPJs ativos agrupados por porte da empresa.",
        },
        {
          metodo: "GET",
          rota: "/api/infos/empresas/ativas/por-cnae-principal",
          descricao: "Ranking de CNPJs ativos por CNAE principal.",
        },
        {
          metodo: "GET",
          rota: "/api/infos/empresas/ativas/por-municipio",
          descricao:
            "Ranking de CNPJs ativos por município, com filtro opcional por UF.",
        },
      ],
    };
  }

  async getLandingSummary() {
    return this.withCache("landing-summary", async () => {
      const stateRows =
        await this.repository.countActiveEstablishmentsByState();
      const total = stateRows.reduce((sum, row) => sum + Number(row.total), 0);
      const states = this.presentByStateRows(stateRows, total);
      const topState = states[0] ?? null;

      return {
        totalCnpjsAtivos: total,
        totalEstadosComCnpjsAtivos: states.length,
        totalRegioesComCnpjsAtivos: this.presentByRegionRows(stateRows, total)
          .length,
        estadoComMaiorQuantidade: topState,
        criterio: this.getActiveCriterion(),
        geradoEm: new Date().toISOString(),
      };
    });
  }

  async getActiveTotal() {
    return this.withCache("active-total", async () => ({
      totalCnpjsAtivos: await this.repository.countActiveEstablishments(),
      criterio: this.getActiveCriterion(),
      geradoEm: new Date().toISOString(),
    }));
  }

  async getActiveByState() {
    return this.withCache("active-by-state", async () => {
      const rows = await this.repository.countActiveEstablishmentsByState();
      const total = rows.reduce((sum, row) => sum + Number(row.total), 0);

      return {
        criterio: this.getActiveCriterion(),
        totalCnpjsAtivos: total,
        resultado: this.presentByStateRows(rows, total),
        geradoEm: new Date().toISOString(),
      };
    });
  }

  async getActiveByRegion() {
    return this.withCache("active-by-region", async () => {
      const rows = await this.repository.countActiveEstablishmentsByState();
      const total = rows.reduce((sum, row) => sum + Number(row.total), 0);

      return {
        criterio: this.getActiveCriterion(),
        totalCnpjsAtivos: total,
        resultado: this.presentByRegionRows(rows, total),
        geradoEm: new Date().toISOString(),
      };
    });
  }

  async getActiveByCompanySize() {
    return this.withCache("active-by-company-size", async () => {
      const rows =
        await this.repository.countActiveEstablishmentsByCompanySize();
      const total = rows.reduce((sum, row) => sum + Number(row.total), 0);

      return {
        criterio: this.getActiveCriterion(),
        totalCnpjsAtivos: total,
        resultado: rows.map((row) => {
          const itemTotal = Number(row.total);

          return {
            codigoPorteEmpresa: row.company_size_code,
            descricaoPorteEmpresa: translateDomainDescription(
              "company_sizes",
              row.company_size_description,
            ),
            total: itemTotal,
            percentual: this.calculatePercentage(itemTotal, total),
          };
        }),
        geradoEm: new Date().toISOString(),
      };
    });
  }

  async getActiveByMainCnae(query: RankingQuery) {
    const limit = this.parseLimit(
      query.limite,
      DEFAULT_RANKING_LIMIT,
      MAX_RANKING_LIMIT,
    );

    return this.withCache(`active-by-main-cnae:${limit}`, async () => {
      const [rows, total] = await Promise.all([
        this.repository.countActiveEstablishmentsByMainCnae(limit),
        this.repository.countActiveEstablishments(),
      ]);

      return {
        criterio: this.getActiveCriterion(),
        totalCnpjsAtivos: total,
        limite: limit,
        resultado: rows.map((row) => {
          const itemTotal = Number(row.total);

          return {
            codigoCnaePrincipal: row.main_cnae_code,
            descricaoCnaePrincipal: row.main_cnae_description,
            total: itemTotal,
            percentual: this.calculatePercentage(itemTotal, total),
          };
        }),
        geradoEm: new Date().toISOString(),
      };
    });
  }

  async getActiveByCity(query: CityRankingQuery) {
    const limit = this.parseLimit(
      query.limite,
      DEFAULT_CITY_LIMIT,
      MAX_CITY_LIMIT,
    );
    const stateCode = this.parseOptionalStateCode(query.uf);
    const cacheKey = `active-by-city:${stateCode ?? "br"}:${limit}`;

    return this.withCache(cacheKey, async () => {
      const [rows, total] = await Promise.all([
        this.repository.countActiveEstablishmentsByCity({
          stateCode,
          limit,
        }),
        this.repository.countActiveEstablishments(),
      ]);

      return {
        criterio: this.getActiveCriterion(),
        filtrosAplicados: {
          uf: stateCode ?? null,
        },
        totalCnpjsAtivos: total,
        limite: limit,
        resultado: rows.map((row) => {
          const stateInfo = getBrazilianStateInfo(row.state_code);
          const itemTotal = Number(row.total);

          return {
            uf: row.state_code,
            estado: stateInfo?.nome ?? row.state_code,
            regiao: stateInfo?.regiao ?? null,
            codigoMunicipio: row.city_code,
            descricaoMunicipio: row.city_description,
            total: itemTotal,
            percentual: this.calculatePercentage(itemTotal, total),
          };
        }),
        geradoEm: new Date().toISOString(),
      };
    });
  }

  private presentByStateRows(
    rows: Awaited<
      ReturnType<InfoRepository["countActiveEstablishmentsByState"]>
    >,
    total: number,
  ) {
    return rows
      .map((row) => {
        const stateInfo = getBrazilianStateInfo(row.state_code);
        const itemTotal = Number(row.total);

        return {
          uf: row.state_code,
          estado: stateInfo?.nome ?? row.state_code,
          regiao: stateInfo?.regiao ?? null,
          total: itemTotal,
          percentual: this.calculatePercentage(itemTotal, total),
        };
      })
      .sort(
        (left, right) =>
          right.total - left.total || left.uf.localeCompare(right.uf),
      );
  }

  private presentByRegionRows(
    rows: Awaited<
      ReturnType<InfoRepository["countActiveEstablishmentsByState"]>
    >,
    total: number,
  ) {
    const regionTotals = new Map<BrazilianRegion, number>(
      BRAZILIAN_STATES.map((state) => [state.regiao, 0]),
    );

    for (const row of rows) {
      const stateInfo = getBrazilianStateInfo(row.state_code);

      if (stateInfo) {
        regionTotals.set(
          stateInfo.regiao,
          (regionTotals.get(stateInfo.regiao) ?? 0) + Number(row.total),
        );
      }
    }

    return Array.from(regionTotals.entries())
      .map(([region, regionTotal]) => ({
        regiao: region,
        total: regionTotal,
        percentual: this.calculatePercentage(regionTotal, total),
      }))
      .filter((item) => item.total > 0)
      .sort(
        (left, right) =>
          right.total - left.total || left.regiao.localeCompare(right.regiao),
      );
  }

  private getActiveCriterion() {
    return {
      tabelaBase: "establishments",
      campoSituacaoCadastral: "registration_status_code",
      codigoSituacaoCadastral: ACTIVE_REGISTRATION_STATUS_CODE,
      descricaoSituacaoCadastral: "Ativa",
      escopo:
        "CNPJs completos/estabelecimentos ativos. Uma mesma empresa pode possuir mais de um estabelecimento ativo.",
    };
  }

  private parseOptionalStateCode(uf?: string) {
    if (!uf) {
      return undefined;
    }

    const stateCode = uf.trim().toUpperCase();

    if (!isValidBrazilianState(stateCode)) {
      throw new BadRequestError("Informe uma UF brasileira válida.");
    }

    return stateCode;
  }

  private parseLimit(
    rawLimit: string | undefined,
    defaultLimit: number,
    maxLimit: number,
  ) {
    const parsedLimit = Number(rawLimit ?? defaultLimit);

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      return defaultLimit;
    }

    return Math.min(Math.trunc(parsedLimit), maxLimit);
  }

  private calculatePercentage(value: number, total: number) {
    if (total <= 0) {
      return 0;
    }

    return Number(((value / total) * 100).toFixed(2));
  }

  private async withCache<T>(
    key: string,
    factory: () => Promise<T>,
  ): Promise<T> {
    const ttlMs = this.getCacheTtlMs();

    if (ttlMs <= 0) {
      return factory();
    }

    const now = Date.now();
    const cached = this.cache.get(key) as CacheEntry<T> | undefined;

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const data = await factory();
    this.cache.set(key, {
      data,
      expiresAt: now + ttlMs,
    });

    return data;
  }

  private getCacheTtlMs() {
    const ttlSeconds = Number(
      process.env.INFO_CACHE_TTL_SECONDS ?? DEFAULT_CACHE_TTL_SECONDS,
    );

    if (!Number.isFinite(ttlSeconds) || ttlSeconds < 0) {
      return DEFAULT_CACHE_TTL_SECONDS * 1000;
    }

    return ttlSeconds * 1000;
  }
}
