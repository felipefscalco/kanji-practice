import { cx } from "@/components/ui/cx";

/** Chapter / subsection progress. */
export function ProgressBar({
  value,
  max,
  label,
  className,
  fillClass = "bg-text-2",
}: {
  value: number;
  max: number;
  label: string;
  className?: string;
  fillClass?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cx("h-2 overflow-hidden rounded-full bg-surface-3", className)}
    >
      <div
        className={cx("h-full rounded-full transition-[width] duration-[var(--dur-base)]", fillClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
