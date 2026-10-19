import type { KanjiEntry } from "@/lib/kanji-types";
import { KanjiDetailSections } from "@/components/kanji-detail-sections";
import { SessionProgress } from "@/components/ui/session-progress";
import { WkHero, WkTypeBar } from "@/components/wk/wk-hero";
import { WkSessionCard } from "@/components/wk/wk-session-card";

export function KanjiCard({
  kanji,
  index,
  total,
}: {
  kanji: KanjiEntry;
  index: number;
  total: number;
}) {
  return (
    <article className="flex flex-1 flex-col gap-6">
      <SessionProgress current={index} total={total} label="Progresso da lição" />
      <WkSessionCard>
        <WkHero character={kanji.character} mode="lesson" />
        <WkTypeBar mode="lesson" />
        <div className="border-b border-[#ccc] bg-[#e8e8e8] px-4 py-2 text-center text-xs text-[#666]">
          Estude o significado e as leituras antes de marcar como aprendido
        </div>
        <KanjiDetailSections
          kanji={kanji}
          defaultOpenMeaning
          defaultOpenReading
          defaultOpenExamples
        />
      </WkSessionCard>
    </article>
  );
}
