import { cx } from "@/components/ui/cx";
import { ItemTag } from "@/components/ui/item-tag";
import { getSectionById, getSectionForKanji } from "@/lib/curriculum";
import type { ReviewItem } from "@/lib/review-session";

export function sectionLabel(item: ReviewItem): string | undefined {
  const section =
    item.type === "kanji" ? getSectionForKanji(item.kanji.id) : getSectionById(item.vocab.sectionId);
  return section?.titleJa;
}

/** What the prompt shows: the item itself, or its meaning when the question is "write it". */
function promptText(item: ReviewItem): { text: string; ja: boolean } {
  if (item.kind === "writing") {
    const meanings = item.type === "kanji" ? item.kanji.meaningsPt : item.vocab.meaningsPt;
    return { text: meanings[0] ?? "—", ja: false };
  }
  return { text: item.type === "kanji" ? item.kanji.character : item.vocab.expression, ja: true };
}

/** Colored prompt area: item type color, tag, subsection, kanji or word. */
export function PromptHero({ item, compact }: { item: ReviewItem; compact: boolean }) {
  const { text, ja } = promptText(item);
  const section = sectionLabel(item);
  const single = ja && item.type === "kanji";
  const long = !ja && text.length > 14;

  return (
    <div
      className={cx(
        "relative flex items-center justify-center px-4 text-white transition-[height] duration-[var(--dur-base)] ease-[var(--ease-out)]",
        item.type === "kanji" ? "bg-kanji" : "bg-vocab",
        compact ? "h-[140px] sm:h-[200px]" : "h-[196px] sm:h-[300px]",
      )}
    >
      <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between sm:inset-x-5 sm:top-5">
        <ItemTag type={item.type} onCard />
        {section ? (
          <span lang="ja" className="text-[13px] text-white/88 sm:text-sm">
            {section}
          </span>
        ) : null}
      </div>
      <span
        lang={ja ? "ja" : "pt-BR"}
        className={cx(
          "max-w-full text-center leading-none",
          ja ? "font-kanji font-semibold" : "font-ui font-semibold tracking-[-0.01em]",
          compact && "mt-[18px] sm:mt-0",
          single
            ? compact
              ? "text-[84px] sm:text-[120px]"
              : "text-[120px] sm:text-[168px]"
            : ja
              ? compact
                ? "text-4xl sm:text-5xl"
                : "text-[44px] sm:text-[60px]"
              : long
                ? "text-[30px] sm:text-[44px]"
                : "text-[42px] sm:text-[60px]",
        )}
      >
        {text}
      </span>
    </div>
  );
}
