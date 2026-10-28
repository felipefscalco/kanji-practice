import { describe, expect, it } from "vitest";

import {
  getBookPageForKanji,
  getBookPageImageUrl,
  getReviewPagesForSection,
} from "@/lib/book-pages";

describe("book pages", () => {
  it("maps kanji to book scan", () => {
    const page = getBookPageForKanji("毎");
    expect(page?.bookPage).toBe(87);
    expect(getBookPageImageUrl("毎")).toBe("/kanji-master-n4/ch04/page-01.jpeg");
  });

  it("maps chapter 5 kanji to book scan", () => {
    expect(getBookPageImageUrl("駅")).toBe("/kanji-master-n4/ch05/page-01.jpeg");
    expect(getBookPageForKanji("開")?.bookPage).toBe(113);
    expect(getBookPageImageUrl("発")).toBe("/kanji-master-n4/ch05/page-114.jpeg");
    expect(getBookPageImageUrl("交")).toBe("/kanji-master-n4/ch05/page-06.jpeg");
    expect(getBookPageForKanji("青")?.bookPage).toBe(120);
    expect(getBookPageImageUrl("病")).toBe("/kanji-master-n4/ch05/page-12.jpeg");
    expect(getBookPageForKanji("計")?.bookPage).toBe(126);
  });

  it("maps fukushuu scan to any section in the same book lesson", () => {
    const review = getReviewPagesForSection("ch-05-s12")[0];
    expect(review?.kind).toBe("review");
    expect(review?.bookPage).toBe(115);
    expect(review?.file).toBe("/kanji-master-n4/ch05/page-04.jpeg");
    expect(review?.kanji).toEqual([]);
  });
});
