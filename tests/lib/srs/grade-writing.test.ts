import { describe, expect, it } from "vitest";

import { gradeKanjiWriting } from "@/lib/srs/grade";

describe("gradeKanjiWriting", () => {
  it("accepts exact kanji character", () => {
    expect(gradeKanjiWriting("毎", "毎")).toBe(true);
    expect(gradeKanjiWriting("毎 ", "毎")).toBe(true);
    expect(gradeKanjiWriting("時", "毎")).toBe(false);
  });

  it("accepts kanji extracted from IME buffer", () => {
    expect(gradeKanjiWriting("　毎", "毎")).toBe(true);
    expect(gradeKanjiWriting("k", "毎")).toBe(false);
  });

  it("accepts romaji or hiragana reading when writing the kanji", () => {
    const readings = ["コウ", "ク", "グ"];
    expect(gradeKanjiWriting("kou", "工", readings)).toBe(true);
    expect(gradeKanjiWriting("こう", "工", readings)).toBe(true);
    expect(gradeKanjiWriting("工", "工", readings)).toBe(true);
    expect(gradeKanjiWriting("saku", "工", readings)).toBe(false);
  });
});
