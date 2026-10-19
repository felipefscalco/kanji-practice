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

  it("grades meaning without accents or cedilha", () => {
    expect(gradeMeaning("publico", ["público"])).toBe(true);
    expect(gradeMeaning("praca", ["praça", "parque"])).toBe(true);
    expect(gradeMeaning("PÚBLICO", ["público"])).toBe(true);
    expect(normalizeAnswer("ação")).toBe("acao");
  });

  it("accepts meanings without the parenthetical note", () => {
    expect(gradeMeaning("comecar", ["começar (intransitivo)"])).toBe(true);
    expect(gradeMeaning("começar (transitivo)", ["começar (transitivo)"])).toBe(true);
    expect(gradeMeaning("esposa", ["esposa (de outra pessoa, formal)"])).toBe(true);
    expect(gradeMeaning("intransitivo", ["começar (intransitivo)"])).toBe(false);
  });

  it("grades reading with katakana input", () => {
    expect(gradeReading("ジ", ["じ"])).toBe(true);
    expect(gradeReading("とき", ["とき", "じ"])).toBe(true);
  });

  it("grades reading ending in a romaji n", () => {
    expect(gradeReading("こうえn", ["こうえん"])).toBe(true);
    expect(gradeReading("kouen", ["こうえん"])).toBe(true);
    expect(gradeReading("kouenn", ["こうえん"])).toBe(true);
    expect(gradeReading("こうえん", ["こうえん"])).toBe(true);
  });
});
