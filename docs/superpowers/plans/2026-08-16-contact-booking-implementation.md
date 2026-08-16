# Contact Booking with Google Meet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `mailto:` contact form with a self-service booking flow: visitor picks a date, sees real open 30-minute slots from the owner's Google Calendar, books one, and gets a Google Meet invite while the owner gets a Resend notification.

**Architecture:** Two new API routes (`/api/booking/availability`, `/api/booking`) orchestrate four small server-only modules — availability math, Google Calendar (OAuth + freebusy + event creation), a Supabase-backed reservation repository, and Resend mail — all called via plain `fetch`, no vendor SDKs. `ContactForm` becomes a two-stage client component: details → date/slot picker → confirmation.

**Tech Stack:** Next.js 16 App Router route handlers, TypeScript, Supabase Postgres (REST/PostgREST via `fetch`), Google Calendar v3 REST API, Resend REST API, Cloudflare Turnstile. Vitest added as the test runner (none exists today) — this repo has no prior test framework, so Task 1 sets one up and every later task follows the standard TDD cycle.

## Global Constraints

- Business hours: Monday–Friday, 09:00–17:00, `Europe/London`, 30-minute slots, no buffer. (spec §Scope)
- No new runtime dependencies for Google/Resend/Supabase/Turnstile — use `fetch` against their REST APIs. (ponytail: avoid SDKs the project doesn't already use)
- All secrets (`GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) are read only in server-side modules/route handlers, never in client components. (spec §Security)
- `slot_start` has a unique constraint in `bookings`; reservation happens before the Google Calendar call so concurrent requests can't double-book. (spec §Data model)
- Excluded from v1: reschedule/cancel UI, multi-staff calendars, payments, CRM sync. Do not build these. (spec §Excluded)

---

## File Structure

- `vitest.config.ts` — new, test runner config.
- `src/lib/booking/timezone.ts` — new, DST-safe `Europe/London` ⇄ UTC conversion helpers (no deps).
- `src/lib/booking/availability.ts` — new, pure slot-generation logic.
- `src/lib/booking/validation.ts` — new, pure input validation for the booking API.
- `src/lib/booking/google-calendar.ts` — new, server-only Google OAuth token refresh + freebusy + event creation via `fetch`.
- `src/lib/booking/repository.ts` — new, server-only Supabase REST reservation calls via `fetch`.
- `src/lib/booking/mailer.ts` — new, server-only Resend REST call via `fetch`.
- `src/lib/booking/turnstile.ts` — new, server-only Cloudflare Turnstile verification via `fetch`.
- `src/app/api/booking/availability/route.ts` — new, `GET` route handler.
- `src/app/api/booking/route.ts` — new, `POST` route handler.
- `src/app/api/google/authorize/route.ts` — new, one-time OAuth consent redirect (ops tool, not called by the app UI).
- `src/app/api/google/callback/route.ts` — new, one-time OAuth code exchange, prints the refresh token for the owner to copy into `.env`.
- `src/components/forms/ContactForm.tsx` — rewrite, two-stage booking form.
- `supabase/migrations/0001_create_bookings.sql` — new, schema for the Supabase MCP `apply_migration` call.
- `.env.example` — new, documents required variables without values.
- `package.json` — add `vitest` devDependency and a `test` script.

---

### Task 1: Test framework setup

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Test: `src/lib/booking/sanity.test.ts` (deleted at the end of this task once it has proven the runner works)

**Interfaces:**
- Produces: `npm test` runs Vitest once; `npm run test:watch` runs it in watch mode.

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Add config**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Write a throwaway sanity test**

```ts
// src/lib/booking/sanity.test.ts
import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run it**

Run: `npm test`
Expected: 1 passed, `sanity.test.ts` shown as passing.

- [ ] **Step 6: Delete the sanity test and commit**

```bash
rm src/lib/booking/sanity.test.ts
git add vitest.config.ts package.json package-lock.json
git commit -m "test: add Vitest test runner"
```

---

### Task 2: Timezone helpers (`Europe/London` ⇄ UTC, DST-safe)

**Files:**
- Create: `src/lib/booking/timezone.ts`
- Test: `src/lib/booking/timezone.test.ts`

**Interfaces:**
- Produces:
  - `zonedTimeToUtc(dateStr: string, hour: number, minute: number, timeZone: string): Date`
  - `weekdayInZone(dateStr: string, timeZone: string): "Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun"`
- `dateStr` is always `YYYY-MM-DD`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/booking/timezone.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- timezone`
Expected: FAIL — `Cannot find module './timezone'`

- [ ] **Step 3: Implement**

```ts
// src/lib/booking/timezone.ts

/**
 * Returns the UTC offset (in minutes, e.g. +60 for BST) that `timeZone`
 * observes at the instant `utcGuess` represents.
 */
function offsetMinutesAt(utcGuess: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(utcGuess).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (asIfUtc - utcGuess.getTime()) / 60000;
}

/** Converts a wall-clock date/time in `timeZone` to the equivalent UTC instant. */
export function zonedTimeToUtc(dateStr: string, hour: number, minute: number, timeZone: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const naiveUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  // ponytail: single-pass offset correction. Wrong only for the ~1hr DST
  // transition window itself; business hours (9-5) never sit on that boundary.
  const offset = offsetMinutesAt(naiveUtc, timeZone);
  return new Date(naiveUtc.getTime() - offset * 60000);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Weekday of `dateStr` (a calendar date, not an instant) as observed in `timeZone`. */
export function weekdayInZone(dateStr: string, timeZone: string): (typeof WEEKDAYS)[number] {
  const noon = zonedTimeToUtc(dateStr, 12, 0, timeZone);
  const name = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(noon);
  const match = WEEKDAYS.find((w) => name.startsWith(w));
  if (!match) throw new Error(`Unrecognized weekday "${name}"`);
  return match;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- timezone`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/timezone.ts src/lib/booking/timezone.test.ts
git commit -m "feat: add DST-safe Europe/London timezone helpers"
```

---

### Task 3: Availability calculation

**Files:**
- Create: `src/lib/booking/availability.ts`
- Test: `src/lib/booking/availability.test.ts`

**Interfaces:**
- Consumes: `zonedTimeToUtc`, `weekdayInZone` from `./timezone`.
- Produces:
  - `interface BusyPeriod { start: string; end: string }` (ISO strings)
  - `interface Slot { start: string; end: string }` (ISO strings, UTC)
  - `getAvailableSlots(params: { date: string; timeZone: string; busyPeriods: BusyPeriod[]; now?: Date }): Slot[]`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/booking/availability.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- availability`
Expected: FAIL — `Cannot find module './availability'`

- [ ] **Step 3: Implement**

```ts
// src/lib/booking/availability.ts
import { weekdayInZone, zonedTimeToUtc } from "./timezone";

export interface BusyPeriod {
  start: string;
  end: string;
}

export interface Slot {
  start: string;
  end: string;
}

const SLOT_MINUTES = 30;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;
const OPEN_DAYS = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

export function getAvailableSlots(params: {
  date: string;
  timeZone: string;
  busyPeriods: BusyPeriod[];
  now?: Date;
}): Slot[] {
  const { date, timeZone, busyPeriods, now = new Date() } = params;

  if (!OPEN_DAYS.has(weekdayInZone(date, timeZone))) return [];

  const dayStart = zonedTimeToUtc(date, OPEN_HOUR, 0, timeZone).getTime();
  const dayEnd = zonedTimeToUtc(date, CLOSE_HOUR, 0, timeZone).getTime();
  const slotMs = SLOT_MINUTES * 60000;
  const nowMs = now.getTime();

  const slots: Slot[] = [];
  for (let t = dayStart; t + slotMs <= dayEnd; t += slotMs) {
    if (t < nowMs) continue;
    const slotEnd = t + slotMs;
    const overlapsBusy = busyPeriods.some((b) => {
      const busyStart = new Date(b.start).getTime();
      const busyEnd = new Date(b.end).getTime();
      return t < busyEnd && slotEnd > busyStart;
    });
    if (overlapsBusy) continue;
    slots.push({ start: new Date(t).toISOString(), end: new Date(slotEnd).toISOString() });
  }
  return slots;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- availability`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/availability.ts src/lib/booking/availability.test.ts
git commit -m "feat: add business-hours availability calculation"
```

---

### Task 4: Booking input validation

**Files:**
- Create: `src/lib/booking/validation.ts`
- Test: `src/lib/booking/validation.test.ts`

**Interfaces:**
- Consumes: `zonedTimeToUtc`, `weekdayInZone` from `./timezone`.
- Produces:
  - `interface BookingInput { name: string; email: string; company?: string; phone?: string; message: string; slotStart: string; slotEnd: string; turnstileToken: string; honeypot?: string }`
  - `type ValidationResult = { valid: true } | { valid: false; errors: Record<string, string> }`
  - `validateBookingInput(input: BookingInput, opts: { timeZone: string; now?: Date }): ValidationResult`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/booking/validation.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- validation`
Expected: FAIL — `Cannot find module './validation'`

- [ ] **Step 3: Implement**

```ts
// src/lib/booking/validation.ts
import { weekdayInZone, zonedTimeToUtc } from "./timezone";

export interface BookingInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  slotStart: string;
  slotEnd: string;
  turnstileToken: string;
  honeypot?: string;
}

export type ValidationResult = { valid: true } | { valid: false; errors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLOT_MINUTES = 30;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;
const OPEN_DAYS = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export function validateBookingInput(
  input: BookingInput,
  opts: { timeZone: string; now?: Date },
): ValidationResult {
  const { timeZone, now = new Date() } = opts;
  const errors: Record<string, string> = {};

  if (input.honeypot) errors.honeypot = "Bot check failed.";
  if (!input.name.trim()) errors.name = "Enter your name.";
  if (input.name.length > MAX_FIELD_LENGTH) errors.name = "Name is too long.";
  if (!EMAIL_RE.test(input.email)) errors.email = "Enter a valid email.";
  if (!input.message.trim()) errors.message = "Tell us what you need.";
  if (input.message.length > MAX_MESSAGE_LENGTH) errors.message = "Message is too long.";
  if (input.company && input.company.length > MAX_FIELD_LENGTH) errors.company = "Company name is too long.";
  if (input.phone && input.phone.length > MAX_FIELD_LENGTH) errors.phone = "Phone number is too long.";
  if (!input.turnstileToken) errors.turnstileToken = "Bot verification is required.";

  const slotStart = new Date(input.slotStart);
  const slotEnd = new Date(input.slotEnd);
  if (Number.isNaN(slotStart.getTime()) || Number.isNaN(slotEnd.getTime())) {
    errors.slotStart = "Select a valid time slot.";
  } else {
    const durationMinutes = (slotEnd.getTime() - slotStart.getTime()) / 60000;
    const dateStr = input.slotStart.slice(0, 10);
    const openStart = zonedTimeToUtc(dateStr, OPEN_HOUR, 0, timeZone).getTime();
    const openEnd = zonedTimeToUtc(dateStr, CLOSE_HOUR, 0, timeZone).getTime();

    if (durationMinutes !== SLOT_MINUTES) {
      errors.slotStart = "Select a valid 30-minute slot.";
    } else if (!OPEN_DAYS.has(weekdayInZone(dateStr, timeZone))) {
      errors.slotStart = "Select a weekday slot.";
    } else if (slotStart.getTime() < openStart || slotEnd.getTime() > openEnd) {
      errors.slotStart = "Select a slot within business hours.";
    } else if (slotStart.getTime() < now.getTime()) {
      errors.slotStart = "Select a future slot.";
    }
  }

  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- validation`
Expected: 9 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/validation.ts src/lib/booking/validation.test.ts
git commit -m "feat: add booking input validation"
```

---

### Task 5: Supabase migration + reservation repository

**Files:**
- Create: `supabase/migrations/0001_create_bookings.sql`
- Create: `src/lib/booking/repository.ts`
- Test: `src/lib/booking/repository.test.ts`

**Interfaces:**
- Produces:
  - `interface ReserveInput { name: string; email: string; company?: string; phone?: string; message: string; slotStart: string; slotEnd: string }`
  - `type ReserveResult = { ok: true; id: string } | { ok: false; reason: "conflict" | "error" }`
  - `reserveSlot(input: ReserveInput): Promise<ReserveResult>`
  - `confirmBooking(id: string, googleEventId: string, meetUrl: string): Promise<void>`
  - `releaseBooking(id: string): Promise<void>`
- Reads `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` from `process.env` at call time (not at module load, so tests can stub `fetch` without needing real env values).

- [ ] **Step 1: Write the migration SQL**

```sql
-- supabase/migrations/0001_create_bookings.sql
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  name text not null,
  email text not null,
  company text,
  phone text,
  message text not null,
  status text not null default 'reserving' check (status in ('reserving', 'confirmed', 'failed')),
  google_event_id text,
  meet_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slot_start)
);

alter table public.bookings enable row level security;
-- No public policies: only the secret key (used server-side only) may read/write this table.
```

- [ ] **Step 2: Apply the migration**

Use the Supabase MCP `apply_migration` tool (project has no linked Supabase CLI project yet) with the SQL above, name `create_bookings`. If no Supabase project exists yet, create one first with the MCP `create_project` tool, then run `get_project_url` and a secret-key lookup to fill `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `.env`.

Expected: `list_tables` shows `public.bookings` with the columns above.

- [ ] **Step 3: Write the failing tests**

```ts
// src/lib/booking/repository.test.ts
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

  it("releaseBooking DELETEs the row", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    await releaseBooking("booking-1");
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toBe("https://example.supabase.co/rest/v1/bookings?id=eq.booking-1");
    expect(init?.method).toBe("DELETE");
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npm test -- repository`
Expected: FAIL — `Cannot find module './repository'`

- [ ] **Step 5: Implement**

```ts
// src/lib/booking/repository.ts

export interface ReserveInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  slotStart: string;
  slotEnd: string;
}

export type ReserveResult = { ok: true; id: string } | { ok: false; reason: "conflict" | "error" };

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are not configured.");
  return { url, key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function reserveSlot(input: ReserveInput): Promise<ReserveResult> {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/bookings`, {
    method: "POST",
    headers: headers(key, { Prefer: "return=representation" }),
    body: JSON.stringify({
      slot_start: input.slotStart,
      slot_end: input.slotEnd,
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      phone: input.phone ?? null,
      message: input.message,
      status: "reserving",
    }),
  });

  if (res.status === 409) return { ok: false, reason: "conflict" };
  if (res.status !== 201) return { ok: false, reason: "error" };

  const rows = (await res.json()) as { id: string }[];
  return { ok: true, id: rows[0].id };
}

export async function confirmBooking(id: string, googleEventId: string, meetUrl: string): Promise<void> {
  const { url, key } = supabaseConfig();
  await fetch(`${url}/rest/v1/bookings?id=eq.${id}`, {
    method: "PATCH",
    headers: headers(key),
    body: JSON.stringify({
      status: "confirmed",
      google_event_id: googleEventId,
      meet_url: meetUrl,
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function releaseBooking(id: string): Promise<void> {
  const { url, key } = supabaseConfig();
  await fetch(`${url}/rest/v1/bookings?id=eq.${id}`, {
    method: "DELETE",
    headers: headers(key),
  });
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- repository`
Expected: 5 passed.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/0001_create_bookings.sql src/lib/booking/repository.ts src/lib/booking/repository.test.ts
git commit -m "feat: add bookings table and reservation repository"
```

---

### Task 6: Google Calendar service (token refresh, freebusy, event creation)

**Files:**
- Create: `src/lib/booking/google-calendar.ts`
- Test: `src/lib/booking/google-calendar.test.ts`

**Interfaces:**
- Produces:
  - `getAccessToken(): Promise<string>`
  - `getBusyPeriods(accessToken: string, timeMin: string, timeMax: string): Promise<{ start: string; end: string }[]>`
  - `createCalendarEvent(accessToken: string, input: { summary: string; description: string; start: string; end: string; attendeeEmail: string; requestId: string }): Promise<{ eventId: string; meetUrl: string }>`
- Reads `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` from `process.env` at call time.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/booking/google-calendar.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- google-calendar`
Expected: FAIL — `Cannot find module './google-calendar'`

- [ ] **Step 3: Implement**

```ts
// src/lib/booking/google-calendar.ts

function googleEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID ?? "primary";
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google Calendar environment variables are not configured.");
  }
  return { clientId, clientSecret, refreshToken, calendarId };
}

export async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = googleEnv();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google token refresh failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function getBusyPeriods(
  accessToken: string,
  timeMin: string,
  timeMax: string,
): Promise<{ start: string; end: string }[]> {
  const { calendarId } = googleEnv();
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
  });
  if (!res.ok) throw new Error(`Google freeBusy lookup failed: ${res.status}`);
  const data = (await res.json()) as { calendars: Record<string, { busy: { start: string; end: string }[] }> };
  return data.calendars[calendarId]?.busy ?? [];
}

export async function createCalendarEvent(
  accessToken: string,
  input: { summary: string; description: string; start: string; end: string; attendeeEmail: string; requestId: string },
): Promise<{ eventId: string; meetUrl: string }> {
  const { calendarId } = googleEnv();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.start },
        end: { dateTime: input.end },
        visibility: "private",
        attendees: [{ email: input.attendeeEmail }],
        conferenceData: { createRequest: { requestId: input.requestId } },
      }),
    },
  );
  if (!res.ok) throw new Error(`Google event creation failed: ${res.status}`);
  const data = (await res.json()) as {
    id: string;
    conferenceData?: { entryPoints?: { entryPointType: string; uri: string }[] };
  };
  const meetUrl = data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri;
  if (!meetUrl) throw new Error("Google event created without a Meet link.");
  return { eventId: data.id, meetUrl };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- google-calendar`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/google-calendar.ts src/lib/booking/google-calendar.test.ts
git commit -m "feat: add Google Calendar REST client for freebusy and event creation"
```

---

### Task 7: One-time Google OAuth authorize/callback routes

**Files:**
- Create: `src/app/api/google/authorize/route.ts`
- Create: `src/app/api/google/callback/route.ts`

**Interfaces:**
- Consumes: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` from `process.env`.
- Produces: nothing consumed by later tasks — this is an ops-only pair of routes the owner visits once to mint `GOOGLE_REFRESH_TOKEN`. No automated test: it requires a real Google account consent screen, so verification is manual.

- [ ] **Step 1: Implement the authorize redirect**

```ts
// src/app/api/google/authorize/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Google OAuth environment variables are not configured." }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/calendar",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
```

- [ ] **Step 2: Implement the callback that exchanges the code**

```ts
// src/app/api/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!code || !clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Missing code or Google OAuth environment variables." }, { status: 400 });
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Token exchange failed: ${res.status}` }, { status: 502 });
  }

  const data = (await res.json()) as { refresh_token?: string };
  if (!data.refresh_token) {
    return new NextResponse(
      "No refresh_token returned. Revoke this app's access at https://myaccount.google.com/permissions and retry /api/google/authorize so Google issues a fresh one.",
      { status: 200 },
    );
  }

  return new NextResponse(
    `Copy this value into GOOGLE_REFRESH_TOKEN in .env, then delete/disable this route:\n\n${data.refresh_token}`,
    { status: 200, headers: { "Content-Type": "text/plain" } },
  );
}
```

- [ ] **Step 3: Manual verification**

1. In Google Cloud Console, add `http://localhost:3000/api/google/callback` as an authorized redirect URI on the OAuth client (alongside the production one already in `GOOGLE_REDIRECT_URI`).
2. Temporarily set `GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback` in `.env`.
3. Run: `npm run dev`
4. Visit `http://localhost:3000/api/google/authorize` in a browser signed in as the calendar owner.
5. Approve the consent screen.
6. Expected: the callback page shows a `GOOGLE_REFRESH_TOKEN` value as plain text.
7. Copy that value into `.env` as `GOOGLE_REFRESH_TOKEN`, restore `GOOGLE_REDIRECT_URI` to the production URL.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/google/authorize/route.ts src/app/api/google/callback/route.ts
git commit -m "feat: add one-time Google OAuth authorization routes"
```

---

### Task 8: Resend mailer

**Files:**
- Create: `src/lib/booking/mailer.ts`
- Test: `src/lib/booking/mailer.test.ts`

**Interfaces:**
- Produces: `sendOwnerNotification(input: { name: string; email: string; company?: string; phone?: string; message: string; slotStart: string; meetUrl: string }): Promise<{ ok: boolean }>`
- Reads `RESEND_API_KEY`, `BOOKING_FROM_EMAIL`, `BOOKING_OWNER_EMAIL` from `process.env` at call time. Never throws — a mail failure must not fail an already-confirmed booking (spec §Failure behaviour), so it logs and returns `{ ok: false }` instead.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/booking/mailer.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- mailer`
Expected: FAIL — `Cannot find module './mailer'`

- [ ] **Step 3: Implement**

```ts
// src/lib/booking/mailer.ts

export async function sendOwnerNotification(input: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  slotStart: string;
  meetUrl: string;
}): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const ownerEmail = process.env.BOOKING_OWNER_EMAIL;
  if (!apiKey || !from || !ownerEmail) {
    console.error("Resend environment variables are not configured; skipping owner notification.");
    return { ok: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [ownerEmail],
        subject: `New booking: ${input.name}`,
        html: `
          <p><strong>${input.name}</strong> (${input.email}) booked a consultation.</p>
          <p>Company: ${input.company ?? "-"}<br/>Phone: ${input.phone ?? "-"}</p>
          <p>Time: ${input.slotStart}</p>
          <p>Meet link: <a href="${input.meetUrl}">${input.meetUrl}</a></p>
          <p>Message: ${input.message}</p>
        `,
      }),
    });
    if (!res.ok) {
      console.error(`Resend owner notification failed: ${res.status}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend owner notification threw", err);
    return { ok: false };
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- mailer`
Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/mailer.ts src/lib/booking/mailer.test.ts
git commit -m "feat: add Resend owner-notification mailer"
```

---

### Task 9: Turnstile verification

**Files:**
- Create: `src/lib/booking/turnstile.ts`
- Test: `src/lib/booking/turnstile.test.ts`

**Interfaces:**
- Produces: `verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean>`
- Reads `TURNSTILE_SECRET_KEY` from `process.env` at call time.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/booking/turnstile.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- turnstile`
Expected: FAIL — `Cannot find module './turnstile'`

- [ ] **Step 3: Implement**

```ts
// src/lib/booking/turnstile.ts

export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured; rejecting booking.");
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return false;

  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- turnstile`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/booking/turnstile.ts src/lib/booking/turnstile.test.ts
git commit -m "feat: add Cloudflare Turnstile verification"
```

---

### Task 10: `GET /api/booking/availability` route

**Files:**
- Create: `src/app/api/booking/availability/route.ts`
- Test: `src/app/api/booking/availability/route.test.ts`

**Interfaces:**
- Consumes: `getAvailableSlots` from `@/lib/booking/availability`, `getAccessToken`/`getBusyPeriods` from `@/lib/booking/google-calendar`, `zonedTimeToUtc` from `@/lib/booking/timezone`.
- Produces: `GET` handler responding `200 { slots: Slot[] }` or `400`/`502` on bad input/upstream failure. Query params: `date` (`YYYY-MM-DD`, required).

- [ ] **Step 1: Write the failing tests**

```ts
// src/app/api/booking/availability/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
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
  beforeEach(() => vi.clearAllMocks());

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- api/booking/availability`
Expected: FAIL — `Cannot find module './route'`

- [ ] **Step 3: Implement**

```ts
// src/app/api/booking/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking/availability";
import { getAccessToken, getBusyPeriods } from "@/lib/booking/google-calendar";
import { zonedTimeToUtc } from "@/lib/booking/timezone";

const TIME_ZONE = "Europe/London";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "Provide a date as YYYY-MM-DD." }, { status: 400 });
  }

  const dayStart = zonedTimeToUtc(date, 0, 0, TIME_ZONE).toISOString();
  const dayEnd = zonedTimeToUtc(date, 23, 59, TIME_ZONE).toISOString();

  try {
    const accessToken = await getAccessToken();
    const busyPeriods = await getBusyPeriods(accessToken, dayStart, dayEnd);
    const slots = getAvailableSlots({ date, timeZone: TIME_ZONE, busyPeriods });
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("Availability lookup failed", err);
    return NextResponse.json({ error: "Availability is temporarily unavailable." }, { status: 502 });
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- api/booking/availability`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/booking/availability/route.ts src/app/api/booking/availability/route.test.ts
git commit -m "feat: add booking availability API route"
```

---

### Task 11: `POST /api/booking` route

**Files:**
- Create: `src/app/api/booking/route.ts`
- Test: `src/app/api/booking/route.test.ts`

**Interfaces:**
- Consumes: `validateBookingInput` from `@/lib/booking/validation`, `verifyTurnstileToken` from `@/lib/booking/turnstile`, `reserveSlot`/`confirmBooking`/`releaseBooking` from `@/lib/booking/repository`, `getAccessToken`/`getBusyPeriods`/`createCalendarEvent` from `@/lib/booking/google-calendar`, `sendOwnerNotification` from `@/lib/booking/mailer`.
- Produces: `POST` handler responding `200 { meetUrl: string, slotStart: string }`, `400 { errors }` on validation failure, `409 { error }` on slot conflict, `502 { error }` on upstream failure.

- [ ] **Step 1: Write the failing tests**

```ts
// src/app/api/booking/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
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
  beforeEach(() => vi.clearAllMocks());

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- api/booking/route`
Expected: FAIL — `Cannot find module './route'`

- [ ] **Step 3: Implement**

```ts
// src/app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateBookingInput, type BookingInput } from "@/lib/booking/validation";
import { verifyTurnstileToken } from "@/lib/booking/turnstile";
import { reserveSlot, confirmBooking, releaseBooking } from "@/lib/booking/repository";
import { getAccessToken, getBusyPeriods, createCalendarEvent } from "@/lib/booking/google-calendar";
import { sendOwnerNotification } from "@/lib/booking/mailer";

const TIME_ZONE = "Europe/London";

export async function POST(req: NextRequest) {
  let input: BookingInput;
  try {
    input = (await req.json()) as BookingInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateBookingInput(input, { timeZone: TIME_ZONE });
  if (!validation.valid) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstileToken(input.turnstileToken, req.headers.get("x-forwarded-for") ?? undefined);
  if (!turnstileOk) {
    return NextResponse.json({ errors: { turnstileToken: "Bot verification failed." } }, { status: 400 });
  }

  const reservation = await reserveSlot({
    name: input.name,
    email: input.email,
    company: input.company,
    phone: input.phone,
    message: input.message,
    slotStart: input.slotStart,
    slotEnd: input.slotEnd,
  });
  if (!reservation.ok) {
    const status = reservation.reason === "conflict" ? 409 : 502;
    return NextResponse.json({ error: "That slot is no longer available." }, { status });
  }

  try {
    const accessToken = await getAccessToken();

    // Final availability recheck immediately before creating the event.
    const stillBusy = await getBusyPeriods(accessToken, input.slotStart, input.slotEnd);
    const isTaken = stillBusy.some(
      (b) => new Date(input.slotStart) < new Date(b.end) && new Date(input.slotEnd) > new Date(b.start),
    );
    if (isTaken) {
      await releaseBooking(reservation.id);
      return NextResponse.json({ error: "That slot is no longer available." }, { status: 409 });
    }

    const { eventId, meetUrl } = await createCalendarEvent(accessToken, {
      summary: `Consultation with ${input.name}`,
      description: `Company: ${input.company ?? "-"}\nPhone: ${input.phone ?? "-"}\n\n${input.message}`,
      start: input.slotStart,
      end: input.slotEnd,
      attendeeEmail: input.email,
      requestId: reservation.id,
    });

    await confirmBooking(reservation.id, eventId, meetUrl);
    await sendOwnerNotification({
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone,
      message: input.message,
      slotStart: input.slotStart,
      meetUrl,
    });

    return NextResponse.json({ meetUrl, slotStart: input.slotStart });
  } catch (err) {
    console.error("Booking confirmation failed", err);
    await releaseBooking(reservation.id);
    return NextResponse.json({ error: "Booking failed. Please try again." }, { status: 502 });
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- api/booking/route`
Expected: 6 passed.

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: all tests across every task pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/booking/route.ts src/app/api/booking/route.test.ts
git commit -m "feat: add booking confirmation API route"
```

---

### Task 12: Two-stage `ContactForm` with date/slot picker and Turnstile

**Files:**
- Modify: `src/components/forms/ContactForm.tsx` (full rewrite)
- Create: `src/components/forms/SlotPicker.tsx`
- Modify: `src/app/layout.tsx:1-40` (add the Turnstile script tag, scoped so it only loads where used — see Step 1)

No test framework covers React component behavior here (none is configured, and adding one is out of scope for this plan — ponytail: manual browser verification is the substitute, per the plan's Tech Stack note). Steps are manual, with exact commands and expected observations.

- [ ] **Step 1: Add the Turnstile script**

Cloudflare's widget loads via a plain `<script>` tag, not an npm package. Add it once, next to other external scripts:

```tsx
// src/app/layout.tsx — inside <body>, near other top-level scripts (or via next/script)
import Script from "next/script";
// ...
<Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
```

- [ ] **Step 2: Build the slot picker**

```tsx
// src/components/forms/SlotPicker.tsx
"use client";

import { useEffect, useState } from "react";

export interface Slot {
  start: string;
  end: string;
}

function formatSlotLabel(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function SlotPicker({
  selectedSlot,
  onSelect,
}: {
  selectedSlot: Slot | null;
  onSelect: (slot: Slot) => void;
}) {
  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetch(`/api/booking/availability?date=${date}`)
      .then((res) => {
        if (!res.ok) throw new Error("availability request failed");
        return res.json();
      })
      .then((data: { slots: Slot[] }) => {
        if (cancelled) return;
        setSlots(data.slots);
        setStatus("idle");
      })
      .catch(() => {
        if (cancelled) return;
        setSlots([]);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="booking-date" className="text-sm font-medium text-ink">
          Choose a day
        </label>
        <input
          id="booking-date"
          type="date"
          min={todayIso()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-fit rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
        />
      </div>

      {status === "loading" && <p className="text-sm text-muted">Loading available times…</p>}
      {status === "error" && <p className="text-sm text-accent">Couldn&apos;t load times. Try another day.</p>}
      {status === "idle" && slots.length === 0 && (
        <p className="text-sm text-muted">No open times on this day. Try another day.</p>
      )}

      {slots.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.start}
              type="button"
              onClick={() => onSelect(slot)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedSlot?.start === slot.start
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink hover:border-ink"
              }`}
            >
              {formatSlotLabel(slot.start)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `ContactForm`**

```tsx
// src/components/forms/ContactForm.tsx
"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SlotPicker, type Slot } from "./SlotPicker";

type Errors = Partial<Record<"name" | "email" | "message" | "slotStart" | "turnstileToken", string>>;

declare global {
  interface Window {
    turnstile?: { getResponse: (widgetId?: string) => string | undefined };
  }
}

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [slot, setSlot] = useState<Slot | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ meetUrl: string; slotStart: string } | null>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email.";
    if (!values.message.trim()) next.message = "Tell us a little about what you need.";
    if (!slot) next.slotStart = "Choose a time before booking.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const turnstileToken = window.turnstile?.getResponse();
    if (!turnstileToken) {
      setErrors({ turnstileToken: "Complete the verification check before booking." });
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, slotStart: slot!.start, slotEnd: slot!.end, turnstileToken }),
      });

      if (res.status === 409) {
        setErrors({ slotStart: "That time was just taken. Pick another." });
        setSlot(null);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrors(body.errors ?? { message: "Something went wrong. Please try again." });
        return;
      }

      const body = (await res.json()) as { meetUrl: string; slotStart: string };
      setConfirmed(body);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-paper-dim p-8">
        <CheckCircle weight="fill" className="size-8 text-accent" />
        <h3 className="text-lg font-medium text-ink">
          Booked for {new Date(confirmed.slotStart).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        </h3>
        <p className="text-sm leading-relaxed text-muted">
          Check your email for the calendar invite — it includes your Google Meet link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
            placeholder="Jordan Fernandez"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-accent">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
            placeholder="jordan@company.com"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-accent">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-sm font-medium text-ink">
            Company <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="company"
            type="text"
            value={values.company}
            onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
            placeholder="Company name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-ink">
            Phone <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
            placeholder="+44 7000 000000"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          What do you need help with?
        </label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="resize-none rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
          placeholder="A short note on your business and what you're looking for."
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="text-xs text-accent">{errors.message}</p>}
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-5">
        <SlotPicker selectedSlot={slot} onSelect={setSlot} />
        {errors.slotStart && <p className="text-xs text-accent">{errors.slotStart}</p>}
      </div>

      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-theme="light"
      />
      {errors.turnstileToken && <p className="text-xs text-accent">{errors.turnstileToken}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-fit rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:opacity-60"
      >
        {submitting ? "Booking…" : "Book consultation"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`

1. Visit `http://localhost:3000/contact-us`.
2. Confirm the form shows Name/Email/Company/Phone/Message fields, then a date picker, then a grid of time buttons, then a Turnstile checkbox, then a disabled-until-ready "Book consultation" button.
3. Pick a weekday date. Expected: the slot grid populates with times between 9:00 AM and 4:30 PM (local browser time zone), no times on weekends.
4. Fill the form, pick a slot, complete the Turnstile checkbox, submit.
5. Expected: button shows "Booking…", then the form is replaced by the "Booked for …" confirmation panel.
6. Check the owner's Gmail inbox for the Resend notification and the calendar owner's Google Calendar for the new event with a Meet link.
7. Re-load `/contact-us`, pick the exact same slot from step 3, and submit again with different visitor details. Expected: a `409`-driven "That time was just taken" message, since Google Calendar now shows it busy.

- [ ] **Step 5: Commit**

```bash
git add src/components/forms/ContactForm.tsx src/components/forms/SlotPicker.tsx src/app/layout.tsx
git commit -m "feat: rebuild contact form as a Google Meet booking flow"
```

---

### Task 13: Environment documentation

**Files:**
- Create: `.env.example`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Write `.env.example`**

```dotenv
NEXT_PUBLIC_APP_URL=

# Google Calendar / Google Meet — see docs/superpowers/plans/2026-08-16-contact-booking-implementation.md Task 7
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_CALENDAR_ID=primary
GOOGLE_REFRESH_TOKEN=

# Email — Resend
RESEND_API_KEY=
BOOKING_DEMO_MODE=true
BOOKING_FROM_EMAIL=
BOOKING_OWNER_EMAIL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

- [ ] **Step 2: Confirm it's tracked while `.env` stays ignored**

Run: `git check-ignore -v .env .env.example`
Expected: `.env` matches the `.env*` ignore rule; `.env.example` prints nothing (not ignored).

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "docs: document booking environment variables"
```

---

## Self-Review

**Spec coverage:** OAuth owner calendar (Task 6/7), business-hours slots in visitor-local display (Task 3, Task 12), freebusy + final recheck (Task 10, Task 11), private event + Meet + attendee (Task 6), Resend owner-only demo email (Task 8), `bookings` table + unique constraint (Task 5), bot protection + validation (Task 4, Task 9), failure behaviors — conflict/mail-fail/OAuth-fail (Task 11, Task 8), secrets server-only (all modules read `process.env` server-side only; `.env` already gitignored), automated coverage of slot calc/validation/conflict/mocked booking (Tasks 3, 4, 10, 11). Excluded-from-v1 items (reschedule, multi-calendar, payments) are not touched anywhere in this plan.

**Placeholder scan:** none found — every step has runnable code or an exact manual command/observation.

**Type consistency:** `Slot { start, end }` (Task 3) matches `Slot` in `SlotPicker.tsx` (Task 12) and the availability route's `slots` response. `ReserveInput`/`ReserveResult` (Task 5) match the fields the route handler in Task 11 passes to `reserveSlot`. `BookingInput` (Task 4) matches the JSON body `ContactForm` posts in Task 12 and what Task 11's route parses.

---

Plan complete and saved to `docs/superpowers/plans/2026-08-16-contact-booking-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
