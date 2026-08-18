"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { IconCycler } from "@/components/ui/IconCycler";
import { SYNC_TOOLS } from "@/lib/content";
import { SlotPicker, type Slot } from "./SlotPicker";

type Errors = Partial<Record<"name" | "email" | "message" | "slotStart" | "turnstileToken", string>>;

declare global {
  interface Window {
    turnstile?: { getResponse: (widgetId?: string) => string | undefined };
  }
}

// Matches top-to-bottom field order so the first error the user sees
// scrolling down is also the first one flagged.
const FIELD_ORDER: (keyof Errors)[] = ["name", "email", "message", "slotStart", "turnstileToken"];

function focusFirstError(errs: Errors) {
  const firstKey = FIELD_ORDER.find((key) => errs[key]);
  if (!firstKey) return;
  const el = document.getElementById(firstKey);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.focus({ preventScroll: true });
  }
}

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [slot, setSlot] = useState<Slot | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
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
      focusFirstError(next);
      return;
    }

    const turnstileToken = window.turnstile?.getResponse();
    if (!turnstileToken) {
      const turnstileError: Errors = { turnstileToken: "Complete the verification check before booking." };
      setErrors(turnstileError);
      focusFirstError(turnstileError);
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
        const slotError: Errors = { slotStart: "That time was just taken. Pick another." };
        setErrors(slotError);
        setSlot(null);
        setRefreshToken((n) => n + 1);
        focusFirstError(slotError);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const submitError: Errors = body.errors ?? { message: "Something went wrong. Please try again." };
        setErrors(submitError);
        focusFirstError(submitError);
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
        <CheckCircleFilled className="[&>svg]:size-8 text-accent" />
        <h3 className="text-lg font-medium text-ink">
          Booked for {new Date(confirmed.slotStart).toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}
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
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-base text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none md:text-sm"
            placeholder="Jordan Fernandez"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-accent">
              {errors.name}
            </p>
          )}
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
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-base text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none md:text-sm"
            placeholder="jordan@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-accent">
              {errors.email}
            </p>
          )}
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
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-base text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none md:text-sm"
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
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-base text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none md:text-sm"
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
          className="resize-none rounded-lg border border-line bg-paper px-4 py-3 text-base text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none md:text-sm"
          placeholder="A short note on your business and what you're looking for."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-accent">
            {errors.message}
          </p>
        )}
      </div>

      <div id="slotStart" className="flex flex-col gap-2 border-t border-line pt-5 scroll-mt-24">
        <SlotPicker selectedSlot={slot} onSelect={setSlot} refreshKey={refreshToken} />
        {errors.slotStart && <p className="text-xs text-accent">{errors.slotStart}</p>}
      </div>

      <div
        id="turnstileToken"
        className="cf-turnstile scroll-mt-24"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-theme="light"
      />
      {errors.turnstileToken && <p className="text-xs text-accent">{errors.turnstileToken}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <LoadingOutlined className="[&>svg]:size-3.5 animate-spin" />}
        {submitting ? "Booking…" : "Book consultation"}
      </button>

      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3"
          >
            <IconCycler tools={SYNC_TOOLS} size={32} intervalMs={900} />
            <span className="text-xs text-muted">Adding this to your calendar…</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
