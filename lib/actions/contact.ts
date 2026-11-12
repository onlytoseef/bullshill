"use server";

import { getCms } from "@/lib/cms/client";
import { sendContactEmail } from "@/lib/email";

export type ContactState = {
  ok: boolean;
  message: string;
};

export type ContactInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  /** Honeypot — hidden from real users; bots fill it in. */
  company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Handles the public contact form: validate, archive the query in Payload, and
 * email a notification. The email is the reliable channel — if the CMS write
 * fails (e.g. the table isn't migrated yet) the team still gets the message.
 */
export async function submitContact(input: ContactInput): Promise<ContactState> {
  // Honeypot tripped: pretend it worked, write nothing.
  if (field(input.company)) {
    return { ok: true, message: "Thank you — we'll be in touch shortly." };
  }

  const name = field(input.name);
  const phone = field(input.phone);
  const email = field(input.email);
  const message = field(input.message);

  if (!name || !email || !message) {
    return {
      ok: false,
      message: "Please fill in your name, email address and message.",
    };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (name.length > 120 || email.length > 200 || phone.length > 40 || message.length > 5000) {
    return { ok: false, message: "One of the fields is too long." };
  }

  let saved = false;
  try {
    const payload = await getCms();
    if (payload) {
      await payload.create({
        collection: "contact-submissions",
        data: { name, phone, email, message },
      });
      saved = true;
    }
  } catch (error) {
    console.error("[contact] could not save submission", error);
  }

  let emailed = false;
  try {
    emailed = await sendContactEmail({ name, phone, email, message });
  } catch (error) {
    console.error("[contact] could not send notification email", error);
  }

  if (!saved && !emailed) {
    return {
      ok: false,
      message:
        "Sorry, something went wrong on our side. Please email us directly at support@bullshill.com.",
    };
  }

  return {
    ok: true,
    message:
      "Thank you! Your message has been received — we'll get back to you shortly.",
  };
}
