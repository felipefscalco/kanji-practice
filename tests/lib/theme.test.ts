import { describe, expect, it } from "vitest";

import { resolveTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("follows the system when there is no choice", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
  });

  it("keeps an explicit choice", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });
});
