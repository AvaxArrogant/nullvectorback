import { sendSmtpMail } from "../../lib/smtp";

export const runtime = "nodejs";

const categories = new Set([
  "Feature idea",
  "Bug report",
  "Scan result feedback",
  "UI feedback",
  "Partnership",
  "Other",
]);

function clean(value, maxLength = 4000) {
  return String(value || "").replace(/\0/g, "").trim().slice(0, maxLength);
}

function isEmail(value) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid feedback payload." }, { status: 400 });
  }

  const honeypot = clean(payload.website, 300);
  if (honeypot) {
    return Response.json({ ok: true, message: "Feedback received." });
  }

  const category = categories.has(payload.category) ? payload.category : "Other";
  const email = clean(payload.email, 254);
  const message = clean(payload.message, 6000);
  const path = clean(payload.path, 500);
  const userAgent = clean(request.headers.get("user-agent"), 500);
  const forwardedFor = clean(request.headers.get("x-forwarded-for"), 180);
  const to = process.env.FEEDBACK_TO_EMAIL || "contact@pulseshield.io";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "contact@pulseshield.io";

  if (message.length < 12) {
    return Response.json({ ok: false, error: "Add a little more detail before sending." }, { status: 400 });
  }

  if (!isEmail(email)) {
    return Response.json({ ok: false, error: "Enter a valid email or leave it blank." }, { status: 400 });
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return Response.json(
      { ok: false, error: "Feedback email is not configured yet. Email contact@pulseshield.io directly for now." },
      { status: 503 },
    );
  }

  const submittedAt = new Date().toISOString();
  const body = [
    "PulseShield.io feedback submission",
    "",
    `Category: ${category}`,
    `Reply email: ${email || "not provided"}`,
    `Page: ${path || "not provided"}`,
    `Submitted: ${submittedAt}`,
    forwardedFor ? `Forwarded IP: ${forwardedFor}` : "",
    userAgent ? `User agent: ${userAgent}` : "",
    "",
    "Message:",
    message,
  ].filter(Boolean).join("\n");

  try {
    await sendSmtpMail({
      to,
      from,
      replyTo: email || undefined,
      subject: `PulseShield Feedback: ${category}`,
      text: body,
    });

    return Response.json({ ok: true, message: "Feedback sent to PulseShield." });
  } catch (error) {
    console.error("Feedback email failed", error);
    return Response.json(
      { ok: false, error: "Feedback could not be sent right now. Email contact@pulseshield.io directly." },
      { status: 502 },
    );
  }
}
