import "dotenv/config";
import { Pool, type QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_POOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.DATABASE_IDLE_TIMEOUT_MS ?? 30000),
  connectionTimeoutMillis: Number(
    process.env.DATABASE_CONNECTION_TIMEOUT_MS ?? 5000,
  ),
});

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return pool.query<T>(text, params);
}
