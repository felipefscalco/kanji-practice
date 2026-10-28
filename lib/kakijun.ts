const KAKIJUN_ORIGIN = "https://kakijun.com";

/** Lowercase Unicode code point (e.g. 金 → 91d1). */
export function kakijunCodeHex(character: string): string {
  const code = character.codePointAt(0);
  if (code === undefined) {
    return "";
  }
  return code.toString(16);
}

/** Animated stroke-order GIF from kakijun.com (漢字書き順辞典). */
export function getKakijunStrokeGifUrl(character: string): string | undefined {
  const hex = kakijunCodeHex(character);
  if (!hex) {
    return undefined;
  }
  return `${KAKIJUN_ORIGIN}/kanjiphoto/gif/kanji-kakijun-animation-${hex}.gif`;
}

export function getKakijunKanjiPageUrl(character: string): string | undefined {
  const hex = kakijunCodeHex(character);
  if (!hex) {
    return undefined;
  }
  return `${KAKIJUN_ORIGIN}/c/${hex}.html`;
}
