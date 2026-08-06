"use client";

import { FormEvent, useState } from "react";

/** Compact boxed newsletter signup used in the Contact page sidebar. */
export function NewsletterCard() {
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          website: form.get("website")
        })
      });
      const result = (await response.json()) as {
        ok: boolean;
        message: string;
      };
      setOk(result.ok);
      setMessage(result.message);
      if (result.ok) event.currentTarget.reset();
    } catch {
      setOk(false);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-line bg-surface p-6">
      <h2 className="font-display text-xl text-ink">
        Get new episodes in your inbox
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-secondary">
        New episode alerts and occasional field notes. No spam, unsubscribe
        anytime.
      </p>
      <form onSubmit={subscribe} className="mt-4 flex gap-2">
        <label className="block flex-1">
          <span className="sr-only">First name</span>
          <input
            name="name"
            type="text"
            autoComplete="given-name"
            placeholder="Name"
            className="min-h-[48px] w-full border border-line bg-surface-warm px-3 text-sm text-ink placeholder:text-ink-muted focus:border-rust focus:outline-none"
          />
        </label>
        <label className="block flex-1">
          <span className="sr-only">Email address</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            className="min-h-[48px] w-full border border-line bg-surface-warm px-3 text-sm text-ink placeholder:text-ink-muted focus:border-rust focus:outline-none"
          />
        </label>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[10000px]"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={submitting}
          className="min-h-[48px] shrink-0 bg-ink px-4 text-sm font-semibold text-white transition hover:bg-navy-light disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "…" : "Subscribe"}
        </button>
      </form>
      <p
        className={`mt-2 min-h-4 text-xs ${
          ok === false ? "text-rust-dark" : "text-mint"
        }`}
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}
