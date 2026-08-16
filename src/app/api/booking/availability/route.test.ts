import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/booking/google-calendar", () => ({
  getAccessToken: vi.fn().mockResolvedValue("access-123"),
  getBusyPeriods: vi.fn().mockResolvedValue([]),
}));

import { GET } from "./route";
import { getBusyPeriods } from "@/lib/booking/google-calendar";

function requestFor(date: string) {
  return new NextRequest(`https://example.com/api/booking/availability?date=${date}`);
}

describe("GET /api/booking/availability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // route.ts defaults getAvailableSlots' `now` to the real clock, so pin it
    // before the fixture date (2026-01-12) to keep slots from being filtered out.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => vi.useRealTimers());

  it("returns 400 when date is missing", async () => {
    const res = await GET(new NextRequest("https://example.com/api/booking/availability"));
    expect(res.status).toBe(400);
  });

  it("returns 400 when date is malformed", async () => {
    const res = await GET(requestFor("not-a-date"));
    expect(res.status).toBe(400);
  });

  it("returns available slots for a valid weekday", async () => {
    const res = await GET(requestFor("2026-01-12"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slots.length).toBeGreaterThan(0);
    expect(getBusyPeriods).toHaveBeenCalled();
  });

  it("returns 502 when Google Calendar is unreachable", async () => {
    vi.mocked(getBusyPeriods).mockRejectedValueOnce(new Error("network down"));
    const res = await GET(requestFor("2026-01-12"));
    expect(res.status).toBe(502);
  });
});
