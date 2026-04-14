import { BadRequestError } from "../http/errors.js";

const BRAZILIAN_STATE_CODES = new Set([
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]);

export function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

export function validateMinimumTextLength(
  value: string | undefined,
  fieldName: string,
  minimumLength: number,
) {
  if (!value) {
    return;
  }

  if (value.length < minimumLength) {
    throw new BadRequestError(
      `${fieldName} deve conter ao menos ${minimumLength} caracteres.`,
    );
  }
}

export function normalizeBrazilianStateCode(value?: string) {
  const normalized = value?.trim().toUpperCase();

  if (!normalized) {
    return undefined;
  }

  if (!BRAZILIAN_STATE_CODES.has(normalized)) {
    throw new BadRequestError(
      "uf deve ser uma sigla válida de unidade federativa brasileira.",
    );
  }

  return normalized;
}

export function normalizeMainCnaeCode(value?: string) {
  const normalized = value?.replace(/\D/g, "");

  if (!normalized) {
    return undefined;
  }

  if (normalized.length !== 7) {
    throw new BadRequestError(
      "codigoCnaePrincipal deve conter exatamente 7 dígitos.",
    );
  }

  return normalized;
}

export function normalizeCnaeCodeList(value?: string) {
  const normalized = value
    ?.split(",")
    .map((item) => item.replace(/\D/g, ""))
    .filter(Boolean);

  if (!normalized?.length) {
    return undefined;
  }

  const uniqueCodes = [...new Set(normalized)];

  for (const code of uniqueCodes) {
    if (code.length !== 7) {
      throw new BadRequestError(
        "codigosCnae deve conter apenas códigos CNAE com exatamente 7 dígitos.",
      );
    }
  }

  return uniqueCodes;
}
