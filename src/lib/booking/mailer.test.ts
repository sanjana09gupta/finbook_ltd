import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendOwnerNotification } from "./mailer";

const INPUT = {
  name: "Jordan Fernandez",
  email: "jordan@company.com",
  message: "We need help with bookkeeping.",
  slotStart: "2026-01-12T09:00:00.000Z",
  meetUrl: "https://meet.google.com/abc-defg-hij",
};

describe("sendOwnerNotification", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.BOOKING_FROM_EMAIL = "Finbook Global <onboarding@resend.dev>";
    process.env.BOOKING_OWNER_EMAIL = "owner@example.com";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts to the Resend API with the owner as recipient", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ id: "email-1" }), { status: 200 }));
    const result = await sendOwnerNotification(INPUT);
    expect(result).toEqual({ ok: true });
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toBe("https://api.resend.com/emails");
    const body = JSON.parse(String(init?.body));
    expect(body.to).toEqual(["owner@example.com"]);
    expect(body.from).toBe("Finbook Global <onboarding@resend.dev>");
    expect(body.html).toContain("Jordan Fernandez");
    expect(body.html).toContain("https://meet.google.com/abc-defg-hij");
  });

  it("returns ok:false without throwing when Resend errors", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("boom", { status: 500 }));
    const result = await sendOwnerNotification(INPUT);
    expect(result).toEqual({ ok: false });
  });
});
