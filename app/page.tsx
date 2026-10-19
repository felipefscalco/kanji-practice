"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useStudyDays } from "@/hooks/use-activity";
import { useStudyStats, type StudyStats } from "@/hooks/use-study-stats";
import { currentStreak, lastSevenDays, toDayKey } from "@/lib/activity";
import { getChapters, getSectionForKanji } from "@/lib/curriculum";
import { chapterProgress, currentLesson, greeting } from "@/lib/dashboard";
import { SRS_GROUPS } from "@/lib/srs/groups";

const SECONDS_PER_ITEM = 18;
const WEEKDAY = ["D", "S", "T", "Q", "Q", "S", "S"];
const WEEKDAY_LONG = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cx("flex flex-col rounded-[18px] border border-line bg-surface-1", className)}>
      {children}
    </section>
  );
}

export default function HomePage() {
  const stats = useStudyStats();
  return <AppShell className="gap-3.5 sm:gap-6">{stats ? <Dashboard stats={stats} /> : null}</AppShell>;
}

function Dashboard({ stats }: { stats: StudyStats }) {
  const days = useStudyDays() ?? [];
  const now = new Date();
  const chapter = getChapters()[0];
  const progress = chapter ? chapterProgress(chapter, stats.sectionIds) : [];
  const lesson = currentLesson(progress);
  const selectedKanji = progress.reduce((n, g) => n + g.selected, 0);
  const totalKanji = progress.reduce((n, g) => n + g.total, 0);
  const minutes = Math.max(1, Math.round((stats.sessionCount * SECONDS_PER_ITEM) / 60));
  const lessonSection = stats.lessonKanji[0] ? getSectionForKanji(stats.lessonKanji[0].id)?.titleJa : undefined;
  const streak = currentStreak(days, now);
  const week = lastSevenDays(days, now);
  const studiedToday = days.includes(toDayKey(now));

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[26px] font-bold tracking-[-0.02em] sm:text-[34px]">{greeting(now.getHours())}</h1>
        {chapter ? (
          <p className="m-0 text-sm text-text-2 sm:text-base">
            <span lang="ja">
              第{chapter.number}章<span className="hidden sm:inline"> {chapter.titleJa}</span>
            </span>
            {lesson ? (
              <>
                {" · "}
                <span className="hidden sm:inline">você está em </span>
                <span lang="ja">{lesson}</span>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] sm:gap-4">
        <Card className="gap-3.5 border-line-strong bg-[linear-gradient(180deg,#1D1B18,#181614)] p-5 sm:gap-[18px] sm:p-7 [[data-theme=light]_&]:bg-none">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-text">Agora · revisões</span>
            <span className="hidden text-[13px] text-text-2 sm:inline">faça primeiro</span>
          </div>
          <div className="flex items-baseline gap-2.5 sm:gap-3">
            <strong className="text-[52px] leading-none tabular-nums sm:text-[64px]">{stats.sessionCount}</strong>
            <span className="text-text-2 sm:text-lg">
              itens<span className="hidden sm:inline"> prontos</span> · ~{minutes} min
            </span>
          </div>
          <div className="hidden flex-wrap gap-2 text-sm text-text-2 sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <i aria-hidden className="size-2.5 rounded-[3px] bg-kanji" />
              {stats.kanjiCount} kanji
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i aria-hidden className="size-2.5 rounded-[3px] bg-vocab" />
              {stats.vocabCount} vocabulário
            </span>
          </div>
          <ButtonLink
            variant="primary"
            href="/practice"
            disabled={stats.sessionCount === 0}
            className="sm:self-start"
          >
            Revisar {stats.sessionCount} itens
            <ArrowRightIcon className="hidden sm:block" />
          </ButtonLink>
        </Card>

        <Card className="gap-3.5 p-5 sm:gap-[18px] sm:p-7">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Novos · lições</span>
            {lessonSection ? (
              <span lang="ja" className="text-[13px] text-text-2">
                {lessonSection}
              </span>
            ) : null}
          </div>
          {/* TODO(design): show only kanji whose lesson is still pending once lesson progress is tracked. */}
          <div lang="ja" className="flex gap-1.5 sm:gap-2">
            {stats.lessonKanji.map((k) => (
              <span
                key={k.id}
                className="inline-flex h-[52px] flex-1 items-center justify-center rounded-md border border-line bg-surface-2 font-kanji text-[26px] font-semibold text-kanji-ink sm:max-w-[54px]"
              >
                {k.character}
              </span>
            ))}
          </div>
          <p className="m-0 hidden text-[15px] text-text-2 sm:block">
            {stats.lessonKanji.length} kanji para estudar. Depois das lições eles entram nas revisões.
          </p>
          <ButtonLink href="/lessons" disabled={stats.lessonKanji.length === 0} className="sm:self-start">
            Fazer {stats.lessonKanji.length} lições
          </ButtonLink>
        </Card>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] sm:gap-4">
        {chapter ? (
          <Card className="gap-3 p-5 sm:gap-4 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="m-0 text-[17px] font-bold sm:text-lg">Capítulo {chapter.number}</h2>
              <span className="text-sm text-text-2">
                <strong className="text-text tabular-nums">{selectedKanji}</strong>
                <span className="sm:hidden">/</span>
                <span className="hidden sm:inline"> de </span>
                {totalKanji} kanji<span className="hidden sm:inline"> na prática</span>
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {progress.map((g) => (
                <div key={g.label} className="flex flex-col gap-[5px] sm:gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span lang="ja">{g.label}</span>
                    <span className="text-text-2 tabular-nums">
                      {g.selected}/{g.total}
                    </span>
                  </div>
                  <ProgressBar value={g.selected} max={g.total} label={`${g.label}: ${g.selected} de ${g.total} kanji na prática`} />
                </div>
              ))}
            </div>
            <Link href="/study" className="hidden text-sm font-semibold text-text-2 underline hover:text-text sm:inline">
              Abrir currículo
            </Link>
          </Card>
        ) : null}

        {/* TODO(design): distribution by SRS stage once practice records stages (srsGroup() is ready). */}
        <Card className="gap-3 p-5 sm:gap-4 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 text-[17px] font-bold sm:text-lg">Estágios SRS</h2>
            <span className="text-sm text-text-3">em breve</span>
          </div>
          <div aria-hidden className="h-3 rounded-full bg-surface-3 sm:h-3.5" />
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {SRS_GROUPS.map((g) => (
              <div key={g.id} className="flex flex-col items-center gap-0.5 text-text-3">
                <span lang="ja" className="font-kanji text-lg font-semibold sm:text-xl">
                  {g.glyph}
                </span>
                <strong className="sm:text-xl">—</strong>
                <span className="hidden text-[12.5px] sm:block">{g.name}</span>
              </div>
            ))}
          </div>
          <p className="m-0 text-[12.5px] text-text-3">Os estágios aparecem quando as revisões passarem a registrar seu progresso.</p>
        </Card>

        <Card className="hidden gap-4 p-6 sm:flex">
          <div className="flex items-baseline justify-between">
            <h2 className="m-0 text-lg font-bold">Sequência</h2>
            <strong className="text-lg text-shu">
              {streak} {streak === 1 ? "dia" : "dias"}
            </strong>
          </div>
          <ol className="m-0 grid list-none grid-cols-7 gap-1.5 p-0 text-center text-[12.5px] text-text-3">
            {week.map(({ date, studied }, i) => {
              const today = i === week.length - 1;
              return (
                <li key={toDayKey(date)} className={cx("flex flex-col items-center gap-1.5", today && "text-text")}>
                  <span
                    aria-label={`${today ? "hoje" : WEEKDAY_LONG[date.getDay()]}: ${studied ? "feito" : today ? "pendente" : "sem sessão"}`}
                    className={cx(
                      "size-8 rounded-[8px]",
                      studied ? "bg-shu-fill" : today ? "border border-dashed border-shu" : "bg-surface-3",
                    )}
                  />
                  {today ? "Hoje" : WEEKDAY[date.getDay()]}
                </li>
              );
            })}
          </ol>
          {/* TODO(design): "Próximas: +6 às 21h · +14 amanhã 9h" needs SRS review times. */}
          <p className="m-0 text-sm text-text-2">
            {studiedToday ? "Hoje garantido." : "Termine uma sessão hoje para manter a sequência."}
          </p>
        </Card>
      </div>
    </>
  );
}
