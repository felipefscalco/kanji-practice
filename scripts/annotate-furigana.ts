/**
 * Fills the `furigana` field of every vocabulary word, splitting its reading per kanji:
 *
 *   pnpm annotate:furigana
 *
 * 調味料 / ちょうみりょう → "{調|ちょう}{味|み}{料|りょう}". Readings come from KANJIDIC
 * (with rendaku and っ); when a run of kanji can't be split, it becomes one group
 * ("{今日|きょう}"), which is shown in kana until all its kanji are learned.
 * Existing `furigana` values are kept, so manual fixes stick. Review the diff before committing.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import KANJIS from "kanjidic2-json";
import * as wanakana from "wanakana";

import { furiganaKanji, furiganaReading, isKanji } from "../lib/furigana";
import type { VocabularyData, VocabularyFile } from "../lib/kanji-types";

import type { KanjiDic2Character } from "kanjidic2-json";

const root = path.resolve(import.meta.dirname, "..");
const byLiteral = new Map((KANJIS as KanjiDic2Character[]).map((k) => [k.literal, k]));

const RENDAKU: Record<string, string> = {
  か: "が", き: "ぎ", く: "ぐ", け: "げ", こ: "ご",
  さ: "ざ", し: "じ", す: "ず", せ: "ぜ", そ: "ぞ",
  た: "だ", ち: "ぢ", つ: "づ", て: "で", と: "ど",
  は: "ば", ひ: "び", ふ: "ぶ", へ: "べ", ほ: "ぼ",
};
const HANDAKU: Record<string, string> = { は: "ぱ", ひ: "ぴ", ふ: "ぷ", へ: "ぺ", ほ: "ぽ" };

const hira = (s: string) => wanakana.toHiragana(s, { passRomaji: true });

function readingsOf(kanji: string): string[] {
  const row = byLiteral.get(kanji);
  if (!row) return [];
  const on = (row.readings?.ja_on ?? []).map(hira);
  const kun = (row.readings?.ja_kun ?? []).flatMap((r) => {
    const clean = r.replace(/^-|-$/g, "");
    const [stem, okuri] = clean.split(".");
    return okuri ? [stem, stem + okuri] : [stem];
  });
  const base = [...new Set([...on, ...kun].map(hira).filter(Boolean))];
  const out = new Set(base);
  for (const r of base) {
    const first = r[0];
    if (RENDAKU[first]) out.add(RENDAKU[first] + r.slice(1));
    if (HANDAKU[first]) out.add(HANDAKU[first] + r.slice(1));
    if (/[つちくき]$/.test(r)) out.add(r.slice(0, -1) + "っ");
    if (r === "じ") out.add("ぢ");
  }
  return [...out].sort((a, b) => b.length - a.length);
}

type Part = { text: string; reading?: string };

/** Splits the reading per kanji; a run of kanji may fall back to one group. */
function align(expression: string, reading: string): Part[] | undefined {
  const chars = [...expression];
  const read = hira(reading);

  function go(i: number, j: number): Part[] | undefined {
    if (i === chars.length) return j === read.length ? [] : undefined;
    const ch = chars[i];
    if (!isKanji(ch)) {
      if (hira(ch) !== read[j]) return undefined;
      const rest = go(i + 1, j + 1);
      return rest && [{ text: ch }, ...rest];
    }
    for (const r of readingsOf(ch)) {
      if (read.startsWith(r, j)) {
        const rest = go(i + 1, j + r.length);
        if (rest) return [{ text: ch, reading: r }, ...rest];
      }
    }
    return undefined;
  }

  const exact = go(0, 0);
  if (exact) return exact;

  // Fallback: each run of kanji is one group, anchored on the kana between runs.
  const pattern = chars
    .map((ch, i) => (isKanji(ch) ? (isKanji(chars[i - 1] ?? "") ? "" : "(.+?)") : escape(hira(ch))))
    .join("");
  const match = new RegExp(`^${pattern}$`, "u").exec(read);
  if (!match) return undefined;
  const parts: Part[] = [];
  let g = 1;
  for (let i = 0; i < chars.length; ) {
    if (isKanji(chars[i])) {
      let k = i;
      while (k < chars.length && isKanji(chars[k])) k++;
      parts.push({ text: chars.slice(i, k).join(""), reading: match[g++] });
      i = k;
    } else {
      parts.push({ text: chars[i] });
      i++;
    }
  }
  return parts;
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toMarkup(parts: Part[]): string {
  return parts.map((p) => (p.reading ? `{${p.text}|${p.reading}}` : p.text)).join("");
}

const failed: string[] = [];
const grouped: string[] = [];

for (const book of ["n5", "n4"]) {
  const dir = path.join(root, `data/kanji-master-${book}`);
  for (const name of readdirSync(dir).filter((f) => /^vocabulary\..+\.json$/.test(f)).sort()) {
    const file = path.join(dir, name);
    const data = JSON.parse(readFileSync(file, "utf8")) as VocabularyFile;
    for (const item of data.items as (VocabularyData & { kanjiIds?: unknown })[]) {
      delete item.kanjiIds; // computed at runtime now (lib/vocabulary.ts)
      if (item.furigana || ![...item.expression].some(isKanji)) continue;
      const parts = align(item.expression, item.reading);
      if (!parts) {
        failed.push(`${item.id} ${item.expression} ${item.reading}`);
        continue;
      }
      const markup = toMarkup(parts);
      if (furiganaKanji(markup) !== item.expression || hira(furiganaReading(markup)) !== hira(item.reading)) {
        failed.push(`${item.id} ${item.expression} ${item.reading} (bad markup ${markup})`);
        continue;
      }
      if (parts.some((p) => p.reading && [...p.text].length > 1)) grouped.push(`${item.expression} → ${markup}`);
      item.furigana = markup;
    }
    writeFileSync(file, formatVocabFile(data));
  }
}

/** One word per line, a blank line between sections (the files' hand-written style). */
function formatVocabFile(data: VocabularyFile): string {
  const lines: string[] = [];
  let section: string | undefined;
  for (const item of data.items) {
    if (section && item.sectionId !== section) lines.push("");
    section = item.sectionId;
    const ordered = {
      id: item.id,
      expression: item.expression,
      reading: item.reading,
      ...(item.furigana ? { furigana: item.furigana } : {}),
      meaningsPt: item.meaningsPt,
      sectionId: item.sectionId,
    };
    const json = JSON.stringify(ordered)
      .replace(/","/g, '", "')
      .replace(/":/g, '": ')
      .replace(/,"/g, ', "')
      .replace(/^\{/, "{ ")
      .replace(/\}$/, " }");
    lines.push(`    ${json}`);
  }
  // Commas after every item but the last; blank lines carry none.
  const last = lines.findLastIndex(Boolean);
  const out = lines.map((l, i) => (l && i !== last ? `${l},` : l));
  return `{\n  "chapterId": ${JSON.stringify(data.chapterId)},\n  "items": [\n${out.join("\n")}\n  ]\n}\n`;
}

console.log(`Grouped (shown in kana until every kanji is learned):\n  ${grouped.join("\n  ") || "none"}`);
if (failed.length > 0) {
  console.error(`Could not align — add "furigana" by hand:\n  ${failed.join("\n  ")}`);
  process.exitCode = 1;
}
