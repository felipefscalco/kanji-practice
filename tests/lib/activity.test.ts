import { describe, expect, it } from "vitest";

import { currentStreak, lastSevenDays, toDayKey } from "@/lib/activity";

const today = new Date(2026, 9, 19, 21, 0);

describe("currentStreak", () => {
  it("counts consecutive days ending today", () => {
    expect(currentStreak(["2026-10-17", "2026-10-18", "2026-10-19"], today)).toBe(3);
  });

  it("keeps a streak that ended yesterday", () => {
    expect(currentStreak(["2026-10-17", "2026-10-18"], today)).toBe(2);
  });

  it("breaks on a missed day", () => {
    expect(currentStreak(["2026-10-15", "2026-10-17"], today)).toBe(0);
    expect(currentStreak([], today)).toBe(0);
  });
});

describe("lastSevenDays", () => {
  it("ends today and flags the studied days", () => {
    const week = lastSevenDays(["2026-10-13", "2026-10-19"], today);
    expect(week).toHaveLength(7);
    expect(toDayKey(week[0].date)).toBe("2026-10-13");
    expect(week.map((d) => d.studied)).toEqual([true, false, false, false, false, false, true]);
  });
});
