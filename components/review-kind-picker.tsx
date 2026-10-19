"use client";

import { useEffect, useState } from "react";

import { notifySelectionChanged } from "@/components/due-count";
import type { ReviewKind } from "@/components/review-prompt";
import {
  ALL_REVIEW_KINDS,
  getActiveReviewKinds,
  setActiveReviewKinds,
} from "@/lib/study-selection";

const LABELS: Record<ReviewKind, string> = {
  meaning: "Significado",
  reading: "Leitura",
  writing: "Escrita (kanji)",
};

export function ReviewKindPicker() {
  const [selected, setSelected] = useState<ReviewKind[]>(ALL_REVIEW_KINDS);

  useEffect(() => {
    setSelected(getActiveReviewKinds());
  }, []);

  function toggle(kind: ReviewKind) {
    const next = selected.includes(kind)
      ? selected.filter((k) => k !== kind)
      : ALL_REVIEW_KINDS.filter((k) => k === kind || selected.includes(k));
    if (next.length === 0) {
      return;
    }
    setSelected(next);
    setActiveReviewKinds(next);
    notifySelectionChanged();
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-[var(--km-green)]">
        Tipo de pergunta
      </legend>
      <div className="flex flex-wrap gap-2">
        {ALL_REVIEW_KINDS.map((kind) => {
          const active = selected.includes(kind);
          return (
            <button
              key={kind}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(kind)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-[var(--wk-pink)] bg-[var(--wk-pink)]/15 text-[var(--wk-pink)]"
                  : "border-[var(--wk-border)] text-[var(--wk-text-muted)] hover:bg-[var(--wk-surface-raised)]"
              }`}
            >
              {LABELS[kind]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
