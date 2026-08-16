import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/booking/turnstile", () => ({ verifyTurnstileToken: vi.fn().mockResolvedValue(true) }));
vi.mock("@/lib/booking/repository", () => ({
  reserveSlot: vi.fn().mockResolvedValue({ ok: true, id: "booking-1" }),
  confirmBooking: vi.fn().mockResolvedValue(undefined),
  releaseBooking: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/booking/google-calendar", () => ({
  getAccessToken: vi.fn().mockResolvedValue("access-123"),
  getBusyPeriods: vi.fn().mockResolvedValue([]),
  createCalendarEvent: vi.fn().mockResolvedValue({ eventId: "event-1", meetUrl: "https://meet.google.com/abc-defg-hij" }),
}));
vi.mock("@/lib/booking/mailer", () => ({ sendOwnerNotification: vi.fn().mockResolvedValue({ ok: true }) }));

import { POST } from "./route";
import { verifyTurnstileToken } from "@/lib/booking/turnstile";
import { reserveSlot, releaseBooking } from "@/lib/booking/repository";
import { createCalendarEvent, getBusyPeriods } from "@/lib/booking/google-calendar";

const VALID_BODY = {
  name: "Jordan Fernandez",
  email: "jordan@company.com",
  message: "We need help with bookkeeping.",
  slotStart: "2026-01-12T09:00:00.000Z",
  slotEnd: "2026-01-12T09:30:00.000Z",
  turnstileToken: "token-123",
};

function requestWith(body: unknown) {
  return new NextRequest("https://example.com/api/booking", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // validateBookingInput defaults `now` to the real clock, so pin it before
    // the fixture date (2026-01-12) to keep the slot from being rejected as past.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => vi.useRealTimers());

  it("returns 400 on invalid input", async () => {
    const res = await POST(requestWith({ ...VALID_BODY, email: "bad" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when Turnstile rejects the token", async () => {
    vi.mocked(verifyTurnstileToken).mockResolvedValueOnce(false);
    const res = await POST(requestWith(VALID_BODY));
    expect(res.status).toBe(400);
  });

  it("returns 409 when the slot is already reserved", async () => {
    vi.mocked(reserveSlot).mockResolvedValueOnce({ ok: false, reason: "conflict" });
    const res = await POST(requestWith(VALID_BODY));
    expect(res.status).toBe(409);
  });

  it("returns 409 and releases the reservation when Google reports the slot became busy", async () => {
    vi.mocked(getBusyPeriods).mockResolvedValueOnce([
      { start: "2026-01-12T09:00:00.000Z", end: "2026-01-12T09:30:00.000Z" },
    ]);
    const res = await POST(requestWith(VALID_BODY));
    expect(res.status).toBe(409);
    expect(releaseBooking).toHaveBeenCalledWith("booking-1");
  });

  it("confirms the booking on the happy path", async () => {
    const res = await POST(requestWith(VALID_BODY));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.meetUrl).toBe("https://meet.google.com/abc-defg-hij");
  });

  it("releases the reservation and returns 502 when calendar event creation fails", async () => {
    vi.mocked(createCalendarEvent).mockRejectedValueOnce(new Error("google down"));
    const res = await POST(requestWith(VALID_BODY));
    expect(res.status).toBe(502);
    expect(releaseBooking).toHaveBeenCalledWith("booking-1");
  });
});
