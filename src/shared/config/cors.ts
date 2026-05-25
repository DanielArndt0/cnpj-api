export type CorsOriginConfig = boolean | string[];

const ALLOW_ALL_ORIGINS = "*";

export function parseCorsOrigins(
  value = process.env.CORS_ORIGINS,
): CorsOriginConfig {
  const origins = value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!origins?.length) {
    return false;
  }

  if (origins.includes(ALLOW_ALL_ORIGINS)) {
    return true;
  }

  return [...new Set(origins)];
}
