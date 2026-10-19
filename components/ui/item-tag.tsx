import { cx } from "@/components/ui/cx";

export type ItemType = "kanji" | "vocab";

const LABEL: Record<ItemType, string> = { kanji: "Kanji", vocab: "Vocabulário" };

/** "Kanji" / "Vocabulário" pill. `onCard` is the translucent variant used on the colored prompt. */
export function ItemTag({ type, onCard = false }: { type: ItemType; onCard?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex h-[26px] items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold uppercase leading-none tracking-[0.06em] text-white",
        onCard ? "bg-white/16" : type === "kanji" ? "bg-kanji" : "bg-vocab",
      )}
    >
      {LABEL[type]}
    </span>
  );
}
