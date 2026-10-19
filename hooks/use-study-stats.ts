"use client";

import { useMemo, useSyncExternalStore } from "react";

import { kanjiEntriesFromIds, countPracticePrompts } from "@/lib/practice";
import { resolveKanjiIds } from "@/lib/curriculum";
import type { KanjiEntry } from "@/lib/kanji-types";
import { LESSON_BATCH } from "@/lib/lessons";
import type { ReviewKind } from "@/lib/review-session";
import { SESSION_SIZE } from "@/lib/session";
import {
  defaultSectionIds,
  getActiveReviewKinds,
  getActiveSectionIds,
  SELECTION_EVENT,
} from "@/lib/study-selection";
import { getVocabularyForKanjiIds } from "@/lib/vocabulary";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SELECTION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SELECTION_EVENT, onChange);
  };
}

// A string snapshot keeps useSyncExternalStore stable between reads.
function snapshot(): string {
  return JSON.stringify([getActiveSectionIds(), getActiveReviewKinds()]);
}

export interface StudyStats {
  sectionIds: string[];
  kinds: ReviewKind[];
  kanjiCount: number;
  vocabCount: number;
  /** Questions in a full practice cycle. */
  promptCount: number;
  /** Questions in the next practice session. */
  sessionCount: number;
  /** Kanji the Lições page will teach. */
  lessonKanji: KanjiEntry[];
}

export interface Selection {
  /** Subsections exactly as chosen (may be empty). */
  sectionIds: string[];
  kinds: ReviewKind[];
}

/** The stored practice selection, live. `null` until it can be read in the browser. */
export function useSelection(): Selection | null {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => {
    if (raw === null) {
      return null;
    }
    const [sectionIds, kinds] = JSON.parse(raw) as [string[], ReviewKind[]];
    return { sectionIds, kinds };
  }, [raw]);
}

/** Practice selection and what it adds up to. `null` until it can be read in the browser. */
export function useStudyStats(): StudyStats | null {
  const selection = useSelection();
  return useMemo(() => {
    if (selection === null) {
      return null;
    }
    const { sectionIds: stored, kinds } = selection;
    // An emptied selection falls back to the whole chapter, like the practice queue does.
    const sectionIds = stored.length > 0 ? stored : defaultSectionIds();
    const kanjiIds = resolveKanjiIds(sectionIds);
    const promptCount = countPracticePrompts(kanjiIds, kinds);
    return {
      sectionIds,
      kinds,
      kanjiCount: kanjiIds.length,
      vocabCount: getVocabularyForKanjiIds(kanjiIds).length,
      promptCount,
      sessionCount: Math.min(SESSION_SIZE, promptCount),
      lessonKanji: kanjiEntriesFromIds(kanjiIds).slice(0, LESSON_BATCH),
    };
  }, [selection]);
}
