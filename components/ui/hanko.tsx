import { cx } from "@/components/ui/cx";

/**
 * 朱 seal. `logo` is the app mark (36px mobile, 40px desktop); `stamp` is the tilted 112px seal
 * (完, 済, 休); 88px on mobile that animates in on completion screens.
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
          ? "size-9 rounded-[8px] text-[21px] shadow-[inset_0_0_0_2px_rgba(255,240,230,.35)] sm:size-10 sm:rounded-[9px] sm:text-2xl"
          : "size-[88px] animate-stamp rounded-[16px] text-[56px] shadow-[inset_0_0_0_3px_rgba(255,240,230,.35)] sm:size-28 sm:rounded-[18px] sm:text-[72px] sm:shadow-[inset_0_0_0_4px_rgba(255,240,230,.35),0_18px_40px_rgba(194,64,31,.25)]",
        className,
      )}
    >
      {glyph}
    </span>
  );
}
