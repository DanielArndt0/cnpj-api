// Comparação textual acento-insensível para PostgreSQL sem depender da extensão
// `unaccent`. Usa translate(lower(...)) mapeando os acentos mais comuns do
// português para as versões simples. É genérico (serve para qualquer texto:
// cidades, CNAEs, naturezas etc.), não altera dados e não exige migration.
//
// As duas listas precisam ter exatamente o mesmo comprimento: cada caractere
// acentuado em ACCENTED_CHARACTERS é mapeado para o caractere na mesma posição
// em PLAIN_CHARACTERS.
const ACCENTED_CHARACTERS = "áàâãäçéèêëíìîïñóòôõöúùûü";
const PLAIN_CHARACTERS = "aaaaaceeeeiiiinooooouuuu";

/**
 * Envolve uma expressão SQL (coluna ou parâmetro) com lower + translate,
 * produzindo um texto minúsculo e sem acentos para comparações `like`.
 *
 * Aplique nos DOIS lados da comparação para funcionar com termos com ou sem
 * acento, ex.: `${unaccentLower("ci.description")} like ${unaccentLower("$1")}`.
 */
export function unaccentLower(expression: string): string {
  return `translate(lower(${expression}), '${ACCENTED_CHARACTERS}', '${PLAIN_CHARACTERS}')`;
}
