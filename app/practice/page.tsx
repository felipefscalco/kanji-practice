"use client";

import { useState } from "react";

import { PracticeSession } from "@/components/practice/practice-session";
import { Button, ButtonLink } from "@/components/ui/button";
import { Hanko } from "@/components/ui/hanko";
import { useIsClient } from "@/hooks/use-client-env";
import { buildPracticeQueue, type ReviewItem } from "@/lib/practice";
import { counts, takeBatch, type SessionState } from "@/lib/session";
import { getActiveKanjiIds, getActiveReviewKinds } from "@/lib/study-selection";

function buildCycle(): ReviewItem[] {
  return buildPracticeQueue(getActiveKanjiIds(), getActiveReviewKinds());
}

export default function PracticePage() {
  // The cycle comes from sessionStorage, so it only exists in the browser.
  const isClient = useIsClient();
  if (!isClient) {
    return <div className="min-h-dvh" aria-busy="true" />;
  }
  return <PracticeRunner />;
}

type Batch = { items: ReviewItem[]; nextOffset: number; id: number };

function PracticeRunner() {
  const [cycle, setCycle] = useState(buildCycle);
  const [batch, setBatch] = useState<Batch>(() => ({ ...takeBatch(cycle, 0), id: 0 }));
  const [finished, setFinished] = useState<SessionState | null>(null);

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

  if (cycle.length === 0) {
    // TODO(design): Phase 7 empty state (Estados.html).
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-text-2">
          Nenhum kanji na seleção. Marque as subseções do capítulo 4 em Currículo.
        </p>
        <ButtonLink variant="primary" href="/study">
          Escolher seções
        </ButtonLink>
      </main>
    );
  }

  if (finished) {
    // TODO(design): Phase 3 replaces this with the session summary (Resumo-*.html).
    const { ok, err } = counts(finished);
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
        <Hanko glyph="完" variant="stamp" />
        <h1 className="m-0 text-[34px] font-bold tracking-[-0.02em]">Sessão concluída</h1>
        <p className="m-0 text-text-2">
          {ok} corretas · {err} para reforçar
        </p>
        <div className="grid w-full gap-3">
          <Button variant="primary" onClick={nextSession}>
            Próxima sessão
          </Button>
          <ButtonLink href="/">Voltar ao início</ButtonLink>
        </div>
      </main>
    );
  }

  return <PracticeSession key={batch.id} items={batch.items} onFinish={setFinished} />;
}
