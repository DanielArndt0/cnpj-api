import { HealthRepository } from "./health.repository.js";

export type HealthDependencyStatus = "healthy" | "unhealthy";
export type HealthServiceStatus = "healthy" | "unhealthy";

export type HealthCheckResult = {
  service: string;
  version: string;
  status: HealthServiceStatus;
  timestamp: string;
  uptimeSeconds: number;
  dependencies: {
    database: {
      status: HealthDependencyStatus;
      latencyMs: number;
    };
  };
};

export class HealthService {
  constructor(private readonly repository: HealthRepository) {}

  async check(): Promise<HealthCheckResult> {
    const baseResult = {
      service: "cnpj-api",
      version: process.env.npm_package_version ?? "1.0.0",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };

    try {
      const database = await this.repository.checkDatabase();

      return {
        ...baseResult,
        status: "healthy",
        dependencies: {
          database: {
            status: "healthy",
            latencyMs: database.latencyMs,
          },
        },
      };
    } catch {
      return {
        ...baseResult,
        status: "unhealthy",
        dependencies: {
          database: {
            status: "unhealthy",
            latencyMs: 0,
          },
        },
      };
    }
  }
}
