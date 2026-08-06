import Link from "next/link";

export function EmptyState({
  title,
  message,
  link
}: {
  title: string;
  message: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="border-y border-line bg-transparent py-14 text-center">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-orange">
        Episode status
      </p>
      <h2 className="mt-3 text-2xl font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-secondary">
        {message}
      </p>
      {link && (
        <Link
          href={link.href}
          className="mt-6 inline-flex bg-orange px-5 py-3 text-sm font-bold text-white hover:opacity-85"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
