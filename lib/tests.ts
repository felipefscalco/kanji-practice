import * as wanakana from "wanakana";

import testsCh04 from "@/data/kanji-master-n4/tests.ch04.json";
import testsCh05 from "@/data/kanji-master-n4/tests.ch05.json";

/** "class" = transcribed from a real class test; "generated" = written by scripts/generate-tests.ts. */
export type TestSource = "class" | "generated";

/** Sentences mark the underlined part with brackets: "休みの日は よく [映画]を 見に 行きます。" */
export interface ReadingQuestion {
  id: string;
  sentence: string;
  /** Hiragana reading of the bracketed kanji. */
  answer: string;
  source: TestSource;
}

export interface WritingQuestion {
  id: string;
  /** The bracketed part is in hiragana. */
  sentence: string;
  /** Kanji spelling, okurigana included. */
  answer: string;
  /** Three wrong spellings shown next to the answer. */
  distractors: string[];
  source: TestSource;
}

export interface ChapterTestFile {
  chapterId: string;
  reading: ReadingQuestion[];
  writing: WritingQuestion[];
}

/** Questions per section, as on the paper test (【1】 reading, 【2】 writing). */
export const QUESTIONS_PER_SECTION = 10;
export const POINTS_PER_QUESTION = 5;

const files = [testsCh04, testsCh05] as ChapterTestFile[];

export function getChapterTest(chapterId: string): ChapterTestFile | undefined {
  return files.find((f) => f.chapterId === chapterId);
}

export function getTestChapterIds(): string[] {
  return files.map((f) => f.chapterId);
}

export interface SentenceParts {
  before: string;
  target: string;
  after: string;
}

export function parseSentence(sentence: string): SentenceParts {
  const match = /^(.*?)\[(.+?)\](.*)$/u.exec(sentence);
  if (!match) {
    return { before: sentence, target: "", after: "" };
  }
  return { before: match[1], target: match[2], after: match[3] };
}

export interface WritingPrompt {
  question: WritingQuestion;
  /** Answer and distractors in shuffled order. */
  options: string[];
}

export interface TestPaper {
  chapterId: string;
  reading: ReadingQuestion[];
  writing: WritingPrompt[];
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A fresh paper: up to 10 random questions per section, options shuffled. */
export function buildTest(chapterId: string, random: () => number = Math.random): TestPaper | undefined {
  const file = getChapterTest(chapterId);
  if (!file) {
    return undefined;
  }
  return {
    chapterId,
    reading: shuffle(file.reading, random).slice(0, QUESTIONS_PER_SECTION),
    writing: shuffle(file.writing, random)
      .slice(0, QUESTIONS_PER_SECTION)
      .map((question) => ({ question, options: shuffle([question.answer, ...question.distractors], random) })),
  };
}

function normalizeKana(text: string): string {
  // Leftover romaji ("n") and katakana both become hiragana.
  return wanakana.toHiragana(text.normalize("NFKC").replace(/\s+/gu, ""));
}

export function isReadingCorrect(typed: string, answer: string): boolean {
  const normalized = normalizeKana(typed);
  return normalized !== "" && normalized === normalizeKana(answer);
}

export interface TestAnswers {
  reading: string[];
  /** Chosen option per writing prompt; null when left blank. */
  writing: (string | null)[];
}

export interface TestResult {
  score: number;
  maxScore: number;
  reading: boolean[];
  writing: boolean[];
}

export function gradeTest(paper: TestPaper, answers: TestAnswers): TestResult {
  const reading = paper.reading.map((q, i) => isReadingCorrect(answers.reading[i] ?? "", q.answer));
  const writing = paper.writing.map((p, i) => answers.writing[i] === p.question.answer);
  const correct = [...reading, ...writing].filter(Boolean).length;
  return {
    score: correct * POINTS_PER_QUESTION,
    maxScore: (reading.length + writing.length) * POINTS_PER_QUESTION,
    reading,
    writing,
  };
}
