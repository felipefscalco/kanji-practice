import chaptersN4 from "@/data/kanji-master-n4/chapters.json";
import enrichedN4 from "@/data/kanji-master-n4/kanji.enriched.json";
import chaptersN5 from "@/data/kanji-master-n5/chapters.json";
import enrichedN5 from "@/data/kanji-master-n5/kanji.enriched.json";

import type {
  BookId,
  Chapter,
  ChaptersFile,
  KanjiEntry,
  KanjiId,
  Section,
} from "@/lib/kanji-types";

export const BOOKS: { id: BookId; label: string }[] = [
  { id: "n5", label: "N5" },
  { id: "n4", label: "N4" },
];

/** Curriculum order: the N5 book, then the N4 book. */
const chapters: Chapter[] = [
  ...(chaptersN5 as ChaptersFile).chapters.map((c) => ({ ...c, book: "n5" as const })),
  ...(chaptersN4 as ChaptersFile).chapters.map((c) => ({ ...c, book: "n4" as const })),
];
const enriched = [...(enrichedN5 as KanjiEntry[]), ...(enrichedN4 as KanjiEntry[])];

const enrichedById = new Map(enriched.map((k) => [k.id, k]));

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChaptersOfBook(book: BookId): Chapter[] {
  return chapters.filter((c) => c.book === book);
}

export function bookLabel(book: BookId): string {
  return BOOKS.find((b) => b.id === book)?.label ?? book;
}

/** "N5 第4章 しぜん-1" */
export function chapterTitle(chapter: Chapter): string {
  return `${bookLabel(chapter.book)} 第${chapter.number}章 ${chapter.titleJa}`;
}

export function getChapterForSection(sectionId: string): Chapter | undefined {
  return chapters.find((c) => c.sections.some((s) => s.id === sectionId));
}

/** Last chapter, in curriculum order, with a selected section: where the class is. */
export function currentChapter(selectedSectionIds: string[]): Chapter | undefined {
  return chapters.findLast((c) => c.sections.some((s) => selectedSectionIds.includes(s.id))) ?? chapters.at(-1);
}

export function charFromKanjiId(id: KanjiId | string): string {
  return id.replace(/^km-n\d-/, "");
}

const learnedBySection = new Map<string, ReadonlySet<string>>();
{
  const learned = new Set<string>();
  for (const chapter of chapters) {
    for (const section of chapter.sections) {
      section.kanjiIds.forEach((id) => learned.add(charFromKanjiId(id)));
      learnedBySection.set(section.id, new Set(learned));
    }
  }
}

/** Kanji learned up to and including this section, in curriculum order. */
export function learnedThroughSection(sectionId: string): ReadonlySet<string> {
  return learnedBySection.get(sectionId) ?? new Set();
}

/** Kanji learned by the end of this chapter. */
export function learnedThroughChapter(chapterId: string): ReadonlySet<string> {
  const last = getChapterById(chapterId)?.sections.at(-1);
  return last ? learnedThroughSection(last.id) : new Set();
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
