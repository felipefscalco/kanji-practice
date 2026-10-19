"use client";

import type { ReactNode } from "react";

import { Accordion } from "@/components/ui/accordion";
import { Tabs } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-client-env";
import { getKanjiByCharacter, getSectionForKanji } from "@/lib/curriculum";
import { toHiraganaReading } from "@/lib/display-readings";
import type { KanjiEntry, VocabularyEntry } from "@/lib/kanji-types";
import type { ReviewItem } from "@/lib/review-session";
import { getVocabularyForKanji } from "@/lib/vocabulary";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="eyebrow">{label}</span>
      {children}
    </div>
  );
}

function Meanings({ meanings, en }: { meanings: string[]; en?: string[] }) {
  const extra = [
    meanings.length > 1 ? `Também aceito: ${meanings.slice(1).join(" · ")}` : null,
    en && en.length > 0 ? `EN ${en.slice(0, 3).join(", ")}` : null,
  ].filter(Boolean);
  return (
    <Field label="Significado">
      <strong className="text-xl text-text">{meanings[0] ?? "—"}</strong>
      {extra.length > 0 ? <span className="text-sm text-text-2">{extra.join(" · ")}</span> : null}
    </Field>
  );
}

function Readings({ kanji }: { kanji: KanjiEntry }) {
  const on = kanji.onReadings.map(toHiraganaReading);
  const kun = [...new Set(kanji.kunReadings.map(toHiraganaReading))];
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="On'yomi">
        <span lang="ja" className="font-jp text-lg tracking-[0.06em] text-text-2">
          {on.length > 0 ? on.join("、") : "—"}
        </span>
      </Field>
      <Field label="Kun'yomi">
        <span lang="ja" className="font-jp text-lg tracking-[0.06em] text-text-2">
          {kun.length > 0 ? kun.join("、") : "—"}
        </span>
      </Field>
    </div>
  );
}

function KanjiChip({ character }: { character: string }) {
  const kanji = getKanjiByCharacter(character);
  const section = kanji ? getSectionForKanji(kanji.id)?.titleJa.split(" ")[0] : undefined;
  return (
    <div className="flex flex-1 items-center gap-2.5 rounded-md bg-surface-2 px-3 py-2.5">
      <span lang="ja" className={`font-kanji text-[30px] font-semibold ${kanji ? "text-kanji-ink" : "text-text"}`}>
        {character}
      </span>
      <span className="text-[13px] leading-[1.3] text-text-2">
        {kanji ? (
          <>
            {kanji.meaningsPt[0]}
            <br />
          </>
        ) : null}
        <span className="text-text-3">{section ?? "fora do cap. 4"}</span>
      </span>
    </div>
  );
}

function WordList({ words }: { words: VocabularyEntry[] }) {
  if (words.length === 0) {
    return <p className="text-sm text-text-3">Nenhuma palavra do livro cadastrada para este kanji ainda.</p>;
  }
  return (
    <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
      {words.map((v) => (
        <li key={v.id} className="flex items-baseline gap-3 rounded-md bg-surface-2 px-3 py-2.5">
          <span lang="ja" className="font-kanji text-2xl font-semibold text-text">
            {v.expression}
          </span>
          <span className="flex min-w-0 flex-col text-[13px] leading-[1.3]">
            <span lang="ja" className="font-jp text-text-2">
              {toHiraganaReading(v.reading)}
            </span>
            <span className="text-text-3">{v.meaningsPt[0]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Mnemonic() {
  // TODO(design): persist the learner's mnemonic with the item once there is per-item storage.
  return (
    <div className="flex flex-col gap-2">
      <label className="eyebrow" htmlFor="mnemonic">
        Seu mnemônico
      </label>
      <textarea
        id="mnemonic"
        rows={3}
        placeholder="Uma imagem ou história que ajude a lembrar…"
        className="w-full resize-y rounded-md border border-line-strong bg-surface-2 p-3 text-base text-text placeholder:text-text-3"
      />
      <span className="text-[12.5px] text-text-3">Ainda não fica salvo entre sessões.</span>
    </div>
  );
}

function sections(item: ReviewItem): Array<{ id: string; title: string; content: ReactNode }> {
  if (item.type === "vocab") {
    const chars = [...item.vocab.expression].filter((ch) => /\p{Script=Han}/u.test(ch));
    const kanji = chars.map((ch) => getKanjiByCharacter(ch)).filter((k): k is KanjiEntry => !!k);
    return [
      {
        id: "word",
        title: "Palavra",
        content: (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Meanings meanings={item.vocab.meaningsPt} />
              <Field label="Leitura">
                <span lang="ja" className="font-jp text-lg tracking-[0.06em] text-text-2">
                  {toHiraganaReading(item.vocab.reading)}
                </span>
              </Field>
            </div>
            <Field label="Kanji desta palavra">
              <div className="flex gap-2">
                {chars.map((ch, i) => (
                  <KanjiChip key={`${ch}-${i}`} character={ch} />
                ))}
              </div>
            </Field>
          </div>
        ),
      },
      {
        id: "kanji",
        title: `Kanji (${kanji.length})`,
        content: (
          <div className="flex flex-col gap-5">
            {kanji.map((k) => (
              <div key={k.id} className="flex gap-4">
                <span lang="ja" className="font-kanji text-5xl font-semibold leading-none text-kanji-ink">
                  {k.character}
                </span>
                <div className="flex flex-1 flex-col gap-3">
                  <Meanings meanings={k.meaningsPt} />
                  <Readings kanji={k} />
                </div>
              </div>
            ))}
            {kanji.length === 0 ? <p className="text-sm text-text-3">Os kanji desta palavra não estão no capítulo 4.</p> : null}
          </div>
        ),
      },
      { id: "mnemonic", title: "Meu mnemônico", content: <Mnemonic /> },
    ];
  }
  const words = getVocabularyForKanji(item.kanji.id);
  return [
    {
      id: "kanji",
      title: "Kanji",
      content: (
        <div className="grid gap-6 sm:grid-cols-2">
          <Meanings meanings={item.kanji.meaningsPt} en={item.kanji.meaningsEn} />
          <Readings kanji={item.kanji} />
        </div>
      ),
    },
    { id: "words", title: `Palavras (${words.length})`, content: <WordList words={words} /> },
    { id: "mnemonic", title: "Meu mnemônico", content: <Mnemonic /> },
  ];
}

/** Item details after answering: tabs on desktop, accordion on mobile (first open). */
export function ItemDetails({ item, id }: { item: ReviewItem; id: string }) {
  const wide = useMediaQuery("(min-width: 640px)");
  const items = sections(item);
  return (
    <div id={id} className="border-t border-line">
      {wide ? (
        <Tabs items={items.map((s) => ({ id: s.id, label: s.title, content: s.content }))} label="Detalhes do item" />
      ) : (
        <Accordion items={items.map((s) => ({ id: s.id, title: s.title, content: s.content }))} />
      )}
    </div>
  );
}
