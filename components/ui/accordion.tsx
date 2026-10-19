"use client";

import { useId, useState, type ReactNode } from "react";

import { cx } from "@/components/ui/cx";
import { ChevronDownIcon } from "@/components/ui/icons";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

/** Disclosure list; the first section starts open, the others closed. */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<string[]>(items[0] ? [items[0].id] : []);
  const baseId = useId();

  function toggle(id: string) {
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className={cx("overflow-hidden", className)}>
      {items.map((item, i) => {
        const expanded = open.includes(item.id);
        const panelId = `${baseId}-${item.id}`;
        return (
          <section key={item.id} className={cx(i > 0 && "border-t border-line")}>
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-[52px] w-full items-center justify-between px-4 text-left text-base font-semibold text-text"
              >
                {item.title}
                <ChevronDownIcon
                  className={cx(
                    "transition-transform duration-[var(--dur-fast)]",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            </h3>
            {expanded ? (
              <div id={panelId} className="px-4 pb-4 text-text-2">
                {item.content}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
