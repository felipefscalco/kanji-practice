import { cx } from "@/components/ui/cx";

export type SegmentResult = "ok" | "err";

/**
 * One segment per item: done = text-2, wrong = err, current = ring.
 * Below `sm` it collapses to a continuous bar.
 */
export function SessionProgress({
  total,
  current,
  results = [],
  label = "Progresso da sessão",
  className,
}: {
  total: number;
  /** 0-based index of the item on screen. */
  current: number;
  /** Outcome per finished position. */
  results?: SegmentResult[];
  label?: string;
  className?: string;
}) {
  const done = Math.min(current, total);
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className={className}
    >
      <div aria-hidden className="hidden gap-[3px] sm:flex">
        {Array.from({ length: total }, (_, i) => (
          <i
            key={i}
            className={cx(
              "h-1.5 flex-1 rounded-full",
              i < current
                ? results[i] === "err"
                  ? "bg-err"
                  : "bg-text-2"
                : i === current
                  ? "bg-text shadow-[0_0_0_2px_var(--color-bg),0_0_0_3px_var(--color-text)]"
                  : "bg-surface-3",
            )}
          />
        ))}
      </div>
      <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-surface-3 sm:hidden">
        <i
          className="block h-full rounded-full bg-text transition-[width] duration-[var(--dur-base)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
