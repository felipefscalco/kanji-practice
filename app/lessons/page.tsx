"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { KanjiCard } from "@/components/kanji-card";
import { AppShell } from "@/components/app-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { LESSON_BATCH } from "@/lib/lessons";
import { kanjiEntriesFromIds } from "@/lib/practice";
import { getActiveKanjiIds } from "@/lib/study-selection";

export default function LessonsPage() {
  const [index, setIndex] = useState(0);

  const queue = useMemo(() => {
    return kanjiEntriesFromIds(getActiveKanjiIds()).slice(0, LESSON_BATCH);
  }, []);

  const current = queue[index];
  const done = queue.length === 0 || index >= queue.length;

  function next() {
    if (index + 1 >= queue.length) {
      setIndex(queue.length);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (queue.length === 0) {
    return (
      <AppShell>
        <p className="mb-6 text-[var(--wk-text-muted)]">
          Nenhum kanji na seleção. Ajuste o currículo em Estudar.
        </p>
        <ButtonLink variant="primary" className="w-full" href="/study">Escolher seções</ButtonLink>
      </AppShell>
    );
  }

  if (done) {
    return (
      <AppShell>
        <div className="rounded-xl border border-[var(--wk-border)] bg-[var(--wk-surface)] p-8 text-center">
          <p className="mb-6 text-[var(--wk-text-muted)]">
            Lote de {queue.length} kanji concluído. Use Prática para significado, leitura e escrita.
          </p>
          <ButtonLink variant="primary" className="w-full" href="/practice">Ir para prática</ButtonLink>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <KanjiCard kanji={current!} index={index} total={queue.length} />
      <Button variant="primary" className="w-full" onClick={next}>Próximo kanji</Button>
      <Link
        href="/"
        className="mt-4 block text-center text-sm text-[var(--wk-text-muted)] hover:text-[var(--wk-text)]"
      >
        Sair das lições
      </Link>
    </AppShell>
  );
}
