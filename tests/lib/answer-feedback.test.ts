import { describe, expect, it } from "vitest";

import { confusionHint, describeTyped, diffChars } from "@/lib/answer-feedback";
import { getKanjiByCharacter } from "@/lib/curriculum";
import type { ReviewItem } from "@/lib/review-session";
import { getVocabularyCatalog } from "@/lib/vocabulary";

const jinkou = getVocabularyCatalog().find((v) => v.expression === "人工")!;
const kouen = getVocabularyCatalog().find((v) => v.expression === "公園")!;

function hintText(parts: ReturnType<typeof confusionHint>): string {
  return (parts ?? []).map((p) => p.text).join("");
}

describe("diffChars", () => {
  it("marks positions that differ", () => {
    const d = diffChars("人口", "人工");
    expect(d.typed.map((c) => c.diff)).toEqual([false, true]);
    expect(d.correct.map((c) => c.diff)).toEqual([false, true]);
  });

  it("marks missing characters on the correct side", () => {
    expect(diffChars("こう", "こうえん").correct.map((c) => c.diff)).toEqual([
      false,
      false,
      true,
      true,
    ]);
  });
});

describe("describeTyped", () => {
  it("finds another word of the book written by mistake", () => {
    const item: ReviewItem = { type: "vocab", vocab: kouen, kind: "writing" };
    expect(describeTyped(item, "公開")?.meaning).toBeTruthy();
  });

  it("returns null when the answer is not in the book", () => {
    const item: ReviewItem = { type: "vocab", vocab: jinkou, kind: "writing" };
    expect(describeTyped(item, "人口")).toBeNull();
  });
});

describe("confusionHint", () => {
  it("names the kanji that differ in a writing answer", () => {
    const item: ReviewItem = { type: "vocab", vocab: jinkou, kind: "writing" };
    const text = hintText(confusionHint(item, "人口", "人工"));
    expect(text.startsWith("Kanji diferente: 工")).toBe(true);
    expect(text).toContain("(4-3)");
    expect(text).toContain("≠ 口");
  });

  it("has no hint when the writing answer has no kanji", () => {
    const item: ReviewItem = { type: "vocab", vocab: jinkou, kind: "writing" };
    expect(confusionHint(item, "じんこ", "人工")).toBeNull();
  });

  it("points to the item whose meaning was typed", () => {
    const kou = getKanjiByCharacter("公")!;
    const item: ReviewItem = { type: "kanji", kanji: kou, kind: "meaning" };
    const meaning = kouen.meaningsPt[0];
    expect(hintText(confusionHint(item, meaning, kou.meaningsPt[0]))).toBe(
      "Esse é o significado de 公園.",
    );
  });
});
