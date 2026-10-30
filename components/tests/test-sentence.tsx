import { cx } from "@/components/ui/cx";
import { parseSentence } from "@/lib/tests";

/** A test sentence with its target underlined, as on the paper test. */
export function TestSentence({ sentence, className }: { sentence: string; className?: string }) {
  const { before, target, after } = parseSentence(sentence);
  return (
    <p lang="ja" className={cx("m-0 font-jp text-lg leading-[1.9] sm:text-xl", className)}>
      {before}
      <span className="underline decoration-shu decoration-2 underline-offset-[6px]">{target}</span>
      {after}
    </p>
  );
}
