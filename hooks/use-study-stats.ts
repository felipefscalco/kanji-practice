"use client";

import { useEffect, useState } from "react";

import { countPracticePrompts } from "@/lib/practice";
import { getActiveKanjiIds, getActiveReviewKinds } from "@/lib/study-selection";

export function useStudyStats() {
  const [kanjiCount, setKanjiCount] = useState(0);
  const [promptCount, setPromptCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const ids = getActiveKanjiIds();
      setKanjiCount(ids.length);
      setPromptCount(countPracticePrompts(ids, getActiveReviewKinds()));
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("oyster-selection", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("oyster-selection", refresh);
    };
  }, []);

  return { kanjiCount, promptCount };
}
