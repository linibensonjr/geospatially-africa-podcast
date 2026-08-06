import type { ElementType, ReactNode } from "react";

/** Plain serif section heading, used under an Eyebrow across the site. */
export function SectionTitle({
  children,
  as: Tag = "h2",
  className = ""
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={`font-display text-3xl text-ink sm:text-4xl ${className}`}>
      {children}
    </Tag>
  );
}

/** Small uppercase mono eyebrow that sits above a SectionTitle. */
export function Eyebrow({
  children,
  className = "",
  tone = "rust"
}: {
  children: ReactNode;
  className?: string;
  tone?: "rust" | "muted" | "light";
}) {
  const color =
    tone === "muted"
      ? "text-ink-secondary"
      : tone === "light"
        ? "text-white/50"
        : "text-rust";
  return (
    <p
      className={`font-mono text-[0.7rem] uppercase tracking-[0.1em] ${color} ${className}`}
    >
      {children}
    </p>
  );
}
