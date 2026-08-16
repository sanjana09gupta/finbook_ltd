const BRAND = {
  ink: "#141414",
  paper: "#fafaf8",
  paperDim: "#f0efe9",
  line: "#e2e0d8",
  muted: "#6b6b64",
  accent: "#da240d",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderOwnerNotificationHtml(input: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  slotStart: string;
  meetUrl: string;
}): string {
  const when = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(input.slotStart));

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:${BRAND.muted};font-size:13px;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:${BRAND.ink};font-size:14px;">${value}</td>
    </tr>`;

  return `
  <div style="background:${BRAND.paperDim};padding:32px 16px;font-family:Geist,'Segoe UI',Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:${BRAND.paper};border:1px solid ${BRAND.line};border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:24px 32px;border-bottom:1px solid ${BRAND.line};">
          <span style="font-size:16px;font-weight:700;letter-spacing:-0.01em;color:${BRAND.ink};">Finbook Global</span>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 8px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.accent};">New booking</p>
          <h1 style="margin:0 0 20px;font-size:20px;color:${BRAND.ink};">${escapeHtml(input.name)}</h1>
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            ${row("Email", `<a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND.ink};">${escapeHtml(input.email)}</a>`)}
            ${row("Company", escapeHtml(input.company || "-"))}
            ${row("Phone", escapeHtml(input.phone || "-"))}
            ${row("When", `${when} (Europe/London)`)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 24px;">
          <p style="margin:0 0 6px;color:${BRAND.muted};font-size:13px;">Message</p>
          <p style="margin:0;padding:14px 16px;background:${BRAND.paperDim};border-radius:12px;color:${BRAND.ink};font-size:14px;line-height:1.5;">${escapeHtml(input.message)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px 32px;">
          <a href="${input.meetUrl}" style="display:inline-block;background:${BRAND.ink};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:999px;">Join Google Meet</a>
        </td>
      </tr>
    </table>
    <p style="max-width:520px;margin:16px auto 0;text-align:center;color:${BRAND.muted};font-size:12px;">Sent automatically by the Finbook Global booking system.</p>
  </div>`;
}

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
        html: renderOwnerNotificationHtml(input),
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
