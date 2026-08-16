# Contact booking with Google Meet

## Goal

Replace the current `mailto:` contact form behaviour with a required, self-service booking flow. A visitor submits their contact details and enquiry, chooses a 30-minute open slot, then receives a calendar invitation and a Google Meet link. The calendar owner receives both the event and an internal notification.

## Scope

### Included

- One Google Calendar owner authorized through Google OAuth.
- Available slots Monday to Friday, 09:00 through 17:00 in `Europe/London`.
- 30-minute meetings, with no booking buffer.
- A date picker and required time-slot picker on the contact page.
- Slot rendering in the visitor's local timezone.
- Google Calendar free/busy lookup and a final availability check before booking.
- A private Google Calendar event with the visitor as an attendee and a unique Google Meet conference.
- Visitor and owner confirmation emails from `hello@finbookglobal.com`.
- Persistent bookings and a database uniqueness constraint to prevent double bookings.
- Bot protection and server-side validation.

### Excluded from v1

- Rescheduling and cancellation UI or links.
- Multiple staff calendars or round-robin assignment.
- Booking buffers, lead-time, maximum-horizon, payments, or CRM synchronization.
- A public staff availability calendar.

## User flow

1. The visitor enters name, email, optional company, optional phone, and an enquiry message.
2. They select a date.
3. The client requests availability for that date from the server.
4. The server calculates candidate slots in `Europe/London`, removes slots which are in the past or overlap a busy calendar period, and returns ISO timestamps.
5. The client displays the returned slots in the visitor's browser timezone.
6. The visitor must select a slot before they can submit the booking.
7. The booking endpoint verifies the bot-protection token and every submitted field, reserves the slot, rechecks Google Calendar availability, creates the calendar event and Meet conference, and records the event ID.
8. Google Calendar sends the attendee invitation; Resend sends branded visitor and owner emails.
9. The client displays a confirmation with the confirmed local time and a note that the invitation contains the Meet link.

## Architecture

### Client

`ContactForm` remains a client component and becomes a two-stage form. It owns field state, validation feedback, selected date, selected slot, loading state, and the final success state. It does not receive Google credentials and does not call Google directly.

### Application routes

- `GET /api/booking/availability` accepts an ISO calendar date and browser timezone, and returns available 30-minute slots.
- `POST /api/booking` accepts contact details, selected slot, and Turnstile token; it creates exactly one booking or returns a structured failure.

Route handlers validate data, perform all secret-bearing work, and return only client-safe information.

### Booking service

The service is split into focused modules:

- Availability module: creates London business-hour candidates and subtracts busy periods.
- Calendar module: refreshes the owner's OAuth token, reads free/busy state, inserts private events, creates a Google Meet conference, and sends attendee updates.
- Booking repository: reserves a slot and records the Google event ID and booking state.
- Mailer: sends visitor and owner transactional emails through Resend.
- Bot-protection module: verifies Cloudflare Turnstile tokens.

## Data model

The `bookings` table has these fields:

| Field | Purpose |
| --- | --- |
| `id` | Internal UUID booking ID. |
| `slot_start` / `slot_end` | UTC timestamps used for the unique reservation constraint. |
| `name`, `email`, `company`, `phone`, `message` | Visitor-provided booking context. |
| `status` | `reserving`, `confirmed`, or `failed`. |
| `google_event_id` | Link between the booking and its Google Calendar event. |
| `meet_url` | Meet URL for operational support; not exposed in an unprotected public API. |
| `created_at`, `updated_at` | Audit timestamps. |

`slot_start` has a unique constraint. The endpoint reserves the row before inserting the Calendar event, so concurrent requests cannot confirm the same slot.

## Calendar event

Each confirmed event:

- is created on the authorized owner's primary calendar;
- has a 30-minute start/end time in `Europe/London`;
- is marked private and busy;
- includes the visitor as an attendee;
- includes the company, phone, and enquiry message in its description;
- requests a new Google Meet conference with a unique request ID;
- requests attendee email updates from Google Calendar.

Google Calendar remains the operational source of truth for the owner's schedule. The database adds reservation safety and an application audit trail.

## Email and notifications

Google Calendar supplies the canonical invitation and Meet link to the attendee. Resend supplies:

1. A branded confirmation to the visitor with their confirmed time and a reminder to use the calendar invite for the Meet link.
2. An internal booking summary to the calendar owner's Gmail address, including visitor details and message.

If branded email fails after the Calendar event is created, the booking remains confirmed and the failure is logged for retry; the visitor still receives the Google Calendar invitation.

## Security and reliability

- Google OAuth credentials, refresh token, database key, Resend key, and Turnstile secret exist only in server environment variables.
- OAuth refresh credentials are encrypted at rest or stored as a deployment secret for this single-owner demo.
- The booking endpoint rechecks availability immediately before creating the event.
- A unique slot reservation prevents two successful confirmations for the same slot.
- API validation rejects invalid emails, non-business-hour slots, non-30-minute boundaries, stale/past times, and overlong fields.
- Cloudflare Turnstile, a hidden honeypot field, and route-level rate limiting protect the public endpoint.
- No calendar event details or Meet URLs are available through an unauthenticated lookup route.

## Failure behaviour

- Availability lookup failure: show a retry message and do not show stale slots.
- Slot no longer available: return a conflict response, clear the selection, and refresh availability.
- Calendar creation failure: release or mark the reservation as failed and show a retry message.
- Mail failure after confirmation: show successful booking confirmation; log the error for operational retry.
- OAuth failure: disable booking with a generic temporary-unavailable message; never expose credential details.

## Environment configuration

The application will use this configuration:

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_CALENDAR_ID=primary
GOOGLE_REFRESH_TOKEN=

NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

RESEND_API_KEY=
BOOKING_FROM_EMAIL=Finbook Global <hello@finbookglobal.com>
BOOKING_OWNER_EMAIL=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

The production deployment will also have a server-side rate-limit provider configuration if the hosting platform does not supply suitable built-in protection.

## Acceptance criteria

- A visitor cannot submit the form without selecting a valid future slot.
- Only weekdays and London 09:00–17:00 slots are offered, in 30-minute increments.
- Busy times in the owner's calendar never appear as available.
- Two simultaneous requests for the same slot result in exactly one confirmed booking.
- A successful booking produces one private Google Calendar event, one unique Meet URL, an attendee invitation, and the two branded email notifications.
- Visitors see slot labels in their browser timezone while the event is stored correctly across UK daylight-saving changes.
- Secrets are absent from client bundles and Git history.
- Automated checks cover slot calculation, validation, conflict handling, and a mocked successful/failed booking flow.
