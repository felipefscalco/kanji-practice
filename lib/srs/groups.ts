import { SRS_STAGE_BURNED } from "@/lib/srs/intervals";

export type SrsGroupId = 1 | 2 | 3 | 4 | 5;

export interface SrsGroup {
  id: SrsGroupId;
  glyph: string;
  name: string;
  /** CSS custom property with the group color. */
  colorVar: `--color-srs-${SrsGroupId}`;
}

export const SRS_GROUPS: readonly SrsGroup[] = [
  { id: 1, glyph: "種", name: "Semente", colorVar: "--color-srs-1" },
  { id: 2, glyph: "芽", name: "Broto", colorVar: "--color-srs-2" },
  { id: 3, glyph: "葉", name: "Folha", colorVar: "--color-srs-3" },
  { id: 4, glyph: "花", name: "Flor", colorVar: "--color-srs-4" },
  { id: 5, glyph: "実", name: "Fruto", colorVar: "--color-srs-5" },
];

/**
 * Visual grouping of the stored SRS stages (1–8, see intervals.ts):
 * 1–2 (4h, 8h) 種 · 3–4 (1d, 2d) 芽 · 5 (1 sem) 葉 · 6–7 (2 sem, 1 mês) 花 · 8 実.
 * Stages below 1 are items not started yet (lesson pending) and have no group.
 */
export function srsGroup(stage: number): SrsGroup | null {
  if (!Number.isFinite(stage) || stage < 1) {
    return null;
  }
  if (stage <= 2) return SRS_GROUPS[0];
  if (stage <= 4) return SRS_GROUPS[1];
  if (stage === 5) return SRS_GROUPS[2];
  if (stage < SRS_STAGE_BURNED) return SRS_GROUPS[3];
  return SRS_GROUPS[4];
}
