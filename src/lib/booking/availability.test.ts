import { describe, it, expect } from "vitest";
import { getAvailableSlots } from "./availability";

const LONDON = "Europe/London";

describe("getAvailableSlots", () => {
  it("returns 16 half-hour slots for a full open weekday", () => {
    const slots = getAvailableSlots({
      date: "2026-01-12", // Monday
      timeZone: LONDON,
      busyPeriods: [],
      now: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(slots).toHaveLength(16);
    expect(slots[0]).toEqual({ start: "2026-01-12T09:00:00.000Z", end: "2026-01-12T09:30:00.000Z" });
    expect(slots[15]).toEqual({ start: "2026-01-12T16:30:00.000Z", end: "2026-01-12T17:00:00.000Z" });
  });

  it("returns no slots on a weekend", () => {
    const slots = getAvailableSlots({
      date: "2026-01-17", // Saturday
      timeZone: LONDON,
      busyPeriods: [],
      now: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(slots).toHaveLength(0);
  });

  it("removes slots that overlap a busy period", () => {
    const slots = getAvailableSlots({
      date: "2026-01-12",
      timeZone: LONDON,
      busyPeriods: [{ start: "2026-01-12T10:00:00.000Z", end: "2026-01-12T11:00:00.000Z" }],
      now: new Date("2026-01-01T00:00:00.000Z"),
    });
    expect(slots.find((s) => s.start === "2026-01-12T10:00:00.000Z")).toBeUndefined();
    expect(slots.find((s) => s.start === "2026-01-12T10:30:00.000Z")).toBeUndefined();
    expect(slots.find((s) => s.start === "2026-01-12T09:30:00.000Z")).toBeDefined();
    expect(slots.find((s) => s.start === "2026-01-12T11:00:00.000Z")).toBeDefined();
  });

  it("removes slots that start before now", () => {
    const slots = getAvailableSlots({
      date: "2026-01-12",
      timeZone: LONDON,
      busyPeriods: [],
      now: new Date("2026-01-12T10:15:00.000Z"),
    });
    expect(slots.find((s) => s.start === "2026-01-12T09:00:00.000Z")).toBeUndefined();
    expect(slots.find((s) => s.start === "2026-01-12T10:30:00.000Z")).toBeDefined();
  });
});
