import vocabCh01 from "@/data/kanji-master-n4/vocabulary.ch01.json";
import vocabCh02 from "@/data/kanji-master-n4/vocabulary.ch02.json";
import vocabCh03 from "@/data/kanji-master-n4/vocabulary.ch03.json";
import vocabCh04 from "@/data/kanji-master-n4/vocabulary.ch04.json";
import vocabCh05 from "@/data/kanji-master-n4/vocabulary.ch05.json";
import vocabCh06 from "@/data/kanji-master-n4/vocabulary.ch06.json";
import vocabN5Ch01 from "@/data/kanji-master-n5/vocabulary.ch01.json";
import vocabN5Ch02 from "@/data/kanji-master-n5/vocabulary.ch02.json";
import vocabN5Ch03 from "@/data/kanji-master-n5/vocabulary.ch03.json";
import vocabN5Ch04 from "@/data/kanji-master-n5/vocabulary.ch04.json";
import vocabN5Ch05 from "@/data/kanji-master-n5/vocabulary.ch05.json";
import vocabN5Ch06 from "@/data/kanji-master-n5/vocabulary.ch06.json";
import vocabN5Ch07 from "@/data/kanji-master-n5/vocabulary.ch07.json";
import vocabN5Ch08 from "@/data/kanji-master-n5/vocabulary.ch08.json";
import vocabN5Ch09 from "@/data/kanji-master-n5/vocabulary.ch09.json";
import vocabN5Ch10 from "@/data/kanji-master-n5/vocabulary.ch10.json";
import vocabN5Ch11 from "@/data/kanji-master-n5/vocabulary.ch11.json";
import vocabN5Ch12 from "@/data/kanji-master-n5/vocabulary.ch12.json";
import vocabN5Ch13 from "@/data/kanji-master-n5/vocabulary.ch13.json";
import vocabN5Ch14 from "@/data/kanji-master-n5/vocabulary.ch14.json";
import vocabN5Ch15 from "@/data/kanji-master-n5/vocabulary.ch15.json";

import { getKanjiByCharacter, getSectionById, learnedThroughSection } from "@/lib/curriculum";
import { isKanji, renderFurigana } from "@/lib/furigana";
import type { KanjiId, VocabularyData, VocabularyEntry, VocabularyFile } from "@/lib/kanji-types";

/** Curriculum order: N5, then N4. */
const files = [
  vocabN5Ch01,
  vocabN5Ch02,
  vocabN5Ch03,
  vocabN5Ch04,
  vocabN5Ch05,
  vocabN5Ch06,
  vocabN5Ch07,
  vocabN5Ch08,
  vocabN5Ch09,
  vocabN5Ch10,
  vocabN5Ch11,
  vocabN5Ch12,
  vocabN5Ch13,
  vocabN5Ch14,
  vocabN5Ch15,
  vocabCh01,
  vocabCh02,
  vocabCh03,
  vocabCh04,
  vocabCh05,
  vocabCh06,
] as VocabularyFile[];

/** The word as shown at its section: kanji not learned yet become kana. */
export function toVocabularyEntry(data: VocabularyData): VocabularyEntry {
  const { furigana, ...rest } = data;
  const expression = renderFurigana(furigana ?? data.expression, learnedThroughSection(data.sectionId));
  const kanjiIds = [
    ...new Set(
      [...expression]
        .filter(isKanji)
        .map((ch) => getKanjiByCharacter(ch)?.id)
        .filter((id): id is KanjiId => id !== undefined),
    ),
  ];
  return { ...rest, expression, fullExpression: data.expression, kanjiIds };
}

const allItems = files.flatMap((f) => f.items).map(toVocabularyEntry);

/** Raw data files, as stored (full spelling + furigana). */
export function getVocabularyFiles(): VocabularyFile[] {
  return files;
}

export function getVocabularyCatalog(): VocabularyEntry[] {
  return allItems;
}

/** Kanji of the word taught in its own section (研究会 in 研·究 → 研, 究). */
function targetKanjiIds(v: VocabularyEntry): KanjiId[] {
  const own = new Set(getSectionById(v.sectionId)?.kanjiIds ?? []);
  return v.kanjiIds.filter((id) => own.has(id));
}

/**
 * Words whose own-section kanji are all in the study set. Their other kanji
 * were learned in earlier sections, so they don't need to be selected too.
 * A word that shows none of its section's kanji yet (自分 → じ分) is left out.
 */
export function getVocabularyForKanjiIds(kanjiIds: KanjiId[]): VocabularyEntry[] {
  const active = new Set(kanjiIds);
  return allItems.filter((v) => {
    const target = targetKanjiIds(v);
    return target.length > 0 && target.every((id) => active.has(id));
  });
}

export function getVocabularyForKanji(kanjiId: KanjiId): VocabularyEntry[] {
  return allItems.filter((v) => v.kanjiIds.includes(kanjiId));
}
