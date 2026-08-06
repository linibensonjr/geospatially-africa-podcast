import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/audio-player";
import { Container } from "@/components/container";
import { EpisodeCard } from "@/components/episode-card";
import {
  PlatformIcon,
  type PlatformName
} from "@/components/platform-icon";
import { PodcastJsonLd } from "@/components/podcast-json-ld";
import { ShareEpisode } from "@/components/share-episode";
import { YouTubeEmbed } from "@/components/youtube-embed";
import {
  getAdjacentEpisodes,
  getEpisodeBySlug,
  getHosts,
  getPublishedEpisodes
} from "@/lib/data";
import {
  formatDate,
  mediaUrl,
  parseChapters,
  parseLinks,
  plainText
} from "@/lib/format";

export const revalidate = 3600;

const rssUrl = "https://anchor.fm/geospatiallyafrica";
const youtubeChannel =
  "https://www.youtube.com/channel/UCh27HyKTvXvofv1TiPhcSpA";

export async function generateStaticParams() {
  const episodes = await getPublishedEpisodes();
  return episodes.map((episode) => ({ slug: episode.slug }));
}

function personFallback(name: string | null): string {
  if (name === "Iniobong Benson") return "/images/iniobong.jpg";
  if (name === "Opeyemi Kazeem-Jimoh") return "/images/ope.jpg";
  return "/images/guest-fallback.png";
}

/** Small circular avatar + name, used inline in the "Hosted by" line. */
function HostChip({
  name,
  image
}: {
  name: string;
  image?: string | null;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Image
        src={mediaUrl(image) || personFallback(name)}
        alt={name}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full object-cover"
      />
      <span className="text-sm font-semibold text-ink">{name}</span>
    </span>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) return { title: "Episode not found" };
  const image = mediaUrl(episode.episode_image || episode.guest_image);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geospatiallyafrica.com";
  return {
    title: episode.title,
    description: episode.summary,
    alternates: { canonical: `${siteUrl}/episodes/${episode.slug}` },
    twitter: { card: "summary_large_image", title: episode.title, description: episode.summary, images: image ? [image] : ["/images/podcast-art.png"] },
    openGraph: {
      type: "article",
      title: episode.title,
      description: episode.summary,
      images: image ? [image] : ["/images/podcast-art.png"]
    }
  };
}

