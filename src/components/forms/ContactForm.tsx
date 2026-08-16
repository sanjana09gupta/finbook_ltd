"use client";

import { useState, type FormEvent } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
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
        setRefreshToken((n) => n + 1);
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
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
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
            className="rounded-lg border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
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
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-accent">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-5">
        <SlotPicker selectedSlot={slot} onSelect={setSlot} refreshKey={refreshToken} />
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
