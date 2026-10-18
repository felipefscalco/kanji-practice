import * as wanakana from "wanakana";

export function toHiraganaReading(reading: string): string {
  return wanakana.toHiragana(reading.replace(/\./g, "").normalize("NFKC"));
}

export function formatReadingsList(on: string[], kun: string[]): string {
  const parts = [
    ...on.map((r) => toHiraganaReading(r)),
    ...kun.map((r) => toHiraganaReading(r)),
  ];
  return parts.length ? parts.join("、") : "—";
}
