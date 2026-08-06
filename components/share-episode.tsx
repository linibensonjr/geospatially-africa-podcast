"use client";

import { useState } from "react";

export function ShareEpisode({ title, url }: { title: string; url: string }) {
  const [message, setMessage] = useState("");
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
    } catch {
      setMessage("Use your browser address to copy the link");
    }
  }

  const buttonClass =
    "grid h-9 w-9 place-items-center rounded-full border border-line font-mono text-[0.62rem] font-medium uppercase text-ink-secondary transition hover:border-rust hover:text-rust";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
        Share
      </span>
      <div className="flex items-center gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          className={buttonClass}
          title="Share on X"
          aria-label="Share on X"
        >
          X
        </a>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          className={buttonClass}
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
        >
          WA
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          className={buttonClass}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          IN
        </a>
        <button
          type="button"
          onClick={copy}
          className={buttonClass}
          title="Copy link"
          aria-label="Copy episode link"
        >
          <span aria-hidden="true">🔗</span>
        </button>
      </div>
      <span className="min-w-0 text-xs text-ink-muted" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
