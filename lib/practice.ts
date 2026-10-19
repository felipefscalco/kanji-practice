import type { ReviewKind } from "@/components/review-prompt";
import { getKanjiById } from "@/lib/curriculum";
import type { KanjiEntry, KanjiId } from "@/lib/kanji-types";
import {
  buildInterleavedReviewQueue,
  type ReviewItem,
} from "@/lib/review-session";
import { ALL_REVIEW_KINDS } from "@/lib/study-selection";
import { getVocabularyForKanjiIds } from "@/lib/vocabulary";

export type { ReviewItem };

export function kanjiEntriesFromIds(ids: KanjiId[]): KanjiEntry[] {
  return ids.map((id) => getKanjiById(id)).filter((k): k is KanjiEntry => k !== undefined);
}

export function buildPracticeQueue(
  kanjiIds: KanjiId[],
  kinds: ReviewKind[] = ALL_REVIEW_KINDS,
): ReviewItem[] {
  const kanji = kanjiEntriesFromIds(kanjiIds);
  const vocab = getVocabularyForKanjiIds(kanjiIds);
  return buildInterleavedReviewQueue(kanji, vocab, kinds);
}

export function practicePromptCount(
  kanjiCount: number,
  vocabCount: number,
  kindCount: number = ALL_REVIEW_KINDS.length,
): number {
  return (kanjiCount + vocabCount) * kindCount;
}

export function countPracticePrompts(
  kanjiIds: KanjiId[],
  kinds: ReviewKind[] = ALL_REVIEW_KINDS,
): number {
  const vocab = getVocabularyForKanjiIds(kanjiIds);
  return practicePromptCount(kanjiIds.length, vocab.length, kinds.length);
}
