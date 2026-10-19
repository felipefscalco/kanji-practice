"use client";

import { useEffect, useId, useRef, useState } from "react";

import { AnswerCompare } from "@/components/practice/answer-compare";
import { AnswerInput, type AnswerState } from "@/components/practice/answer-input";
import { ItemDetails } from "@/components/practice/item-details";
import { PromptHero } from "@/components/practice/prompt-hero";
import { Button } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { CheckIcon, QuestionIcon } from "@/components/ui/icons";
import { QUESTION_KIND, QuestionBand } from "@/components/ui/question-band";
import { useKeepFocusedInView, useMediaQuery } from "@/hooks/use-client-env";
import { correctAnswer } from "@/lib/review-grading";
import type { ReviewItem, ReviewKind } from "@/lib/review-session";
import type { Outcome } from "@/lib/session";
import { finalizeKana } from "@/lib/srs/grade";

function bandHints(item: ReviewItem): { hint: string; shortHint: string } {
  if (item.kind === "meaning") {
    return { hint: "digite em português", shortHint: "em português" };
  }
  if (item.kind === "reading") {
    return {
      hint: item.type === "kanji" ? "digite em hiragana — on'yomi ou kun'yomi" : "digite em hiragana",
      shortHint: "em hiragana",
    };
  }
  return {
    hint: item.type === "kanji" ? "escreva o kanji — ou digite a leitura" : "escreva a palavra em kanji",
    shortHint: "em kanji",
  };
}

function UndoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
    </svg>
  );
}

