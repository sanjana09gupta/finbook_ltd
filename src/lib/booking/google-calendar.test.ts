import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAccessToken, getBusyPeriods, createCalendarEvent } from "./google-calendar";

describe("google-calendar", () => {
  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";
    process.env.GOOGLE_REFRESH_TOKEN = "refresh-token";
    process.env.GOOGLE_CALENDAR_ID = "primary";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getAccessToken exchanges the refresh token for an access token", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ access_token: "access-123" }), { status: 200 }),
    );
    const token = await getAccessToken();
    expect(token).toBe("access-123");
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toBe("https://oauth2.googleapis.com/token");
    expect(init?.method).toBe("POST");
  });

  it("getBusyPeriods reads the primary calendar's busy list", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({ calendars: { primary: { busy: [{ start: "2026-01-12T10:00:00Z", end: "2026-01-12T10:30:00Z" }] } } }),
        { status: 200 },
      ),
    );
    const busy = await getBusyPeriods("access-123", "2026-01-12T00:00:00Z", "2026-01-13T00:00:00Z");
    expect(busy).toEqual([{ start: "2026-01-12T10:00:00Z", end: "2026-01-12T10:30:00Z" }]);
  });

  it("createCalendarEvent returns the event id and Meet URL", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "event-1",
          conferenceData: { entryPoints: [{ entryPointType: "video", uri: "https://meet.google.com/abc-defg-hij" }] },
        }),
        { status: 200 },
      ),
    );
    const result = await createCalendarEvent("access-123", {
      summary: "Consultation with Jordan Fernandez",
      description: "Company: -\nPhone: -\n\nWe need help.",
      start: "2026-01-12T09:00:00.000Z",
      end: "2026-01-12T09:30:00.000Z",
      attendeeEmail: "jordan@company.com",
      requestId: "req-1",
    });
    expect(result).toEqual({ eventId: "event-1", meetUrl: "https://meet.google.com/abc-defg-hij" });
    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain("/calendars/primary/events");
    expect(String(url)).toContain("conferenceDataVersion=1");
  });
});
