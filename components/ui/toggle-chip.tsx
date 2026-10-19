import type { ReactNode } from "react";

import { cx } from "@/components/ui/cx";
import { CheckIcon } from "@/components/ui/icons";

/**
 * Filter chip with `aria-pressed`. On: filled + ✓. Off: outline, neutral icon.
 * `iconOnClass` colors the round icon badge while pressed.
 */
export function ToggleChip({
  pressed,
  onToggle,
  icon,
  iconOnClass,
  iconLang,
  disabled,
  children,
}: {
  pressed: boolean;
  onToggle: () => void;
  icon?: ReactNode;
  iconOnClass?: string;
  iconLang?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onToggle}
      className={cx(
        "inline-flex min-h-11 items-center gap-2.5 rounded-full border pl-2 pr-4 text-[15px] font-semibold leading-none transition-colors duration-[var(--dur-fast)]",
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
            "inline-flex size-7 items-center justify-center rounded-full text-[13px] font-bold",
            pressed ? iconOnClass : "bg-surface-3 text-text-2",
          )}
        >
          {icon}
        </span>
      ) : null}
      {children}
      {pressed ? <CheckIcon size={16} strokeWidth={3} /> : null}
    </button>
  );
}
