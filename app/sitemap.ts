import type { MetadataRoute } from "next";
import { getPublishedEpisodes } from "@/lib/data";
import { getTags } from "@/lib/data";
import { slugify } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://geospatiallyafrica.com";
  const [episodes, tags] = await Promise.all([
    getPublishedEpisodes(),
    getTags()
  ]);
  const guestSlugs = Array.from(
    new Set(
      episodes
        .filter((episode) => episode.guest)
        .map((episode) => slugify(episode.guest!))
    )
  );
  const activeTags = tags.filter((tag) =>
    episodes.some((episode) => episode.tags.some((item) => item.id === tag.id))
  );

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/episodes`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/topics`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guests`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/partners`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ...activeTags.map((tag) => ({
      url: `${base}/topics/${slugify(tag.name)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })),
    ...guestSlugs.map((slug) => ({
      url: `${base}/guests/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })),
    ...episodes.map((episode) => ({
      url: `${base}/episodes/${episode.slug}`,
      lastModified: episode.published_date || episode.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
