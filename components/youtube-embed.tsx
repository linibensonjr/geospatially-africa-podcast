"use client";

import Image from "next/image";
import { useState } from "react";
import { getYouTubeId } from "@/lib/youtube";

export function YouTubeEmbed({
  url,
  title
}: {
  url: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  if (loaded) {
    return (
      <div className="relative aspect-video overflow-hidden bg-navy">
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="group relative block aspect-video w-full overflow-hidden bg-navy"
      onClick={() => setLoaded(true)}
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <span className="absolute inset-0 bg-navy/20 transition-colors group-hover:bg-navy/35" />
      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-orange text-white">
        <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
      </span>
    </button>
  );
}
