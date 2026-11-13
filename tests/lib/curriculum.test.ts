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

  it("includes chapter 6 lesson 6-1 けんきゅう", () => {
    const ch = getChapters().find((c) => c.id === "ch-06");
    expect(ch?.titleJa).toBe("学生");
    const lesson61 = ch?.sections.filter((s) => s.titleJa === "6-1 けんきゅう");
    expect(lesson61?.map((s) => s.titlePt)).toEqual(["研 · 究", "語 · 文", "英 · 化", "数 · 心"]);
    expect(resolveKanjiIds(["ch-06-s04"])).toEqual(["km-n4-数", "km-n4-心"]);
  });

  it("includes chapter 6 lessons 6-2 コミュニケーション and 6-3 ラーメンや", () => {
    const ch = getChapters().find((c) => c.id === "ch-06");
    const lesson62 = ch?.sections.filter((s) => s.titleJa === "6-2 コミュニケーション");
    expect(lesson62?.map((s) => s.titlePt)).toEqual(["若 · 集", "知 · 酒", "歌 · 声", "楽"]);
    const lesson63 = ch?.sections.filter((s) => s.titleJa === "6-3 ラーメンや");
    expect(lesson63?.map((s) => s.titlePt)).toEqual(["味 · 油", "太 · 細", "皿 · 飯", "麦"]);
    expect(resolveKanjiIds(["ch-06-s12"])).toEqual(["km-n4-麦"]);
  });

  it("includes chapter 7 lessons 7-1 きせつ, 7-2 てんき and 7-3 りょこう", () => {
    const ch = getChapters().find((c) => c.id === "ch-07");
    expect(ch?.titleJa).toBe("春夏秋冬");
    const lesson71 = ch?.sections.filter((s) => s.titleJa === "7-1 きせつ");
    expect(lesson71?.map((s) => s.titlePt)).toEqual(["春 · 夏", "秋 · 冬", "空 · 星", "雲 · 去"]);
    const lesson72 = ch?.sections.filter((s) => s.titleJa === "7-2 てんき");
    expect(lesson72?.map((s) => s.titlePt)).toEqual(["天 · 晴", "雪 · 風", "強 · 弱", "暑 · 寒"]);
    const lesson73 = ch?.sections.filter((s) => s.titleJa === "7-3 りょこう");
    expect(lesson73?.map((s) => s.titlePt)).toEqual(["旅 · 持", "世 · 界", "写 · 真", "船"]);
    expect(resolveKanjiIds(["ch-07-s08"])).toEqual(["km-n4-暑", "km-n4-寒"]);
  });
});
