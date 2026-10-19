import { Button } from "@/components/ui/button";
import { getSectionForKanji } from "@/lib/curriculum";
import type { KanjiEntry } from "@/lib/kanji-types";

const STROKE_FRAMES = 6;

/** The kanji being taught: big card, plus the stroke-order block on desktop. */
export function LessonKanji({ kanji }: { kanji: KanjiEntry }) {
  const section = getSectionForKanji(kanji.id)?.titleJa;
  const strokes = kanji.strokeCount ?? 0;
  return (
    <aside className="flex flex-col gap-4 sm:max-w-[380px] sm:flex-[1_1_320px]">
      <div className="relative flex h-[220px] items-center justify-center rounded-[20px] bg-kanji text-white sm:aspect-square sm:h-auto sm:rounded-xl">
        {/* TODO(design): "Kanji · novo" once lesson progress is tracked. */}
        <span className="absolute left-3.5 top-3.5 flex h-6 items-center rounded-full bg-white/16 px-[9px] text-[11.5px] font-semibold uppercase tracking-[0.06em] sm:left-[18px] sm:top-[18px] sm:h-[26px] sm:px-2.5 sm:text-xs">
          Kanji
        </span>
        {section ? (
          <span lang="ja" className="absolute right-5 top-5 hidden text-sm text-white/88 sm:block">
            {section}
          </span>
        ) : null}
        <span lang="ja" className="font-kanji text-[140px] font-semibold leading-none sm:text-[200px]">
          {kanji.character}
        </span>
        <span className="absolute bottom-3.5 right-4 text-lg font-semibold text-white/92 sm:hidden">
          {kanji.meaningsPt[0]}
        </span>
      </div>

      {/* TODO(design): stroke-order SVG and animation from KanjiVG. */}
      <div className="hidden flex-col gap-3 rounded-lg border border-line bg-surface-1 p-[18px] sm:flex">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Ordem dos traços</span>
          {strokes > 0 ? <span className="text-[13px] text-text-2">{strokes} traços</span> : null}
        </div>
        <div aria-hidden className="flex flex-wrap gap-1.5">
          {Array.from({ length: Math.min(strokes, STROKE_FRAMES) }, (_, i) => (
            <span
              key={i}
              className="flex size-14 items-end justify-end rounded-[10px] border border-dashed border-line-strong p-1 text-[11px] text-text-3"
            >
              {i === STROKE_FRAMES - 1 && strokes > STROKE_FRAMES ? `…${strokes}` : i + 1}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button disabled className="min-h-11! flex-1">
            Animar
          </Button>
          <Button disabled className="min-h-11!">
            Praticar traçado
          </Button>
        </div>
        <span className="text-[12.5px] text-text-3">Animação dos traços em breve.</span>
      </div>
    </aside>
  );
}
