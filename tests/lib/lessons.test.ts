import { describe, expect, it } from "vitest";

import { getKanjiByCharacter } from "@/lib/curriculum";
import { kunReadings, onReadings } from "@/lib/lessons";

describe("kunReadings", () => {
  it("adds okurigana from the book words", () => {
    expect(kunReadings(getKanjiByCharacter("働")!)).toEqual([{ stem: "はたら", okurigana: "く" }]);
    expect(kunReadings(getKanjiByCharacter("作")!)[0]).toEqual({ stem: "つく", okurigana: "る" });
  });

  it("dedupes and drops suffix markers", () => {
    expect(kunReadings(getKanjiByCharacter("毎")!).map((k) => k.stem)).toEqual(["ごと"]);
  });

  it("leaves readings without a matching word as they are", () => {
    expect(kunReadings(getKanjiByCharacter("社")!)).toEqual([{ stem: "やしろ", okurigana: "" }]);
  });
});

describe("onReadings", () => {
  it("shows on'yomi in hiragana", () => {
    expect(onReadings(getKanjiByCharacter("働")!)).toEqual(["どう"]);
  });
});