/** Keys typed into the mnemonic field or a focused control must not trigger shortcuts. */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLInputElement && !target.readOnly) ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/** One question: prompt, question band, answer, feedback and details. Remounted per item. */
export function ReviewCard({
  item,
  outcome,
  answered,
  kanaMode,
  onToggleKana,
  onSubmit,
  onUndo,
  onContinue,
}: {
  item: ReviewItem;
  outcome: Outcome | null;
  /** Other question types of this item already answered in the session. */
  answered: ReviewKind[];
  kanaMode: boolean;
  onToggleKana: () => void;
  onSubmit: (value: string) => void;
  onUndo: () => void;
  onContinue: () => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [wasWrong, setWasWrong] = useState(false);
  const wide = useMediaQuery("(min-width: 640px)");
  const [detailsPref, setDetailsPref] = useState<boolean | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const detailsId = useId();
  useKeepFocusedInView(rootRef);

  const kind = item.kind;
  const correct = correctAnswer(item);
  const isAnswered = outcome !== null;
  // Open by default after a mistake on wide screens; the learner's toggle wins.
  const detailsOpen = isAnswered && (detailsPref ?? (wide && outcome === "err"));
  const state: AnswerState = isAnswered
    ? outcome === "ok"
      ? "correct"
      : "wrong"
    : value.trim()
      ? "typing"
      : "idle";

  function submit(raw: string) {
    if (isAnswered) {
      return;
    }
    setSubmitted(raw);
    onSubmit(raw);
  }

  function check() {
    if (!value.trim()) {
      inputRef.current?.focus();
      return;
    }
    // A trailing romaji "n" becomes ん only when the answer is final.
    submit(kind === "meaning" ? value : finalizeKana(value));
  }

  function undo() {
    setWasWrong(true);
    onUndo();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.isComposing) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        if (!isAnswered && kind !== "meaning") {
          e.preventDefault();
          onToggleKana();
        }
        return;
      }
      if (!isAnswered || isTypingTarget(e.target) || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      const onControl = e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement;
      if (e.key === "Enter" && !onControl) {
        e.preventDefault();
        onContinue();
      } else if (e.key === "/") {
        e.preventDefault();
        setDetailsPref(!detailsOpen);
      } else if (e.key === "Backspace" && outcome === "err") {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const hints = bandHints(item);
  const aside =
    answered.length > 0 ? (
      <>
        <CheckIcon size={14} />
        {answered.map((k) => QUESTION_KIND[k].label).join(" e ")} já respondido
      </>
    ) : undefined;
  const showKana = kind !== "meaning";

  return (
    <article
      ref={rootRef}
      aria-label="Pergunta"
      className="w-full max-w-[720px] overflow-hidden rounded-[20px] border border-line bg-surface-1 sm:rounded-xl sm:shadow-toast"
    >
      <PromptHero item={item} compact={outcome === "err"} />
      <QuestionBand kind={kind} hint={hints.hint} shortHint={hints.shortHint} aside={aside} />

      <div className={cx("flex flex-col gap-2.5 p-3.5 sm:p-5", isAnswered ? "sm:gap-4" : "sm:gap-3.5")}>
        {!isAnswered ? (
          <span aria-hidden className="eyebrow hidden sm:block">
            Sua resposta
          </span>
        ) : null}
        <AnswerInput
          ref={inputRef}
          kind={kind}
          value={isAnswered ? submitted : value}
          onChange={setValue}
          onSubmit={check}
          state={state}
          kanaMode={kanaMode}
        />

        {outcome === "err" ? <AnswerCompare item={item} typed={submitted} correct={correct} /> : null}

        {!isAnswered ? (
          <div
            className={cx(
              "grid gap-2 sm:gap-2.5",
              showKana ? "grid-cols-[1fr_1fr_1.5fr] sm:grid-cols-[1fr_1fr_1.4fr]" : "grid-cols-[1fr_1.4fr]",
            )}
          >
            {showKana ? (
              <Button
                aria-pressed={kanaMode}
                onClick={onToggleKana}
                kbd="⌃K"
               
                icon={
                  <span lang="ja" className="font-jp font-bold">
                    あ
                  </span>
                }
              >
                <span className="sm:hidden">Kana</span>
                <span className="hidden sm:inline">{kanaMode ? "Kana ligado" : "Kana desligado"}</span>
              </Button>
            ) : null}
            <Button
              onClick={() => submit("")}
             
              icon={<QuestionIcon className="hidden sm:block" />}
            >
              Não sei
            </Button>
            <Button
              variant="primary"
              disabled={!value.trim()}
              onClick={check}
              kbd="Enter"
             
            >
              Verificar
            </Button>
          </div>
        ) : outcome === "ok" ? (
          <div className="grid grid-cols-[1fr_1.6fr] gap-2 sm:grid-cols-[1fr_1.4fr] sm:gap-2.5">
            <DetailsButton open={detailsOpen} controls={detailsId} onClick={() => setDetailsPref(!detailsOpen)} />
            <Button variant="primary" onClick={onContinue} kbd="Enter" autoFocus={wasWrong}>
              Continuar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1.4fr] sm:gap-2.5">
            <Button
              onClick={undo}
              kbd="⌫"
              icon={<UndoIcon />}
              className="sm:bg-transparent sm:text-text-2 sm:hover:text-text"
            >
              <span className="sm:hidden">Foi digitação</span>
              <span className="hidden sm:inline">Foi erro de digitação</span>
            </Button>
            <DetailsButton open={detailsOpen} controls={detailsId} onClick={() => setDetailsPref(!detailsOpen)} />
            <Button variant="primary" onClick={onContinue} kbd="Enter" className="col-span-2 sm:col-span-1">
              Continuar
            </Button>
          </div>
        )}

        {outcome === "err" ? (
          <p className="m-0 text-center text-[12.5px] text-text-3 sm:text-[13px]">
            {/* TODO(design): append "· estágio X → Y" once practice records SRS stages. */}
            <span className="hidden sm:inline">Este item volta no fim desta sessão</span>
            <span className="sm:hidden">Volta no fim desta sessão</span>
          </p>
        ) : null}
      </div>

      {detailsOpen ? <ItemDetails item={item} id={detailsId} /> : null}
    </article>
  );
}

function DetailsButton({ open, controls, onClick }: { open: boolean; controls: string; onClick: () => void }) {
  return (
    <Button aria-expanded={open} aria-controls={controls} onClick={onClick} kbd="/">
      Detalhes
    </Button>
  );
}
