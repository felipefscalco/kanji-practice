import { charFromKanjiId } from "@/lib/curriculum";
import { toHiraganaReading } from "@/lib/display-readings";
import type { Chapter, Section } from "@/lib/kanji-types";
import { getVocabularyCatalog } from "@/lib/vocabulary";

/**
 * Portuguese subtitle of each book lesson.
 * TODO(design): move into chapters.json when the curriculum data gets PT lesson titles.
 */
const LESSON_TITLE_PT: Record<string, string> = {
  "1-1 かぞく": "Família",
  "1-2 マンション": "Apartamento",
  "1-3 ファッション": "Moda",
  "2-1 レジ": "Caixa",
  "2-2 てんない": "Dentro da loja",
  "2-3 24じかん": "24 horas",
  "3-1 にもつ": "Encomenda",
  "3-2 あてさき": "Destinatário",
  "3-3 とどうふけん": "Províncias",
  "4-1 デート": "Encontro",
  "4-2 けっこんきねんび": "Aniversário de casamento",
  "4-3 しごと": "Trabalho",
  "5-1 えき": "Estação",
  "5-2 こうさてん": "Cruzamento",
  "5-3 びょういん": "Hospital",
  "6-1 けんきゅう": "Pesquisa",
  "6-2 コミュニケーション": "Comunicação",
  "6-3 ラーメンや": "Restaurante de lámen",
  "7-1 きせつ": "Estações do ano",
  "7-2 てんき": "Tempo (clima)",
  "7-3 りょこう": "Viagem",
};

export interface BookLesson {
  /** e.g. "4-1 デート" — shared by the subsections of one lesson of the book. */
  label: string;
  titlePt?: string;
  sections: Section[];
}

/** Subsections grouped by the book lesson they belong to, in book order. */
export function bookLessons(chapter: Chapter): BookLesson[] {
  const lessons: BookLesson[] = [];
  for (const section of chapter.sections) {
    let lesson = lessons.find((l) => l.label === section.titleJa);
    if (!lesson) {
      // N5 chapters are one lesson each, so the chapter title is the lesson title.
      const titlePt = LESSON_TITLE_PT[section.titleJa] ?? (chapter.book === "n5" ? chapter.titlePt : undefined);
      lesson = { label: section.titleJa, titlePt, sections: [] };
      lessons.push(lesson);
    }
    lesson.sections.push(section);
  }
  return lessons;
}

export interface SectionWords {
  /** Book words that cover the subsection's kanji, e.g. "毎週" or "働く・作る". */
  label: string;
  /** Reading, when a single word covers every kanji. */
  reading?: string;
}

/** Fewest words of the subsection that use all its kanji (ties keep book order). */
export function sectionWords(section: Section): SectionWords {
  const vocab = getVocabularyCatalog().filter((v) => v.sectionId === section.id);
  const chars = section.kanjiIds.map(charFromKanjiId);
  const uncovered = new Set(chars);
  const picked: typeof vocab = [];
  while (uncovered.size > 0) {
    let best: (typeof vocab)[number] | undefined;
    let bestScore = 0;
    for (const v of vocab) {
      const score = [...new Set(v.expression)].filter((ch) => uncovered.has(ch)).length;
      if (score > bestScore) {
        best = v;
        bestScore = score;
      }
    }
    if (!best) {
      break;
    }
    picked.push(best);
    for (const ch of best.expression) {
      uncovered.delete(ch);
    }
  }
  if (picked.length === 0) {
    return { label: chars.join("・") };
  }
  return {
    label: picked.map((v) => v.expression).join("・"),
    reading: picked.length === 1 ? toHiraganaReading(picked[0].reading) : undefined,
  };
}

export type CheckState = "on" | "off" | "mixed";

export function groupCheckState(sectionIds: string[], selected: string[]): CheckState {
  const count = sectionIds.filter((id) => selected.includes(id)).length;
  return count === 0 ? "off" : count === sectionIds.length ? "on" : "mixed";
}

/** Toggling a lesson: anything unchecked turns all on; all on turns all off. */
export function toggleGroup(sectionIds: string[], selected: string[]): string[] {
  if (groupCheckState(sectionIds, selected) === "on") {
    return selected.filter((id) => !sectionIds.includes(id));
  }
  return [...selected, ...sectionIds.filter((id) => !selected.includes(id))];
}

export function toggleSection(sectionId: string, selected: string[]): string[] {
  return selected.includes(sectionId) ? selected.filter((id) => id !== sectionId) : [...selected, sectionId];
}
