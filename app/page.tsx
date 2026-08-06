import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { EpisodeCard } from "@/components/episode-card";
import { EpisodeRow } from "@/components/episode-row";
import { Newsletter } from "@/components/newsletter";
import {
  PlatformIcon,
  type PlatformName
} from "@/components/platform-icon";
import { Eyebrow } from "@/components/section-title";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { getHosts, getPublishedEpisodes, getTags } from "@/lib/data";
import { mediaUrl } from "@/lib/format";

export const revalidate = 3600;

const platforms: Array<{
  label: PlatformName;
  href: string;
  color: string;
}> = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/7aqyurtRoF42hTysOqNa9v",
    color: "bg-mint"
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/geospatially-africa-podcast-the-podcast-for/id1561204113",
    color: "bg-mint"
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCh27HyKTvXvofv1TiPhcSpA",
    color: "bg-mint"
  },
  {
    label: "RSS",
    href: "https://anchor.fm/geospatiallyafrica",
    color: "bg-mint"
  }
];

function hostFallback(name: string): string {
  if (name === "Iniobong Benson") return "/images/iniobong.jpg";
  if (name === "Opeyemi Kazeem-Jimoh") return "/images/ope.jpg";
  return "/images/guest-fallback.png";
}

export default async function HomePage() {
  const [episodes, tags, hosts] = await Promise.all([
    getPublishedEpisodes(),
    getTags(),
    getHosts()
  ]);
  const featured = episodes[0];
  const rest = episodes.slice(4, 7);
  const videos = episodes.filter((episode) => episode.youtube).slice(0, 3);
  const starterEpisodes = episodes
    .filter((episode) => episode.guest && episode.slug !== featured?.slug)
    .slice(0, 3);
  const activeTags = tags.filter((tag) =>
    episodes.some((episode) => episode.tags.some((item) => item.id === tag.id))
  );

  const [primaryHost, ...cohosts] = hosts;
  const byline = primaryHost
    ? `Hosted by ${primaryHost.name}` +
      (cohosts.length
        ? `, with ${cohosts.map((host) => host.name.split(" ")[0]).join(" and ")} as cohost${cohosts.length > 1 ? "s" : ""}`
        : "")
    : "";

  return (
    <>
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Eyebrow>A podcast for the African geospatial community</Eyebrow>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
              A continent of ideas deserves to hear itself clearly.
            </h1>
            <p className="mt-6 max-w-xl leading-8 text-ink-secondary">
              Geospatially Africa began with a simple conviction: the people
              mapping, measuring, and imagining Africa&apos;s future should
              not be footnotes in someone else&apos;s story. Their work should
              be heard—in their own voices.
            </p>
            {byline && (
              <p className="mt-4 font-display italic text-ink-secondary">
                {byline}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/episodes"
                className="inline-flex items-center rounded-full bg-rust px-5 py-3 text-sm font-semibold text-white transition hover:bg-rust-dark"
              >
                Listen to the show
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-rust hover:text-rust"
              >
                Our story
              </Link>
            </div>
          </div>

          {featured && (
            <Link
              href={`/episodes/${featured.slug}`}
              aria-label={`Listen to ${featured.title}`}
              className="group relative block aspect-square w-full overflow-hidden bg-surface"
            >
              {mediaUrl(featured.episode_image) ? (
                <Image
                  src={mediaUrl(featured.episode_image)!}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <Image
                  src="/images/podcast-art.png"
                  alt="Geospatially Africa Podcast artwork"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/30">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-ink text-white shadow-card transition-transform duration-200 group-hover:scale-105">
                  <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-current" />
                </span>
              </span>
              <span className="absolute bottom-3 left-3 bg-ink/75 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white">
                Latest conversation
              </span>
            </Link>
          )}
        </Container>
      </section>

      {activeTags.length > 0 && (
        <section className="border-t border-line py-10">
          <Container>
            <Eyebrow>Topics we cover</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/episodes?tag=${encodeURIComponent(tag.name)}`}
                  className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:border-rust hover:text-rust"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {featured && (
        <section className="border-t border-line py-10">
          <Container>
            <Eyebrow>Latest episode</Eyebrow>
            <div className="mt-4 border-t border-line">
              <EpisodeRow episode={featured} size="large" />
            </div>
          </Container>
        </section>
      )}

      {starterEpisodes.length > 0 && (
        <section className="border-t border-line py-14 sm:py-20">
          <Container>
            <Eyebrow>New here?</Eyebrow>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-2xl font-display text-3xl text-ink sm:text-4xl">
                Start with a conversation that makes the map bigger.
              </h2>
              <Link href="/episodes" className="text-sm font-semibold text-rust hover:text-rust-dark">
                Browse the full archive →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {starterEpisodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-line py-10">
        <Container>
          <Eyebrow>All episodes</Eyebrow>
          <div className="mt-4 border-t border-line">
            {rest.map((episode) => (
              <EpisodeRow key={episode.id} episode={episode} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/episodes"
              className="border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-rust hover:text-rust"
            >
              View All Episodes
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-8">
        <Container className="flex flex-wrap items-center justify-between gap-5">
          <p className="font-semibold text-ink">
            Listen wherever you get your podcasts
          </p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <a
                key={platform.label}
                href={platform.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 ${platform.color}`}
              >
                <PlatformIcon platform={platform.label} className="h-4 w-4" />
                {platform.label}
              </a>
            ))}
          </div>
        </Container>
      </section>

      {videos.length > 0 && (
        <section className="py-14 sm:py-20">
          <Container>
            <Eyebrow>Watch on YouTube</Eyebrow>
            <p className="mt-3 max-w-2xl leading-7 text-ink-secondary">
              Every episode is also filmed and published as a full video
              conversation, with the maps and data the guests are describing
              shown on screen.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((episode) => (
                <article key={episode.id} className="overflow-hidden rounded-brand border border-line bg-surface-warm shadow-card">
                  <div className="overflow-hidden bg-navy">
                    <YouTubeEmbed
                      url={episode.youtube!}
                      title={episode.title}
                    />
                  </div>
                  <div className="p-5">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-rust">
                    Episode {episode.episode ?? ""}
                  </p>
                  <Link
                    href={`/episodes/${episode.slug}`}
                    className="mt-1 block font-display text-lg font-bold leading-snug text-ink hover:text-rust"
                  >
                    {episode.title}
                  </Link>
                  </div>
                </article>
              ))}
            </div>
            <a
              href="https://www.youtube.com/channel/UCh27HyKTvXvofv1TiPhcSpA?sub_confirmation=1"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-rust px-5 py-3 text-sm font-semibold text-white transition hover:bg-rust-dark"
            >
              <PlatformIcon platform="YouTube" className="h-5 w-5" />
              Subscribe on YouTube
            </a>
          </Container>
        </section>
      )}

      {hosts.length > 0 && (
        <section className="border-t border-line py-14 sm:py-20">
          <Container>
            <Eyebrow>Hosted by</Eyebrow>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {hosts.map((host) => (
                <div key={host.id} className="flex items-start gap-4">
                  <Image
                    src={mediaUrl(host.image) || hostFallback(host.name)}
                    alt={host.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display font-bold text-ink">
                      {host.name}
                    </p>
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-rust">
                      {host.role || "Cohost"}
                    </p>
                    {host.bio && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-secondary">
                        {host.bio.replace(/<[^>]*>/g, " ")}
                      </p>
                    )}
                    {(host.linkedin || host.twitter) && (
                      <p className="mt-2 text-xs font-semibold text-ink-secondary">
                        {host.twitter && (
                          <a
                            href={host.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-rust"
                          >
                            X
                          </a>
                        )}
                        {host.twitter && host.linkedin && " · "}
                        {host.linkedin && (
                          <a
                            href={host.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-rust"
                          >
                            LinkedIn
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Newsletter />
    </>
  );
}
