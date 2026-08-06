export type Tag = {
  id: number;
  name: string;
};

export type Host = {
  id: number;
  name: string;
  role: string | null;
  bio: string;
  image: string | null;
  location: string | null;
  linkedin: string | null;
  twitter: string | null;
};

export type Episode = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  transcript: string | null;
  season: number | null;
  episode: number | null;
  published_date: string | null;
  host: string | null;
  cohost: string | null;
  guest: string | null;
  guest_bio: string | null;
  guest_image: string | null;
  episode_image: string | null;
  link: string | null;
  audio_url: string | null;
  spotify: string | null;
  applepodcast: string | null;
  youtube: string | null;
  chapters: string | null;
  links_mentioned: string | null;
  created_at: string;
  tags: Tag[];
};
