import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/components/ui/cx";
import { Kbd } from "@/components/ui/kbd";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-md border px-5 font-ui text-base font-semibold leading-none no-underline transition-colors duration-[var(--dur-fast)] sm:min-h-12";

const variants: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-primary text-on-primary hover:opacity-90",
  secondary: "border-line-strong bg-surface-3 text-text hover:border-text-3",
  ghost: "border-transparent bg-transparent text-text-2 hover:bg-surface-2 hover:text-text",
};

const disabledClass =
  "cursor-not-allowed border-dashed border-line-strong bg-transparent text-text-3 hover:opacity-100";

export function buttonClass(variant: ButtonVariant = "secondary", disabled = false): string {
  return cx(base, disabled ? disabledClass : variants[variant]);
}

type CommonProps = {
  variant?: ButtonVariant;
  /** Keyboard shortcut shown as a keycap (hidden on touch). */
  kbd?: ReactNode;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "secondary",
  kbd,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(buttonClass(variant, disabled), className)}
      {...rest}
    >
      {icon}
      {children}
      {kbd ? <Kbd>{kbd}</Kbd> : null}
    </button>
  );
}

/** Navigation styled as a button. Disabled links render as inert text. */
export function ButtonLink({
  href,
  variant = "secondary",
  kbd,
  icon,
  className,
  children,
  disabled,
}: CommonProps & { href: string; disabled?: boolean }) {
  const cls = cx(buttonClass(variant, disabled), className);
  const content = (
    <>
      {icon}
      {children}
      {kbd ? <Kbd>{kbd}</Kbd> : null}
    </>
  );
  if (disabled) {
    return (
      <span className={cls} aria-disabled="true">
        {content}
      </span>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
