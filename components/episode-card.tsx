import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/format";
import type { Episode } from "@/lib/types";

/** Grid tile used in "More episodes" rails: thumbnail, EP number, title. */
export function EpisodeCard({ episode }: { episode: Episode }) {
  const image = mediaUrl(episode.episode_image || episode.guest_image);

  return (
    <article className="episode-card group relative flex h-full min-w-0 flex-col overflow-hidden rounded-brand border border-line bg-surface-warm shadow-card transition duration-200 hover:-translate-y-1 hover:border-rust/60">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-lg text-rust/40">
            {episode.episode != null ? String(episode.episode) : "—"}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-rust">
          EP {episode.episode != null ? String(episode.episode).padStart(2, "0") : "—"}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-display text-base font-bold leading-snug text-ink transition-colors group-hover:text-rust">
          <Link
            href={`/episodes/${episode.slug}`}
            className="after:absolute after:inset-0"
          >
            {episode.title}
          </Link>
        </h3>
        {episode.guest && (
          <p className="mt-3 truncate text-xs font-medium text-ink-secondary">
            With {episode.guest}
          </p>
        )}
      </div>
    </article>
  );
}
