"use client";

import { useEffect, useState } from "react";

import type { KanjiEntry, VocabularyEntry } from "@/lib/kanji-types";
import { KanjiDetailSections } from "@/components/kanji-detail-sections";
import { VocabDetailSections } from "@/components/vocab-detail-sections";
import { toHiraganaReading } from "@/lib/display-readings";
import type { ReviewItem } from "@/lib/review-session";
import { WkAnswerBar } from "@/components/wk/wk-answer-bar";
import { WkHero, WkTypeBar } from "@/components/wk/wk-hero";
import { WkSessionCard } from "@/components/wk/wk-session-card";
import { WkToolbar } from "@/components/wk/wk-toolbar";
import {
  gradeKanjiWriting,
  gradeMeaning,
  gradeReading,
  gradeVocabWriting,
} from "@/lib/srs/grade";

export type ReviewKind = "meaning" | "reading" | "writing";

function correctAnswerForKanji(kanji: KanjiEntry, kind: ReviewKind): string {
  if (kind === "meaning") {
    return kanji.meaningsPt[0] ?? kanji.meaningsPt.join(" · ");
  }
  if (kind === "writing") {
    return kanji.character;
  }
  const readings = [...kanji.onReadings, ...kanji.kunReadings];
  if (readings.length === 0) {
    return "—";
  }
  return toHiraganaReading(readings[0]);
}

function correctAnswerForVocab(vocab: VocabularyEntry, kind: ReviewKind): string {
  if (kind === "meaning") {
    return vocab.meaningsPt[0] ?? vocab.meaningsPt.join(" · ");
  }
  if (kind === "writing") {
    return vocab.expression;
  }
  return toHiraganaReading(vocab.reading);
}

function gradeKanjiAnswer(kanji: KanjiEntry, kind: ReviewKind, value: string): boolean {
  if (kind === "meaning") {
    return gradeMeaning(value, kanji.meaningsPt);
  }
  if (kind === "writing") {
    return gradeKanjiWriting(value, kanji.character, [
      ...kanji.onReadings,
      ...kanji.kunReadings,
    ]);
  }
  return gradeReading(value, [...kanji.onReadings, ...kanji.kunReadings]);
}

function gradeVocabAnswer(vocab: VocabularyEntry, kind: ReviewKind, value: string): boolean {
  if (kind === "meaning") {
    return gradeMeaning(value, vocab.meaningsPt);
  }
  if (kind === "writing") {
    return gradeVocabWriting(value, vocab.expression, [vocab.reading]);
  }
  return gradeReading(value, [vocab.reading]);
}

export type ReviewPromptResult = { correct: boolean };

export function ReviewPrompt({
  item,
  onResult,
}: {
  item: ReviewItem;
  onResult: (result: ReviewPromptResult) => void;
}) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "ok" | "fail">("idle");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const kind = item.kind;
  const subjectType = item.type;

  useEffect(() => {
    if (feedback === "idle") {
      return;
    }
    setDetailsOpen(true);
  }, [feedback]);

  useEffect(() => {
    if (feedback === "idle") {
      return;
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter") {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      finishItem();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [feedback, onResult]);

  function finishItem() {
    onResult({ correct: feedback === "ok" });
  }

  function continueToNext() {
    finishItem();
  }

  function checkAnswer() {
    if (feedback !== "idle") {
      return;
    }
    if (!value.trim()) {
      return;
    }
    const correct =
      item.type === "kanji"
        ? gradeKanjiAnswer(item.kanji, kind, value)
        : gradeVocabAnswer(item.vocab, kind, value);
    setFeedback(correct ? "ok" : "fail");
  }

  const heroCharacter = (() => {
    if (item.type === "kanji") {
      const kanji = item.kanji;
      if (kind === "writing") {
        return kanji.meaningsPt[0] ?? kanji.meaningsEn[0] ?? "—";
      }
      return kanji.character;
    }
    const vocab = item.vocab;
    if (kind === "writing") {
      return vocab.meaningsPt[0] ?? "—";
    }
    return vocab.expression;
  })();

  const revealed =
    feedback !== "idle"
      ? item.type === "kanji"
        ? correctAnswerForKanji(item.kanji, kind)
        : correctAnswerForVocab(item.vocab, kind)
      : undefined;

  const awaitingContinue = feedback !== "idle";

  return (
    <div className="flex flex-1 flex-col">
      <WkSessionCard>
        <WkHero character={heroCharacter} kind={kind} mode="review" />
        <WkTypeBar kind={kind} mode="review" subjectType={subjectType} />
        <WkAnswerBar
          value={value}
          onChange={setValue}
          onSubmit={checkAnswer}
          onContinue={continueToNext}
          state={feedback}
          revealedAnswer={revealed}
          disabled={feedback !== "idle"}
          answerKind={kind}
        />
        <WkToolbar
          detailsOpen={detailsOpen}
          onToggleDetails={() => setDetailsOpen((o) => !o)}
          onSubmit={checkAnswer}
          canSubmit={feedback === "idle" && value.trim().length > 0}
          awaitingContinue={awaitingContinue}
          onContinue={continueToNext}
        />
        {detailsOpen ? (
          item.type === "kanji" ? (
            <KanjiDetailSections
              kanji={item.kanji}
              defaultOpenMeaning
              defaultOpenReading
              defaultOpenExamples
            />
          ) : (
            <VocabDetailSections vocab={item.vocab} />
          )
        ) : null}
      </WkSessionCard>
    </div>
  );
}
