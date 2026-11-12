"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { submitContact } from "@/lib/actions/contact";
import { contactPage } from "@/lib/content";

type Status = "idle" | "pending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "pending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("pending");
    setFeedback("");

    try {
      const result = await submitContact({
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        company: String(data.get("company") ?? ""),
      });

      if (result.ok) {
        setStatus("success");
        setFeedback(result.message);
        form.reset();
      } else {
        setStatus("error");
        setFeedback(result.message);
      }
    } catch {
      setStatus("error");
      setFeedback(
        "Network error — please try again, or email support@bullshill.com.",
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="contact-form" noValidate>
      {contactPage.fields.map((field) => (
        <label key={field.name} className="contact-field">
          <span>{field.label}</span>
          <input
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            required
          />
        </label>
      ))}

      <label className="contact-field">
        <span>{contactPage.message.label}</span>
        <textarea
          name={contactPage.message.name}
          placeholder={contactPage.message.placeholder}
          required
        />
      </label>

      {/* Honeypot: hidden from users and assistive tech, but bots fill it in. */}
      <div className="contact-honeypot" aria-hidden="true">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="contact-submit"
        disabled={status === "pending"}
      >
        {status === "pending" ? "Sending…" : contactPage.submit}
      </Button>

      {feedback ? (
        <p role="status" className="contact-feedback" data-state={status}>
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
