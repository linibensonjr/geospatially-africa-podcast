import type { Episode } from "@/lib/types";
import { mediaUrl } from "@/lib/format";

export function PodcastJsonLd({ episode, url }: { episode: Episode; url: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geospatiallyafrica.com";
  const directAudio = episode.audio_url || (/^https?:\/\/[^\s<]+$/i.test(episode.link || "") ? episode.link : null);
  const data = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    url,
    name: episode.title,
    description: episode.summary,
    datePublished: episode.published_date,
    image: mediaUrl(episode.episode_image) || `${siteUrl}/images/podcast-art.png`,
    associatedMedia: directAudio
      ? { "@type": "MediaObject", contentUrl: directAudio }
      : undefined,
    actor: [episode.host, episode.cohost, episode.guest]
      .filter(Boolean)
      .map((name) => ({ "@type": "Person", name })),
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Geospatially Africa Podcast",
      url: siteUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PodcastSeriesJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://geospatiallyafrica.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "Geospatially Africa Podcast",
    url: siteUrl,
    description: "Meaningful conversations about the geospatial industry in Africa and around the world.",
    image: `${siteUrl}/images/podcast-art.png`,
    author: { "@type": "Organization", name: "Geospatially Africa" },
    sameAs: [
      "https://open.spotify.com/show/7aqyurtRoF42hTysOqNa9v",
      "https://podcasts.apple.com/us/podcast/geospatially-africa-podcast-the-podcast-for/id1561204113",
      "https://www.youtube.com/channel/UCh27HyKTvXvofv1TiPhcSpA"
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
