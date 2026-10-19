/** Days the learner finished a practice session, as local YYYY-MM-DD dates. */
export const ACTIVITY_STORAGE_KEY = "oyster-activity-v1";

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Consecutive study days up to today. A streak that ended yesterday still
 * counts (today is not over yet).
 */
export function currentStreak(days: string[], today: Date): number {
  const set = new Set(days);
  let cursor = set.has(toDayKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (set.has(toDayKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Whether each of the last 7 days (oldest first, today last) had a session. */
export function lastSevenDays(days: string[], today: Date): Array<{ date: Date; studied: boolean }> {
  const set = new Set(days);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i - 6);
    return { date, studied: set.has(toDayKey(date)) };
  });
}

export function getStudyDays(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((d): d is string => typeof d === "string") : [];
  } catch {
    return [];
  }
}

/** Marks `now` as a study day. Keeps the last year only. */
export function recordStudyDay(now: Date = new Date()): string[] {
  const key = toDayKey(now);
  const days = getStudyDays();
  if (days.includes(key)) {
    return days;
  }
  const next = [...days, key].sort().slice(-366);
  try {
    window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: the streak just won't advance.
  }
  return next;
}
