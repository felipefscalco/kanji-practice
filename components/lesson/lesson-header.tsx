import Link from "next/link";

import { cx } from "@/components/ui/cx";
import { CloseIcon } from "@/components/ui/icons";
import type { KanjiEntry } from "@/lib/kanji-types";

/** Focus-mode header: exit, the lesson's kanji queue (desktop) or a progress bar (mobile). */
export function LessonHeader({
  queue,
  index,
  onSelect,
}: {
  queue: KanjiEntry[];
  index: number;
  onSelect: (index: number) => void;
}) {
  const position = Math.min(index + 1, queue.length);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 pl-1 pr-3 sm:h-[72px] sm:gap-6 sm:border-b sm:border-line sm:px-6">
      <Link
        href="/"
        aria-label="Sair das lições"
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md text-text-2 no-underline transition-colors duration-[var(--dur-fast)] hover:bg-surface-2 hover:text-text sm:px-3 sm:font-semibold"
      >
        <CloseIcon size={20} />
        <span className="hidden sm:inline">Sair das lições</span>
      </Link>

      <nav aria-label="Kanji desta lição" className="mx-auto hidden items-center gap-2 sm:flex">
        {queue.map((k, i) => (
          <button
            key={k.id}
            type="button"
            lang="ja"
            aria-current={i === index ? "step" : undefined}
            aria-label={`${k.character}, ${k.meaningsPt[0] ?? ""}`}
            onClick={() => onSelect(i)}
            className={cx(
              "inline-flex size-11 items-center justify-center rounded-[10px] border font-kanji text-[22px] font-semibold transition-colors duration-[var(--dur-fast)]",
              i === index
                ? "border-kanji bg-kanji text-white"
                : i < index
                  ? "border-line bg-surface-1 text-text-2 hover:text-text"
                  : "border-line bg-surface-1 text-text-3 hover:text-text",
            )}
          >
            {k.character}
          </button>
        ))}
      </nav>

      <div
        role="progressbar"
        aria-label="Lições"
        aria-valuemin={0}
        aria-valuemax={queue.length}
        aria-valuenow={position}
        className="flex flex-1 gap-1 sm:hidden"
      >
        {queue.map((k, i) => (
          <i key={k.id} className={cx("h-1.5 flex-1 rounded-full", i <= index ? "bg-text" : "bg-surface-3")} />
        ))}
      </div>

      <span className="text-sm font-semibold tabular-nums sm:font-normal sm:text-text-2">
        <span className="sm:hidden">
          {position}/{queue.length}
        </span>
        <span className="hidden sm:inline">
          Lição <strong className="text-text">{position}</strong> de {queue.length}
        </span>
      </span>
    </header>
  );
}
