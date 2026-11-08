/**
 * Reading markup for kanji that may not be learned yet: "{調|ちょう}{味|み}{料|りょう}".
 * A group holds one or more kanji and their reading; text outside groups is shown as is.
 * Like the book, a group whose kanji are not all learned is written in kana (ちょう味料, い味).
 */
const GROUP = /\{([^|{}]+)\|([^{}]+)\}/gu;

/** Every kanji written: "{取|と}り{皿|ざら}" → "取り皿". */
export function furiganaKanji(markup: string): string {
  return markup.replace(GROUP, (_, kanji: string) => kanji);
}

/** Kana only: "{取|と}り{皿|ざら}" → "とりざら". */
export function furiganaReading(markup: string): string {
  return markup.replace(GROUP, (_, _kanji: string, reading: string) => reading);
}

/** Kanji for learned groups, kana for the rest. */
export function renderFurigana(markup: string, learned: ReadonlySet<string>): string {
  return markup.replace(GROUP, (_, kanji: string, reading: string) =>
    [...kanji].every((ch) => learned.has(ch)) ? kanji : reading,
  );
}

export function isKanji(ch: string): boolean {
  return /\p{Script=Han}/u.test(ch);
}

/** Kanji written outside markup groups (they always show as kanji). */
export function bareKanji(markup: string): string[] {
  return [...markup.replace(GROUP, "")].filter(isKanji);
}
