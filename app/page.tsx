"use client";

import { PracticeCycleRing, useStudyStats } from "@/components/due-count";
import { ReviewKindPicker } from "@/components/review-kind-picker";
import { SiteShell } from "@/components/site-shell";
import { ButtonLink } from "@/components/ui/button";

export default function HomePage() {
  const { kanjiCount, promptCount } = useStudyStats();

  return (
    <SiteShell hideTitle>
      <div className="flex flex-1 flex-col gap-10">
        <section className="text-center">
          <h1 className="mb-2 text-xl font-semibold">Pronto para estudar?</h1>
          <p className="text-sm text-[var(--wk-text-muted)]">
            Capítulo 4 · {kanjiCount} kanji · {promptCount} perguntas no ciclo
          </p>
        </section>

        <PracticeCycleRing count={promptCount} />

        <ReviewKindPicker />

        <div className="grid gap-3 sm:grid-cols-2">
          <ButtonLink variant="primary" className="w-full" href="/practice" disabled={kanjiCount === 0}>
            {kanjiCount > 0 ? "Iniciar prática" : "Escolha seções primeiro"}
          </ButtonLink>
          <ButtonLink variant="secondary" className="w-full" href="/lessons">Ver lições do livro</ButtonLink>
        </div>

        <section className="rounded-xl border border-[var(--wk-border)] bg-[var(--wk-surface)] p-5">
          <h2 className="mb-2 text-sm font-semibold text-[var(--km-green)]">
            Currículo do livro
          </h2>
          <p className="mb-4 text-sm text-[var(--wk-text-muted)]">
            Cada ciclo cobre kanji e palavras compostas do livro, nos tipos de pergunta escolhidos (significado, leitura e/ou escrita).
            Repita quantas vezes quiser.
          </p>
          <ButtonLink variant="secondary" className="w-full" href="/study">Escolher seções</ButtonLink>
        </section>
      </div>
    </SiteShell>
  );
}
