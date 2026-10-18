/** Extrai apenas caracteres han (kanji) do que o IME / teclado enviou. */
export function extractHanCharacters(input: string): string {
  return [...input.normalize("NFKC")]
    .filter((ch) => /\p{Script=Han}/u.test(ch))
    .join("");
}

export function normalizeKanjiForCompare(character: string): string {
  return character.normalize("NFKC");
}
