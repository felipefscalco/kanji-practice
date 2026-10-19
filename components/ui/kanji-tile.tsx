import { cx } from "@/components/ui/cx";
import { CheckIcon } from "@/components/ui/icons";

/**
 * Selectable kanji: Klee One glyph, reading (first one only on mobile) and, from `sm`, meaning.
 * Selected = 2px kanji-ink border + ✓. `isNew` marks a pending lesson.
 */
export function KanjiTile({
  character,
  reading,
  meaning,
  selected,
  isNew = false,
  stageGlyph,
  label,
  onToggle,
}: {
  character: string;
  reading?: string;
  meaning?: string;
  selected: boolean;
  isNew?: boolean;
  /** SRS group glyph (種…実) shown in the corner. */
  stageGlyph?: string;
  /** Accessible name; defaults to the kanji and its meaning. */
  label?: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label ?? [character, meaning].filter(Boolean).join(", ")}
      onClick={onToggle}
      className={cx(
        "relative flex h-16 w-full flex-col items-center justify-center gap-0.5 rounded-[12px] p-1.5 transition-colors duration-[var(--dur-fast)] sm:h-[116px] sm:w-[104px] sm:rounded-[14px] sm:p-2",
        selected
          ? "border-2 border-kanji-ink bg-kanji/20"
          : "border border-line-strong bg-surface-2 hover:border-text-3",
      )}
    >
      {isNew ? (
        <span className="absolute left-1.5 top-1.5 size-2 rounded-full bg-shu-fill sm:left-[7px] sm:top-[7px] sm:flex sm:size-auto sm:h-[18px] sm:items-center sm:px-1.5 sm:text-[10.5px] sm:font-bold sm:uppercase sm:tracking-[0.04em] sm:text-[#FFF6EE]">
          <span className="hidden sm:inline">novo</span>
        </span>
      ) : stageGlyph ? (
        <span lang="ja" aria-hidden className="absolute left-2 top-[7px] hidden font-kanji text-[13px] text-text-3 sm:block">
          {stageGlyph}
        </span>
      ) : null}
      {selected ? (
        <span
          aria-hidden
          className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-kanji-ink text-bg sm:right-[7px] sm:top-[7px] sm:size-5"
        >
          <CheckIcon size={12} strokeWidth={4} className="size-2.5 sm:size-3" />
        </span>
      ) : null}
      <span
        lang="ja"
        aria-hidden
        className={cx(
          "font-kanji text-[30px] font-semibold leading-[1.05] sm:text-[44px]",
          selected ? "text-text" : "text-text-2",
        )}
      >
        {character}
      </span>
      {reading ? (
        <span lang="ja" aria-hidden className="max-w-full truncate font-jp text-[12.5px] leading-tight text-text-2 sm:text-[13px]">
          <span className="sm:hidden">{reading.split("・")[0]}</span>
          <span className="hidden sm:inline">{reading}</span>
        </span>
      ) : null}
      {meaning ? (
        <span aria-hidden className="hidden max-w-full truncate text-[12.5px] leading-tight text-text-3 sm:block">
          {meaning}
        </span>
      ) : null}
    </button>
  );
}
