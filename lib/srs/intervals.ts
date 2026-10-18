export const SRS_STAGE_MAX = 8;
export const SRS_STAGE_BURNED = 8;

const HOURS_BY_STAGE: Record<number, number | null> = {
  1: 4,
  2: 8,
  3: 24,
  4: 48,
  5: 168,
  6: 336,
  7: 720,
  8: null,
};

export function hoursUntilNextReview(stage: number): number | null {
  if (process.env.NEXT_PUBLIC_SRS_DEBUG === "true" && stage >= 1 && stage <= 4) {
    return 0;
  }
  return HOURS_BY_STAGE[stage] ?? null;
}

export function applyReview(stage: number, correct: boolean): number {
  if (correct) {
    return Math.min(SRS_STAGE_MAX, stage + 1);
  }
  return Math.max(1, stage - 1);
}

export function computeNextReviewAt(stage: number, now: Date): Date | null {
  const hours = hoursUntilNextReview(stage);
  if (hours === null) {
    return null;
  }
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}
