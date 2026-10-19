import type { ReviewKind } from "@/lib/review-session";

/** WaniKani: kanji reviews use pink; reading uses the same item color with a different prompt. */
export function WkHero({
  character,
  mode = "review",
}: {
  character: string;
  kind?: ReviewKind;
  mode?: "lesson" | "review";
}) {
  const bg = mode === "lesson" ? "bg-[var(--wk-pink)]" : "bg-[var(--wk-pink)]";

  const sizeClass =
    character.length > 5 ? "text-4xl sm:text-5xl" : character.length > 3 ? "text-5xl sm:text-6xl" : "text-7xl sm:text-8xl";

  return (
    <div className={`${bg} px-4 py-16 text-center sm:py-20`}>
      <p className={`${sizeClass} font-normal text-white`}>{character}</p>
    </div>
  );
}

export function WkTypeBar({
  kind,
  mode = "review",
  subjectType = "kanji",
}: {
  kind?: ReviewKind;
  mode?: "lesson" | "review";
  subjectType?: "kanji" | "vocab";
}) {
  const label = subjectType === "vocab" ? "Vocabulário" : "Kanji";
  if (mode === "lesson") {
    return (
      <div className="bg-[#e0e0e0] px-4 py-2.5 text-center text-sm text-[#999]">
        Kanji · <span className="font-bold text-[#777]">Lição</span>
      </div>
    );
  }

  if (kind === "reading") {
    return (
      <div className="bg-[#e0e0e0] px-4 py-2.5 text-center text-sm text-[#999]">
        {label} · <span className="font-bold text-[#777]">Leitura</span>
      </div>
    );
  }

  if (kind === "writing") {
    return (
      <div className="bg-[#e0e0e0] px-4 py-2.5 text-center text-sm text-[#999]">
        {label} · <span className="font-bold text-[#777]">Escrita</span>
      </div>
    );
  }

  return (
    <div className="bg-[#e0e0e0] px-4 py-2.5 text-center text-sm text-[#999]">
      {label} · <span className="font-bold text-[#777]">Significado</span>
    </div>
  );
}
