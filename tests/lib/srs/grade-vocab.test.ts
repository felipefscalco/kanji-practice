import { describe, expect, it } from "vitest";

import { gradeVocabWriting } from "@/lib/srs/grade";

describe("gradeVocabWriting", () => {
  it("accepts full expression or reading", () => {
    expect(gradeVocabWriting("毎週", "毎週", ["まいしゅう"])).toBe(true);
    expect(gradeVocabWriting("maishuu", "毎週", ["まいしゅう"])).toBe(true);
    expect(gradeVocabWriting("映画", "映画", ["えいが"])).toBe(true);
    expect(gradeVocabWriting("eiga", "映画", ["えいが"])).toBe(true);
  });
});
