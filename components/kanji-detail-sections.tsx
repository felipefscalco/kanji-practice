import type { KanjiEntry } from "@/lib/kanji-types";
import { formatReadingsList, toHiraganaReading } from "@/lib/display-readings";

import { KanjiExamples } from "@/components/kanji-examples";
import { WkAccordion } from "@/components/wk/wk-accordion";
import { getVocabularyForKanji } from "@/lib/vocabulary";

export function KanjiDetailSections({
  kanji,
  defaultOpenMeaning = true,
  defaultOpenReading = true,
  defaultOpenExamples = true,
}: {
  kanji: KanjiEntry;
  defaultOpenMeaning?: boolean;
  defaultOpenReading?: boolean;
  defaultOpenExamples?: boolean;
}) {
  const exampleCount = getVocabularyForKanji(kanji.id).length;
  const primary = kanji.meaningsPt[0] ?? "—";
  const alternatives = kanji.meaningsPt.slice(1);

  return (
    <div className="overflow-hidden rounded-b-lg border border-t-0 border-[#ccc] shadow-sm">
      <WkAccordion title="Meaning" defaultOpen={defaultOpenMeaning}>
        <p className="text-base font-bold text-[#222]">{primary}</p>
        {alternatives.length > 0 ? (
          <p className="mt-2 text-[#666]">
            <span className="font-medium">Alternativas:</span> {alternatives.join(", ")}
          </p>
        ) : null}
        <p className="mt-3 text-[#888]">Tipo: kanji (漢字マスター N4)</p>
        {kanji.meaningsEn.length > 0 ? (
          <p className="mt-3 text-[#666]">
            EN (KANJIDIC): {kanji.meaningsEn.join(", ")}
          </p>
        ) : null}
      </WkAccordion>
      <WkAccordion title="Reading" defaultOpen={defaultOpenReading}>
        <p className="text-lg font-medium text-[#222]">
          {formatReadingsList(kanji.onReadings, kanji.kunReadings)}
        </p>
        {kanji.onReadings.length > 0 ? (
          <p className="mt-3 text-[#666]">
            <span className="font-medium">On:</span>{" "}
            {kanji.onReadings.map((r) => toHiraganaReading(r)).join("、")}
          </p>
        ) : null}
        {kanji.kunReadings.length > 0 ? (
          <p className="mt-2 text-[#666]">
            <span className="font-medium">Kun:</span>{" "}
            {kanji.kunReadings.map((r) => toHiraganaReading(r)).join("、")}
          </p>
        ) : null}
        <p className="mt-3 text-[#888]">
          Na revisão, qualquer leitura listada (on ou kun) em hiragana é aceita.
        </p>
      </WkAccordion>
      <WkAccordion
        title={exampleCount > 0 ? `Examples (${exampleCount})` : "Examples"}
        defaultOpen={defaultOpenExamples}
      >
        <p className="mb-3 text-sm text-[#888]">
          Palavras compostas do capítulo 4 do livro (漢字を書きましょう).
        </p>
        <KanjiExamples kanji={kanji} />
      </WkAccordion>
    </div>
  );
}
