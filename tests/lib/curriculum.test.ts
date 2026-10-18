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
});
