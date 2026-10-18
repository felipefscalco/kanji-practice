import type { KanjiId } from "@/lib/kanji-types";
import type { UserKanjiProgress } from "@/lib/progress/types";
import { SRS_STAGE_BURNED } from "@/lib/srs/intervals";

export function isDue(progress: UserKanjiProgress, now: Date): boolean {
  if (progress.srsStage >= SRS_STAGE_BURNED) {
    return false;
  }
  if (!progress.nextReviewAt) {
    return progress.srsStage >= 1;
  }
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}

export function getDueKanjiIds(
  kanjiIds: KanjiId[],
  progressList: UserKanjiProgress[],
  now: Date,
): KanjiId[] {
  const byId = new Map(progressList.map((p) => [p.kanjiId, p]));
  return kanjiIds.filter((id) => {
    const p = byId.get(id);
    if (!p || p.srsStage < 1) {
      return false;
    }
    return isDue(p, now);
  });
}

export function getNewKanjiIds(
  kanjiIds: KanjiId[],
  progressList: UserKanjiProgress[],
): KanjiId[] {
  const started = new Set(
    progressList.filter((p) => p.srsStage >= 1).map((p) => p.kanjiId),
  );
  return kanjiIds.filter((id) => !started.has(id));
}
