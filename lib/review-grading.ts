import { toHiraganaReading } from "@/lib/display-readings";
import type { KanjiEntry, VocabularyEntry } from "@/lib/kanji-types";
import type { ReviewItem, ReviewKind } from "@/lib/review-session";
import {
  gradeKanjiWriting,
  gradeMeaning,
  gradeReading,
  gradeVocabWriting,
} from "@/lib/srs/grade";

function correctAnswerForKanji(kanji: KanjiEntry, kind: ReviewKind): string {
  if (kind === "meaning") {
    return kanji.meaningsPt[0] ?? kanji.meaningsPt.join(" · ");
  }
  if (kind === "writing") {
    return kanji.character;
  }
  const readings = [...kanji.onReadings, ...kanji.kunReadings];
  if (readings.length === 0) {
    return "—";
  }
  return toHiraganaReading(readings[0]);
}

function correctAnswerForVocab(vocab: VocabularyEntry, kind: ReviewKind): string {
  if (kind === "meaning") {
    return vocab.meaningsPt[0] ?? vocab.meaningsPt.join(" · ");
  }
  if (kind === "writing") {
    return vocab.expression;
  }
  return toHiraganaReading(vocab.reading);
}

function gradeKanjiAnswer(kanji: KanjiEntry, kind: ReviewKind, value: string): boolean {
  if (kind === "meaning") {
    return gradeMeaning(value, kanji.meaningsPt);
  }
  if (kind === "writing") {
    return gradeKanjiWriting(value, kanji.character, [
      ...kanji.onReadings,
      ...kanji.kunReadings,
    ]);
  }
  return gradeReading(value, [...kanji.onReadings, ...kanji.kunReadings]);
}

function gradeVocabAnswer(vocab: VocabularyEntry, kind: ReviewKind, value: string): boolean {
  if (kind === "meaning") {
    return gradeMeaning(value, vocab.meaningsPt);
  }
  if (kind === "writing") {
    return gradeVocabWriting(value, vocab.expression, [vocab.reading]);
  }
  return gradeReading(value, [vocab.reading]);
}

export function gradeItem(item: ReviewItem, value: string): boolean {
  return item.type === "kanji"
    ? gradeKanjiAnswer(item.kanji, item.kind, value)
    : gradeVocabAnswer(item.vocab, item.kind, value);
}

export function correctAnswer(item: ReviewItem): string {
  return item.type === "kanji"
    ? correctAnswerForKanji(item.kanji, item.kind)
    : correctAnswerForVocab(item.vocab, item.kind);
}
