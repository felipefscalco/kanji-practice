export type KanjiId = `km-n4-${string}`;

export interface Section {
  id: string;
  titleJa: string;
  titlePt: string;
  kanjiIds: KanjiId[];
}

export interface Chapter {
  id: string;
  number: number;
  titleJa: string;
  titlePt: string;
  sections: Section[];
}

export interface ChaptersFile {
  book: string;
  chapters: Chapter[];
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

export type VocabularyId = `v-ch04-${string}`;

export interface VocabularyEntry {
  id: VocabularyId;
  expression: string;
  reading: string;
  meaningsPt: string[];
  sectionId: string;
  kanjiIds: KanjiId[];
}

export interface VocabularyFile {
  chapterId: string;
  items: VocabularyEntry[];
}
