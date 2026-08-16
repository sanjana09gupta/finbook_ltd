import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reserveSlot, confirmBooking, releaseBooking } from "./repository";

const INPUT = {
  name: "Jordan Fernandez",
  email: "jordan@company.com",
  message: "We need help with bookkeeping.",
  slotStart: "2026-01-12T09:00:00.000Z",
  slotEnd: "2026-01-12T09:30:00.000Z",
};

describe("repository", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "test-secret-key";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reserveSlot returns ok with the new row id on success", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([{ id: "booking-1" }]), { status: 201 }),
    );
    const result = await reserveSlot(INPUT);
    expect(result).toEqual({ ok: true, id: "booking-1" });
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toBe("https://example.supabase.co/rest/v1/bookings");
    expect(init?.method).toBe("POST");
  });

  it("reserveSlot returns a conflict when the slot is already unique-constrained", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("duplicate key value", { status: 409 }));
    const result = await reserveSlot(INPUT);
    expect(result).toEqual({ ok: false, reason: "conflict" });
  });

  it("reserveSlot returns an error on an unexpected status", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("boom", { status: 500 }));
    const result = await reserveSlot(INPUT);
    expect(result).toEqual({ ok: false, reason: "error" });
  });

  it("confirmBooking PATCHes the row to confirmed", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    await confirmBooking("booking-1", "event-1", "https://meet.google.com/abc-defg-hij");
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toBe("https://example.supabase.co/rest/v1/bookings?id=eq.booking-1");
    expect(init?.method).toBe("PATCH");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      status: "confirmed",
      google_event_id: "event-1",
      meet_url: "https://meet.google.com/abc-defg-hij",
    });
  });

  it("confirmBooking logs but does not throw when the PATCH response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("boom", { status: 500 }));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      confirmBooking("booking-1", "event-1", "https://meet.google.com/abc-defg-hij"),
    ).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("booking-1"));
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("500"));
    errorSpy.mockRestore();
  });

  it("releaseBooking DELETEs the row", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    await releaseBooking("booking-1");
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toBe("https://example.supabase.co/rest/v1/bookings?id=eq.booking-1");
    expect(init?.method).toBe("DELETE");
  });
});
