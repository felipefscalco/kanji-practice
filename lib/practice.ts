import { getKanjiById } from "@/lib/curriculum";
import type { KanjiEntry, KanjiId } from "@/lib/kanji-types";
import {
  buildInterleavedReviewQueue,
  type ReviewItem,
} from "@/lib/review-session";
import { getVocabularyForKanjiIds } from "@/lib/vocabulary";

export const PROMPTS_PER_KANJI = 3;
export const PROMPTS_PER_VOCAB = 3;

export type { ReviewItem };

export function kanjiEntriesFromIds(ids: KanjiId[]): KanjiEntry[] {
  return ids.map((id) => getKanjiById(id)).filter((k): k is KanjiEntry => k !== undefined);
}

export function buildPracticeQueue(kanjiIds: KanjiId[]): ReviewItem[] {
  const kanji = kanjiEntriesFromIds(kanjiIds);
  const vocab = getVocabularyForKanjiIds(kanjiIds);
  return buildInterleavedReviewQueue(kanji, vocab);
}

export function practicePromptCount(kanjiCount: number, vocabCount: number): number {
  return kanjiCount * PROMPTS_PER_KANJI + vocabCount * PROMPTS_PER_VOCAB;
}

export function countPracticePrompts(kanjiIds: KanjiId[]): number {
  const vocab = getVocabularyForKanjiIds(kanjiIds);
  return practicePromptCount(kanjiIds.length, vocab.length);
}
