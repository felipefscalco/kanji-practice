"use client";

import { QUESTION_KIND } from "@/components/ui/question-band";
import { ToggleChip } from "@/components/ui/toggle-chip";
import type { ReviewKind } from "@/lib/review-session";
import { ALL_REVIEW_KINDS, setActiveReviewKinds } from "@/lib/study-selection";

const ICON_ON: Record<ReviewKind, string> = {
  meaning: "bg-q-meaning text-[#141210]",
  reading: "bg-q-reading text-[#141210] shadow-[0_0_0_1px_rgba(20,18,16,.25)]",
  writing: "bg-q-writing text-on-q-writing font-kanji",
};

/** Question types the practice cycle asks. At least one always stays on. */
export function QuestionKindChips({ kinds }: { kinds: ReviewKind[] }) {
  function toggle(kind: ReviewKind) {
    const next = kinds.includes(kind)
      ? kinds.filter((k) => k !== kind)
      : ALL_REVIEW_KINDS.filter((k) => k === kind || kinds.includes(k));
    if (next.length > 0) {
      setActiveReviewKinds(next);
    }
  }

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
      <span className="eyebrow" id="question-kinds">
        Tipos de pergunta
      </span>
      <div role="group" aria-labelledby="question-kinds" className="flex flex-wrap gap-1.5 sm:gap-2">
        {ALL_REVIEW_KINDS.map((kind) => {
          const pressed = kinds.includes(kind);
          const meta = QUESTION_KIND[kind];
          return (
            <ToggleChip
              key={kind}
              pressed={pressed}
              onToggle={() => toggle(kind)}
              locked={pressed && kinds.length === 1}
              lockedReason="Pelo menos um tipo de pergunta fica ligado"
              icon={meta.icon}
              iconLang={meta.iconLang}
              iconOnClass={ICON_ON[kind]}
            >
              {meta.label}
            </ToggleChip>
          );
        })}
      </div>
    </div>
  );
}
