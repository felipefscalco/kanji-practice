"use client";

import { useEffect, useState } from "react";

import type { Chapter } from "@/lib/kanji-types";
import { resolveKanjiIds } from "@/lib/curriculum";
import { notifySelectionChanged } from "@/components/due-count";
import {
  getActiveSectionIds,
  setActiveSectionIds,
} from "@/lib/study-selection";

export function SectionPicker({ chapters }: { chapters: Chapter[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setSelected(getActiveSectionIds());
  }, []);

  useEffect(() => {
    const ids = resolveKanjiIds(selected);
    setTotal(ids.length);
  }, [selected]);

  function toggle(sectionId: string) {
    setSelected((prev) => {
      const next = prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId];
      setActiveSectionIds(next);
      notifySelectionChanged();
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {chapters.map((chapter) => (
        <section
          key={chapter.id}
          className="overflow-hidden rounded-xl border border-[var(--wk-border)] bg-[var(--wk-surface)]"
        >
          <div className="border-b border-[var(--km-green)]/40 bg-[var(--km-green)]/10 px-4 py-3">
            <h2 className="font-semibold">
              第{chapter.number}章 {chapter.titleJa}
            </h2>
            <p className="text-sm text-[var(--wk-text-muted)]">{chapter.titlePt}</p>
          </div>
          <ul className="divide-y divide-[var(--wk-border)]">
            {chapter.sections.map((section) => {
              const active = selected.includes(section.id);
              return (
                <li key={section.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--wk-surface-raised)] ${
                      active ? "bg-[var(--wk-pink)]/5" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--wk-pink)]"
                      checked={active}
                      onChange={() => toggle(section.id)}
                    />
                    <span>
                      <span className="block font-medium">{section.titleJa}</span>
                      <span className="text-sm text-[var(--wk-text-muted)]">
                        {section.titlePt} · {section.kanjiIds.length} kanji
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="text-sm text-[var(--wk-text-muted)]">
        Na prática: <strong className="text-[var(--wk-text)]">{total * 3}</strong> perguntas por
        ciclo completo ({total} kanji)
      </p>
    </div>
  );
}
