import { applyReview, computeNextReviewAt } from "@/lib/srs/intervals";
import {
  PROGRESS_STORAGE_KEY,
  type UserKanjiProgress,
} from "@/lib/progress/types";

export interface ProgressStore {
  get(kanjiId: string): UserKanjiProgress | null;
  upsert(progress: UserKanjiProgress): void;
  list(): UserKanjiProgress[];
}

function loadRaw(): UserKanjiProgress[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as UserKanjiProgress[];
  } catch {
    return [];
  }
}

function saveRaw(list: UserKanjiProgress[]): void {
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(list));
}

export function createLocalProgressStore(): ProgressStore {
  let cache: UserKanjiProgress[] | null = null;

  function ensure(): UserKanjiProgress[] {
    if (!cache) {
      cache = loadRaw();
    }
    return cache;
  }

  function flush(): void {
    if (cache) {
      saveRaw(cache);
    }
  }

  return {
    get(kanjiId: string) {
      return ensure().find((p) => p.kanjiId === kanjiId) ?? null;
    },
    upsert(progress: UserKanjiProgress) {
      const list = ensure();
      const idx = list.findIndex((p) => p.kanjiId === progress.kanjiId);
      if (idx >= 0) {
        list[idx] = progress;
      } else {
        list.push(progress);
      }
      flush();
    },
    list() {
      return [...ensure()];
    },
  };
}

export function startLesson(
  store: ProgressStore,
  kanjiId: string,
  now = new Date(),
): UserKanjiProgress {
  const stage = 1;
  const progress: UserKanjiProgress = {
    kanjiId,
    srsStage: stage,
    nextReviewAt: computeNextReviewAt(stage, now)?.toISOString() ?? null,
    lastReviewedAt: now.toISOString(),
  };
  store.upsert(progress);
  return progress;
}

export function recordReview(
  store: ProgressStore,
  kanjiId: string,
  correct: boolean,
  now = new Date(),
): UserKanjiProgress {
  const current = store.get(kanjiId);
  const stage = current?.srsStage ?? 1;
  const nextStage = applyReview(stage, correct);
  const progress: UserKanjiProgress = {
    kanjiId,
    srsStage: nextStage,
    nextReviewAt: computeNextReviewAt(nextStage, now)?.toISOString() ?? null,
    lastReviewedAt: now.toISOString(),
  };
  store.upsert(progress);
  return progress;
}
