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
