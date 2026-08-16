import { describe, it, expect } from "vitest";
import { zonedTimeToUtc, weekdayInZone } from "./timezone";

describe("zonedTimeToUtc", () => {
  it("converts a GMT (winter) London time to UTC", () => {
    // Europe/London is UTC+0 in January.
    const d = zonedTimeToUtc("2026-01-12", 9, 0, "Europe/London");
    expect(d.toISOString()).toBe("2026-01-12T09:00:00.000Z");
  });

  it("converts a BST (summer) London time to UTC", () => {
    // Europe/London is UTC+1 in July.
    const d = zonedTimeToUtc("2026-07-13", 9, 0, "Europe/London");
    expect(d.toISOString()).toBe("2026-07-13T08:00:00.000Z");
  });
});

describe("weekdayInZone", () => {
  it("identifies a Monday in Europe/London", () => {
    expect(weekdayInZone("2026-01-12", "Europe/London")).toBe("Mon");
  });

  it("identifies a Saturday in Europe/London", () => {
    expect(weekdayInZone("2026-01-17", "Europe/London")).toBe("Sat");
  });
});
