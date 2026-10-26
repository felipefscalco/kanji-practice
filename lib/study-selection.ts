import type { ReviewKind } from "@/lib/review-session";
import { resolveKanjiIds } from "@/lib/curriculum";
import type { KanjiId } from "@/lib/kanji-types";

export const ACTIVE_SECTIONS_KEY = "oyster-active-sections";
export const ACTIVE_KINDS_KEY = "oyster-active-kinds";
/** Fired on window when the selection changes in this tab (storage events cover other tabs). */
export const SELECTION_EVENT = "oyster-selection";

export const ALL_REVIEW_KINDS: ReviewKind[] = ["meaning", "reading", "writing"];

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
  window.dispatchEvent(new Event(SELECTION_EVENT));
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
    "ch-05-s01",
    "ch-05-s02",
    "ch-05-s03",
    "ch-05-s04",
    "ch-05-s05",
    "ch-05-s06",
    "ch-05-s07",
  ];
}

export function getActiveKanjiIds(): KanjiId[] {
  const sectionIds = getActiveSectionIds();
  if (sectionIds.length === 0) {
    return resolveKanjiIds(defaultSectionIds());
  }
  return resolveKanjiIds(sectionIds);
}

/** Which question types (significado, leitura, escrita) the practice cycle asks. */
export function getActiveReviewKinds(): ReviewKind[] {
  if (typeof window === "undefined") {
    return ALL_REVIEW_KINDS;
  }
  try {
    const raw = window.sessionStorage.getItem(ACTIVE_KINDS_KEY);
    if (!raw) {
      return ALL_REVIEW_KINDS;
    }
    const stored = JSON.parse(raw) as string[];
    const kinds = ALL_REVIEW_KINDS.filter((k) => stored.includes(k));
    return kinds.length > 0 ? kinds : ALL_REVIEW_KINDS;
  } catch {
    return ALL_REVIEW_KINDS;
  }
}

export function setActiveReviewKinds(kinds: ReviewKind[]): void {
  window.sessionStorage.setItem(ACTIVE_KINDS_KEY, JSON.stringify(kinds));
  window.dispatchEvent(new Event(SELECTION_EVENT));
}