export default async function EpisodeDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [episode, hosts, adjacent, allEpisodes] = await Promise.all([
    getEpisodeBySlug(slug),
    getHosts(),
    getAdjacentEpisodes(slug),
    getPublishedEpisodes()
  ]);
  if (!episode) notFound();

  const chapters = parseChapters(episode.chapters);
  const resources = parseLinks(episode.links_mentioned);
  const host = hosts.find((item) => item.name === episode.host) ?? null;
  const cohost = hosts.find((item) => item.name === episode.cohost) ?? null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geospatiallyafrica.com";
  const episodeUrl = `${siteUrl}/episodes/${episode.slug}`;
  const image = mediaUrl(episode.episode_image || episode.guest_image);

  const primaryTag = episode.tags[0]?.name.toLocaleLowerCase();
  const others = allEpisodes.filter((item) => item.slug !== episode.slug);
  const sameTopic = primaryTag
    ? others.filter((item) =>
        item.tags.some((tag) => tag.name.toLocaleLowerCase() === primaryTag)
      )
    : [];
  const moreEpisodes = [
    ...sameTopic,
    ...others.filter((item) => !sameTopic.includes(item))
  ].slice(0, 3);

  const listeningPlatforms: Array<{ label: PlatformName; href: string }> = [
    ...(episode.spotify
      ? [{ label: "Spotify" as const, href: episode.spotify }]
      : []),
    ...(episode.applepodcast
      ? [{ label: "Apple Podcasts" as const, href: episode.applepodcast }]
      : []),
    { label: "YouTube", href: episode.youtube || youtubeChannel },
    { label: "RSS", href: rssUrl }
  ];

  return (
    <>
      <PodcastJsonLd episode={episode} url={episodeUrl} />
      <article>
        <Container className="py-10 sm:py-14">
          <Link
            href="/episodes"
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-secondary hover:text-rust"
          >
            ‹ All Episodes
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
            <div className="relative aspect-square w-full overflow-hidden bg-surface">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 340px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center font-mono text-sm text-rust/40">
                  Episode art
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-rust">
                Episode {episode.episode ?? "—"}
                {episode.published_date &&
                  ` · ${formatDate(episode.published_date)}`}
              </p>
              <h1 className="mt-3 font-display text-3xl leading-[1.1] text-ink sm:text-4xl">
                {episode.title}
              </h1>

              {episode.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {episode.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/episodes?tag=${encodeURIComponent(tag.name)}`}
                      className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-secondary transition-colors hover:border-rust hover:text-rust"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}

              <p className="mt-4 leading-7 text-ink-secondary">
                {episode.summary}
              </p>

              {(episode.audio_url || episode.link) && (
                <div className="mt-6">
                  <AudioPlayer
                    value={episode.audio_url || episode.link!}
                    title={episode.title}
                  />
                </div>
              )}

              <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-secondary">
                {listeningPlatforms.map((platform, index) => (
                  <span key={platform.label} className="inline-flex">
                    {index > 0 && <span className="mr-2">·</span>}
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold hover:text-rust"
                    >
                      {platform.label}
                    </a>
                  </span>
                ))}
              </p>

              <div className="mt-5">
                <ShareEpisode title={episode.title} url={episodeUrl} />
              </div>
            </div>
          </div>
        </Container>

        {episode.youtube && (
          <section className="border-t border-line py-12 sm:py-16">
            <Container>
              <div className="mx-auto max-w-3xl">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
                  Watch this episode
                </p>
                <div className="mt-4 overflow-hidden rounded-brand bg-navy shadow-card">
                  <YouTubeEmbed url={episode.youtube} title={episode.title} />
                </div>
              </div>
            </Container>
          </section>
        )}

        <Container className="border-t border-line py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
              Show notes
            </p>
            {episode.description ? (
              <div
                className="rich-text mt-5"
                dangerouslySetInnerHTML={{ __html: episode.description }}
              />
            ) : (
              <p className="mt-4 leading-8 text-ink-secondary">
                {episode.summary}
              </p>
            )}

            {chapters.length > 0 && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
                  Key takeaways
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {chapters.slice(0, 4).map((chapter, index) => (
                    <li
                      key={`${chapter.title}-${index}`}
                      className="border border-line bg-surface p-4 text-sm leading-6 text-ink-secondary"
                    >
                      <span className="mr-2 font-mono text-xs text-rust">
                        0{index + 1}
                      </span>
                      {chapter.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {episode.transcript && (
              <details className="mt-10 border-t border-line pt-8">
                <summary className="cursor-pointer font-display text-2xl text-ink">
                  Read the transcript
                </summary>
                <div className="rich-text mt-5 whitespace-pre-wrap">
                  {plainText(episode.transcript)}
                </div>
              </details>
            )}

            {resources.length > 0 && (
              <ul className="mt-5 space-y-2">
                {resources.map((resource, index) => (
                  <li key={`${resource.url}-${index}`}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-mint underline underline-offset-2 hover:text-ink"
                    >
                      {resource.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {chapters.length > 0 && (
              <div className="mt-10">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
                  In this episode
                </p>
                <ol className="mt-4 divide-y divide-line">
                  {chapters.map((chapter, index) => (
                    <li
                      key={`${chapter.time}-${index}`}
                      className="flex gap-5 py-3"
                    >
                      <span className="w-16 shrink-0 font-mono text-sm font-medium text-rust">
                        {chapter.time}
                      </span>
                      <span className="text-ink-secondary">
                        {chapter.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {(episode.host || episode.cohost) && (
              <div className="mt-10 border-t border-line pt-6">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
                  Hosted by
                </p>
                <div className="mt-3 flex flex-wrap gap-5">
                  {episode.host && (
                    <HostChip name={episode.host} image={host?.image} />
                  )}
                  {episode.cohost && (
                    <HostChip name={episode.cohost} image={cohost?.image} />
                  )}
                </div>
              </div>
            )}

            {episode.guest && (
              <div className="mt-10 border-t border-line pt-8">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-rust">
                  Meet the guest
                </p>
                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Image
                    src={
                      mediaUrl(episode.guest_image) ||
                      personFallback(episode.guest)
                    }
                    alt={episode.guest}
                    width={96}
                    height={96}
                    className="h-24 w-24 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-display text-2xl text-ink">
                      {episode.guest}
                    </h2>
                    <p className="mt-2 max-w-xl leading-7 text-ink-secondary">
                      {episode.guest_bio
                        ? plainText(episode.guest_bio)
                        : "A guest voice sharing experience, ideas, and perspective with the Geospatially Africa community."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>

        <nav
          className="border-t border-line py-8"
          aria-label="Previous and next episodes"
        >
          <Container className="grid gap-4 sm:grid-cols-2">
            <div>
              {adjacent.previous && (
                <Link
                  href={`/episodes/${adjacent.previous.slug}`}
                  className="block border border-line p-5 transition-colors hover:border-rust"
                >
                  <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-muted">
                    ← Previous episode
                  </span>
                  <span className="mt-2 block font-semibold text-ink">
                    {adjacent.previous.title}
                  </span>
                </Link>
              )}
            </div>
            <div>
              {adjacent.next && (
                <Link
                  href={`/episodes/${adjacent.next.slug}`}
                  className="block border border-line p-5 text-right transition-colors hover:border-rust"
                >
                  <span className="flex items-center justify-end gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-muted">
                    Next episode →
                  </span>
                  <span className="mt-2 block font-semibold text-ink">
                    {adjacent.next.title}
                  </span>
                </Link>
              )}
            </div>
          </Container>
        </nav>

        {moreEpisodes.length > 0 && (
          <section className="border-t border-line py-12 sm:py-16">
            <Container>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
                More episodes
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {moreEpisodes.map((item) => (
                  <EpisodeCard key={item.id} episode={item} />
                ))}
              </div>
            </Container>
          </section>
        )}
      </article>
    </>
  );
}
