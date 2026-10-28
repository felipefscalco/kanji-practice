import { KanjiStrokeAnimation } from "@/components/kanji-stroke-animation";
import { getSectionForKanji } from "@/lib/curriculum";
import type { KanjiEntry } from "@/lib/kanji-types";

/** The kanji being taught: big card, plus the stroke-order block on desktop. */
export function LessonKanji({ kanji }: { kanji: KanjiEntry }) {
  const section = getSectionForKanji(kanji.id)?.titleJa;
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

      <KanjiStrokeAnimation
        character={kanji.character}
        strokeCount={kanji.strokeCount}
        className="flex flex-col gap-3 rounded-lg border border-line bg-surface-1 p-[18px]"
      />
    </aside>
  );
}
