"use client";

import { useMemo, useSyncExternalStore } from "react";

import { ACTIVITY_EVENT, ACTIVITY_STORAGE_KEY, getStudyDays } from "@/lib/activity";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(ACTIVITY_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(ACTIVITY_EVENT, onChange);
  };
}

function snapshot(): string {
  try {
    return window.localStorage.getItem(ACTIVITY_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Study days from the activity log; `null` before hydration. */
export function useStudyDays(): string[] | null {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  // `raw` only signals a change; getStudyDays() validates the stored value.
  return useMemo(() => (raw === null ? null : getStudyDays()), [raw]);
}
