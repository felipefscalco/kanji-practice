import { cx } from "@/components/ui/cx";
import { CheckIcon } from "@/components/ui/icons";

export type TriState = "on" | "off" | "mixed";

/** Group checkbox with a mixed state (`aria-checked="mixed"`). 24px box, 44px hit area. */
export function TriCheckbox({
  state,
  onToggle,
  labelledBy,
}: {
  state: TriState;
  onToggle: () => void;
  labelledBy: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === "on" ? true : state === "mixed" ? "mixed" : false}
      aria-labelledby={labelledBy}
      onClick={onToggle}
      className="-m-2.5 flex size-11 shrink-0 items-center justify-center rounded-md"
    >
      <span
        aria-hidden
        className={cx(
          "flex size-6 items-center justify-center rounded-[7px] border-2 transition-colors duration-[var(--dur-fast)]",
          state === "on"
            ? "border-text bg-text text-bg"
            : state === "mixed"
              ? "border-text bg-surface-3 text-text"
              : "border-line-strong",
        )}
      >
        {state === "on" ? <CheckIcon size={14} strokeWidth={3.5} /> : null}
        {state === "mixed" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
            <path d="M6 12h12" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
