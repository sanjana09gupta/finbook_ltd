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
