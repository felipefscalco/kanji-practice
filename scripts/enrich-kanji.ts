import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import KANJIS from "kanjidic2-json";

import type { ChaptersFile, KanjiEntry, KanjiId } from "../lib/kanji-types";

import type { KanjiDic2Character } from "kanjidic2-json";

const root = path.resolve(import.meta.dirname, "..");
const chaptersPath = path.join(root, "data/kanji-master-n4/chapters.json");
const overridesPath = path.join(
  root,
  "data/kanji-master-n4/meanings-pt.overrides.json",
);
const outPath = path.join(root, "data/kanji-master-n4/kanji.enriched.json");

const chapters = JSON.parse(readFileSync(chaptersPath, "utf8")) as ChaptersFile;
const overrides = JSON.parse(readFileSync(overridesPath, "utf8")) as Record<
  string,
  string[]
>;

const byLiteral = new Map(
  (KANJIS as KanjiDic2Character[]).map((k) => [k.literal, k]),
);

function kanjiIdFromChar(char: string): KanjiId {
  return `km-n4-${char}` as KanjiId;
}

function charFromKanjiId(id: KanjiId): string {
  return id.replace(/^km-n4-/, "");
}

function cleanKun(kun: string): string {
  return kun.split(".")[0] ?? kun;
}

const ids = new Set<KanjiId>();
for (const chapter of chapters.chapters) {
  for (const section of chapter.sections) {
    for (const id of section.kanjiIds) {
      ids.add(id);
    }
  }
}

const missing: string[] = [];
const entries: KanjiEntry[] = [];

for (const id of ids) {
  const character = charFromKanjiId(id);
  const row = byLiteral.get(character);
  if (!row) {
    missing.push(character);
    continue;
  }
  const meaningsEn = row.meanings?.en ?? [];
  const meaningsPt = overrides[character] ?? meaningsEn;
  entries.push({
    id,
    character,
    meaningsPt,
    meaningsEn,
    onReadings: row.readings?.ja_on ?? [],
    kunReadings: (row.readings?.ja_kun ?? []).map(cleanKun),
    strokeCount: row.strokeCounts?.[0],
    jlpt: row.jlpt,
  });
}

if (missing.length > 0) {
  console.error("Missing from KANJIDIC:", missing.join(", "));
  process.exit(1);
}

entries.sort((a, b) => a.character.localeCompare(b.character, "ja"));
writeFileSync(outPath, `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Wrote ${entries.length} kanji to ${outPath}`);
