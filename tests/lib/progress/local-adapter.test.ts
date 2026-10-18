import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createLocalProgressStore,
  recordReview,
  startLesson,
} from "@/lib/progress/local-adapter";
import { PROGRESS_STORAGE_KEY } from "@/lib/progress/types";

describe("local progress store", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => storage.get(k) ?? null,
        setItem: (k: string, v: string) => {
          storage.set(k, v);
        },
      },
    });
  });

  it("round-trips progress", () => {
    const store = createLocalProgressStore();
    startLesson(store, "km-n4-時", new Date("2026-01-01T00:00:00Z"));
    expect(store.list().length).toBe(1);
    const raw = storage.get(PROGRESS_STORAGE_KEY);
    expect(raw).toContain("km-n4-時");
  });

  it("records review updates stage", () => {
    const store = createLocalProgressStore();
    startLesson(store, "km-n4-時", new Date("2026-01-01T00:00:00Z"));
    const after = recordReview(store, "km-n4-時", true, new Date("2026-01-01T01:00:00Z"));
    expect(after.srsStage).toBe(2);
  });
});
