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
