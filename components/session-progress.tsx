export function SessionProgress({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label?: string;
}) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  return (
    <div className="w-full">
      {label ? (
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-[var(--wk-text-muted)]">
          {label}
        </p>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--wk-surface-raised)]">
        <div
          className="h-full rounded-full bg-[var(--wk-pink)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-center text-sm text-[var(--wk-text-muted)]">
        {current} / {total}
      </p>
    </div>
  );
}
