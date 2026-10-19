import { toHiraganaReading } from "@/lib/display-readings";
import type { KanjiEntry } from "@/lib/kanji-types";
import { getVocabularyCatalog } from "@/lib/vocabulary";

/** Kanji taught per lesson round. */
export const LESSON_BATCH = 5;

export interface KunReading {
  /** Reading of the kanji itself. */
  stem: string;
  /** Kana written after the kanji, when a book word shows it (働く → く). */
  okurigana: string;
}

/**
 * Kun'yomi for display: deduplicated, suffix markers removed, with okurigana
 * taken from the chapter words that write the kanji followed by kana.
 */
export function kunReadings(kanji: KanjiEntry): KunReading[] {
  const stems = [...new Set(kanji.kunReadings.map((r) => toHiraganaReading(r.replace(/^-/, ""))))];
  const words = getVocabularyCatalog().filter((v) => v.expression.startsWith(kanji.character));
  return stems.map((stem) => {
    for (const word of words) {
      const tail = word.expression.slice(kanji.character.length);
      if (tail && /^\p{Script=Hiragana}+$/u.test(tail) && toHiraganaReading(word.reading) === stem + tail) {
        return { stem, okurigana: tail };
      }
    }
    return { stem, okurigana: "" };
  });
}

export function onReadings(kanji: KanjiEntry): string[] {
  return [...new Set(kanji.onReadings.map(toHiraganaReading))];
}
