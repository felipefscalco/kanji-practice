"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { Hanko } from "@/components/ui/hanko";
import { QUESTION_KIND } from "@/components/ui/question-band";
import { correctAnswer } from "@/lib/review-grading";
import type { ReviewItem } from "@/lib/review-session";
import { subjectKey, type SessionSummary } from "@/lib/session";

const PREVIEW = 6;

function itemText(item: ReviewItem): string {
  return item.type === "kanji" ? item.kanji.character : item.vocab.expression;
}

function itemMeaning(item: ReviewItem): string {
  return (item.type === "kanji" ? item.kanji.meaningsPt[0] : item.vocab.meaningsPt[0]) ?? "";
}

function ItemGlyph({ item }: { item: ReviewItem }) {
  const text = itemText(item);
  return (
    <span
      lang="ja"
      className={cx(
        "min-w-12 shrink-0 whitespace-nowrap text-center font-kanji font-semibold leading-none",
        item.type === "kanji" ? "text-kanji-ink" : "text-vocab-ink",
        text.length > 2 ? "text-lg sm:text-xl" : text.length > 1 ? "text-xl sm:text-[22px]" : "text-[26px] sm:text-[28px]",
      )}
    >
      {text}
    </span>
  );
}

function Metric({ label, value, note, labelClass }: { label: ReactNode; value: ReactNode; note: string; labelClass?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface-1 px-4 py-3.5 sm:p-5">
      <span className={cx("eyebrow", labelClass)}>{label}</span>
      <strong className="text-[28px] leading-tight tabular-nums sm:text-4xl">{value}</strong>
      <span className="hidden text-sm text-text-2 sm:block">{note}</span>
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  return minutes < 1 ? "menos de 1 min" : `${minutes} min`;
}

/** End-of-batch screen (完): metrics, what went well, what to reinforce, next steps. */
export function SessionSummaryView({
  summary,
  streak,
  chapterLabel,
  nextCount,
  onNext,
  onReviewMissed,
}: {
  summary: SessionSummary;
  streak: number;
  chapterLabel: string;
  nextCount: number;
  onNext: () => void;
  onReviewMissed: () => void;
}) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const onControl = e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement;
      if (e.key === "Enter" && !onControl) {
        e.preventDefault();
        onNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext]);

  // One row per item, even when several question types were right.
  const wentWell = summary.firstTry.filter(
    (item, i, all) => all.findIndex((other) => subjectKey(other) === subjectKey(item)) === i,
  );
  const visible = showAll ? wentWell : wentWell.slice(0, PREVIEW);
  const missedCount = summary.missed.length;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[920px] flex-col gap-5 px-4 pb-6 pt-10 sm:gap-8 sm:px-6 sm:py-16">
      <header className="flex flex-col items-center gap-3.5 text-center sm:flex-row sm:gap-7 sm:text-left">
        <Hanko glyph="完" variant="stamp" />
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">Sessão concluída</h1>
          <p className="m-0 text-text-2 sm:text-lg">
            {summary.total} {summary.total === 1 ? "item" : "itens"} em {formatDuration(summary.durationMs)}
            <span className="hidden sm:inline">
              {" · "}
              <span lang="ja">{chapterLabel}</span>
            </span>
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        <Metric label="Precisão" value={`${summary.accuracy}%`} note="na primeira tentativa" />
        <Metric
          label="Sequência"
          value={`${streak} ${streak === 1 ? "dia" : "dias"}`}
          note="hoje garantido"
          labelClass="text-shu"
        />
        <Metric
          label="✓ Corretas"
          value={summary.firstTry.length}
          note={`de ${summary.total} de primeira`}
          labelClass="text-ok-ink"
        />
        <Metric
          label={
            <>
              ✕ <span className="sm:hidden">Reforçar</span>
              <span className="hidden sm:inline">Para reforçar</span>
            </>
          }
          value={missedCount}
          note="repetidos nesta sessão"
          labelClass="text-err-ink"
        />
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))]">
        {/* TODO(design): "Subiram de estágio" with 種→芽 glyphs once practice records SRS stages. */}
        <section className="flex flex-col gap-2.5 rounded-lg border border-line bg-surface-1 p-4 sm:gap-3.5 sm:p-6">
          <h2 className="m-0 text-[17px] font-bold sm:text-xl">
            Acertou de primeira <span className="font-medium text-text-3">{wentWell.length}</span>
          </h2>
          {wentWell.length === 0 ? (
            <p className="m-0 text-sm text-text-2">Nenhum item de primeira desta vez. Tudo bem: os erros voltaram no fim da sessão.</p>
          ) : (
            <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
              {visible.map((item) => (
                <li key={subjectKey(item)} className="flex items-center gap-2.5 rounded-md bg-surface-2 px-3 py-2.5 sm:gap-3">
                  <ItemGlyph item={item} />
                  <span className="min-w-0 flex-1 truncate text-sm text-text-2">{itemMeaning(item)}</span>
                </li>
              ))}
            </ul>
          )}
          {wentWell.length > PREVIEW && !showAll ? (
            <Button variant="ghost" className="min-h-11! text-sm!" onClick={() => setShowAll(true)}>
              Ver todos os {wentWell.length}
            </Button>
          ) : null}
        </section>

        <section className="flex flex-col gap-2.5 rounded-lg border border-line bg-surface-1 p-4 sm:gap-3.5 sm:p-6">
          <h2 className="m-0 text-[17px] font-bold sm:text-xl">
            Para reforçar <span className="font-medium text-text-3">{missedCount}</span>
          </h2>
          {missedCount === 0 ? (
            <p className="m-0 text-sm text-text-2">Nenhum erro nesta sessão.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {summary.missed.map(({ item, typed }) => (
                <li
                  key={`${subjectKey(item)}:${item.kind}`}
                  className="flex items-center gap-2.5 rounded-md bg-surface-2 px-3 py-2.5 sm:gap-3.5"
                >
                  <ItemGlyph item={item} />
                  <span className="min-w-0 flex-1 text-sm leading-[1.35] text-text-2">
                    {QUESTION_KIND[item.kind].label} · você:{" "}
                    {typed ? (
                      <span
                        lang={item.kind === "meaning" ? "pt-BR" : "ja"}
                        className={cx("text-err-ink", item.kind === "writing" && "font-kanji font-semibold")}
                      >
                        {typed}
                      </span>
                    ) : (
                      <span className="text-text-3">não respondeu</span>
                    )}
                    {item.kind !== "writing" ? (
                      <span className="hidden sm:inline">
                        {" · certo: "}
                        <span lang={item.kind === "meaning" ? "pt-BR" : "ja"} className="text-text">
                          {correctAnswer(item)}
                        </span>
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {missedCount > 0 ? (
            <Button className="min-h-12! self-stretch sm:min-h-11! sm:self-start" onClick={onReviewMissed}>
              Revisar {missedCount === 1 ? "o erro" : `os ${missedCount} erros`} agora
            </Button>
          ) : null}
        </section>
      </div>

      <div className="mt-auto flex flex-col gap-2.5 sm:mt-0 sm:flex-row sm:flex-wrap sm:gap-3">
        <Button variant="primary" kbd="Enter" onClick={onNext} className="sm:flex-[1_1_280px]">
          Próxima sessão · {nextCount} {nextCount === 1 ? "item" : "itens"}
        </Button>
        <ButtonLink href="/" className="sm:flex-[0_1_220px]">
          Voltar ao início
        </ButtonLink>
      </div>
    </main>
  );
}
