import { describe, expect, it } from "vitest";

import * as wanakana from "wanakana";

import { getAllKanjiIds, getSectionById, learnedThroughSection } from "@/lib/curriculum";
import { furiganaKanji, furiganaReading, isKanji } from "@/lib/furigana";
import { gradeItem } from "@/lib/review-grading";
import { getVocabularyCatalog, getVocabularyFiles, getVocabularyForKanjiIds } from "@/lib/vocabulary";

describe("vocabulary ch04", () => {
  it("includes book compounds when all related kanji are active", () => {
    const ids = ["km-n4-工", "km-n4-場", "km-n4-始", "km-n4-終"] as const;
    const vocab = getVocabularyForKanjiIds([...ids]);
    expect(vocab.some((v) => v.expression === "工場")).toBe(true);
    expect(vocab.some((v) => v.expression === "終電")).toBe(true);
  });

  it("excludes compounds missing a kanji from the selection", () => {
    const vocab = getVocabularyForKanjiIds(["km-n4-映"]);
    expect(vocab.some((v) => v.expression === "映画")).toBe(false);
    expect(vocab.some((v) => v.expression === "映る")).toBe(true);
  });
});

describe("kanji not learned yet", () => {
  const byFull = (full: string) => getVocabularyCatalog().find((v) => v.fullExpression === full);

  it("are written in kana, like the book (ちょう味料, 化しょう品)", () => {
    // 品 is taught in N4 2-1, 粧 never.
    expect(byFull("調味料")?.expression).toBe("ちょう味料");
    expect(byFull("化粧品")?.expression).toBe("化しょう品");
    expect(byFull("意味")?.kanjiIds).toEqual(["km-n4-味"]);
  });

  it("follow the curriculum order inside the N5 book too (月よう日 before 曜)", () => {
    expect(byFull("月曜日")?.expression).toBe("月よう日");
    // 楽 is only taught in N4 6-2.
    expect(byFull("音楽")?.expression).toBe("音がく");
  });

  it("don't need earlier kanji in the selection: 研究会 comes with 研·究 alone", () => {
    const vocab = getVocabularyForKanjiIds(["km-n4-研", "km-n4-究"]);
    expect(vocab.some((v) => v.expression === "研究会")).toBe(true);
    expect(vocab.some((v) => v.expression === "日本語")).toBe(false);
  });

  it("are accepted in writing in their full spelling", () => {
    const item = { type: "vocab" as const, vocab: byFull("調味料")!, kind: "writing" as const };
    expect(gradeItem(item, "調味料")).toBe(true);
    expect(gradeItem(item, "ちょう味料")).toBe(true);
  });
});

describe("vocabulary data", () => {
  const catalog = getVocabularyCatalog();

  it("has unique ids and real sections", () => {
    expect(new Set(catalog.map((v) => v.id)).size).toBe(catalog.length);
    for (const v of catalog) {
      expect(getSectionById(v.sectionId), v.id).toBeDefined();
    }
  });

  it("splits every reading per kanji (furigana matches expression and reading)", () => {
    for (const file of getVocabularyFiles()) {
      for (const v of file.items) {
        if (![...v.expression].some(isKanji)) continue;
        expect(v.furigana, v.id).toBeDefined();
        expect(furiganaKanji(v.furigana!), v.id).toBe(v.expression);
        expect(wanakana.toHiragana(furiganaReading(v.furigana!)), v.id).toBe(wanakana.toHiragana(v.reading));
      }
    }
  });

  it("only shows kanji learned by the word's section", () => {
    for (const v of catalog) {
      const learned = learnedThroughSection(v.sectionId);
      for (const ch of [...v.expression].filter(isKanji)) {
        expect(learned.has(ch), `${v.id} ${v.expression}`).toBe(true);
      }
    }
  });

  it("leaves out words that show none of their section's kanji (自分 → じ分 in 特·思)", () => {
    const everything = getVocabularyForKanjiIds(getAllKanjiIds());
    expect(everything.some((v) => v.fullExpression === "自分")).toBe(false);
    for (const v of everything) {
      const own = getSectionById(v.sectionId)!.kanjiIds;
      expect(v.kanjiIds.some((id) => own.includes(id)), v.id).toBe(true);
    }
  });
});
