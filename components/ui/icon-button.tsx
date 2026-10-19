import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/components/ui/cx";

/** Icon-only button. `aria-label` is required; it doubles as the tooltip. */
export function IconButton({
  label,
  children,
  className,
  type = "button",
  ...rest
}: {
  label: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-text-2 transition-colors duration-[var(--dur-fast)] hover:bg-surface-2 hover:text-text disabled:text-text-3",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
