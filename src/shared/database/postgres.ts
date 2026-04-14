import "dotenv/config";
import { Pool, type QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.DATABASE_IDLE_TIMEOUT_MS ?? 30000),
  connectionTimeoutMillis: Number(
    process.env.DATABASE_CONNECTION_TIMEOUT_MS ?? 5000,
  ),
  query_timeout: Number(process.env.DATABASE_QUERY_TIMEOUT_MS ?? 90000),
  statement_timeout: Number(process.env.DATABASE_STATEMENT_TIMEOUT_MS ?? 90000),
});

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return pool.query<T>(text, params);
}

export async function closeDatabasePool() {
  await pool.end();
}

export async function checkDatabaseConnection(timeoutMs = 2000) {
  const startedAt = Date.now();

  await Promise.race([
    pool.query("select 1"),
    new Promise((_, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Database health check timeout."));
      }, timeoutMs);

      timeout.unref?.();
    }),
  ]);

  return {
    latencyMs: Date.now() - startedAt,
  };
}
