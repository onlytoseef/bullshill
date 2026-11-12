import nodemailer, { type Transporter } from "nodemailer";

export type ContactMessage = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

/**
 * SMTP connection is built lazily from env so the app boots without it (the
 * contact form just reports that email isn't configured). Credentials are never
 * hard-coded — they live in `.env.local` locally and in the host's env in prod.
 */
let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      // 465 = implicit TLS; 587 = STARTTLS (Hostinger's fallback).
      secure: port === 465,
      requireTLS: true,
      tls: { ciphers: "SSLv3" },
      connectionTimeout: 10000,
      auth: { user, pass },
    });
  }

  return transporter;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

/**
 * Sends the "new website query" notification. Returns `false` when SMTP isn't
 * configured rather than throwing, so the caller can decide how to respond.
 */
export async function sendContactEmail(data: ContactMessage): Promise<boolean> {
  const transport = getTransporter();
  const to = process.env.CONTACT_TO ?? process.env.SMTP_USER;
  const from = process.env.CONTACT_FROM ?? process.env.SMTP_USER;

  if (!transport || !to || !from) {
    console.warn(
      "[contact] email is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS/CONTACT_TO).",
    );
    return false;
  }

  await transport.sendMail({
    from,
    to,
    replyTo: data.email,
    subject: `New website query from ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "—"}`,
      "",
      data.message,
    ].join("\n"),
    html: `
      <h2 style="margin:0 0 12px">New website query</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p style="margin:0 0 12px"><strong>Phone:</strong> ${escapeHtml(data.phone || "—")}</p>
      <p style="margin:0 0 4px"><strong>Message:</strong></p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
    `,
  });

  return true;
}
