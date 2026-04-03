import { BadRequestError } from "../http/errors.js";

export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isCnpjRoot(value: string): boolean {
  return sanitizeDigits(value).length === 8;
}

export function isCnpjFull(value: string): boolean {
  return sanitizeDigits(value).length === 14;
}

export function assertValidCnpjRoot(value: string, fieldName = "cnpjBasico") {
  const normalized = sanitizeDigits(value);

  if (normalized.length !== 8) {
    throw new BadRequestError(`${fieldName} deve conter exatamente 8 dígitos.`);
  }

  return normalized;
}

export function extractCnpjRootFromDocument(value: string, fieldName = "cnpj") {
  const normalized = sanitizeDigits(value);

  if (normalized.length === 8) {
    return normalized;
  }

  if (normalized.length === 14) {
    return normalized.slice(0, 8);
  }

  throw new BadRequestError(
    `${fieldName} deve conter 8 dígitos para raiz ou 14 dígitos para CNPJ completo.`,
  );
}
