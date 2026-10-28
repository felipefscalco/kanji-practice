import { describe, expect, it } from "vitest";

import { getKakijunKanjiPageUrl, getKakijunStrokeGifUrl, kakijunCodeHex } from "@/lib/kakijun";

describe("kakijun", () => {
  it("builds hex code points", () => {
    expect(kakijunCodeHex("金")).toBe("91d1");
    expect(kakijunCodeHex("駅")).toBe("99c5");
  });

  it("builds stroke gif urls", () => {
    expect(getKakijunStrokeGifUrl("金")).toBe(
      "https://kakijun.com/kanjiphoto/gif/kanji-kakijun-animation-91d1.gif",
    );
  });

  it("builds kanji page urls", () => {
    expect(getKakijunKanjiPageUrl("交")).toBe("https://kakijun.com/c/4ea4.html");
  });
});
