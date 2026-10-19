import { cx } from "@/components/ui/cx";

/**
 * 朱 seal. `logo` is the 40px app mark; `stamp` is the tilted 112px seal
 * (完, 済, 休) that animates in on completion screens.
 */
export function Hanko({
  glyph,
  variant = "logo",
  className,
}: {
  glyph: string;
  variant?: "logo" | "stamp";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      lang="ja"
      className={cx(
        "inline-flex shrink-0 items-center justify-center bg-shu-fill font-kanji font-semibold text-[#FFF6EE]",
        variant === "logo"
          ? "size-10 rounded-[9px] text-2xl shadow-[inset_0_0_0_2px_rgba(255,240,230,.35)]"
          : "size-28 animate-stamp rounded-[18px] text-[72px] shadow-[inset_0_0_0_4px_rgba(255,240,230,.35),0_18px_40px_rgba(194,64,31,.25)]",
        className,
      )}
    >
      {glyph}
    </span>
  );
}
