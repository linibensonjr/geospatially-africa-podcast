import { getSupabase } from "@/lib/supabase";
import type { Episode, Host, Tag } from "@/lib/types";

type RawEpisode = Omit<Episode, "tags"> & {
  episode_tags?: Array<{ tags: Tag | Tag[] | null }> | null;
};

const EPISODE_SELECT = `
  id, slug, title, summary, description, season, episode, published_date,
  host, cohost, guest, guest_bio, guest_image, episode_image, link, audio_url, spotify,
  applepodcast, youtube, chapters, links_mentioned, created_at,
  episode_tags(tags(id, name))
`;

const EPISODE_SELECT_WITH_TRANSCRIPT = `
  id, slug, title, summary, description, transcript, season, episode, published_date,
  host, cohost, guest, guest_bio, guest_image, episode_image, link, audio_url, spotify,
  applepodcast, youtube, chapters, links_mentioned, created_at,
  episode_tags(tags(id, name))
`;

const REPOSITORY_HOSTS: Host[] = [
  {
    id: -1,
    name: "Iniobong Benson",
    role: "Founder & Host",
    bio:
      "Geospatial analyst and earth observation specialist with an MSc from the University of Tartu & ITC, University of Twente. Works at the intersection of remote sensing, hydrological modelling, and spatial data science with a focus on Africa.",
    image: "/images/iniobong.jpg",
    location: null,
    linkedin: "https://www.linkedin.com/in/linibenson/",
    twitter: "https://twitter.com/linibenson"
  },
  {
    id: -2,
    name: "Opeyemi Kazeem-Jimoh",
    role: "Co-host",
    bio:
      "Geospatial Data Analyst and Cartographer with interests in disaster risk reduction through geo-hazard mapping, GIS for business, and promoting sustainable futures across Africa.",
    image: "/images/ope.jpg",
    location: null,
    linkedin: null,
    twitter: "https://twitter.com/oluremi_opeyemi"
  }
];

function normalizeEpisode(row: RawEpisode): Episode {
  const tags = (row.episode_tags ?? []).flatMap((item) => {
    if (!item.tags) return [];
    return Array.isArray(item.tags) ? item.tags : [item.tags];
  });
  const { episode_tags: _episodeTags, ...episode } = row;
  return { ...episode, transcript: episode.transcript ?? null, tags };
}

function reportDataError(area: string, error: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[Supabase:${area}]`, error);
  }
}

export async function getPublishedEpisodes(options?: {
  limit?: number;
  tag?: string;
  query?: string;
}): Promise<Episode[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase
    .from("episodes")
    .select(EPISODE_SELECT_WITH_TRANSCRIPT)
    .not("published_date", "is", null)
    .lte("published_date", new Date().toISOString())
    .order("published_date", { ascending: false });

  const firstResult = await query;
  let data: unknown = firstResult.data;
  let error = firstResult.error;
  if (error && (error.code === "PGRST204" || error.code === "42703" || error.message.toLowerCase().includes("transcript"))) {
    const fallback = await supabase
      .from("episodes")
      .select(EPISODE_SELECT)
      .not("published_date", "is", null)
      .lte("published_date", new Date().toISOString())
      .order("published_date", { ascending: false });
    data = fallback.data;
    error = fallback.error;
  }
  if (error) {
    reportDataError("episodes", error);
    return [];
  }

  let episodes = ((data ?? []) as unknown as RawEpisode[]).map(
    normalizeEpisode
  );
  if (options?.tag) {
    const selectedTag = options.tag.toLocaleLowerCase();
    episodes = episodes.filter((episode) =>
      episode.tags.some((tag) => tag.name.toLocaleLowerCase() === selectedTag)
    );
  }
  if (options?.query) {
    const search = options.query.toLocaleLowerCase();
    episodes = episodes.filter((episode) =>
      [
        episode.title,
        episode.summary,
        episode.description.replace(/<[^>]*>/g, " "),
        episode.guest ?? "",
        episode.host ?? "",
        ...episode.tags.map((tag) => tag.name)
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search)
    );
  }
  return options?.limit ? episodes.slice(0, options.limit) : episodes;
}

export async function getEpisodeBySlug(
  slug: string
): Promise<Episode | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("episodes")
    .select(EPISODE_SELECT_WITH_TRANSCRIPT)
    .eq("slug", slug)
    .not("published_date", "is", null)
    .lte("published_date", new Date().toISOString())
    .maybeSingle();

  if (error && (error.code === "PGRST204" || error.code === "42703" || error.message.toLowerCase().includes("transcript"))) {
    const fallback = await supabase
      .from("episodes")
      .select(EPISODE_SELECT)
      .eq("slug", slug)
      .not("published_date", "is", null)
      .lte("published_date", new Date().toISOString())
      .maybeSingle();
    if (fallback.error) reportDataError("episode", fallback.error);
    return fallback.data
      ? normalizeEpisode(fallback.data as unknown as RawEpisode)
      : null;
  }
  if (error) {
    reportDataError("episode", error);
    return null;
  }
  return data ? normalizeEpisode(data as unknown as RawEpisode) : null;
}

export async function getTags(): Promise<Tag[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tags")
    .select("id, name")
    .order("name");
  if (error) {
    reportDataError("tags", error);
    return [];
  }
  return (data ?? []) as Tag[];
}

export async function getHosts(): Promise<Host[]> {
  const supabase = getSupabase();
  if (!supabase) return REPOSITORY_HOSTS;
  const { data, error } = await supabase
    .from("hosts")
    .select("id, name, role, bio, image, location, linkedin, twitter")
    .order("id");
  if (error) {
    reportDataError("hosts", error);
    return REPOSITORY_HOSTS;
  }
  const databaseHosts = (data ?? []) as Host[];
  const databaseNames = new Set(databaseHosts.map((host) => host.name));
  return [
    ...databaseHosts,
    ...REPOSITORY_HOSTS.filter((host) => !databaseNames.has(host.name))
  ];
}

export async function getAdjacentEpisodes(
  slug: string
): Promise<{ previous: Episode | null; next: Episode | null }> {
  const episodes = await getPublishedEpisodes();
  const index = episodes.findIndex((episode) => episode.slug === slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: episodes[index + 1] ?? null,
    next: episodes[index - 1] ?? null
  };
}
