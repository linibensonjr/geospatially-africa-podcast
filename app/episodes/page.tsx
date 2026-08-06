import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/section-title";
import { EpisodesExplorer } from "@/components/episodes-explorer";
import { getPublishedEpisodes, getTags } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Episodes",
  description:
    "Explore conversations with Africa's geospatial experts, innovators, and practitioners."
};

export default async function EpisodesPage({
  searchParams
}: {
  searchParams: Promise<{ tag?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialTag = typeof params.tag === "string" ? params.tag.trim() : "";
  const initialQuery = typeof params.q === "string" ? params.q.trim() : "";
  const [episodes, tags] = await Promise.all([
    getPublishedEpisodes(),
    getTags()
  ]);

  return (
    <>
      <section className="border-b border-line py-12 sm:py-16">
        <Container>
          <Eyebrow>The show</Eyebrow>
          <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">
            All Episodes
          </h1>
          <p className="mt-5 max-w-2xl leading-8 text-ink-secondary">
            Explore conversations with the people applying geospatial technology across Africa and around the world.
          </p>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <EpisodesExplorer
            episodes={episodes}
            tags={tags}
            initialTag={initialTag}
            initialQuery={initialQuery}
          />
        </Container>
      </section>
    </>
  );
}
