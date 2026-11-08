/** Kanji Master book: N5 comes first in the curriculum, then N4. */
export type BookId = "n5" | "n4";

export type KanjiId = `km-${BookId}-${string}`;

export interface Section {
  id: string;
  titleJa: string;
  titlePt: string;
  kanjiIds: KanjiId[];
}

export interface Chapter {
  id: string;
  /** Added when the curriculum loads both books. */
  book: BookId;
  number: number;
  titleJa: string;
  titlePt: string;
  sections: Section[];
}

export interface ChaptersFile {
  book: string;
  chapters: Omit<Chapter, "book">[];
}

export interface KanjiEntry {
  id: KanjiId;
  character: string;
  meaningsPt: string[];
  meaningsEn: string[];
  onReadings: string[];
  kunReadings: string[];
  strokeCount?: number;
  jlpt?: number;
}

export type VocabularyId = `v-${string}`;

/** A word as stored in a book's vocabulary.*.json. */
export interface VocabularyData {
  id: VocabularyId;
  /** Full spelling, every kanji written. */
  expression: string;
  reading: string;
  /** Reading of each kanji: "{調|ちょう}{味|み}{料|りょう}", "{取|と}り{皿|ざら}" (see lib/furigana.ts). */
  furigana?: string;
  meaningsPt: string[];
  sectionId: string;
}

/** A word as the app shows it: kanji not yet learned at its section are written in kana. */
export interface VocabularyEntry extends Omit<VocabularyData, "furigana"> {
  /** Display spelling, e.g. "ちょう味料" while 調 and 料 are not learned. */
  expression: string;
  /** Every kanji written: "調味料". */
  fullExpression: string;
  /** Curriculum kanji written as kanji in the display spelling. */
  kanjiIds: KanjiId[];
}

export interface VocabularyFile {
  chapterId: string;
  items: VocabularyData[];
}
