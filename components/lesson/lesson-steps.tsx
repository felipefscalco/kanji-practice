"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import { MnemonicField } from "@/components/mnemonic-field";
import { Button } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { CheckIcon, SpeakerIcon } from "@/components/ui/icons";
import { toHiraganaReading } from "@/lib/display-readings";
import type { KanjiEntry } from "@/lib/kanji-types";
import { kunReadings, onReadings } from "@/lib/lessons";
import { getVocabularyForKanji } from "@/lib/vocabulary";

export const LESSON_STEPS = ["Significado", "Leitura", "Exemplos"] as const;

function Box({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col rounded-lg border border-line bg-surface-1 p-4 sm:p-[22px]", className)}>
      {children}
    </div>
  );
}

/** Step tabs: numbered on desktop, segmented on mobile; visited steps get a ✓. */
export function StepTabs({
  step,
  visited,
  onSelect,
  panelId,
}: {
  step: number;
  visited: boolean[];
  onSelect: (step: number) => void;
  panelId: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Passos da lição"
      className="flex gap-1 rounded-[14px] border border-line bg-surface-1 p-1 sm:gap-2 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
    >
      {LESSON_STEPS.map((label, i) => {
        const selected = i === step;
        const done = visited[i] && !selected;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            id={`${panelId}-tab-${i}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(i)}
            className={cx(
              "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-sm font-semibold leading-none transition-colors duration-[var(--dur-fast)] sm:min-h-[52px] sm:justify-start sm:gap-2.5 sm:rounded-md sm:border sm:px-[18px] sm:text-[15px]",
              selected
                ? "bg-surface-3 text-text sm:border-text sm:bg-surface-2"
                : "text-text-2 hover:text-text sm:border-line",
            )}
          >
            <span
              aria-hidden
              className="hidden size-6 items-center justify-center rounded-full border-[1.5px] border-current text-[12.5px] sm:inline-flex"
            >
              {done ? <CheckIcon size={13} strokeWidth={3} /> : i + 1}
            </span>
            {done ? <CheckIcon size={14} strokeWidth={3} className="sm:hidden" /> : null}
            <span>
              {!done ? <span className="sm:hidden">{i + 1} · </span> : null}
              {label}
            </span>
            {done ? <span className="sr-only">(visto)</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function MeaningStep({ kanji }: { kanji: KanjiEntry }) {
  const [primary, ...others] = kanji.meaningsPt;
  return (
    <>
      <Box className="gap-2.5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="flex size-7 items-center justify-center rounded-[7px] bg-q-meaning text-[12.5px] font-bold text-[#141210]">
            Aa
          </span>
          <span className="eyebrow">Significado</span>
        </div>
        <strong className="text-[32px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]">{primary ?? "—"}</strong>
        {others.length > 0 ? <span className="text-text-2">Também: {others.join(" · ")}</span> : null}
        {kanji.meaningsEn.length > 0 ? (
          <span className="text-text-2">EN (KANJIDIC): {kanji.meaningsEn.slice(0, 3).join(", ")}</span>
        ) : null}
      </Box>
      {/* TODO(design): "Componentes" (radicals) once the data includes kanji components. */}
      <Box>
        <MnemonicField placeholder={`Ex.: uma história curta ligando ${kanji.character} ao significado…`} />
      </Box>
    </>
  );
}

const noopSubscribe = () => () => {};

function useCanSpeak(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => "speechSynthesis" in window,
    () => false,
  );
}

/** Reads Japanese aloud with the browser's own voice; no audio files. */
function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function ReadingBox({ label, children, say, note }: { label: string; children: ReactNode; say: string; note?: string }) {
  const canSpeak = useCanSpeak();
  return (
    <Box className="flex-row! items-center gap-3.5">
      <div className="flex flex-1 flex-col gap-1">
        <span className="eyebrow">{label}</span>
        <span lang="ja" className="font-jp text-[32px] font-medium tracking-[0.06em]">
          {children}
        </span>
        {note ? <span className="text-[13px] text-text-3">{note}</span> : null}
      </div>
      {canSpeak && say ? (
        <Button className="min-h-11! px-3!" icon={<SpeakerIcon />} aria-label={`Ouvir ${say}`} onClick={() => speak(say)}>
          Ouvir
        </Button>
      ) : null}
    </Box>
  );
}

function ReadingStep({ kanji }: { kanji: KanjiEntry }) {
  const on = onReadings(kanji);
  const kun = kunReadings(kanji);
  const hasOkurigana = kun.some((k) => k.okurigana);
  return (
    <>
      <ReadingBox label="On'yomi · sino-japonesa" say={on.join("、")}>
        {on.length > 0 ? on.join("、") : "—"}
      </ReadingBox>
      <ReadingBox
        label="Kun'yomi · japonesa"
        say={kun.map((k) => k.stem + k.okurigana).join("、")}
        note={hasOkurigana ? "em cinza: okurigana (escrito em kana)" : undefined}
      >
        {kun.length > 0
          ? kun.map((k, i) => (
              <span key={k.stem}>
                {i > 0 ? "、" : ""}
                {k.stem}
                {k.okurigana ? <span className="text-text-3">{k.okurigana}</span> : null}
              </span>
            ))
          : "—"}
      </ReadingBox>
      <div className="flex items-start gap-2.5 rounded-md bg-surface-2 px-3.5 py-3">
        <span aria-hidden lang="ja" className="flex size-[26px] shrink-0 items-center justify-center rounded-[7px] bg-q-reading text-sm font-bold text-[#141210]">
          あ
        </span>
        <span className="text-sm text-text-2">Na revisão de Leitura, qualquer leitura listada em hiragana é aceita.</span>
      </div>
    </>
  );
}

function ExamplesStep({ kanji }: { kanji: KanjiEntry }) {
  const words = getVocabularyForKanji(kanji.id);
  return (
    <Box className="gap-3.5">
      <span className="eyebrow">Palavras do capítulo · {words.length}</span>
      {words.length === 0 ? (
        <p className="m-0 text-sm text-text-3">Nenhuma palavra do livro cadastrada para este kanji ainda.</p>
      ) : (
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
          {words.map((v) => (
            <li key={v.id} className="flex items-baseline gap-3 rounded-md bg-surface-2 px-3.5 py-3">
              <span lang="ja" className="font-kanji text-[26px] font-semibold text-text">
                {v.expression}
              </span>
              <span className="flex min-w-0 flex-col text-sm leading-[1.3]">
                <span lang="ja" className="font-jp tracking-[0.06em] text-text-2">
                  {toHiraganaReading(v.reading)}
                </span>
                <span className="text-text-3">{v.meaningsPt[0]}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export function StepPanel({ kanji, step, id }: { kanji: KanjiEntry; step: number; id: string }) {
  return (
    <div role="tabpanel" id={id} aria-labelledby={`${id}-tab-${step}`} className="flex flex-col gap-2.5 sm:gap-4">
      {step === 0 ? <MeaningStep kanji={kanji} /> : step === 1 ? <ReadingStep kanji={kanji} /> : <ExamplesStep kanji={kanji} />}
    </div>
  );
}
