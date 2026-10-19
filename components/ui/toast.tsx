import type { ReactNode } from "react";

import { cx } from "@/components/ui/cx";

/** Transient notice. Announced politely; the parent decides where it sits and when it goes. */
export function Toast({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cx(
        "flex animate-fade items-center gap-3 rounded-[14px] bg-surface-2 px-3.5 py-3 shadow-toast sm:px-4",
        className,
      )}
    >
      {icon}
      <span className="flex min-w-0 flex-col leading-[1.3]">
        <strong className="text-[15px]">{title}</strong>
        {description ? <span className="text-[13px] text-text-2">{description}</span> : null}
      </span>
      {action ? <span className="ml-auto">{action}</span> : null}
    </div>
  );
}
