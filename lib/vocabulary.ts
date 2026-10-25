import vocabCh04 from "@/data/kanji-master-n4/vocabulary.ch04.json";
import vocabCh05 from "@/data/kanji-master-n4/vocabulary.ch05.json";

import type { KanjiId, VocabularyEntry, VocabularyFile } from "@/lib/kanji-types";

const files: VocabularyFile[] = [vocabCh04 as VocabularyFile, vocabCh05 as VocabularyFile];

const allItems = files.flatMap((f) => f.items);

export function getVocabularyCatalog(): VocabularyEntry[] {
  return allItems;
}

/** Vocab whose kanji are all in the active study set. */
export function getVocabularyForKanjiIds(kanjiIds: KanjiId[]): VocabularyEntry[] {
  const active = new Set(kanjiIds);
  return allItems.filter((v) => v.kanjiIds.every((id) => active.has(id)));
}

export function getVocabularyForKanji(kanjiId: KanjiId): VocabularyEntry[] {
  return allItems.filter((v) => v.kanjiIds.includes(kanjiId));
}
