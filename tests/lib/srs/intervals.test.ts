import { describe, expect, it } from "vitest";

import {
  applyReview,
  computeNextReviewAt,
  hoursUntilNextReview,
} from "@/lib/srs/intervals";

describe("intervals", () => {
  it("maps stage 1 to 4 hours", () => {
    expect(hoursUntilNextReview(1)).toBe(4);
  });

  it("burned stage has no next review", () => {
    expect(hoursUntilNextReview(8)).toBeNull();
  });

  it("applyReview moves up on success", () => {
    expect(applyReview(3, true)).toBe(4);
  });

  it("applyReview stays at 1 on failure", () => {
    expect(applyReview(1, false)).toBe(1);
  });

  it("computeNextReviewAt adds hours", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const next = computeNextReviewAt(1, now);
    expect(next?.toISOString()).toBe("2026-01-01T16:00:00.000Z");
  });
});
