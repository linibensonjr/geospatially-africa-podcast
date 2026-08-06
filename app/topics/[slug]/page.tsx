import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { EpisodeCard } from "@/components/episode-card";
import { Eyebrow } from "@/components/section-title";
import { getPublishedEpisodes, getTags } from "@/lib/data";
import { slugify } from "@/lib/format";

export const revalidate = 3600;

export async function generateStaticParams() {
  const [tags, episodes] = await Promise.all([getTags(), getPublishedEpisodes()]);
  return tags
    .filter((tag) => episodes.some((episode) => episode.tags.some((item) => item.id === tag.id)))
    .map((tag) => ({ slug: slugify(tag.name) }));
}

async function getTopic(slug: string) {
  const tags = await getTags();
  return tags.find((tag) => slugify(tag.name) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const topic = await getTopic((await params).slug);
  return topic ? { title: topic.name, description: `Geospatially Africa episodes about ${topic.name}.` } : { title: "Topic not found" };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();
  const episodes = await getPublishedEpisodes({ tag: topic.name });
  if (!episodes.length) notFound();

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <Link href="/topics" className="text-sm font-medium text-ink-secondary hover:text-rust">← All topics</Link>
        <Eyebrow className="mt-8">Topic</Eyebrow>
        <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">{topic.name}</h1>
        <p className="mt-4 text-ink-secondary">{episodes.length} conversations in this topic.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)}
        </div>
      </Container>
    </section>
  );
}
