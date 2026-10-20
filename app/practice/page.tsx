"use client";

import { useState } from "react";

import { PracticeSession } from "@/components/practice/practice-session";
import { SessionSummaryView } from "@/components/practice/session-summary";
import { EmptySelection } from "@/components/empty-selection";
import { PracticeSkeleton } from "@/components/skeletons";
import { useIsClient, useVisitKey } from "@/hooks/use-client-env";
import { buildPracticeQueue, type ReviewItem } from "@/lib/practice";
import { currentStreak, recordStudyDay } from "@/lib/activity";
import { getChapters, getKanjiById } from "@/lib/curriculum";
import type { KanjiId } from "@/lib/kanji-types";
import {
  SESSION_SIZE,
  summarize,
  takeBatch,
  type SessionState,
  type SessionSummary,
} from "@/lib/session";
import { getActiveKanjiIds, getActiveReviewKinds } from "@/lib/study-selection";

/** Kanji of a post-lesson quiz (`/practice?quiz=id,id`), limited to the curriculum. */
function quizKanjiIds(): KanjiId[] | null {
  const raw = new URLSearchParams(window.location.search).get("quiz");
  if (!raw) {
    return null;
  }
  const ids = raw.split(",").filter((id): id is KanjiId => getKanjiById(id) !== undefined);
  return ids.length > 0 ? ids : null;
}

function buildCycle(): ReviewItem[] {
  return buildPracticeQueue(quizKanjiIds() ?? getActiveKanjiIds(), getActiveReviewKinds());
}

export default function PracticePage() {
  // The cycle comes from sessionStorage, so it only exists in the browser.
  const isClient = useIsClient();
  // Each visit builds a new cycle from the current selection.
  const visit = useVisitKey();
  if (!isClient) {
    return <PracticeSkeleton />;
  }
  return <PracticeRunner key={visit} />;
}

type Batch = {
  items: ReviewItem[];
  /** Where the next regular batch starts in the cycle. */
  nextOffset: number;
  id: number;
};

type Finished = { summary: SessionSummary; streak: number };

function PracticeRunner() {
  const [cycle, setCycle] = useState(buildCycle);
  const [batch, setBatch] = useState<Batch>(() => ({ ...takeBatch(cycle, 0), id: 0 }));
  const [finished, setFinished] = useState<Finished | null>(null);
  const chapter = getChapters()[0];

  const cycleDone = batch.nextOffset >= cycle.length;
  const nextCount = cycleDone ? Math.min(SESSION_SIZE, cycle.length) : takeBatch(cycle, batch.nextOffset).items.length;

  function finish(state: SessionState) {
    const days = recordStudyDay();
    setFinished({ summary: summarize(state), streak: currentStreak(days, new Date()) });
  }

  function nextSession() {
    let source = cycle;
    let offset = batch.nextOffset;
    if (offset >= source.length) {
      // Cycle done: start a new shuffled one.
      source = buildCycle();
      offset = 0;
      setCycle(source);
    }
    setBatch({ ...takeBatch(source, offset), id: batch.id + 1 });
    setFinished(null);
  }

  function reviewMissed() {
    if (!finished) {
      return;
    }
    // A short extra batch with the misses; the cycle position stays put.
    setBatch({ items: finished.summary.missed.map((m) => m.item), nextOffset: batch.nextOffset, id: batch.id + 1 });
    setFinished(null);
  }

  if (cycle.length === 0) {
    return (
      <EmptySelection
        onSelected={() => {
          const next = buildCycle();
          setCycle(next);
          setBatch({ ...takeBatch(next, 0), id: batch.id + 1 });
        }}
      />
    );
  }

  if (finished) {
    return (
      <SessionSummaryView
        summary={finished.summary}
        streak={finished.streak}
        chapterLabel={chapter ? `第${chapter.number}章 ${chapter.titleJa}` : ""}
        nextCount={nextCount}
        onNext={nextSession}
        onReviewMissed={reviewMissed}
      />
    );
  }

  return <PracticeSession key={batch.id} items={batch.items} onFinish={finish} />;
}
