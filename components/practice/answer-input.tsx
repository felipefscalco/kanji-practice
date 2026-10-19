"use client";

import { forwardRef, useRef, useState } from "react";
import * as wanakana from "wanakana";

import { cx } from "@/components/ui/cx";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@/components/ui/icons";
import { Kbd } from "@/components/ui/kbd";
import type { ReviewKind } from "@/lib/review-session";

export type AnswerState = "idle" | "typing" | "correct" | "wrong" | "almost" | "disabled";

const PLACEHOLDER: Record<ReviewKind, string> = {
  meaning: "Significado em português",
  reading: "ひらがな",
  writing: "漢字 ou leitura",
};

const ARIA_LABEL: Record<ReviewKind, string> = {
  meaning: "Sua resposta: significado em português",
  reading: "Sua resposta: leitura em hiragana",
  writing: "Sua resposta: escrita em kanji ou leitura",
};

const BOX: Record<AnswerState, string> = {
  idle: "border-line-strong bg-surface-2 text-text focus:border-text",
  typing: "border-text bg-surface-2 text-text",
  correct: "border-ok bg-ok-bg text-ok-ink",
  wrong: "border-err bg-err-bg text-err-ink",
  almost: "border-q-meaning bg-surface-2 text-text",
  disabled: "border-dashed border-line-strong bg-transparent text-text-3",
};

/**
 * Answer field. Reading and writing answers convert romaji to kana as you type
 * (when kana mode is on); IME composition is left alone.
 */
export const AnswerInput = forwardRef<
  HTMLInputElement,
  {
    kind: ReviewKind;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    state: AnswerState;
    kanaMode: boolean;
  }
>(function AnswerInput({ kind, value, onChange, onSubmit, state, kanaMode }, ref) {
  const [composing, setComposing] = useState(false);
  const skipNextEnterRef = useRef(false);
  const answered = state === "correct" || state === "wrong" || state === "almost";
  const converts = kind !== "meaning" && kanaMode;

  function handleChange(next: string) {
    if (converts && !composing) {
      onChange(wanakana.toHiragana(next, { IMEMode: true }));
      return;
    }
    onChange(next);
  }

  return (
    <div className={cx("relative", state === "wrong" && "animate-shake")}>
      <input
        ref={ref}
        autoFocus
        readOnly={answered}
        disabled={state === "disabled"}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={(e) => {
          setComposing(false);
          skipNextEnterRef.current = true;
          handleChange(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" || answered) {
            return;
          }
          if (e.nativeEvent.isComposing || composing) {
            return;
          }
          if (skipNextEnterRef.current) {
            skipNextEnterRef.current = false;
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }}
        placeholder={PLACEHOLDER[kind]}
        aria-label={ARIA_LABEL[kind]}
        aria-invalid={state === "wrong" || undefined}
        lang={kind === "meaning" ? "pt-BR" : "ja"}
        enterKeyHint="go"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={cx(
          "h-16 w-full rounded-[14px] border-2 text-center leading-none outline-none focus-visible:outline-none transition-colors duration-[var(--dur-fast)] placeholder:text-text-3 sm:h-[76px]",
          kind === "meaning"
            ? "px-14 font-ui text-[22px] font-semibold sm:px-[120px] sm:text-2xl"
            : kind === "writing" && answered
              ? "px-[84px] font-kanji text-[30px] font-semibold tracking-[0.06em] sm:px-[120px] sm:text-[34px]"
              : "px-[84px] font-jp text-[26px] font-medium tracking-[0.06em] sm:px-[120px] sm:text-[30px]",
          "placeholder:font-ui placeholder:text-lg placeholder:font-normal placeholder:tracking-normal",
          BOX[state],
          answered && "cursor-default",
        )}
      />
      <LeftBadge state={state} kind={kind} value={value} converts={converts} />
      {!answered && state !== "disabled" ? (
        <Kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3">↵</Kbd>
      ) : null}
    </div>
  );
});

function LeftBadge({
  state,
  kind,
  value,
  converts,
}: {
  state: AnswerState;
  kind: ReviewKind;
  value: string;
  converts: boolean;
}) {
  const pos = "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 sm:left-3.5";
  if (state === "correct" || state === "wrong") {
    const ok = state === "correct";
    return (
      <span
        aria-hidden
        className={cx(
          pos,
          "flex size-9 animate-fade items-center justify-center rounded-[10px] text-sm font-bold sm:h-[34px] sm:w-auto sm:gap-2 sm:rounded-[8px] sm:px-3",
          ok ? "bg-ok text-[#06180E]" : "bg-err text-[#1A0605]",
        )}
      >
        {ok ? <CheckIcon size={20} strokeWidth={3} /> : <CloseIcon size={18} strokeWidth={3} />}
        <span className="hidden sm:inline">{ok ? "Correto" : "Incorreto"}</span>
      </span>
    );
  }
  if (state === "almost") {
    return (
      <span
        aria-hidden
        className={cx(
          pos,
          "flex h-[30px] items-center gap-1.5 rounded-[8px] bg-q-meaning/18 px-2.5 text-[12.5px] font-semibold text-q-meaning",
        )}
      >
        ! Quase
      </span>
    );
  }
  if (!converts || kind === "meaning") {
    return null;
  }
  const romaji = value ? wanakana.toRomaji(value) : "";
  return (
    <span
      aria-hidden
      className={cx(
        pos,
        "flex h-7 items-center gap-1 rounded-[7px] bg-surface-3 px-2 text-[12.5px] font-semibold text-text-2 sm:h-8 sm:gap-1.5 sm:rounded-[8px] sm:px-2.5 sm:text-[13px]",
      )}
    >
      <span className="sm:hidden">
        a→<span lang="ja">あ</span>
      </span>
      <span className="hidden max-w-[64px] truncate sm:inline">{romaji || "romaji"}</span>
      <ArrowRightIcon size={12} strokeWidth={2.5} className="hidden sm:block" />
      <span lang="ja" className="hidden sm:inline">
        かな
      </span>
    </span>
  );
}
