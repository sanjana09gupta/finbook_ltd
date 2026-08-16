export interface ReserveInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  slotStart: string;
  slotEnd: string;
}

export type ReserveResult = { ok: true; id: string } | { ok: false; reason: "conflict" | "error" };

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are not configured.");
  return { url, key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function reserveSlot(input: ReserveInput): Promise<ReserveResult> {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/bookings`, {
    method: "POST",
    headers: headers(key, { Prefer: "return=representation" }),
    body: JSON.stringify({
      slot_start: input.slotStart,
      slot_end: input.slotEnd,
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      phone: input.phone ?? null,
      message: input.message,
      status: "reserving",
    }),
  });

  if (res.status === 409) return { ok: false, reason: "conflict" };
  if (res.status !== 201) return { ok: false, reason: "error" };

  const rows = (await res.json()) as { id: string }[];
  return { ok: true, id: rows[0].id };
}

export async function confirmBooking(id: string, googleEventId: string, meetUrl: string): Promise<void> {
  const { url, key } = supabaseConfig();
  await fetch(`${url}/rest/v1/bookings?id=eq.${id}`, {
    method: "PATCH",
    headers: headers(key),
    body: JSON.stringify({
      status: "confirmed",
      google_event_id: googleEventId,
      meet_url: meetUrl,
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function releaseBooking(id: string): Promise<void> {
  const { url, key } = supabaseConfig();
  await fetch(`${url}/rest/v1/bookings?id=eq.${id}`, {
    method: "DELETE",
    headers: headers(key),
  });
}
