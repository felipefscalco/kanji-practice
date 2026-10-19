import type { KanjiEntry, VocabularyEntry } from "@/lib/kanji-types";

export type ReviewKind = "meaning" | "reading" | "writing";

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

const ALL_KINDS: ReviewKind[] = ["meaning", "reading", "writing"];

/** WaniKani-style: one prompt per kind (meaning, reading, writing) for each kanji and vocab item. */
export function buildInterleavedReviewQueue(
  kanjiList: KanjiEntry[],
  vocabList: VocabularyEntry[] = [],
  kinds: ReviewKind[] = ALL_KINDS,
): ReviewItem[] {
  const items: ReviewItem[] = [];
  for (const kanji of kanjiList) {
    for (const kind of kinds) {
      items.push({ type: "kanji", kanji, kind });
    }
  }
  for (const vocab of vocabList) {
    for (const kind of kinds) {
      items.push({ type: "vocab", vocab, kind });
    }
  }
  return shuffle(items);
}
