import { describe, expect, it } from "vitest";

import { getChapters, getSectionById } from "@/lib/curriculum";
import {
  bookLessons,
  groupCheckState,
  sectionWords,
  toggleGroup,
  toggleSection,
} from "@/lib/curriculum-groups";

const chapter = getChapters()[0];

describe("bookLessons", () => {
  it("groups subsections by book lesson", () => {
    const lessons = bookLessons(chapter);
    expect(lessons.map((l) => [l.label, l.sections.length])).toEqual([
      ["4-1 デート", 3],
      ["4-2 けっこんきねんび", 3],
      ["4-3 しごと", 3],
    ]);
    expect(lessons[0].titlePt).toBe("Encontro");
  });
});

describe("sectionWords", () => {
  it("uses the single book word that covers all kanji, with its reading", () => {
    expect(sectionWords(getSectionById("ch-04-s01")!)).toEqual({ label: "毎週", reading: "まいしゅう" });
    expect(sectionWords(getSectionById("ch-04-s02")!)).toEqual({ label: "映画館", reading: "えいがかん" });
  });

  it("joins several words when one is not enough", () => {
    expect(sectionWords(getSectionById("ch-04-s08")!)).toEqual({ label: "働く・作る" });
    expect(sectionWords(getSectionById("ch-04-s09")!).label).toBe("工場・始まる・終わる");
  });
});

describe("group selection", () => {
  const ids = ["a", "b", "c"];

  it("reports the tri-state", () => {
    expect(groupCheckState(ids, [])).toBe("off");
    expect(groupCheckState(ids, ["b"])).toBe("mixed");
    expect(groupCheckState(ids, ["a", "b", "c", "x"])).toBe("on");
  });

  it("turns a partial group fully on, and a full group off", () => {
    expect(toggleGroup(ids, ["x", "b"])).toEqual(["x", "b", "a", "c"]);
    expect(toggleGroup(ids, ["a", "x", "b", "c"])).toEqual(["x"]);
  });

  it("toggles one subsection", () => {
    expect(toggleSection("a", ["a", "b"])).toEqual(["b"]);
    expect(toggleSection("c", ["a"])).toEqual(["a", "c"]);
  });
});
