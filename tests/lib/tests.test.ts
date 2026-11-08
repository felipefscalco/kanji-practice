import { describe, expect, it } from "vitest";
import * as wanakana from "wanakana";

import { getChapters, learnedThroughChapter } from "@/lib/curriculum";
import { furiganaKanji, isKanji } from "@/lib/furigana";
import {
  buildTest,
  getChapterTest,
  getRawChapterTests,
  getTestChapterIds,
  gradeTest,
  isReadingCorrect,
  parseSentence,
  QUESTIONS_PER_SECTION,
} from "@/lib/tests";

describe("parseSentence", () => {
  it("splits around the bracketed target", () => {
    expect(parseSentence("休みの日は よく [映画]を 見に 行きます。")).toEqual({
      before: "休みの日は よく ",
      target: "映画",
      after: "を 見に 行きます。",
    });
  });
});

describe("isReadingCorrect", () => {
  it("accepts kana, katakana and leftover romaji", () => {
    expect(isReadingCorrect("えいが", "えいが")).toBe(true);
    expect(isReadingCorrect(" エイガ ", "えいが")).toBe(true);
    expect(isReadingCorrect("びょういn", "びょういん")).toBe(true);
  });

  it("rejects blanks and wrong readings", () => {
    expect(isReadingCorrect("", "えいが")).toBe(false);
    expect(isReadingCorrect("えが", "えいが")).toBe(false);
  });
});

describe("buildTest", () => {
  it("draws ten questions per section with the answer among four options", () => {
    const paper = buildTest("ch-04");
    expect(paper?.reading).toHaveLength(QUESTIONS_PER_SECTION);
    expect(paper?.writing).toHaveLength(QUESTIONS_PER_SECTION);
    for (const prompt of paper?.writing ?? []) {
      expect(prompt.options).toHaveLength(4);
      expect(prompt.options).toContain(prompt.question.answer);
    }
  });

  it("returns undefined for a chapter without a test", () => {
    expect(buildTest("ch-99")).toBeUndefined();
  });
});

describe("gradeTest", () => {
  it("gives five points per correct answer", () => {
    const paper = buildTest("ch-05", () => 0)!;
    const result = gradeTest(paper, {
      reading: paper.reading.map((q, i) => (i === 0 ? "x" : q.answer)),
      writing: paper.writing.map((p, i) => (i === 0 ? null : p.question.answer)),
    });
    expect(result.score).toBe(90);
    expect(result.maxScore).toBe(100);
    expect(result.reading[0]).toBe(false);
    expect(result.writing[0]).toBe(false);
  });
});

describe("test data", () => {
  const chapterIds = new Set(getChapters().map((c) => c.id));

  for (const chapterId of getTestChapterIds()) {
    const file = getChapterTest(chapterId)!;

    it(`${chapterId} belongs to the curriculum and has enough questions`, () => {
      expect(chapterIds.has(chapterId)).toBe(true);
      expect(file.reading.length).toBeGreaterThanOrEqual(QUESTIONS_PER_SECTION);
      expect(file.writing.length).toBeGreaterThanOrEqual(QUESTIONS_PER_SECTION);
    });

    it(`${chapterId} questions are well formed`, () => {
      const ids = [...file.reading, ...file.writing].map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const q of file.reading) {
        expect(parseSentence(q.sentence).target, q.id).not.toBe("");
        expect(wanakana.isHiragana(q.answer), q.id).toBe(true);
      }
      for (const q of file.writing) {
        expect(parseSentence(q.sentence).target, q.id).not.toBe("");
        expect(q.distractors, q.id).toHaveLength(3);
        expect(new Set([q.answer, ...q.distractors]).size, q.id).toBe(4);
      }
    });

    it(`${chapterId} shows only kanji learned by the end of the chapter`, () => {
      const learned = learnedThroughChapter(chapterId);
      // Wrong options may use lookalike kanji on purpose (酒/洒), so they are not checked.
      for (const q of [...file.reading, ...file.writing]) {
        const shown = q.sentence + ("distractors" in q ? q.answer : "");
        for (const ch of [...shown].filter(isKanji)) {
          expect(learned.has(ch), `${q.id} ${q.sentence}: ${ch}`).toBe(true);
        }
      }
    });
  }

  it("writes kanji not learned yet in kana, like the book (化しょう品)", () => {
    const w07 = getChapterTest("ch-06")!.writing.find((q) => q.id === "t-ch06-w07")!;
    expect(w07.answer).toBe("化しょう品");
    // 店 is taught in N4 2-1, so it shows as kanji in the chapter 4 test.
    const r05 = getChapterTest("ch-04")!.reading.find((q) => q.id === "t-ch04-r05")!;
    expect(r05.sentence).toBe("この 店は [終日] きんえんです。");
  });

  it("keeps wrong options wrong once every kanji is learned (no kana-only variants)", () => {
    for (const file of getRawChapterTests()) {
      for (const q of file.writing) {
        const options = [q.answer, ...q.distractors].map(furiganaKanji);
        expect(new Set(options).size, q.id).toBe(4);
      }
    }
  });
});
