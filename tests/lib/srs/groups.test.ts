import { describe, expect, it } from "vitest";

import { srsGroup } from "@/lib/srs/groups";

describe("srsGroup", () => {
  it("has no group before the lesson", () => {
    expect(srsGroup(0)).toBeNull();
    expect(srsGroup(-1)).toBeNull();
    expect(srsGroup(Number.NaN)).toBeNull();
  });

  it.each([
    [1, "Semente"],
    [2, "Semente"],
    [3, "Broto"],
    [4, "Broto"],
    [5, "Folha"],
    [6, "Flor"],
    [7, "Flor"],
    [8, "Fruto"],
  ])("maps stage %i to %s", (stage, name) => {
    expect(srsGroup(stage)?.name).toBe(name);
  });

  it("keeps stages above the max in the last group", () => {
    expect(srsGroup(9)?.glyph).toBe("実");
  });
});
