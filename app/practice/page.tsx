"use client";

import { useEffect, useState } from "react";

import { ReviewPrompt } from "@/components/review-prompt";
import { SessionProgress } from "@/components/ui/session-progress";
import { SiteShell } from "@/components/site-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { getChapters } from "@/lib/curriculum";
import type { ReviewPromptResult } from "@/components/review-prompt";
import { buildPracticeQueue, type ReviewItem } from "@/lib/practice";
import { getActiveKanjiIds, getActiveReviewKinds } from "@/lib/study-selection";

export default function PracticePage() {
  const [cursor, setCursor] = useState(0);
  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setQueue(buildPracticeQueue(getActiveKanjiIds(), getActiveReviewKinds()));
    setReady(true);
  }, []);

  const item = queue[cursor];
  const finished = ready && (queue.length === 0 || cursor >= queue.length);
  const chapter = getChapters()[0];

  function handleResult({ correct }: ReviewPromptResult) {
    if (!correct) {
      setQueue((q) => {
        const current = q[cursor];
        return current ? [...q, current] : q;
      });
    }
    setCursor((c) => c + 1);
  }

  function restart() {
    setCursor(0);
    setQueue(buildPracticeQueue(getActiveKanjiIds(), getActiveReviewKinds()));
  }

  if (!ready) {
    return (
      <SiteShell title="Prática">
        <p className="text-[var(--wk-text-muted)]">Carregando…</p>
      </SiteShell>
    );
  }

  if (queue.length === 0) {
    return (
      <SiteShell title="Prática" fullWidth>
        <div className="rounded-xl border border-[var(--wk-border)] bg-[var(--wk-surface)] p-8 text-center">
          <p className="mb-6 text-[var(--wk-text-muted)]">
            Nenhum kanji na seleção. Marque as subseções do capítulo 4 em Currículo.
          </p>
          <ButtonLink variant="primary" className="w-full" href="/study">Escolher seções</ButtonLink>
        </div>
      </SiteShell>
    );
  }

  if (finished) {
    return (
      <SiteShell title="Prática" fullWidth>
        <div className="rounded-xl border border-[var(--wk-border)] bg-[var(--wk-surface)] p-8 text-center">
          <p className="mb-2 text-lg font-semibold text-[var(--km-green)]">
            Ciclo completo!
          </p>
          <p className="mb-6 text-[var(--wk-text-muted)]">
            Você terminou um ciclo do{" "}
            <strong className="text-[var(--wk-text)]">
              Capítulo {chapter?.number} · {chapter?.titleJa}
            </strong>{" "}
            ({queue.length} perguntas: kanji e palavras do livro). お疲れ様!
          </p>
          <div className="grid gap-3">
            <Button variant="primary" className="w-full" onClick={restart}>Praticar de novo</Button>
            <ButtonLink variant="secondary" className="w-full" href="/">Voltar ao início</ButtonLink>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell hideTitle fullWidth>
      <SessionProgress current={cursor} total={queue.length} />
      <div className="mt-6 flex flex-1 flex-col">
        <ReviewPrompt
          key={`${item!.type}-${item!.type === "kanji" ? item.kanji.id : item.vocab.id}-${item.kind}-${cursor}`}
          item={item!}
          onResult={handleResult}
        />
      </div>
    </SiteShell>
  );
}
