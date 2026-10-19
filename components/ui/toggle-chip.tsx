import type { ReactNode } from "react";

import { cx } from "@/components/ui/cx";
import { CheckIcon } from "@/components/ui/icons";

/**
 * Filter chip with `aria-pressed`. On: filled + ✓. Off: outline, neutral icon.
 * `iconOnClass` colors the round icon badge while pressed. `locked` keeps it
 * as is (e.g. the last question type that must stay on) and says why.
 */
export function ToggleChip({
  pressed,
  onToggle,
  icon,
  iconOnClass,
  iconLang,
  disabled,
  locked,
  lockedReason,
  children,
}: {
  pressed: boolean;
  onToggle: () => void;
  icon?: ReactNode;
  iconOnClass?: string;
  iconLang?: string;
  disabled?: boolean;
  locked?: boolean;
  lockedReason?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      aria-disabled={locked || undefined}
      title={locked ? lockedReason : undefined}
      onClick={locked ? undefined : onToggle}
      className={cx(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full border pl-1 pr-2.5 text-sm sm:gap-2.5 sm:pl-2 sm:pr-4 sm:text-[15px] font-semibold leading-none transition-colors duration-[var(--dur-fast)]",
        locked && "cursor-not-allowed",
        pressed
          ? "border-text bg-text text-bg"
          : "border-line-strong bg-transparent text-text-2 hover:border-text-3 hover:text-text",
      )}
    >
      {icon ? (
        <span
          aria-hidden
          lang={iconLang}
          className={cx(
            "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold sm:size-7 sm:text-[13px]",
            pressed ? iconOnClass : "bg-surface-3 text-text-2",
          )}
        >
          {icon}
        </span>
      ) : null}
      {children}
      {pressed ? <CheckIcon size={16} strokeWidth={3} className="size-3.5 sm:size-4" /> : null}
    </button>
  );
}
