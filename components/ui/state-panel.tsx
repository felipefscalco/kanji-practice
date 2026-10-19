import type { ReactNode } from "react";

import { cx } from "@/components/ui/cx";

/** Empty / error / done states: visual, title, explanation, actions and an optional note. */
export function StatePanel({
  visual,
  title,
  children,
  actions,
  note,
  className,
  headingLevel = 1,
}: {
  visual?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  className?: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section
      className={cx(
        "flex w-full max-w-md flex-col gap-[18px] rounded-[20px] border border-line bg-surface-1 p-6 sm:p-8",
        className,
      )}
    >
      {visual}
      <Heading className="m-0 text-[22px] font-bold leading-tight">{title}</Heading>
      {children ? <div className="m-0 text-text-2">{children}</div> : null}
      {actions ? <div className="mt-2 flex flex-wrap gap-2.5">{actions}</div> : null}
      {note ? <span className="text-[13px] text-text-3">{note}</span> : null}
    </section>
  );
}

/** Tilted 72px seal for states (休, 済…) in neutral or error tones. */
export function StateSeal({ glyph, tone = "neutral" }: { glyph: ReactNode; tone?: "neutral" | "error" }) {
  return (
    <div
      aria-hidden
      className={cx(
        "flex items-center justify-center rounded-[14px]",
        tone === "error"
          ? "size-14 bg-err-bg text-err-ink"
          : "size-[72px] -rotate-4 bg-surface-3 font-kanji text-[44px] font-semibold text-text shadow-[inset_0_0_0_3px_var(--color-line-strong)]",
      )}
    >
      {glyph}
    </div>
  );
}
