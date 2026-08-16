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
