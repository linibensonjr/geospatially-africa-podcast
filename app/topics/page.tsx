import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/section-title";
import { TopicIcon } from "@/components/topic-icon";
import { getPublishedEpisodes, getTags } from "@/lib/data";
import { slugify } from "@/lib/format";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Topics",
  description: "Browse Geospatially Africa conversations by topic."
};

export default async function TopicsPage() {
  const [tags, episodes] = await Promise.all([getTags(), getPublishedEpisodes()]);
  const counts = new Map<string, number>();
  episodes.forEach((episode) => episode.tags.forEach((tag) => counts.set(tag.name, (counts.get(tag.name) || 0) + 1)));
  const activeTags = tags.filter((tag) => (counts.get(tag.name) || 0) > 0);

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Eyebrow>Explore the archive</Eyebrow>
        <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">Topics</h1>
        <p className="mt-5 max-w-2xl leading-8 text-ink-secondary">
          Find conversations about the tools, ideas, and people shaping the geospatial community.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeTags.map((tag) => (
            <Link key={tag.id} href={`/topics/${slugify(tag.name)}`} className="group rounded-brand border border-line bg-surface-warm p-6 shadow-card transition hover:-translate-y-0.5 hover:border-rust">
              <TopicIcon name={tag.name} />
              <h2 className="mt-5 font-display text-2xl text-ink transition-colors group-hover:text-rust">{tag.name}</h2>
              <p className="mt-2 text-sm text-ink-secondary">{counts.get(tag.name) || 0} conversations →</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
