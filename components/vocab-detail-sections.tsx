import type { VocabularyEntry } from "@/lib/kanji-types";
import { toHiraganaReading } from "@/lib/display-readings";

import { WkAccordion } from "@/components/wk/wk-accordion";

export function VocabDetailSections({ vocab }: { vocab: VocabularyEntry }) {
  const primary = vocab.meaningsPt[0] ?? "—";
  const alternatives = vocab.meaningsPt.slice(1);

  return (
    <div className="overflow-hidden rounded-b-lg border border-t-0 border-[#ccc] shadow-sm">
      <WkAccordion title="Palavra" defaultOpen>
        <p className="text-3xl font-normal text-[#222]">{vocab.expression}</p>
        <p className="mt-2 text-lg text-[#666]">{toHiraganaReading(vocab.reading)}</p>
      </WkAccordion>
      <WkAccordion title="Significado" defaultOpen>
        <p className="text-base font-bold text-[#222]">{primary}</p>
        {alternatives.length > 0 ? (
          <p className="mt-2 text-[#666]">
            <span className="font-medium">Alternativas:</span> {alternatives.join(", ")}
          </p>
        ) : null}
        <p className="mt-3 text-[#888]">Vocabulário · 漢字マスター N4 cap. 4</p>
      </WkAccordion>
    </div>
  );
}
