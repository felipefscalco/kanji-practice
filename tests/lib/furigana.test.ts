import { describe, expect, it } from "vitest";

import { furiganaKanji, furiganaReading, renderFurigana } from "@/lib/furigana";

describe("furigana markup", () => {
  it("rebuilds the full spelling and the reading", () => {
    expect(furiganaKanji("{取|と}り{皿|ざら}")).toBe("取り皿");
    expect(furiganaReading("{取|と}り{皿|ざら}")).toBe("とりざら");
    expect(furiganaKanji("お{店|みせ}で [映画]を")).toBe("お店で [映画]を");
  });

  it("writes kanji not yet learned in kana, like the book (ちょう味料)", () => {
    const learned = new Set(["味"]);
    expect(renderFurigana("{調|ちょう}{味|み}{料|りょう}", learned)).toBe("ちょう味りょう");
    expect(renderFurigana("{意|い}{味|み}", learned)).toBe("い味");
  });

  it("keeps a multi-kanji group only when every kanji is learned", () => {
    expect(renderFurigana("{今日|きょう}は", new Set(["今"]))).toBe("きょうは");
    expect(renderFurigana("{今日|きょう}は", new Set(["今", "日"]))).toBe("今日は");
  });

  it("leaves text without markup untouched", () => {
    expect(renderFurigana("休みの日は [映画]を", new Set())).toBe("休みの日は [映画]を");
  });
});
