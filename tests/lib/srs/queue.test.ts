import { describe, expect, it } from "vitest";

import type { UserKanjiProgress } from "@/lib/progress/types";
import { getDueKanjiIds, isDue } from "@/lib/srs/queue";

describe("queue", () => {
  it("is not due before next_review_at", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const progress: UserKanjiProgress = {
      kanjiId: "km-n4-時",
      srsStage: 2,
      nextReviewAt: "2026-01-01T18:00:00.000Z",
      lastReviewedAt: "2026-01-01T12:00:00.000Z",
    };
    expect(isDue(progress, now)).toBe(false);
  });

  it("lists due kanji ids", () => {
    const now = new Date("2026-01-02T00:00:00Z");
    const list: UserKanjiProgress[] = [
      {
        kanjiId: "km-n4-時",
        srsStage: 1,
        nextReviewAt: "2026-01-01T10:00:00.000Z",
        lastReviewedAt: null,
      },
      {
        kanjiId: "km-n4-分",
        srsStage: 8,
        nextReviewAt: null,
        lastReviewedAt: "2026-01-01T10:00:00.000Z",
      },
    ];
    expect(getDueKanjiIds(["km-n4-時", "km-n4-分"], list, now)).toEqual([
      "km-n4-時",
    ]);
  });
});
