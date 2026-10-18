"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { KanjiCard } from "@/components/kanji-card";
import { SiteShell } from "@/components/site-shell";
import { WkPrimaryButton } from "@/components/wk-button";
import { kanjiEntriesFromIds } from "@/lib/practice";
import { getActiveKanjiIds } from "@/lib/study-selection";

const LESSON_BATCH = 5;

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
      <SiteShell title="Lições" fullWidth>
        <p className="mb-6 text-[var(--wk-text-muted)]">
          Nenhum kanji na seleção. Ajuste o currículo em Estudar.
        </p>
        <WkPrimaryButton href="/study">Escolher seções</WkPrimaryButton>
      </SiteShell>
    );
  }

  if (done) {
    return (
      <SiteShell title="Lições" fullWidth>
        <div className="rounded-xl border border-[var(--wk-border)] bg-[var(--wk-surface)] p-8 text-center">
          <p className="mb-6 text-[var(--wk-text-muted)]">
            Lote de {queue.length} kanji concluído. Use Prática para significado, leitura e escrita.
          </p>
          <WkPrimaryButton href="/practice">Ir para prática</WkPrimaryButton>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell title="Lições" hideTitle fullWidth>
      <KanjiCard kanji={current!} index={index} total={queue.length} />
      <WkPrimaryButton onClick={next}>Próximo kanji</WkPrimaryButton>
      <Link
        href="/"
        className="mt-4 block text-center text-sm text-[var(--wk-text-muted)] hover:text-[var(--wk-text)]"
      >
        Sair das lições
      </Link>
    </SiteShell>
  );
}
