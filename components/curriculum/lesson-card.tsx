"use client";

import { KanjiTile } from "@/components/ui/kanji-tile";
import { TriCheckbox } from "@/components/ui/tri-checkbox";
import { getKanjiById } from "@/lib/curriculum";
import {
  groupCheckState,
  sectionWords,
  toggleGroup,
  toggleSection,
  type BookLesson,
} from "@/lib/curriculum-groups";
import { toHiraganaReading } from "@/lib/display-readings";
import type { KanjiEntry } from "@/lib/kanji-types";
import { setActiveSectionIds } from "@/lib/study-selection";

function tileReading(kanji: KanjiEntry): string {
  const readings = [...kanji.onReadings, ...kanji.kunReadings].map(toHiraganaReading);
  return [...new Set(readings)].slice(0, 2).join("・");
}

/**
 * One lesson of the book: group checkbox (tri-state) and its kanji grouped by
 * the book word. Selection works per word group (subsection).
 */
export function LessonCard({ lesson, selected }: { lesson: BookLesson; selected: string[] }) {
  const sectionIds = lesson.sections.map((s) => s.id);
  const state = groupCheckState(sectionIds, selected);
  const total = lesson.sections.reduce((n, s) => n + s.kanjiIds.length, 0);
  const chosen = lesson.sections
    .filter((s) => selected.includes(s.id))
    .reduce((n, s) => n + s.kanjiIds.length, 0);
  const headingId = `lesson-${sectionIds[0]}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-4 rounded-[18px] border border-line bg-surface-1 p-4 sm:px-6 sm:pb-6 sm:pt-5"
    >
      <div className="flex items-center gap-3.5">
        <TriCheckbox
          state={state}
          labelledBy={headingId}
          onToggle={() => setActiveSectionIds(toggleGroup(sectionIds, selected))}
        />
        <h2 id={headingId} className="m-0 flex min-w-0 items-baseline gap-2.5 text-lg font-bold sm:text-xl">
          <span lang="ja">{lesson.label}</span>
          {lesson.titlePt ? (
            <span className="hidden truncate text-[15px] font-medium text-text-2 min-[400px]:inline">{lesson.titlePt}</span>
          ) : null}
        </h2>
        <span className="ml-auto shrink-0 text-sm text-text-2 tabular-nums">
          {chosen}
          <span className="sm:hidden">/{total}</span>
          <span className="hidden sm:inline"> de {total} selecionados</span>
        </span>
      </div>
      {/* TODO(design): "N lições pendentes" link once lesson progress is tracked. */}
      <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-6">
        {lesson.sections.map((section) => {
          const words = sectionWords(section);
          const on = selected.includes(section.id);
          const groupLabel = words.reading ? `${words.label} ${words.reading}` : words.label;
          return (
            <div key={section.id} className="contents sm:flex sm:flex-col sm:gap-2">
              <span lang="ja" className="hidden font-jp text-[13px] text-text-3 sm:block">
                {groupLabel}
              </span>
              <div className="contents sm:flex sm:gap-2">
                {section.kanjiIds.map((id) => {
                  const kanji = getKanjiById(id);
                  if (!kanji) {
                    return null;
                  }
                  // TODO(design): stage glyph (種…実) and "novo" once SRS and lessons are tracked.
                  return (
                    <KanjiTile
                      key={id}
                      character={kanji.character}
                      reading={tileReading(kanji)}
                      meaning={kanji.meaningsPt[0]}
                      selected={on}
                      label={`${kanji.character}, ${kanji.meaningsPt[0] ?? ""} — grupo ${words.label}`}
                      onToggle={() => setActiveSectionIds(toggleSection(section.id, selected))}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
