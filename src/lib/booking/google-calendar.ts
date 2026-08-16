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
