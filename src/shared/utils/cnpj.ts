export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isCnpjRoot(value: string): boolean {
  return sanitizeDigits(value).length === 8;
}

export function isCnpjFull(value: string): boolean {
  return sanitizeDigits(value).length === 14;
}
