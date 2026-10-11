"use client";

import type { FormEvent } from "react";

import { contactPage } from "@/lib/content";

export function ContactForm() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} className="contact-form">
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

      <button type="submit" className="contact-submit">
        {contactPage.submit}
      </button>
    </form>
  );
}
