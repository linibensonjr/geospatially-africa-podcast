"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { EpisodeRow } from "@/components/episode-row";
import { Pagination } from "@/components/pagination";
import type { Episode, Tag } from "@/lib/types";

const PAGE_SIZE = 8;

export function EpisodesExplorer({
  episodes,
  tags,
  initialTag = "",
  initialQuery = ""
}: {
  episodes: Episode[];
  tags: Tag[];
  initialTag?: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [topic, setTopic] = useState(initialTag);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const isFirstRun = useRef(true);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return episodes.filter((episode) => {
      const topicMatches =
        !topic ||
        episode.tags.some(
          (tag) => tag.name.toLocaleLowerCase() === topic.toLocaleLowerCase()
        );
      const textMatches =
        !needle ||
        [
          episode.title,
          episode.summary,
          episode.guest ?? "",
          episode.host ?? "",
          ...episode.tags.map((tag) => tag.name)
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(needle);
      return topicMatches && textMatches;
    });
  }, [episodes, query, topic]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page_ = Math.min(page, pageCount);
  const paged = filtered.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [topic, query]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (topic) params.set("tag", topic);
    if (query.trim()) params.set("q", query.trim());
    const search = params.toString();
    const timeout = setTimeout(() => {
      router.replace(search ? `/episodes?${search}` : "/episodes", {
        scroll: false
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [topic, query, router]);

  function clearSearch() {
    setQuery("");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <label className="block sm:max-w-sm sm:flex-1">
          <span className="sr-only">Search episodes</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search episodes…"
            className="min-h-11 w-full border border-line bg-surface-warm px-4 text-sm text-ink outline-none transition focus:border-rust"
          />
        </label>

        <div
          className="-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-end sm:px-0"
          aria-label="Filter episodes by topic"
        >
          <button
            type="button"
            onClick={() => setTopic("")}
            aria-pressed={!topic}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
              !topic
                ? "border-ink bg-ink text-white"
                : "border-line bg-surface-warm text-ink-secondary hover:border-rust hover:text-rust"
            }`}
          >
            All
          </button>
          {tags.map((tag) => {
            const active =
              topic.toLocaleLowerCase() === tag.name.toLocaleLowerCase();
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setTopic(tag.name)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-surface-warm text-ink-secondary hover:border-rust hover:text-rust"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {query.trim() && (
        <div className="flex items-center justify-between pt-5 text-sm text-ink-secondary">
          <p>
            Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}{" "}
            for &ldquo;{query.trim()}&rdquo;
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="font-semibold text-rust underline underline-offset-2 hover:text-rust-dark"
          >
            Clear search
          </button>
        </div>
      )}

      {paged.length ? (
        <div>
          {paged.map((episode) => (
            <EpisodeRow key={episode.id} episode={episode} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No episodes match"
          message="Try a different topic or search phrase."
        />
      )}

      <Pagination page={page_} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}
