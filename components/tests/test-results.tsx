import { QuestionNumber } from "@/components/tests/test-paper";
import { TestSentence } from "@/components/tests/test-sentence";
import { Button } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";
import type { TestAnswers, TestPaper, TestResult } from "@/lib/tests";

/** Score out of 100 and every question with the learner's answer next to the right one. */
export function TestResults({
  paper,
  answers,
  result,
  onRetake,
  onExit,
}: {
  paper: TestPaper;
  answers: TestAnswers;
  result: TestResult;
  onRetake: () => void;
  onExit: () => void;
}) {
  const readingOk = result.reading.filter(Boolean).length;
  const writingOk = result.writing.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 rounded-[18px] border border-line bg-surface-1 p-6 text-center">
        <p className="m-0 flex items-baseline gap-1">
          <span className="text-[56px] font-bold leading-none tabular-nums text-shu sm:text-[72px]">{result.score}</span>
          <span lang="ja" className="font-jp text-xl text-text-2">
            てん
          </span>
          <span className="sr-only">de {result.maxScore}</span>
        </p>
        <p className="m-0 text-text-2">
          Leitura {readingOk}/{result.reading.length} · Escrita {writingOk}/{result.writing.length}
        </p>
        <div className="mt-3 grid w-full gap-2.5 sm:flex sm:w-auto">
          <Button variant="primary" onClick={onRetake}>
            Refazer com novas questões
          </Button>
          <Button variant="ghost" onClick={onExit}>
            Voltar aos testes
          </Button>
        </div>
      </div>

      <section aria-labelledby="results-reading" className="flex flex-col gap-3">
        <h2 id="results-reading" className="m-0 text-lg font-bold">
          【1】 Leitura
        </h2>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {paper.reading.map((q, i) => (
            <ResultRow
              key={q.id}
              n={i + 1}
              sentence={q.sentence}
              ok={result.reading[i]}
              typed={answers.reading[i]?.trim() || null}
              answer={q.answer}
            />
          ))}
        </ol>
      </section>

      <section aria-labelledby="results-writing" className="flex flex-col gap-3">
        <h2 id="results-writing" className="m-0 text-lg font-bold">
          【2】 Escrita
        </h2>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {paper.writing.map((p, i) => (
            <ResultRow
              key={p.question.id}
              n={i + 1}
              sentence={p.question.sentence}
              ok={result.writing[i]}
              typed={answers.writing[i]}
              answer={p.question.answer}
            />
          ))}
        </ol>
      </section>
    </div>
  );
}

function ResultRow({
  n,
  sentence,
  ok,
  typed,
  answer,
}: {
  n: number;
  sentence: string;
  ok: boolean;
  typed: string | null;
  answer: string;
}) {
  return (
    <li
      className={cx(
        "flex flex-col gap-2 rounded-[14px] border p-4 sm:flex-row sm:items-center sm:gap-6",
        ok ? "border-line bg-surface-1" : "border-err-border bg-err-bg",
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <QuestionNumber n={n} />
        <TestSentence sentence={sentence} className="text-base sm:text-lg" />
      </div>
      <div lang="ja" className="flex items-center gap-3 pl-9 font-jp text-lg sm:pl-0">
        {ok ? (
          <>
            <CheckIcon size={20} className="text-ok" aria-label="Correto" />
            <span>{answer}</span>
          </>
        ) : (
          <>
            <CloseIcon size={20} strokeWidth={3} className="text-err" aria-label="Incorreto" />
            <span className="text-err-ink line-through decoration-err">{typed ?? "—"}</span>
            <span className="font-semibold text-text">{answer}</span>
          </>
        )}
      </div>
    </li>
  );
}
