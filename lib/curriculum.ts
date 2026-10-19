import chaptersData from "@/data/kanji-master-n4/chapters.json";
import enrichedData from "@/data/kanji-master-n4/kanji.enriched.json";

import type {
  Chapter,
  ChaptersFile,
  KanjiEntry,
  KanjiId,
  Section,
} from "@/lib/kanji-types";

const chaptersFile = chaptersData as ChaptersFile;
const enriched = enrichedData as KanjiEntry[];

const enrichedById = new Map(enriched.map((k) => [k.id, k]));

export function getChapters(): Chapter[] {
  return chaptersFile.chapters;
}

export function getChapterById(id: string): Chapter | undefined {
  return getChapters().find((c) => c.id === id);
}

export function resolveKanjiIds(sectionIds: string[]): KanjiId[] {
  const ids = new Set<KanjiId>();
  for (const chapter of getChapters()) {
    for (const section of chapter.sections) {
      if (sectionIds.includes(section.id)) {
        for (const kanjiId of section.kanjiIds) {
          ids.add(kanjiId);
        }
      }
    }
  }
  return [...ids];
}

export function getAllKanjiIds(): KanjiId[] {
  const ids = new Set<KanjiId>();
  for (const chapter of getChapters()) {
    for (const section of chapter.sections) {
      for (const kanjiId of section.kanjiIds) {
        ids.add(kanjiId);
      }
    }
  }
  return [...ids];
}

export function getKanjiById(id: KanjiId | string): KanjiEntry | undefined {
  return enrichedById.get(id as KanjiId);
}

export function getKanjiCatalog(): KanjiEntry[] {
  return enriched;
}

export function getSectionById(id: string): Section | undefined {
  for (const chapter of getChapters()) {
    const section = chapter.sections.find((s) => s.id === id);
    if (section) {
      return section;
    }
  }
  return undefined;
}

/** First subsection of the book that teaches this kanji. */
export function getSectionForKanji(id: KanjiId): Section | undefined {
  for (const chapter of getChapters()) {
    const section = chapter.sections.find((s) => s.kanjiIds.includes(id));
    if (section) {
      return section;
    }
  }
  return undefined;
}

export function getKanjiByCharacter(character: string): KanjiEntry | undefined {
  return enriched.find((k) => k.character === character);
}
