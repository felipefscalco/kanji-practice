"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { PageSkeleton } from "@/components/skeletons";
import { LessonCard } from "@/components/curriculum/lesson-card";
import { QuestionKindChips } from "@/components/curriculum/question-kind-chips";
import { Button, ButtonLink } from "@/components/ui/button";
import { QUESTION_KIND } from "@/components/ui/question-band";
import { useSelection, type Selection } from "@/hooks/use-study-stats";
import { getChapters, resolveKanjiIds } from "@/lib/curriculum";
import { bookLessons } from "@/lib/curriculum-groups";
import { countPracticePrompts } from "@/lib/practice";
import { SESSION_SIZE } from "@/lib/session";
import { setActiveSectionIds } from "@/lib/study-selection";

export default function StudyPage() {
  const selection = useSelection();
  return (
    <AppShell className="gap-5 pb-[220px]! sm:gap-7 sm:pb-[140px]!">
      <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[26px] font-bold tracking-[-0.02em] sm:text-[34px]">Currículo</h1>
          <p className="m-0 hidden text-text-2 sm:block">
            Escolha o que entra nas suas revisões — acompanhe o que a aula já cobriu.
          </p>
        </div>
        <ChapterTabs />
      </div>
      {selection ? <Curriculum selection={selection} /> : <PageSkeleton cards={3} label="Carregando currículo" />}
    </AppShell>
  );
}

function ChapterTabs() {
  // Only chapter 4 exists in the data so far.
  return (
    <div role="tablist" aria-label="Capítulo" className="flex w-full gap-1 rounded-[14px] border border-line bg-surface-1 p-1 sm:w-auto">
      {getChapters().map((chapter) => (
        <button
          key={chapter.id}
          type="button"
          role="tab"
          aria-selected
          className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-surface-3 px-4 text-[15px] font-semibold text-text"
        >
          <span lang="ja">
            第{chapter.number}章 {chapter.titleJa}
          </span>
        </button>
      ))}
    </div>
  );
}

function Curriculum({ selection }: { selection: Selection }) {
  const router = useRouter();
  const chapter = getChapters()[0];
  const lessons = chapter ? bookLessons(chapter) : [];
  const allIds = chapter ? chapter.sections.map((s) => s.id) : [];
  const selected = selection.sectionIds;
  const kanjiIds = resolveKanjiIds(selected);
  const prompts = countPracticePrompts(kanjiIds, selection.kinds);
  const kindsLabel = selection.kinds.map((k) => QUESTION_KIND[k].label).join(" + ");
  const canStart = kanjiIds.length > 0;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const onControl =
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLAnchorElement ||
        e.target instanceof HTMLInputElement;
      if (e.key === "Enter" && !onControl && canStart) {
        e.preventDefault();
        router.push("/practice");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, canStart]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <QuestionKindChips kinds={selection.kinds} />
        <div className="ml-auto hidden gap-1 sm:flex">
          <Button variant="ghost" className="min-h-11!" onClick={() => setActiveSectionIds(allIds)}>
            Selecionar capítulo
          </Button>
          {/* TODO(design): "Só o que já aprendi" needs lesson/SRS progress. */}
          <Button variant="ghost" className="min-h-11!" onClick={() => setActiveSectionIds([])}>
            Limpar
          </Button>
        </div>
      </div>

      {lessons.map((lesson) => (
        <LessonCard key={lesson.label} lesson={lesson} selected={selected} />
      ))}

      <div className="fixed inset-x-0 bottom-[72px] z-10 border-t border-line-strong bg-surface-1/97 backdrop-blur-sm sm:bottom-0">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-4">
          <div className="flex flex-col leading-[1.35]" aria-live="polite">
            <span className="text-sm text-text-2 sm:text-[17px] sm:text-text">
              <strong className="text-text">{kanjiIds.length} kanji</strong> · {kindsLabel}
              <span className="sm:hidden"> · ≈{prompts} perguntas</span>
            </span>
            <span className="hidden text-sm text-text-2 sm:block">
              {canStart
                ? `≈ ${prompts} perguntas no ciclo · sessões de ${SESSION_SIZE}`
                : "Selecione pelo menos um grupo para praticar"}
            </span>
          </div>
          <ButtonLink variant="primary" href="/practice" kbd="Enter" disabled={!canStart} className="sm:ml-auto">
            Começar prática
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
