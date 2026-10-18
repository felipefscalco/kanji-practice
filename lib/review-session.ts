import type { KanjiEntry, VocabularyEntry } from "@/lib/kanji-types";
import type { ReviewKind } from "@/components/review-prompt";

export type ReviewItem =
  | { type: "kanji"; kanji: KanjiEntry; kind: ReviewKind }
  | { type: "vocab"; vocab: VocabularyEntry; kind: ReviewKind };

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** WaniKani-style: meaning, reading, and writing for each kanji and vocab item. */
export function buildInterleavedReviewQueue(
  kanjiList: KanjiEntry[],
  vocabList: VocabularyEntry[] = [],
): ReviewItem[] {
  const items: ReviewItem[] = [];
  for (const kanji of kanjiList) {
    items.push({ type: "kanji", kanji, kind: "meaning" });
    items.push({ type: "kanji", kanji, kind: "reading" });
    items.push({ type: "kanji", kanji, kind: "writing" });
  }
  for (const vocab of vocabList) {
    items.push({ type: "vocab", vocab, kind: "meaning" });
    items.push({ type: "vocab", vocab, kind: "reading" });
    items.push({ type: "vocab", vocab, kind: "writing" });
  }
  return shuffle(items);
}
