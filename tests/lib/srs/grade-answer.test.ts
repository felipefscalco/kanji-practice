import { describe, expect, it } from "vitest";

import { normalizeAnswer } from "@/lib/answer/normalize";
import { gradeMeaning, gradeReading } from "@/lib/srs/grade";

describe("grading", () => {
  it("normalizes whitespace", () => {
    expect(normalizeAnswer("  Hora ")).toBe("hora");
  });

  it("grades meaning", () => {
    expect(gradeMeaning("hora", ["hora", "tempo"])).toBe(true);
    expect(gradeMeaning("errado", ["hora"])).toBe(false);
  });

  it("grades reading with katakana input", () => {
    expect(gradeReading("ジ", ["じ"])).toBe(true);
    expect(gradeReading("とき", ["とき", "じ"])).toBe(true);
  });
});
