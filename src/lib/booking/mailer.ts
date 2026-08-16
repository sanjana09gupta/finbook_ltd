export async function sendOwnerNotification(input: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  slotStart: string;
  meetUrl: string;
}): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const ownerEmail = process.env.BOOKING_OWNER_EMAIL;
  if (!apiKey || !from || !ownerEmail) {
    console.error("Resend environment variables are not configured; skipping owner notification.");
    return { ok: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [ownerEmail],
        subject: `New booking: ${input.name}`,
        html: `
          <p><strong>${input.name}</strong> (${input.email}) booked a consultation.</p>
          <p>Company: ${input.company ?? "-"}<br/>Phone: ${input.phone ?? "-"}</p>
          <p>Time: ${input.slotStart}</p>
          <p>Meet link: <a href="${input.meetUrl}">${input.meetUrl}</a></p>
          <p>Message: ${input.message}</p>
        `,
      }),
    });
    if (!res.ok) {
      console.error(`Resend owner notification failed: ${res.status}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend owner notification threw", err);
    return { ok: false };
  }
}
