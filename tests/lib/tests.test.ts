import { describe, expect, it } from "vitest";
import * as wanakana from "wanakana";

import { getChapters } from "@/lib/curriculum";
import {
  buildTest,
  getChapterTest,
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
  }
});
