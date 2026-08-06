import Image from "next/image";
import Link from "next/link";
import { formatDate, formatEpisodeMarker, mediaUrl } from "@/lib/format";
import type { Episode } from "@/lib/types";

/** A single row in an episode list: thumbnail, number, title, one-line summary. */
export function EpisodeRow({
  episode,
  size = "default"
}: {
  episode: Episode;
  size?: "default" | "large";
}) {
  const image = mediaUrl(episode.episode_image || episode.guest_image);
  const thumbSize = size === "large" ? "h-28 w-28 sm:h-32 sm:w-32" : "h-16 w-16";

  return (
    <article className="group relative flex items-center gap-4 border-b border-line py-5 transition-colors hover:bg-surface/40 sm:gap-6">
      <div
        className={`relative shrink-0 overflow-hidden bg-surface ${thumbSize}`}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-[0.6rem] text-rust/50">
            {episode.episode != null ? String(episode.episode) : "—"}
          </div>
        )}
      </div>

      <span
        className={`shrink-0 font-display text-rust ${
          size === "large" ? "text-3xl" : "text-2xl"
        }`}
      >
        {episode.episode != null
          ? String(episode.episode).padStart(2, "0")
          : "—"}
      </span>

      <div className="min-w-0 flex-1">
        <h3
          className={`font-display font-bold leading-snug text-ink transition-colors group-hover:text-rust ${
            size === "large" ? "text-2xl" : "text-lg"
          }`}
        >
          <Link
            href={`/episodes/${episode.slug}`}
            className="after:absolute after:inset-0"
          >
            {episode.title}
          </Link>
        </h3>
        <p
          className={`text-ink-secondary ${
            size === "large"
              ? "mt-2 line-clamp-2 max-w-2xl text-sm leading-6"
              : "mt-1 line-clamp-1 text-sm"
          }`}
        >
          {episode.summary}
        </p>
        <p className="mt-2 truncate font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-muted">
          {formatEpisodeMarker(episode.season, episode.episode)}
          {episode.guest ? ` · Guest: ${episode.guest}` : ""}
          {episode.published_date ? ` · ${formatDate(episode.published_date)}` : ""}
        </p>
      </div>
    </article>
  );
}
