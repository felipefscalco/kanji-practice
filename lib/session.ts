import type { ReviewItem, ReviewKind } from "@/lib/review-session";

/** Items per practice session (batch). Failed items repeat at the end of the same batch. */
export const SESSION_SIZE = 20;

/** Rough pace used before the first answer, in ms per item. */
const DEFAULT_MS_PER_ITEM = 18_000;

export type Outcome = "ok" | "err";

export interface SessionEntry {
  item: ReviewItem;
  /** True when this entry is a retry of an item failed earlier in the batch. */
  repeat: boolean;
}

export interface AnswerRecord {
  item: ReviewItem;
  typed: string;
  outcome: Outcome;
  repeat: boolean;
}

export interface SessionState {
  entries: SessionEntry[];
  /** Index of the entry on screen. */
  cursor: number;
  /** Outcome per answered entry index. */
  results: Outcome[];
  /** Outcome of the entry on screen once answered, until the learner continues. */
  pending: Outcome | null;
  answers: AnswerRecord[];
  startedAt: number;
  lastAnsweredAt: number;
}

export function subjectKey(item: ReviewItem): string {
  return item.type === "kanji" ? `kanji:${item.kanji.id}` : `vocab:${item.vocab.id}`;
}

export function itemKey(item: ReviewItem): string {
  return `${subjectKey(item)}:${item.kind}`;
}

/** Next batch of the practice cycle. */
export function takeBatch(
  cycle: ReviewItem[],
  offset: number,
  size: number = SESSION_SIZE,
): { items: ReviewItem[]; nextOffset: number } {
  const items = cycle.slice(offset, offset + size);
  return { items, nextOffset: offset + items.length };
}

export function createSession(items: ReviewItem[], now: number): SessionState {
  return {
    entries: items.map((item) => ({ item, repeat: false })),
    cursor: 0,
    results: [],
    pending: null,
    answers: [],
    startedAt: now,
    lastAnsweredAt: now,
  };
}

export function currentEntry(state: SessionState): SessionEntry | undefined {
  return state.entries[state.cursor];
}

export function isFinished(state: SessionState): boolean {
  return state.cursor >= state.entries.length;
}

export function answer(
  state: SessionState,
  outcome: Outcome,
  typed: string,
  now: number,
): SessionState {
  const entry = currentEntry(state);
  if (!entry || state.pending !== null) {
    return state;
  }
  const results = [...state.results];
  results[state.cursor] = outcome;
  return {
    ...state,
    results,
    pending: outcome,
    answers: [...state.answers, { item: entry.item, typed, outcome, repeat: entry.repeat }],
    lastAnsweredAt: now,
  };
}

/** "Foi erro de digitação": turns the pending error into a correct answer. */
export function undoError(state: SessionState): SessionState {
  if (state.pending !== "err") {
    return state;
  }
  const results = [...state.results];
  results[state.cursor] = "ok";
  const answers = [...state.answers];
  const last = answers.at(-1);
  if (last) {
    answers[answers.length - 1] = { ...last, outcome: "ok" };
  }
  return { ...state, results, answers, pending: "ok" };
}

/** Moves on; a failed entry goes back to the end of the batch. */
export function advance(state: SessionState): SessionState {
  const entry = currentEntry(state);
  if (!entry || state.pending === null) {
    return state;
  }
  const entries =
    state.pending === "err" ? [...state.entries, { item: entry.item, repeat: true }] : state.entries;
  return { ...state, entries, cursor: state.cursor + 1, pending: null };
}

export function counts(state: SessionState): { ok: number; err: number } {
  let ok = 0;
  let err = 0;
  for (const r of state.results) {
    if (r === "ok") ok++;
    else if (r === "err") err++;
  }
  return { ok, err };
}

/** Other question types of the same item already answered correctly in this batch. */
export function answeredKinds(state: SessionState, item: ReviewItem): ReviewKind[] {
  const key = subjectKey(item);
  const kinds: ReviewKind[] = [];
  for (let i = 0; i < state.cursor; i++) {
    const other = state.entries[i].item;
    if (
      state.results[i] === "ok" &&
      other.kind !== item.kind &&
      subjectKey(other) === key &&
      !kinds.includes(other.kind)
    ) {
      kinds.push(other.kind);
    }
  }
  return kinds;
}

/** Minutes left at the pace of the answers so far (rounded up, at least 1). */
export function minutesRemaining(state: SessionState): number {
  const left = state.entries.length - state.cursor;
  if (left <= 0) {
    return 0;
  }
  const answered = state.answers.length;
  const perItem =
    answered > 0 ? (state.lastAnsweredAt - state.startedAt) / answered : DEFAULT_MS_PER_ITEM;
  return Math.max(1, Math.ceil((left * perItem) / 60_000));
}

export interface MissedItem {
  item: ReviewItem;
  /** First wrong answer given in the session ("" when skipped). */
  typed: string;
}

export interface SessionSummary {
  /** Distinct questions in the batch. */
  total: number;
  /** Questions answered right on the first try. */
  firstTry: ReviewItem[];
  missed: MissedItem[];
  /** Percent right on the first try, 0–100. */
  accuracy: number;
  durationMs: number;
}

/** Summary of a finished batch, by first attempt per question. */
export function summarize(state: SessionState): SessionSummary {
  const seen = new Set<string>();
  const firstTry: ReviewItem[] = [];
  const missed: MissedItem[] = [];
  for (const a of state.answers) {
    const key = itemKey(a.item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    if (a.outcome === "ok") {
      firstTry.push(a.item);
    } else {
      missed.push({ item: a.item, typed: a.typed });
    }
  }
  const total = seen.size;
  return {
    total,
    firstTry,
    missed,
    accuracy: total > 0 ? Math.round((firstTry.length / total) * 100) : 0,
    durationMs: Math.max(0, state.lastAnsweredAt - state.startedAt),
  };
}
