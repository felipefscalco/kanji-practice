import { describe, expect, it } from "vitest";

import type { KanjiEntry } from "@/lib/kanji-types";
import type { ReviewItem, ReviewKind } from "@/lib/review-session";
import {
  advance,
  answer,
  answeredKinds,
  counts,
  createSession,
  currentEntry,
  isFinished,
  minutesRemaining,
  summarize,
  takeBatch,
  undoError,
} from "@/lib/session";

function kanji(char: string): KanjiEntry {
  return {
    id: `km-n4-${char}`,
    character: char,
    meaningsPt: ["x"],
    meaningsEn: [],
    onReadings: [],
    kunReadings: [],
  };
}

function item(char: string, kind: ReviewKind = "meaning"): ReviewItem {
  return { type: "kanji", kanji: kanji(char), kind };
}

describe("takeBatch", () => {
  it("slices the cycle in batches", () => {
    const cycle = Array.from({ length: 45 }, (_, i) => item(String(i)));
    const first = takeBatch(cycle, 0);
    expect(first.items).toHaveLength(20);
    const last = takeBatch(cycle, 40);
    expect(last.items).toHaveLength(5);
    expect(last.nextOffset).toBe(45);
  });
});

describe("session", () => {
  it("repeats a failed item at the end of the batch", () => {
    let s = createSession([item("a"), item("b")], 0);
    s = advance(answer(s, "err", "?", 1000));
    expect(s.entries).toHaveLength(3);
    expect(s.entries[2]).toMatchObject({ repeat: true });
    expect(currentEntry(s)?.item.type === "kanji" && currentEntry(s)?.item).toBeTruthy();
    s = advance(answer(s, "ok", "x", 2000));
    s = advance(answer(s, "ok", "x", 3000));
    expect(isFinished(s)).toBe(true);
    expect(counts(s)).toEqual({ ok: 2, err: 1 });
  });

  it("ignores a second answer before continuing", () => {
    const s = answer(createSession([item("a")], 0), "ok", "x", 1);
    expect(answer(s, "err", "y", 2)).toBe(s);
  });

  it("undoes an error as a typo and does not repeat the item", () => {
    let s = answer(createSession([item("a")], 0), "err", "y", 1);
    s = undoError(s);
    expect(s.results).toEqual(["ok"]);
    expect(s.answers[0].outcome).toBe("ok");
    s = advance(s);
    expect(s.entries).toHaveLength(1);
    expect(isFinished(s)).toBe(true);
  });

  it("lists other question types already answered for the same item", () => {
    let s = createSession([item("a", "meaning"), item("b"), item("a", "reading")], 0);
    s = advance(answer(s, "ok", "x", 1));
    s = advance(answer(s, "ok", "x", 2));
    expect(answeredKinds(s, item("a", "reading"))).toEqual(["meaning"]);
  });

  it("estimates minutes left from the pace so far", () => {
    let s = createSession(Array.from({ length: 4 }, (_, i) => item(String(i))), 0);
    expect(minutesRemaining(s)).toBe(2); // 4 × 18 s
    s = advance(answer(s, "ok", "x", 60_000));
    expect(minutesRemaining(s)).toBe(3);
  });
});

describe("summarize", () => {
  it("counts each question once, by its first attempt", () => {
    let s = createSession([item("a"), item("b"), item("c")], 0);
    s = advance(answer(s, "ok", "x", 1000));
    s = advance(answer(s, "err", "wrong", 2000));
    s = advance(answer(s, "ok", "x", 3000));
    s = advance(answer(s, "ok", "x", 4000)); // retry of "b"
    const summary = summarize(s);
    expect(summary.total).toBe(3);
    expect(summary.firstTry).toHaveLength(2);
    expect(summary.missed).toEqual([{ item: item("b"), typed: "wrong" }]);
    expect(summary.accuracy).toBe(67);
    expect(summary.durationMs).toBe(4000);
  });
});
