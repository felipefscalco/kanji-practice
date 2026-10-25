import { describe, expect, it } from "vitest";

import { getChapters } from "@/lib/curriculum";
import { chapterProgress, currentLesson, greeting } from "@/lib/dashboard";

const chapter = getChapters().find((c) => c.id === "ch-04")!;

describe("chapterProgress", () => {
  it("groups subsections by book lesson", () => {
    const progress = chapterProgress(chapter, ["ch-04-s01", "ch-04-s02", "ch-04-s07"]);
    expect(progress.map((g) => g.label)).toEqual(["4-1 デート", "4-2 けっこんきねんび", "4-3 しごと"]);
    expect(progress[0]).toMatchObject({ selected: 5, total: 7 });
    expect(progress[1]).toMatchObject({ selected: 0, total: 7 });
    expect(progress[2]).toMatchObject({ selected: 2, total: 8 });
  });

  it("finds the last lesson with a selection", () => {
    expect(currentLesson(chapterProgress(chapter, ["ch-04-s01", "ch-04-s04"]))).toBe("4-2 けっこんきねんび");
    expect(currentLesson(chapterProgress(chapter, []))).toBeUndefined();
  });
});

describe("greeting", () => {
  it("follows the time of day", () => {
    expect(greeting(8)).toBe("Bom dia");
    expect(greeting(14)).toBe("Boa tarde");
    expect(greeting(21)).toBe("Boa noite");
    expect(greeting(2)).toBe("Boa noite");
  });
});
