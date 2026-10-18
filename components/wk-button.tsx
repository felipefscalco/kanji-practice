import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex w-full items-center justify-center rounded-lg px-5 py-4 text-center text-base font-semibold transition-colors";

export function WkPrimaryButton({
  children,
  onClick,
  disabled,
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}) {
  const className = `${base} bg-[var(--wk-pink)] text-white hover:bg-[var(--wk-pink-hover)] disabled:cursor-not-allowed disabled:opacity-40`;
  if (href && disabled) {
    return (
      <span className={`${className} opacity-40`} aria-disabled="true">
        {children}
      </span>
    );
  }
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

export function WkSecondaryButton({
  children,
  href,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className = `${base} border border-[var(--wk-border)] bg-[var(--wk-surface)] text-[var(--wk-text)] hover:bg-[var(--wk-surface-raised)]`;
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
