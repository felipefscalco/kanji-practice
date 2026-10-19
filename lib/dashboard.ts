import type { Chapter } from "@/lib/kanji-types";

export interface LessonProgress {
  /** Book lesson label, e.g. "4-1 デート". Subsections share it. */
  label: string;
  selected: number;
  total: number;
}

/**
 * Kanji of each book lesson that are in the practice selection. Subsections
 * (毎·週, 映·画·館…) are grouped by the lesson title they share.
 */
export function chapterProgress(chapter: Chapter, selectedSectionIds: string[]): LessonProgress[] {
  const selected = new Set(selectedSectionIds);
  const groups: LessonProgress[] = [];
  for (const section of chapter.sections) {
    let group = groups.find((g) => g.label === section.titleJa);
    if (!group) {
      group = { label: section.titleJa, selected: 0, total: 0 };
      groups.push(group);
    }
    group.total += section.kanjiIds.length;
    if (selected.has(section.id)) {
      group.selected += section.kanjiIds.length;
    }
  }
  return groups;
}

/** The last book lesson with anything selected: where the class is. */
export function currentLesson(progress: LessonProgress[]): string | undefined {
  return progress.findLast((g) => g.selected > 0)?.label;
}

export function greeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}
