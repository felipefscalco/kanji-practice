import pagesCh04 from "@/data/kanji-master-n4/ch04-pages.json";
import pagesCh05 from "@/data/kanji-master-n4/ch05-pages.json";

export interface BookPage {
  id: string;
  file: string;
  bookPage?: number;
  sectionId: string;
  titleJa: string;
  kind: "lesson" | "review";
  kanji: string[];
}

const pages = [
  ...(pagesCh04 as { pages: BookPage[] }).pages,
  ...(pagesCh05 as { pages: BookPage[] }).pages,
];

const primaryPageByKanji = new Map<string, BookPage>();
for (const page of pages) {
  if (page.kind !== "lesson") {
    continue;
  }
  for (const char of page.kanji) {
    if (!primaryPageByKanji.has(char)) {
      primaryPageByKanji.set(char, page);
    }
  }
}

export function getBookPageForKanji(character: string): BookPage | undefined {
  return primaryPageByKanji.get(character);
}

export function getBookPageImageUrl(character: string): string | undefined {
  return getBookPageForKanji(character)?.file;
}

export function getReviewPagesForSection(sectionId: string): BookPage[] {
  return pages.filter((p) => p.kind === "review" && p.sectionId === sectionId);
}

export function getChapterBookPages(): BookPage[] {
  return pages;
}
