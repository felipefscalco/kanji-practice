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

  it("maps chapter 6 kanji to book scan", () => {
    expect(getBookPageImageUrl("研")).toBe("/kanji-master-n4/ch06/page-02.jpeg");
    expect(getBookPageForKanji("文")?.bookPage).toBe(134);
    expect(getBookPageForKanji("心")?.bookPage).toBe(136);
    expect(getReviewPagesForSection("ch-06-s04")[0]?.bookPage).toBe(137);
  });

  it("maps chapter 6 lessons 6-2 and 6-3 kanji to book scans", () => {
    expect(getBookPageImageUrl("若")).toBe("/kanji-master-n4/ch06/page-08.jpeg");
    expect(getBookPageForKanji("楽")?.bookPage).toBe(142);
    expect(getBookPageForKanji("油")?.bookPage).toBe(145);
    expect(getBookPageForKanji("麦")?.bookPage).toBe(148);
    expect(getReviewPagesForSection("ch-06-s08")[0]?.bookPage).toBe(143);
    expect(getReviewPagesForSection("ch-06-s12")[0]?.bookPage).toBe(149);
  });

  it("maps chapter 7 kanji to book scans", () => {
    expect(getBookPageImageUrl("春")).toBe("/kanji-master-n4/ch07/page-02.jpeg");
    expect(getBookPageForKanji("去")?.bookPage).toBe(158);
    expect(getBookPageForKanji("晴")?.bookPage).toBe(161);
    expect(getBookPageForKanji("寒")?.bookPage).toBe(164);
    expect(getReviewPagesForSection("ch-07-s04")[0]?.bookPage).toBe(159);
    expect(getReviewPagesForSection("ch-07-s08")[0]?.bookPage).toBe(165);
    expect(getBookPageForKanji("船")?.bookPage).toBe(170);
    expect(getReviewPagesForSection("ch-07-s12")[0]?.bookPage).toBe(171);
  });

  it("maps fukushuu scan to any section in the same book lesson", () => {
    const review = getReviewPagesForSection("ch-05-s12")[0];
    expect(review?.kind).toBe("review");
    expect(review?.bookPage).toBe(115);
    expect(review?.file).toBe("/kanji-master-n4/ch05/page-04.jpeg");
    expect(review?.kanji).toEqual([]);
  });
});
