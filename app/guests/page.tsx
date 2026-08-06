import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/section-title";
import { getPublishedEpisodes } from "@/lib/data";
import { slugify } from "@/lib/format";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Guests", description: "Meet the guests featured on Geospatially Africa." };

export default async function GuestsPage() {
  const episodes = await getPublishedEpisodes();
  const guests = Array.from(new Map(episodes.filter((episode) => episode.guest).map((episode) => [episode.guest, episode])).values());
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Eyebrow>The people we learn from</Eyebrow>
        <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">Guests</h1>
        <p className="mt-5 max-w-2xl leading-8 text-ink-secondary">Explore the people, projects, and perspectives behind the conversations.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((episode) => (
            <Link key={episode.guest} href={`/guests/${slugify(episode.guest!)}`} className="group rounded-brand border border-line bg-surface-warm p-6 shadow-card transition hover:-translate-y-0.5 hover:border-rust">
              <h2 className="font-display text-2xl text-ink transition-colors group-hover:text-rust">{episode.guest}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-secondary">{episode.guest_bio ? episode.guest_bio.replace(/<[^>]*>/g, " ") : episode.summary}</p>
              <p className="mt-4 text-sm font-semibold text-rust">View episode →</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
