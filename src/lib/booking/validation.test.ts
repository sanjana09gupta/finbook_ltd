import { describe, it, expect } from "vitest";
import { validateBookingInput, type BookingInput } from "./validation";

const LONDON = "Europe/London";
const NOW = new Date("2026-01-01T00:00:00.000Z");

function baseInput(overrides: Partial<BookingInput> = {}): BookingInput {
  return {
    name: "Jordan Fernandez",
    email: "jordan@company.com",
    message: "We need help with bookkeeping.",
    slotStart: "2026-01-12T09:00:00.000Z",
    slotEnd: "2026-01-12T09:30:00.000Z",
    turnstileToken: "token-123",
    ...overrides,
  };
}

describe("validateBookingInput", () => {
  it("accepts a well-formed weekday business-hours slot", () => {
    const result = validateBookingInput(baseInput(), { timeZone: LONDON, now: NOW });
    expect(result.valid).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = validateBookingInput(baseInput({ name: "" }), { timeZone: LONDON, now: NOW });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.name).toBeDefined();
  });

  it("rejects an invalid email", () => {
    const result = validateBookingInput(baseInput({ email: "not-an-email" }), { timeZone: LONDON, now: NOW });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.email).toBeDefined();
  });

  it("rejects a slot that isn't exactly 30 minutes", () => {
    const result = validateBookingInput(
      baseInput({ slotEnd: "2026-01-12T10:00:00.000Z" }),
      { timeZone: LONDON, now: NOW },
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.slotStart).toBeDefined();
  });

  it("rejects a slot outside business hours", () => {
    const result = validateBookingInput(
      baseInput({ slotStart: "2026-01-12T07:00:00.000Z", slotEnd: "2026-01-12T07:30:00.000Z" }),
      { timeZone: LONDON, now: NOW },
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.slotStart).toBeDefined();
  });

  it("rejects a slot on a weekend", () => {
    const result = validateBookingInput(
      baseInput({ slotStart: "2026-01-17T10:00:00.000Z", slotEnd: "2026-01-17T10:30:00.000Z" }),
      { timeZone: LONDON, now: NOW },
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.slotStart).toBeDefined();
  });

  it("rejects a slot in the past", () => {
    const result = validateBookingInput(
      baseInput({ slotStart: "2025-01-12T09:00:00.000Z", slotEnd: "2025-01-12T09:30:00.000Z" }),
      { timeZone: LONDON, now: NOW },
    );
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.slotStart).toBeDefined();
  });

  it("rejects a filled-in honeypot field", () => {
    const result = validateBookingInput(baseInput({ honeypot: "spam" }), { timeZone: LONDON, now: NOW });
    expect(result.valid).toBe(false);
  });

  it("rejects an overlong message", () => {
    const result = validateBookingInput(baseInput({ message: "x".repeat(5001) }), { timeZone: LONDON, now: NOW });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors.message).toBeDefined();
  });
});
