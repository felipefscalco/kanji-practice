import * as wanakana from "wanakana";

import {
  extractHanCharacters,
  normalizeKanjiForCompare,
} from "@/lib/answer/kanji-input";
import { normalizeAnswer } from "@/lib/answer/normalize";

export function gradeMeaning(input: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(input);
  if (!normalized) {
    return false;
  }
  return accepted.some(
    (a) =>
      normalizeAnswer(a) === normalized ||
      normalizeAnswer(stripParentheticals(a)) === normalized,
  );
}

/** "começar (transitivo)" → "começar": the note in parentheses is optional. */
function stripParentheticals(text: string): string {
  return text.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
}

export function gradeVocabWriting(
  input: string,
  expression: string,
  readings: string[],
): boolean {
  const target = expression.trim().normalize("NFKC");
  const trimmed = input.trim().normalize("NFKC");
  if (trimmed === target) {
    return true;
  }
  const hanIn = extractHanCharacters(input);
  const hanExpr = extractHanCharacters(expression);
  if (hanIn.length > 0 && hanIn === hanExpr && hanExpr.length > 0) {
    return true;
  }
  if (readings.length > 0 && gradeReading(input, readings)) {
    return true;
  }
  return false;
}

export function gradeKanjiWriting(
  input: string,
  character: string,
  readings: string[] = [],
): boolean {
  const target = normalizeKanjiForCompare(character);
  const trimmed = input.trim().normalize("NFKC");
  if (trimmed === target) {
    return true;
  }
  const han = extractHanCharacters(input);
  if (han === target) {
    return true;
  }
  if (han.length > 0 && han.at(-1) === target) {
    return true;
  }
  if (readings.length > 0 && gradeReading(input, readings)) {
    return true;
  }
  return false;
}

/**
 * IME mode keeps a trailing "n" as romaji while typing (it could still become な, に…).
 * When the answer is final, convert it to ん: "kouen" / "こうえn" → "こうえん".
 */
export function finalizeKana(input: string): string {
  return wanakana.toHiragana(wanakana.toHiragana(input, { IMEMode: true }));
}

export function gradeReading(input: string, accepted: string[]): boolean {
  const raw = input.trim().normalize("NFKC").replace(/\s+/g, "");
  const hiragana = finalizeKana(raw);
  if (!hiragana) {
    return false;
  }
  const normalizedAccepted = accepted.map((r) =>
    wanakana.toHiragana(r.replace(/\./g, "").normalize("NFKC"), { IMEMode: true }),
  );
  if (normalizedAccepted.includes(hiragana)) {
    return true;
  }
  return normalizedAccepted.some((a) => hiragana === a || a.startsWith(hiragana));
}
