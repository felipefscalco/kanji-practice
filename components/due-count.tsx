"use client";

export { useStudyStats } from "@/hooks/use-study-stats";

export function notifySelectionChanged(): void {
  window.dispatchEvent(new Event("oyster-selection"));
}

/** @deprecated use notifySelectionChanged */
export function notifyProgressChanged(): void {
  notifySelectionChanged();
}

export function PracticeCycleRing({ count }: { count: number }) {
  return (
    <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full border-[10px] border-[var(--wk-surface-raised)]"
        aria-hidden
      />
      <div className="text-center">
        <p className="text-5xl font-bold tabular-nums text-[var(--wk-text)]">{count}</p>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--wk-text-muted)]">
          perguntas / ciclo
        </p>
      </div>
    </div>
  );
}
