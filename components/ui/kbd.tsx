import type { ReactNode } from "react";

import { cx } from "@/components/ui/cx";

/** Keycap hint. Hidden on touch-only devices. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cx(
        "hidden h-[22px] min-w-[22px] items-center justify-center rounded-sm border border-current px-1.5 font-ui text-xs font-medium leading-none opacity-80 pointer-fine:inline-flex",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
