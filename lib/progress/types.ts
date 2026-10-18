export interface UserKanjiProgress {
  kanjiId: string;
  srsStage: number;
  nextReviewAt: string | null;
  lastReviewedAt: string | null;
}

export const PROGRESS_STORAGE_KEY = "oyster-progress-v1";
