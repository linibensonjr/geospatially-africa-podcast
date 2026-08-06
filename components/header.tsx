"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/container";

const links = [
  { href: "/episodes", label: "Episodes" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface-warm/90 backdrop-blur-md">
      <Container>
        <div className="flex min-h-[76px] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Geospatially Africa home"
            className="flex items-center"
          >
            <Image
              src="/images/logo.png"
              alt="Geospatially Africa"
              width={126}
              height={57}
              priority
              className="h-auto w-[112px] sm:w-[126px]"
            />
          </Link>

          <nav className="hidden items-center gap-2 sm:flex" aria-label="Main">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 text-[0.9rem] font-medium transition-colors ${
                    active ? "text-rust" : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/episodes"
              className="ml-2 inline-flex items-center rounded-full bg-rust px-5 py-2.5 text-[0.85rem] font-semibold text-white transition hover:bg-rust-dark"
            >
              Listen Now
            </Link>
          </nav>

          <details className="group relative sm:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-brand border border-line bg-surface-warm px-3 py-2 text-sm font-bold text-ink">
              Menu
              <span className="grid gap-[3px]">
                <span className="block h-px w-3.5 bg-current" />
                <span className="block h-px w-3.5 bg-current" />
                <span className="block h-px w-3.5 bg-current" />
              </span>
            </summary>
            <nav
              className="absolute right-0 top-14 grid min-w-48 gap-1 rounded-brand border border-line bg-surface-warm p-2 shadow-card"
              aria-label="Mobile"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-brand px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-rust-soft text-rust"
                      : "text-ink-secondary hover:bg-surface hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/episodes"
                className="mt-1 rounded-brand bg-rust px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Listen Now
              </Link>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
