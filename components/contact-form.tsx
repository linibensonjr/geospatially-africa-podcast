"use client";

import { FormEvent } from "react";

const TEAM_EMAIL = "gspatially@gmail.com";

/**
 * Looks and behaves like a real contact form, but on submit it builds a
 * mailto: link from the fields and hands off to the visitor's email client
 * — there is no backend endpoint for general contact messages yet.
 */
export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");

    const subject = `Message from ${name || "the website"}`;
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
    window.location.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  const fieldClass =
    "min-h-[52px] w-full border border-line bg-surface-warm px-4 text-ink placeholder:text-ink-muted focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-ink-secondary">
        Have a guest suggestion, feedback on an episode, or want to sponsor
        the show? Send us a note.
      </p>
      <label className="block">
        <span className="sr-only">Name</span>
        <input
          name="name"
          type="text"
          required
          placeholder="Name"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Message"
          className={`${fieldClass} min-h-32 py-3`}
        />
      </label>
      <button
        type="submit"
        className="bg-ink px-6 py-3 font-semibold text-white transition hover:bg-navy-light"
      >
        Send Message
      </button>
    </form>
  );
}
