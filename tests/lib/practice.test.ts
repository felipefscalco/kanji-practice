import { describe, expect, it } from "vitest";

import { resolveKanjiIds } from "@/lib/curriculum";
import { buildPracticeQueue, countPracticePrompts } from "@/lib/practice";

describe("practice queue", () => {
  const ids = resolveKanjiIds(["ch-04-s09"]);

  it("asks every kind by default", () => {
    const queue = buildPracticeQueue(ids);
    expect(new Set(queue.map((i) => i.kind))).toEqual(
      new Set(["meaning", "reading", "writing"]),
    );
    expect(queue).toHaveLength(countPracticePrompts(ids));
  });

  it("only asks the selected kinds", () => {
    const queue = buildPracticeQueue(ids, ["reading"]);
    expect(queue.length).toBeGreaterThan(0);
    expect(queue.every((i) => i.kind === "reading")).toBe(true);
    expect(queue).toHaveLength(countPracticePrompts(ids, ["reading"]));
    expect(countPracticePrompts(ids, ["reading"]) * 3).toBe(countPracticePrompts(ids));
  });
});
