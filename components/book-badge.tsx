export function BookBadge({ chapter }: { chapter?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-[var(--km-green)] bg-white text-lg font-bold text-[var(--km-green-dark)]"
        aria-hidden
      >
        字
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-wide">漢字マスター</p>
        <p className="text-xs text-[var(--wk-text-muted)]">
          N4 · Kanji for beginners
          {chapter ? ` · ${chapter}` : ""}
        </p>
      </div>
    </div>
  );
}
