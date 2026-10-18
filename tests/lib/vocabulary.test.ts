import { describe, expect, it } from "vitest";

import { getVocabularyForKanjiIds } from "@/lib/vocabulary";

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
