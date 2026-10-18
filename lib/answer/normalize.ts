/** PT-BR: compare without accents (público = publico, praça = praca). */
function stripPortugueseDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ß/g, "ss");
}

export function normalizeAnswer(input: string): string {
  return stripPortugueseDiacritics(
    input
      .trim()
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[.,;:!?]/g, ""),
  );
}
