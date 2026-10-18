import { resolveKanjiIds } from "@/lib/curriculum";
import type { KanjiId } from "@/lib/kanji-types";

export const ACTIVE_SECTIONS_KEY = "oyster-active-sections";

export function getActiveSectionIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.sessionStorage.getItem(ACTIVE_SECTIONS_KEY);
    if (!raw) {
      return defaultSectionIds();
    }
    return JSON.parse(raw) as string[];
  } catch {
    return defaultSectionIds();
  }
}

export function setActiveSectionIds(sectionIds: string[]): void {
  window.sessionStorage.setItem(ACTIVE_SECTIONS_KEY, JSON.stringify(sectionIds));
}

export function defaultSectionIds(): string[] {
  return [
    "ch-04-s01",
    "ch-04-s02",
    "ch-04-s03",
    "ch-04-s04",
    "ch-04-s05",
    "ch-04-s06",
    "ch-04-s07",
    "ch-04-s08",
    "ch-04-s09",
  ];
}

export function getActiveKanjiIds(): KanjiId[] {
  const sectionIds = getActiveSectionIds();
  if (sectionIds.length === 0) {
    return resolveKanjiIds(defaultSectionIds());
  }
  return resolveKanjiIds(sectionIds);
}
