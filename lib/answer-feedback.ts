import { normalizeAnswer } from "@/lib/answer/normalize";
import { getKanjiByCharacter, getKanjiCatalog, getSectionForKanji } from "@/lib/curriculum";
import { toHiraganaReading } from "@/lib/display-readings";
import type { ReviewItem } from "@/lib/review-session";
import { finalizeKana } from "@/lib/srs/grade";
import { getVocabularyCatalog } from "@/lib/vocabulary";

export interface DiffChar {
  ch: string;
  diff: boolean;
}

/** Position-by-position comparison, used to underline what differs. */
export function diffChars(typed: string, correct: string): { typed: DiffChar[]; correct: DiffChar[] } {
  const a = [...typed];
  const b = [...correct];
  return {
    typed: a.map((ch, i) => ({ ch, diff: ch !== b[i] })),
    correct: b.map((ch, i) => ({ ch, diff: ch !== a[i] })),
  };
}

/** A study item from the book, as shown in feedback. */
export interface Subject {
  text: string;
  reading?: string;
  meaning?: string;
}

/** What the learner's wrong answer means, when it is another item of the book. */
export function describeTyped(item: ReviewItem, typed: string): Subject | null {
  const value = typed.trim().normalize("NFKC");
  if (!value) {
    return null;
  }
  if (item.kind === "writing") {
    const vocab = getVocabularyCatalog().find((v) => v.expression === value);
    if (vocab) {
      return { text: vocab.expression, reading: toHiraganaReading(vocab.reading), meaning: vocab.meaningsPt[0] };
    }
    const kanji = getKanjiByCharacter(value);
    if (kanji) {
      return { text: kanji.character, meaning: kanji.meaningsPt[0] };
    }
    return null;
  }
  if (item.kind === "reading") {
    const kana = finalizeKana(value);
    const vocab = getVocabularyCatalog().find(
      (v) => toHiraganaReading(v.reading) === kana && !isSameSubject(item, v.id),
    );
    return vocab
      ? { text: vocab.expression, reading: kana, meaning: vocab.meaningsPt[0] }
      : null;
  }
  const norm = normalizeAnswer(value);
  const vocab = getVocabularyCatalog().find(
    (v) => !isSameSubject(item, v.id) && v.meaningsPt.some((m) => normalizeAnswer(m) === norm),
  );
  if (vocab) {
    return { text: vocab.expression, meaning: vocab.meaningsPt[0] };
  }
  const kanji = getKanjiCatalog().find(
    (k) => !isSameSubject(item, k.id) && k.meaningsPt.some((m) => normalizeAnswer(m) === norm),
  );
  return kanji ? { text: kanji.character, meaning: kanji.meaningsPt[0] } : null;
}

function isSameSubject(item: ReviewItem, id: string): boolean {
  return item.type === "kanji" ? item.kanji.id === id : item.vocab.id === id;
}

export interface HintPart {
  text: string;
  ja?: boolean;
}

function kanjiLabel(ch: string): HintPart[] {
  const kanji = getKanjiByCharacter(ch);
  if (!kanji) {
    return [{ text: ch, ja: true }];
  }
  const section = getSectionForKanji(kanji.id)?.titleJa.split(" ")[0];
  const meaning = kanji.meaningsPt.slice(0, 2).join(", ");
  return [{ text: ch, ja: true }, { text: ` ${meaning}${section ? ` (${section})` : ""}` }];
}

/**
 * Confusion tip shown under a wrong answer, derived from the book data:
 * homophones, a different kanji in the same word, or another item's answer.
 */
export function confusionHint(item: ReviewItem, typed: string, correct: string): HintPart[] | null {
  const other = describeTyped(item, typed);
  if (item.kind === "writing") {
    const value = typed.trim().normalize("NFKC");
    const { correct: marks } = diffChars(value, correct);
    const wrongChars = [...value].filter((ch, i) => ch !== [...correct][i]);
    const rightChars = marks.filter((m) => m.diff).map((m) => m.ch);
    if (wrongChars.length === 0 || rightChars.length === 0 || !/\p{Script=Han}/u.test(value)) {
      return null;
    }
    const sameReading = other?.reading !== undefined && other.reading === readingOf(item);
    const parts: HintPart[] = [{ text: sameReading ? "Mesma leitura, kanji diferente: " : "Kanji diferente: " }];
    rightChars.forEach((ch, i) => {
      if (i > 0) parts.push({ text: ", " });
      parts.push(...kanjiLabel(ch));
    });
    parts.push({ text: " ≠ " });
    wrongChars.forEach((ch, i) => {
      if (i > 0) parts.push({ text: ", " });
      parts.push(...kanjiLabel(ch));
    });
    parts.push({ text: "." });
    return parts;
  }
  if (!other) {
    return null;
  }
  const lead = item.kind === "reading" ? "Essa é a leitura de " : "Esse é o significado de ";
  return [
    { text: lead },
    { text: other.text, ja: true },
    { text: other.meaning && item.kind === "reading" ? ` (${other.meaning}).` : "." },
  ];
}

function readingOf(item: ReviewItem): string | undefined {
  return item.type === "vocab" ? toHiraganaReading(item.vocab.reading) : undefined;
}
