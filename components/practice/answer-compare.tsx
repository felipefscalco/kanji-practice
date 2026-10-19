import { cx } from "@/components/ui/cx";
import { CheckIcon } from "@/components/ui/icons";
import {
  confusionHint,
  describeTyped,
  diffChars,
  type DiffChar,
  type HintPart,
} from "@/lib/answer-feedback";
import { toHiraganaReading } from "@/lib/display-readings";
import type { ReviewItem } from "@/lib/review-session";

function itemText(item: ReviewItem): string {
  return item.type === "kanji" ? item.kanji.character : item.vocab.expression;
}

function itemReadings(item: ReviewItem): string[] {
  const raw = item.type === "kanji" ? [...item.kanji.onReadings, ...item.kanji.kunReadings] : [item.vocab.reading];
  return [...new Set(raw.map(toHiraganaReading))];
}

function itemMeanings(item: ReviewItem): string[] {
  return item.type === "kanji" ? item.kanji.meaningsPt : item.vocab.meaningsPt;
}

function Marked({ chars, tone }: { chars: DiffChar[]; tone: "err" | "ok" }) {
  return (
    <>
      {chars.map((c, i) =>
        c.diff ? (
          <span
            key={i}
            className={cx(
              "underline underline-offset-[7px] sm:underline-offset-8",
              tone === "err"
                ? "decoration-err decoration-wavy decoration-2"
                : "decoration-ok decoration-[3px]",
            )}
          >
            {c.ch}
          </span>
        ) : (
          <span key={i}>{c.ch}</span>
        ),
      )}
    </>
  );
}

function Hint({ parts }: { parts: HintPart[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.ja ? (
          <span key={i} lang="ja" className="font-kanji font-semibold text-text">
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/** "Você escreveu × Resposta correta", with what differs underlined and a confusion tip. */
export function AnswerCompare({
  item,
  typed,
  correct,
}: {
  item: ReviewItem;
  typed: string;
  correct: string;
}) {
  const kind = item.kind;
  const value = typed.trim();
  const showDiff = kind !== "meaning" && value.length > 0;
  const diff = diffChars(value, correct);
  const typedInfo = describeTyped(item, value);
  const hint = value ? confusionHint(item, value, correct) : null;

  const readings = itemReadings(item);
  const meanings = itemMeanings(item);
  const mainClass =
    kind === "writing"
      ? "font-kanji text-[38px] font-semibold leading-[1.1] sm:text-[40px]"
      : kind === "reading"
        ? "font-jp text-[28px] font-medium tracking-[0.06em] sm:text-[30px]"
        : "font-ui text-[22px] font-semibold sm:text-2xl";
  const mainLang = kind === "meaning" ? "pt-BR" : "ja";

  // Secondary line next to the correct answer: what the item is, beyond the asked part.
  const correctSide =
    kind === "writing" ? readings[0] : kind === "reading" ? itemText(item) : `${itemText(item)} · ${readings[0] ?? ""}`;
  const correctLine =
    kind === "meaning"
      ? meanings.length > 1
        ? `Também aceito: ${meanings.slice(1).join(" · ")}`
        : undefined
      : kind === "reading" && readings.length > 1
        ? `${meanings[0]} · também aceito: ${readings.filter((r) => r !== correct).join("、")}`
        : meanings[0];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="hidden flex-col gap-1.5 rounded-[14px] border border-line-strong px-[18px] py-4 sm:flex">
          <span className="eyebrow">Você escreveu</span>
          <div className="flex items-baseline gap-3">
            <span lang={mainLang} className={cx(mainClass, !value && "text-text-3")}>
              {value ? showDiff ? <Marked chars={diff.typed} tone="err" /> : value : "—"}
            </span>
            {typedInfo?.reading && kind !== "reading" ? (
              <span lang="ja" className="font-jp text-lg text-text-2">
                {typedInfo.reading}
              </span>
            ) : null}
          </div>
          <span className="text-[15px] text-text-2">
            {value ? (typedInfo?.meaning ?? "não é uma palavra deste capítulo") : "Você pulou este item"}
          </span>
        </div>

        <div className="flex items-center gap-3.5 rounded-[14px] border-2 border-ok-border bg-ok-bg px-3.5 py-3 sm:flex-col sm:items-stretch sm:gap-1.5 sm:px-[17px] sm:py-[15px]">
          <span className="eyebrow hidden items-center gap-1.5 text-ok-ink sm:flex">
            <CheckIcon size={13} strokeWidth={3} />
            Resposta correta
          </span>
          <div className="flex items-baseline gap-3">
            <span lang={mainLang} className={cx(mainClass, "text-text")}>
              {showDiff ? <Marked chars={diff.correct} tone="ok" /> : correct}
            </span>
            {correctSide ? (
              <span lang="ja" className="hidden font-jp text-lg text-text-2 sm:inline">
                {correctSide}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col leading-[1.3] sm:hidden">
            <span className="eyebrow text-ok-ink">Correta</span>
            {correctSide ? (
              <span lang="ja" className="font-jp text-base text-text-2">
                {correctSide}
              </span>
            ) : null}
            {correctLine ? <span className="text-sm text-text">{correctLine}</span> : null}
          </div>
          {correctLine ? <span className="hidden text-[15px] text-text sm:block">{correctLine}</span> : null}
        </div>
      </div>

      {hint ? (
        <div className="hidden items-center gap-3 rounded-md bg-surface-2 px-4 py-3.5 sm:flex">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-q-meaning)" strokeWidth="2" strokeLinecap="round" aria-hidden className="shrink-0">
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
          </svg>
          <span className="text-[15px] text-text-2">
            <Hint parts={hint} />
          </span>
        </div>
      ) : null}

      <p className="m-0 px-0.5 pt-0.5 text-sm text-text-2 sm:hidden">
        {value ? (
          <>
            Você escreveu{" "}
            <span lang={mainLang} className={cx("text-text", kind === "writing" && "font-kanji font-semibold")}>
              {value}
            </span>
            {typedInfo?.meaning ? ` (${typedInfo.meaning})` : ""}.
          </>
        ) : (
          "Você pulou este item."
        )}
        {hint ? (
          <>
            {" "}
            <Hint parts={hint} />
          </>
        ) : null}
      </p>
    </>
  );
}
