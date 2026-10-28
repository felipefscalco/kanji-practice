import { describe, expect, it } from "vitest";

import { getChapters, resolveKanjiIds } from "@/lib/curriculum";

describe("curriculum", () => {
  it("includes chapter 4 schedule", () => {
    const ch = getChapters().find((c) => c.id === "ch-04");
    expect(ch).toBeDefined();
    expect(ch?.titleJa).toBe("スケジュール");
    expect(ch?.sections.length).toBe(9);
  });

  it("resolves kanji from section ids", () => {
    const ids = resolveKanjiIds(["ch-04-s01"]);
    expect(ids).toContain("km-n4-毎");
    expect(ids.length).toBe(2);
  });

  it("includes chapter 5 transportation", () => {
    const ch = getChapters().find((c) => c.id === "ch-05");
    expect(ch).toBeDefined();
    expect(ch?.titleJa).toBe("交通");
    expect(ch?.sections.length).toBe(12);
    const lesson51 = ch?.sections.filter((s) => s.titleJa === "5-1 えき");
    expect(lesson51?.map((s) => s.titlePt)).toEqual(["駅 · 鉄", "乗 · 降", "開 · 閉", "発 · 着"]);
    const lesson52 = ch?.sections.filter((s) => s.titleJa === "5-2 こうさてん");
    expect(lesson52?.map((s) => s.titlePt)).toEqual(["交 · 通", "台 · 止", "色 · 赤", "黄 · 青"]);
    const lesson53 = ch?.sections.filter((s) => s.titleJa === "5-3 びょういん");
    expect(lesson53?.map((s) => s.titlePt)).toEqual(["病 · 院", "医 · 科", "薬 · 待", "合 · 計"]);
  });
});
