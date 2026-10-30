/**
 * Adds generated questions to a chapter's achievement-test pool using the Claude CLI.
 *
 *   pnpm generate:tests ch-04 [count]
 *
 * Appends `count` reading and `count` writing questions (default 20) to
 * data/kanji-master-n4/tests.<chapter>.json. Review the diff before committing.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import * as wanakana from "wanakana";

import type { ChaptersFile, VocabularyFile } from "../lib/kanji-types";
import type { ChapterTestFile, ReadingQuestion, WritingQuestion } from "../lib/tests";

const root = path.resolve(import.meta.dirname, "..");
const dataDir = path.join(root, "data/kanji-master-n4");

const chapterId = process.argv[2];
const count = Number(process.argv[3] ?? 20);
if (!chapterId || !Number.isInteger(count) || count < 1) {
  console.error("Usage: pnpm generate:tests <chapter-id> [count]");
  process.exit(1);
}

const short = chapterId.replace("-", ""); // ch-04 -> ch04
const chapters = JSON.parse(readFileSync(path.join(dataDir, "chapters.json"), "utf8")) as ChaptersFile;
const chapter = chapters.chapters.find((c) => c.id === chapterId);
if (!chapter) {
  console.error(`Unknown chapter: ${chapterId}`);
  process.exit(1);
}
const vocab = JSON.parse(readFileSync(path.join(dataDir, `vocabulary.${short}.json`), "utf8")) as VocabularyFile;
const testPath = path.join(dataDir, `tests.${short}.json`);
const existing: ChapterTestFile = existsSync(testPath)
  ? (JSON.parse(readFileSync(testPath, "utf8")) as ChapterTestFile)
  : { chapterId, reading: [], writing: [] };

const chapterKanji = chapter.sections.flatMap((s) => s.kanjiIds.map((id) => id.replace(/^km-n4-/, "")));

const prompt = `You write questions for a Japanese "Kanji Master N4" chapter achievement test (アチーブメントテスト).
The learner studies with Minna no Nihongo I and II: use only grammar and everyday vocabulary at that level.
Write original sentences (do not copy textbook sentences). Separate phrases with a half-width space, like the class tests.
Kanji outside the list below may appear only if they are N5 level; otherwise write those words in hiragana.

Chapter ${chapter.number} kanji: ${chapterKanji.join(" ")}
Chapter vocabulary (expression = reading):
${vocab.items.map((v) => `${v.expression} = ${v.reading}`).join("\n")}

Existing sentences (do not repeat them or their target words too often):
${[...existing.reading, ...existing.writing].map((q) => q.sentence).join("\n")}

Return ONLY a JSON object, no prose, with this shape:
{
  "reading": [{ "sentence": "休みの日は よく [映画]を 見に 行きます。", "answer": "えいが" }],
  "writing": [{ "sentence": "きのう おいしい ベトナム[りょうり]を 食べました。", "answer": "料理", "distractors": ["科理", "料里", "料埋"] }]
}
Rules:
- Exactly ${count} "reading" and ${count} "writing" items. Every target uses at least one chapter kanji; spread them across all chapter kanji.
- Mark the target with square brackets exactly once per sentence.
- reading: the target is written in kanji (with okurigana if any); "answer" is its full reading in hiragana.
- writing: the target is written in hiragana; "answer" is the correct kanji spelling with okurigana.
- "distractors": 3 wrong spellings a learner could confuse: lookalike kanji (働/動, 始/治), a wrong kanji with the same reading, or wrong okurigana. Each must be wrong in this sentence and different from the answer.`;

console.log(`Asking Claude for ${count}+${count} questions for ${chapterId}…`);
const output = execFileSync("claude", ["-p", prompt, "--output-format", "text", "--tools", ""], {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});
const json = output.slice(output.indexOf("{"), output.lastIndexOf("}") + 1);
const generated = JSON.parse(json) as {
  reading: Omit<ReadingQuestion, "id" | "source">[];
  writing: Omit<WritingQuestion, "id" | "source">[];
};

const seen = new Set([...existing.reading, ...existing.writing].map((q) => q.sentence));
const hasTarget = (s: string) => (s.match(/\[[^\]]+\]/gu) ?? []).length === 1;
const usesChapterKanji = (s: string) => chapterKanji.some((k) => s.includes(k));

function nextId(kind: "r" | "w", list: { id: string }[]): string {
  const max = list.reduce((n, q) => Math.max(n, Number(q.id.split(`-${kind}`)[1]) || 0), 0);
  return `t-${short}-${kind}${String(max + 1).padStart(2, "0")}`;
}

let skipped = 0;
for (const q of generated.reading) {
  const target = /\[(.+?)\]/u.exec(q.sentence)?.[1] ?? "";
  if (seen.has(q.sentence) || !hasTarget(q.sentence) || !usesChapterKanji(target) || !wanakana.isHiragana(q.answer)) {
    skipped++;
    continue;
  }
  seen.add(q.sentence);
  existing.reading.push({ id: nextId("r", existing.reading), sentence: q.sentence, answer: q.answer, source: "generated" });
}
for (const q of generated.writing) {
  const options = new Set([q.answer, ...(q.distractors ?? [])]);
  if (seen.has(q.sentence) || !hasTarget(q.sentence) || !usesChapterKanji(q.answer) || q.distractors?.length !== 3 || options.size !== 4) {
    skipped++;
    continue;
  }
  seen.add(q.sentence);
  existing.writing.push({
    id: nextId("w", existing.writing),
    sentence: q.sentence,
    answer: q.answer,
    distractors: q.distractors,
    source: "generated",
  });
}

const line = (q: object) => `    ${JSON.stringify(q)}`;
writeFileSync(
  testPath,
  `{\n  "chapterId": ${JSON.stringify(chapterId)},\n  "reading": [\n${existing.reading.map(line).join(",\n")}\n  ],\n  "writing": [\n${existing.writing.map(line).join(",\n")}\n  ]\n}\n`,
);
console.log(`Pool now ${existing.reading.length} reading + ${existing.writing.length} writing (${skipped} skipped). Review ${path.relative(root, testPath)}.`);
