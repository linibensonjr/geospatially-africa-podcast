import Link from "next/link";
import { Container } from "@/components/container";

const listenLinks = [
  ["Spotify", "https://open.spotify.com/show/7aqyurtRoF42hTysOqNa9v"],
  ["Apple Podcasts", "https://podcasts.apple.com/us/podcast/geospatially-africa-podcast-the-podcast-for/id1561204113"],
  ["YouTube", "https://www.youtube.com/channel/UCh27HyKTvXvofv1TiPhcSpA"],
  ["RSS", "https://anchor.fm/geospatiallyafrica"]
] as const;

const socialLinks = [
  ["X", "https://twitter.com/geospatialy"],
  ["LinkedIn", "https://ng.linkedin.com/company/geospatially-africa"],
  ["GitHub", "https://github.com/geospatiallyafrica"]
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-warm">
      <Container className="grid gap-9 py-12 md:grid-cols-[1.5fr_0.85fr_0.85fr_0.95fr] md:py-16">
        <div>
          <p className="font-display text-xl font-bold text-ink">
            Geospatially Africa
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-ink-secondary">
            The podcast about everything geospatial—showcasing African talent,
            innovation, and expertise to the world.
          </p>
          <a
            href="mailto:gspatially@gmail.com"
            className="mt-4 inline-block text-sm font-semibold text-ink hover:text-rust"
          >
            gspatially@gmail.com
          </a>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            Navigate
          </h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/" className="text-ink-secondary hover:text-rust">
              Home
            </Link>
            <Link
              href="/episodes"
              className="text-ink-secondary hover:text-rust"
            >
              Episodes
            </Link>
            <Link href="/about" className="text-ink-secondary hover:text-rust">
              About
            </Link>
            <Link href="/topics" className="text-ink-secondary hover:text-rust">
              Topics
            </Link>
            <Link href="/guests" className="text-ink-secondary hover:text-rust">
              Guests
            </Link>
            <Link
              href="/contact"
              className="text-ink-secondary hover:text-rust"
            >
              Contact
            </Link>
          </div>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            Where to listen
          </h2>
          <div className="mt-4 grid gap-2 text-sm">
            {listenLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-ink-secondary hover:text-rust"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            Connect
          </h2>
          <div className="mt-4 grid gap-2 text-sm">
            {socialLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-ink-secondary hover:text-rust"
              >
                {label}
              </a>
            ))}
            <Link href="/contact" className="text-ink-secondary hover:text-rust">
              Become a guest or partner
            </Link>
            <Link href="/partners" className="text-ink-secondary hover:text-rust">
              Media & partnerships
            </Link>
          </div>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-wrap justify-between gap-2 py-5 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-ink-muted">
          <span>© {new Date().getFullYear()} Geospatially Africa Podcast</span>
          <span>Nigeria · Africa</span>
        </Container>
      </div>
    </footer>
  );
}
