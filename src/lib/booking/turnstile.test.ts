import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

describe("verifyTurnstileToken", () => {
  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = "secret-key";
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns true when Cloudflare confirms success", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    const result = await verifyTurnstileToken("token-abc");
    expect(result).toBe(true);
  });

  it("returns false when Cloudflare rejects the token", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ success: false }), { status: 200 }));
    const result = await verifyTurnstileToken("token-abc");
    expect(result).toBe(false);
  });

  it("returns false when the request itself fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("boom", { status: 500 }));
    const result = await verifyTurnstileToken("token-abc");
    expect(result).toBe(false);
  });
});
