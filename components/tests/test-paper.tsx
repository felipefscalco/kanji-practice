"use client";

import { useState, type FormEvent } from "react";
import * as wanakana from "wanakana";

import { TestSentence } from "@/components/tests/test-sentence";
import { Button } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import type { TestAnswers, TestPaper } from "@/lib/tests";

/** The test as one page, like the paper: 【1】 type readings, 【2】 pick the kanji. No feedback until it is handed in. */
export function TestPaperForm({ paper, onSubmit }: { paper: TestPaper; onSubmit: (answers: TestAnswers) => void }) {
  const [reading, setReading] = useState(() => paper.reading.map(() => ""));
  const [writing, setWriting] = useState<(string | null)[]>(() => paper.writing.map(() => null));
  const blanks = reading.filter((a) => a.trim() === "").length + writing.filter((a) => a === null).length;

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ reading, writing });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8 sm:gap-10">
      <section aria-labelledby="test-reading" className="flex flex-col gap-4">
        <SectionTitle id="test-reading" number={1} text="の よみかたを ひらがなで かいてください。" />
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {paper.reading.map((q, i) => (
            <li key={q.id} className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface-1 p-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex min-w-0 flex-1 gap-3">
                <QuestionNumber n={i + 1} />
                <TestSentence sentence={q.sentence} />
              </div>
              <KanaInput
                label={`Leitura da questão ${i + 1}`}
                value={reading[i]}
                onChange={(value) => setReading((r) => r.map((a, j) => (j === i ? value : a)))}
              />
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="test-writing" className="flex flex-col gap-4">
        <SectionTitle id="test-writing" number={2} text="の かんじを えらんでください。" />
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {paper.writing.map((prompt, i) => (
            <li key={prompt.question.id} className="flex flex-col gap-3 rounded-[14px] border border-line bg-surface-1 p-4">
              <div className="flex gap-3">
                <QuestionNumber n={i + 1} />
                <TestSentence sentence={prompt.question.sentence} />
              </div>
              <fieldset className="m-0 grid grid-cols-2 gap-2 border-0 p-0 sm:grid-cols-4">
                <legend className="sr-only">Escrita da questão {i + 1}</legend>
                {prompt.options.map((option) => {
                  const checked = writing[i] === option;
                  return (
                    <label
                      key={option}
                      className={cx(
                        "flex min-h-12 cursor-pointer items-center justify-center rounded-[10px] border-2 px-3 font-kanji text-xl font-semibold transition-colors duration-[var(--dur-fast)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text",
                        checked ? "border-text bg-surface-3 text-text" : "border-line bg-surface-2 text-text-2 hover:border-text-3",
                      )}
                    >
                      <input
                        type="radio"
                        name={prompt.question.id}
                        value={option}
                        checked={checked}
                        onChange={() => setWriting((w) => w.map((a, j) => (j === i ? option : a)))}
                        className="sr-only"
                      />
                      <span lang="ja">{option}</span>
                    </label>
                  );
                })}
              </fieldset>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        {blanks > 0 ? (
          <p className="m-0 text-center text-sm text-text-2 sm:text-right">
            {blanks} {blanks === 1 ? "questão em branco" : "questões em branco"}
          </p>
        ) : null}
        <Button type="submit" variant="primary">
          Entregar teste
        </Button>
      </div>
    </form>
  );
}

function SectionTitle({ id, number, text }: { id: string; number: number; text: string }) {
  return (
    <h2 id={id} lang="ja" className="m-0 font-jp text-lg font-semibold sm:text-xl">
      【{number}】<span className="inline-block w-14 border-b-2 border-text align-[-2px]" aria-hidden /> {text}
    </h2>
  );
}

export function QuestionNumber({ n }: { n: number }) {
  return <span className="w-6 shrink-0 pt-[0.35em] text-right font-semibold tabular-nums text-text-2">{n}.</span>;
}

/** Romaji becomes hiragana as you type; IME composition is left alone. */
function KanaInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [composing, setComposing] = useState(false);
  const convert = (next: string) => onChange(wanakana.toHiragana(next, { IMEMode: true }));
  return (
    <input
      value={value}
      onChange={(e) => (composing ? onChange(e.target.value) : convert(e.target.value))}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={(e) => {
        setComposing(false);
        convert(e.currentTarget.value);
      }}
      onKeyDown={(e) => {
        // Enter must not hand in the whole test.
        if (e.key === "Enter") e.preventDefault();
      }}
      placeholder="ひらがな"
      aria-label={label}
      lang="ja"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      className="h-12 w-full rounded-[10px] border-2 border-line-strong bg-surface-2 px-3 text-center font-jp text-xl text-text outline-none transition-colors duration-[var(--dur-fast)] placeholder:font-ui placeholder:text-base placeholder:text-text-3 focus:border-text sm:w-56"
    />
  );
}
