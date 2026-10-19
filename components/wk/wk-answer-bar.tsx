"use client";

import { useEffect, useRef, useState } from "react";
import * as wanakana from "wanakana";

import type { ReviewKind } from "@/components/review-prompt";
import { finalizeKana } from "@/lib/srs/grade";

type BarState = "idle" | "ok" | "fail";

export function WkAnswerBar({
  value,
  onChange,
  onSubmit,
  onContinue,
  state,
  revealedAnswer,
  disabled,
  answerKind = "meaning",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onContinue?: () => void;
  state: BarState;
  revealedAnswer?: string;
  disabled?: boolean;
  answerKind?: ReviewKind;
}) {
  const [composing, setComposing] = useState(false);
  const skipNextEnterRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "idle") {
      return;
    }
    revealRef.current?.focus();
  }, [state]);

  const barClass =
    state === "ok"
      ? "bg-[#3d9970] text-white"
      : state === "fail"
        ? "bg-[#d9534f] text-white"
        : "bg-white text-[#333]";

  function handleChange(next: string) {
    if ((answerKind === "reading" || answerKind === "writing") && !composing) {
      onChange(wanakana.toHiragana(next, { IMEMode: true }));
      return;
    }
    onChange(next);
  }

  if (state !== "idle" && revealedAnswer !== undefined) {
    return (
      <div
        ref={revealRef}
        role="button"
        tabIndex={0}
        className={`${barClass} border-y border-[#ccc] px-4 py-6 text-center text-2xl font-normal outline-none focus:ring-2 focus:ring-inset focus:ring-white/40`}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            onContinue?.();
          }
        }}
        onClick={() => onContinue?.()}
      >
        <p>{revealedAnswer}</p>
        <p className="mt-2 text-sm font-normal opacity-90">
          {state === "fail" ? "Repetir no ciclo · Enter para continuar" : "Enter para continuar"}
        </p>
      </div>
    );
  }

  const lang = answerKind === "meaning" ? "pt-BR" : "ja";

  return (
    <div className={`${barClass} border-y border-[#ccc]`}>
      <input
        ref={inputRef}
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={(e) => {
          setComposing(false);
          skipNextEnterRef.current = true;
          handleChange(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter") {
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
          if (answerKind === "reading" || answerKind === "writing") {
            onChange(finalizeKana(value));
          }
          onSubmit();
        }}
        placeholder={
          answerKind === "writing"
            ? "Kanji ou leitura (ex.: kou / こう)"
            : "Sua resposta"
        }
        lang={lang}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full bg-transparent px-4 py-6 text-center text-xl text-[#222] outline-none placeholder:font-normal placeholder:text-[#bbb]"
      />
    </div>
  );
}
