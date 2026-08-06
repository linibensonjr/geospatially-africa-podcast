"use client";

import { FormEvent, useState } from "react";
import { Container } from "@/components/container";

export function Newsletter() {
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
    <section className="border-t border-line bg-surface py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">
          Get new episodes in your inbox
        </h2>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-ink-secondary">
          New episode alerts and occasional field notes from the team. No
          spam, unsubscribe anytime.
        </p>
        <form
          onSubmit={subscribe}
          className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label className="block sm:w-40">
            <span className="sr-only">First name</span>
            <input
              name="name"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              className="min-h-[52px] w-full border border-line bg-surface-warm px-4 text-ink placeholder:text-ink-muted focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
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
              className="min-h-[52px] w-full border border-line bg-surface-warm px-4 text-ink placeholder:text-ink-muted focus:border-rust focus:outline-none focus:ring-2 focus:ring-rust/10"
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
            className="min-h-[52px] shrink-0 bg-ink px-6 font-semibold text-white transition hover:bg-navy-light disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Joining…" : "Subscribe"}
          </button>
        </form>
        <p
          className={`mt-3 min-h-5 text-sm ${
          ok === false ? "text-rust-dark" : "text-mint"
          }`}
          aria-live="polite"
        >
          {message}
        </p>
        </div>
      </Container>
    </section>
  );
}
