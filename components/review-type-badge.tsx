import type { ReviewKind } from "@/components/review-prompt";

export function ReviewTypeBadge({ kind }: { kind: ReviewKind }) {
  const label =
    kind === "meaning"
      ? "Significado"
      : kind === "reading"
        ? "Leitura"
        : "Escrita";
  return (
    <span className="inline-block rounded bg-[var(--wk-pink)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--wk-pink)]">
      {label} · Kanji
    </span>
  );
}
