import type { ReactNode } from "react";

import type { ReviewKind } from "@/lib/review-session";
import { cx } from "@/components/ui/cx";

type BandMeta = {
  label: string;
  icon: string;
  iconLang?: string;
  bandClass: string;
  iconClass: string;
  hintClass: string;
};

/** Question type → band color, icon and label. Never color alone: always icon + label. */
export const QUESTION_KIND: Record<ReviewKind, BandMeta> = {
  meaning: {
    label: "Significado",
    icon: "Aa",
    bandClass: "bg-q-meaning text-[#141210]",
    iconClass: "bg-[rgba(20,18,16,.12)] text-[14px]",
    hintClass: "text-[#3D3830]",
  },
  reading: {
    label: "Leitura",
    icon: "あ",
    iconLang: "ja",
    bandClass: "bg-q-reading text-[#141210]",
    iconClass: "bg-[rgba(20,18,16,.1)] sm:text-xl",
    hintClass: "text-[#3D3830]",
  },
  writing: {
    label: "Escrita",
    icon: "筆",
    iconLang: "ja",
    bandClass: "border-y border-line-strong bg-q-writing text-on-q-writing",
    iconClass: "bg-[rgba(239,234,224,.1)] font-kanji font-semibold sm:text-xl",
    hintClass: "text-on-q-writing/75",
  },
};

/**
 * The strip under the prompt that says what to answer.
 * `hint` shows from `sm` up; `shortHint` replaces it on narrow screens.
 */
export function QuestionBand({
  kind,
  hint,
  shortHint,
  aside,
  className,
}: {
  kind: ReviewKind;
  hint?: ReactNode;
  shortHint?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  const meta = QUESTION_KIND[kind];
  return (
    <div
      className={cx(
        "flex h-[52px] items-center gap-2.5 px-3.5 sm:h-16 sm:gap-3.5 sm:px-5",
        meta.bandClass,
        className,
      )}
    >
      <span
        aria-hidden
        lang={meta.iconLang}
        className={cx(
          "flex size-[30px] shrink-0 items-center justify-center rounded-[8px] font-bold sm:size-9 sm:rounded-[9px]",
          meta.iconClass,
        )}
      >
        {meta.icon}
      </span>
      <div className="flex min-w-0 items-baseline gap-2.5">
        <strong className="text-[17px] sm:text-[19px]">{meta.label}</strong>
        {shortHint ? (
          <span className={cx("truncate text-sm sm:hidden", meta.hintClass)}>{shortHint}</span>
        ) : null}
        {hint ? (
          <span
            className={cx(
              "truncate text-sm sm:text-[15px]",
              shortHint ? "hidden sm:inline" : "",
              meta.hintClass,
            )}
          >
            {hint}
          </span>
        ) : null}
      </div>
      {aside ? (
        <span className={cx("ml-auto hidden items-center gap-1.5 text-[13px] sm:flex", meta.hintClass)}>
          {aside}
        </span>
      ) : null}
    </div>
  );
}
