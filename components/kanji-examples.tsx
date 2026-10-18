import type { KanjiEntry } from "@/lib/kanji-types";
import { toHiraganaReading } from "@/lib/display-readings";
import { getVocabularyForKanji } from "@/lib/vocabulary";

export function KanjiExamples({ kanji }: { kanji: KanjiEntry }) {
  const items = getVocabularyForKanji(kanji.id);
  if (items.length === 0) {
    return (
      <p className="text-sm text-[#888]">
        Nenhuma palavra do livro cadastrada para este kanji ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[#eee] rounded-md border border-[#eee]">
      {items.map((v) => (
        <li key={v.id} className="px-3 py-2.5 first:rounded-t-md last:rounded-b-md">
          <p className="text-lg text-[#222]">
            <span className="font-medium">{v.expression}</span>
            <span className="ml-2 text-base text-[#888]">{toHiraganaReading(v.reading)}</span>
          </p>
          <p className="mt-0.5 text-sm text-[#666]">{v.meaningsPt[0]}</p>
        </li>
      ))}
    </ul>
  );
}
