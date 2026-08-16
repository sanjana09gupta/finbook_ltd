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
