import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { EpisodeCard } from "@/components/episode-card";
import { Eyebrow } from "@/components/section-title";
import { getPublishedEpisodes } from "@/lib/data";
import { mediaUrl, plainText, slugify } from "@/lib/format";

export const revalidate = 3600;

export async function generateStaticParams() {
  const episodes = await getPublishedEpisodes();
  return Array.from(new Set(episodes.filter((episode) => episode.guest).map((episode) => slugify(episode.guest!)))).map((slug) => ({ slug }));
}

async function getGuest(slug: string) {
  const episodes = await getPublishedEpisodes();
  return episodes.filter((episode) => episode.guest && slugify(episode.guest) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const episodes = await getGuest((await params).slug);
  return episodes[0]?.guest ? { title: episodes[0].guest, description: episodes[0].guest_bio ? plainText(episodes[0].guest_bio) : episodes[0].summary } : { title: "Guest not found" };
}

export default async function GuestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episodes = await getGuest(slug);
  const guest = episodes[0];
  if (!guest || !guest.guest) notFound();
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Link href="/guests" className="text-sm font-medium text-ink-secondary hover:text-rust">← All guests</Link>
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          <Image src={mediaUrl(guest.guest_image) || "/images/guest-fallback.png"} alt={guest.guest} width={128} height={128} className="h-32 w-32 rounded-full object-cover" />
          <div>
            <Eyebrow>Guest profile</Eyebrow>
            <h1 className="mt-2 font-display text-5xl text-ink">{guest.guest}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-ink-secondary">{guest.guest_bio ? plainText(guest.guest_bio) : guest.summary}</p>
          </div>
        </div>
        <h2 className="mt-14 font-display text-3xl text-ink">Featured conversations</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)}</div>
      </Container>
    </section>
  );
}
