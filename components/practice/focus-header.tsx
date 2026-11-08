import Link from "next/link";

import { CheckIcon, CloseIcon } from "@/components/ui/icons";
import { Kbd } from "@/components/ui/kbd";
import { SessionProgress, type SegmentResult } from "@/components/ui/session-progress";
import type { CycleProgress } from "@/lib/session";

/** Focus-mode header: exit, session progress and ✓/✕ counters. No global nav. */
export function FocusHeader({
  title,
  current,
  total,
  results,
  ok,
  err,
  minutesLeft,
  cycle,
  exitHref = "/",
}: {
  title: string;
  /** 0-based index of the item on screen. */
  current: number;
  total: number;
  results: SegmentResult[];
  ok: number;
  err: number;
  minutesLeft?: number;
  /** Whole-cycle progress, when the practice spans several batches. */
  cycle?: CycleProgress;
  exitHref?: string;
}) {
  const position = Math.min(current + 1, total);
  const left = cycle ? cycle.total - cycle.done : 0;
  const cycleLabel = cycle
    ? `${cycle.done} de ${cycle.total} concluídos · ${left === 0 ? "último item" : `faltam ${left}`}`
    : "";
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 pl-1 pr-2 sm:h-16 sm:gap-6 sm:border-b sm:border-line sm:px-6">
      <Link
        href={exitHref}
        aria-label="Sair da sessão"
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md text-text-2 no-underline transition-colors duration-[var(--dur-fast)] hover:bg-surface-2 hover:text-text sm:px-3 sm:font-semibold"
      >
        <CloseIcon size={20} />
        <span className="hidden sm:inline">Sair</span>
        <Kbd>Esc</Kbd>
      </Link>

      <div className="mx-auto flex min-w-0 flex-1 flex-col gap-2 sm:max-w-[560px]">
        <div className="hidden justify-between text-[13px] text-text-2 sm:flex">
          <span>
            {cycle ? (
              <span className="tabular-nums">
                Sessão {cycle.batch}/{cycle.batches}
              </span>
            ) : (
              title
            )}{" "}
            ·{" "}
            <strong className="text-text tabular-nums">
              {position} de {total}
            </strong>
          </span>
          <span className="tabular-nums">
            {cycle ? cycleLabel : null}
            {cycle && minutesLeft ? " · " : null}
            {minutesLeft ? `~${minutesLeft} min` : null}
            {minutesLeft && !cycle ? " restantes" : null}
          </span>
        </div>
        <SessionProgress total={total} current={current} results={results} />
        {cycle ? (
          <p className="m-0 truncate text-center text-[11px] leading-none text-text-3 tabular-nums sm:hidden">
            {cycle.done}/{cycle.total} concluídos · {left === 0 ? "último" : `faltam ${left}`}
          </p>
        ) : null}
      </div>

      <span className="min-w-10 text-right text-sm font-semibold tabular-nums sm:hidden">
        {position}/{total}
      </span>
      <span className="flex gap-2 pr-1 text-[13px] tabular-nums sm:gap-4 sm:pr-0 sm:text-[15px]">
        <span aria-label={`${ok} ${ok === 1 ? "correta" : "corretas"}`} className="flex items-center gap-0.5 text-ok-ink sm:gap-1.5">
          <CheckIcon size={16} className="size-3.5 sm:size-4" />
          {ok}
        </span>
        <span aria-label={`${err} ${err === 1 ? "incorreta" : "incorretas"}`} className="flex items-center gap-0.5 text-err-ink sm:gap-1.5">
          <CloseIcon size={16} strokeWidth={2.5} className="size-3.5 sm:size-4" />
          {err}
        </span>
      </span>
    </header>
  );
}
