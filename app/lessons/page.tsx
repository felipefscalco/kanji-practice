"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { EmptySelection } from "@/components/empty-selection";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonKanji } from "@/components/lesson/lesson-kanji";
import { LESSON_STEPS, StepPanel, StepTabs } from "@/components/lesson/lesson-steps";
import { PageSkeleton } from "@/components/skeletons";
import { Button, ButtonLink } from "@/components/ui/button";
import { Hanko } from "@/components/ui/hanko";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { useVisitKey } from "@/hooks/use-client-env";
import { useStudyStats } from "@/hooks/use-study-stats";
import type { KanjiEntry } from "@/lib/kanji-types";
import { countPracticePrompts } from "@/lib/practice";
import { SESSION_SIZE } from "@/lib/session";

const LAST_STEP = LESSON_STEPS.length - 1;

export default function LessonsPage() {
  const stats = useStudyStats();
  // Each visit starts the round over with the current selection.
  const visit = useVisitKey();
  if (!stats) {
    return (
      <main className="mx-auto w-full max-w-[1120px] px-4 pt-[72px] sm:px-6 sm:pt-[112px]">
        <PageSkeleton label="Carregando lições" />
      </main>
    );
  }
  if (stats.lessonKanji.length === 0) {
    return <EmptySelection />;
  }
  return <LessonRunner key={visit} queue={stats.lessonKanji} kinds={stats.kinds} />;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement;
}

function LessonRunner({ queue, kinds }: { queue: KanjiEntry[]; kinds: Parameters<typeof countPracticePrompts>[1] }) {
  const router = useRouter();
  const panelId = useId();
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState<boolean[][]>(() => queue.map((_, i) => LESSON_STEPS.map((_, s) => i === 0 && s === 0)));
  const [done, setDone] = useState(false);

  const kanji = queue[index];
  const atStart = index === 0 && step === 0;
  const atEnd = index === queue.length - 1 && step === LAST_STEP;

  function goTo(nextIndex: number, nextStep: number) {
    setIndex(nextIndex);
    setStep(nextStep);
    setVisited((v) => v.map((steps, i) => (i === nextIndex ? steps.map((seen, s) => seen || s === nextStep) : steps)));
  }

  function next() {
    if (step < LAST_STEP) goTo(index, step + 1);
    else if (index < queue.length - 1) goTo(index + 1, 0);
    else setDone(true);
  }

  function prev() {
    if (step > 0) goTo(index, step - 1);
    else if (index > 0) goTo(index - 1, LAST_STEP);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.isComposing || isTypingTarget(e.target) || e.altKey || e.ctrlKey || e.metaKey) {
        return;
      }
      if (e.key === "Escape") {
        router.push("/");
      } else if (done) {
        return;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (done) {
    const quizIds = queue.map((k) => k.id);
    const quizCount = Math.min(SESSION_SIZE, countPracticePrompts(quizIds, kinds));
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <Hanko glyph="済" variant="stamp" />
        <h1 className="m-0 text-[26px] font-bold tracking-[-0.02em] sm:text-[34px]">
          {queue.length} kanji novos aprendidos
        </h1>
        <div lang="ja" className="flex gap-2">
          {queue.map((k) => (
            <span key={k.id} className="font-kanji text-[30px] font-semibold text-kanji-ink">
              {k.character}
            </span>
          ))}
        </div>
        <p className="m-0 text-text-2">Faça um quiz rápido agora para fixá-los.</p>
        <div className="mt-2 grid w-full gap-2.5">
          <ButtonLink variant="primary" href={`/practice?quiz=${encodeURIComponent(quizIds.join(","))}`}>
            Começar quiz ({quizCount})
          </ButtonLink>
          <Button
            variant="ghost"
            onClick={() => {
              setDone(false);
              goTo(0, 0);
            }}
          >
            Rever lições
          </Button>
        </div>
      </main>
    );
  }

  if (!kanji) {
    return null;
  }

  const nextLabel =
    step < LAST_STEP
      ? `Próximo: ${LESSON_STEPS[step + 1]}`
      : atEnd
        ? "Concluir lições"
        : "Próximo kanji";

  return (
    <div className="flex min-h-dvh flex-col">
      <LessonHeader queue={queue} index={index} onSelect={(i) => goTo(i, 0)} />
      <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-3.5 px-4 pb-[120px] pt-1 sm:flex-row sm:flex-wrap sm:items-start sm:gap-10 sm:px-6 sm:pb-12 sm:pt-10">
        <LessonKanji kanji={kanji} />
        <section aria-label={`Lição de ${kanji.character}`} className="flex min-w-0 flex-col gap-3.5 sm:flex-[999_1_520px] sm:gap-5">
          <StepTabs step={step} visited={visited[index] ?? []} onSelect={(s) => goTo(index, s)} panelId={panelId} />
          <StepPanel key={kanji.id} kanji={kanji} step={step} id={panelId} />
          <nav
            aria-label="Navegação da lição"
            className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-[1fr_1.6fr] gap-2 border-t border-line bg-bg px-4 pb-5 pt-3 sm:static sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0"
          >
            <Button disabled={atStart} onClick={prev} kbd="←" icon={<ArrowLeftIcon size={16} />}>
              <span className="sm:hidden">Voltar</span>
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <Button variant="primary" onClick={next} kbd="→" className="sm:ml-auto">
              {nextLabel}
            </Button>
          </nav>
        </section>
      </main>
    </div>
  );
}
