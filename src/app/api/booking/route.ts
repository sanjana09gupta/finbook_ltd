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

  let confirmed = false;
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
    confirmed = true;
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
    if (!confirmed) {
      await releaseBooking(reservation.id);
    }
    return NextResponse.json({ error: "Booking failed. Please try again." }, { status: 502 });
  }
}
