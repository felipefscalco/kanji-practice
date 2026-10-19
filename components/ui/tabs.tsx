"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cx } from "@/components/ui/cx";

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

/** WAI-ARIA tabs with ← → / Home / End roving focus. */
export function Tabs({
  items,
  label,
  className,
  listClassName,
  panelClassName,
}: {
  items: TabItem[];
  label: string;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = items.find((t) => t.id === active) ?? items[0];

  function onKeyDown(e: KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next < 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setActive(items[next].id);
    tabRefs.current[next]?.focus();
  }

  if (!current) {
    return null;
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className={cx("flex gap-7 border-b border-line px-5", listClassName)}
      >
        {items.map((tab, i) => {
          const selected = tab.id === current.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                "-mb-px inline-flex min-h-12 items-center border-b-2 px-1 text-[15px] font-semibold leading-none transition-colors duration-[var(--dur-fast)]",
                selected
                  ? "border-text text-text"
                  : "border-transparent text-text-2 hover:text-text",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${current.id}`}
        aria-labelledby={`${baseId}-tab-${current.id}`}
        tabIndex={0}
        className={cx("p-5", panelClassName)}
      >
        {current.content}
      </div>
    </div>
  );
}
