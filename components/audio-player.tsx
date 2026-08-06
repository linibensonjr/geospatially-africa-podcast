"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

function decodeStoredHtml(value: string): string {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

function spotifyEmbed(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.hostname !== "open.spotify.com") return null;
    const [type, id] = url.pathname.split("/").filter(Boolean);
    if (!["episode", "show"].includes(type) || !id) return null;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}

function anchorEmbed(value: string): string | null {
  try {
    const url = new URL(value);
    if (!["anchor.fm", "podcasters.spotify.com"].includes(url.hostname)) {
      return null;
    }
    if (url.pathname.includes("/embed/")) return value;
    const episodeMatch = url.pathname.match(
      /^(\/pod\/show)?\/([^/]+)\/episodes\/([^/?#]+)/
    );
    if (!episodeMatch) return null;
    return `https://podcasters.spotify.com/pod/show/${episodeMatch[2]}/embed/episodes/${episodeMatch[3]}`;
  } catch {
    return null;
  }
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.floor(seconds % 60);
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${minutes}:${String(remainder).padStart(2, "0")}`;
}

/** Circular-arrow skip icon with the jump length printed inside the ring. */
function SkipIcon({ seconds, back }: { seconds: number; back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden="true">
      <path
        fill="currentColor"
        transform={back ? undefined : "translate(24,0) scale(-1,1)"}
        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
      />
      <text
        x="12"
        y="13.6"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="8.5"
        fontWeight="700"
        fill="currentColor"
      >
        {seconds}
      </text>
    </svg>
  );
}

function NativeAudioPlayer({
  source,
  title
}: {
  source: string;
  title: string;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  // Show the seek-bar focus ring for keyboard users only, never while dragging.
  const [keyFocus, setKeyFocus] = useState(false);
  const viaPointer = useRef(false);

  const seekable = duration > 0 && Number.isFinite(duration);
  const shownTime = dragRatio != null ? dragRatio * duration : current;
  const progress = seekable ? Math.min(1, shownTime / duration) : 0;

  useEffect(() => {
    const element = audio.current;
    if (!element) return;

    const onTime = () => setCurrent(element.currentTime);
    const onMeta = () => setDuration(element.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onWaiting = () => setWaiting(true);
    const onPlaying = () => setWaiting(false);
    const onProgress = () => {
      if (!element.buffered.length) return;
      setBuffered(element.buffered.end(element.buffered.length - 1));
    };

    element.addEventListener("timeupdate", onTime);
    element.addEventListener("loadedmetadata", onMeta);
    element.addEventListener("durationchange", onMeta);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    element.addEventListener("ended", onEnded);
    element.addEventListener("waiting", onWaiting);
    element.addEventListener("playing", onPlaying);
    element.addEventListener("canplay", onPlaying);
    element.addEventListener("progress", onProgress);

    return () => {
      element.removeEventListener("timeupdate", onTime);
      element.removeEventListener("loadedmetadata", onMeta);
      element.removeEventListener("durationchange", onMeta);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("pause", onPause);
      element.removeEventListener("ended", onEnded);
      element.removeEventListener("waiting", onWaiting);
      element.removeEventListener("playing", onPlaying);
      element.removeEventListener("canplay", onPlaying);
      element.removeEventListener("progress", onProgress);
    };
  }, []);

  async function toggle() {
    const element = audio.current;
    if (!element) return;
    if (element.paused) {
      try {
        await element.play();
      } catch {
        setPlaying(false);
      }
    } else {
      element.pause();
    }
  }

  const seekTo = useCallback(
    (seconds: number) => {
      const element = audio.current;
      if (!element || !seekable) return;
      element.currentTime = Math.min(duration, Math.max(0, seconds));
      setCurrent(element.currentTime);
    },
    [duration, seekable]
  );

  function skip(seconds: number) {
    const element = audio.current;
    if (!element) return;
    seekTo(element.currentTime + seconds);
  }

  function ratioAt(clientX: number): number {
    const element = track.current;
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!seekable) return;
    viaPointer.current = true;
    setKeyFocus(false);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragRatio(ratioAt(event.clientX));
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!seekable) return;
    const ratio = ratioAt(event.clientX);
    setHoverRatio(ratio);
    if (dragRatio != null) setDragRatio(ratio);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRatio == null) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    seekTo(dragRatio * duration);
    setDragRatio(null);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    setKeyFocus(true);
    if (!seekable) return;
    const jump: Record<string, number> = {
      ArrowRight: 5,
      ArrowLeft: -5,
      PageUp: 60,
      PageDown: -60
    };
    if (event.key in jump) {
      event.preventDefault();
      skip(jump[event.key]);
    } else if (event.key === "Home") {
      event.preventDefault();
      seekTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      seekTo(duration);
    }
  }

  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audio.current) audio.current.playbackRate = next;
  }

  function changeVolume(value: number) {
    setVolume(value);
    setMuted(value === 0);
    if (audio.current) {
      audio.current.volume = value;
      audio.current.muted = value === 0;
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (audio.current) audio.current.muted = next;
  }

  const controlClass =
    "grid h-9 w-9 place-items-center rounded-full text-ink-secondary transition hover:bg-surface hover:text-rust focus-visible:bg-surface focus-visible:text-rust";

  return (
    <div className="rounded-brand border border-line bg-surface p-4 shadow-card sm:p-5">
      <audio ref={audio} preload="metadata" src={source} />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-rust">
            Listen now
          </p>
          <p className="mt-1 line-clamp-1 text-sm font-semibold text-ink">
            {title}
          </p>
        </div>
        <span className="hidden rounded-full bg-rust-soft px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-rust sm:inline-flex">
          Audio episode
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause episode" : "Play episode"}
          className="group relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-200 hover:scale-[1.06] active:scale-95"
        >
          {waiting && (
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-rust" />
          )}
          {playing ? (
            <span className="flex gap-[5px]">
              <span className="h-5 w-[5px] rounded-sm bg-current" />
              <span className="h-5 w-[5px] rounded-sm bg-current" />
            </span>
          ) : (
            <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-current" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div
            ref={track}
            role="slider"
            tabIndex={0}
            aria-label="Seek through the episode"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(shownTime) || 0}
            aria-valuetext={`${formatTime(shownTime)} of ${formatTime(duration)}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={() => setHoverRatio(null)}
            onKeyDown={onKeyDown}
            onFocus={() => setKeyFocus(!viaPointer.current)}
            onBlur={() => {
              setKeyFocus(false);
              viaPointer.current = false;
            }}
            className={`group relative flex h-6 items-center rounded-full outline-none ${
              seekable ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {hoverRatio != null && seekable && (
              <span
                className="pointer-events-none absolute -top-7 z-10 -translate-x-1/2 rounded-brand bg-ink px-2 py-1 font-mono text-[0.6rem] font-medium text-white"
                style={{ left: `${hoverRatio * 100}%` }}
              >
                {formatTime(hoverRatio * duration)}
              </span>
            )}

            <span
              className={`relative h-1.5 w-full overflow-hidden rounded-full bg-line ${
                keyFocus ? "ring-2 ring-rust ring-offset-2 ring-offset-surface-warm" : ""
              }`}
            >
              {seekable && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-ink/10"
                  style={{
                    width: `${Math.min(1, buffered / duration) * 100}%`
                  }}
                />
              )}
              <span
                className={`absolute inset-y-0 left-0 rounded-full bg-rust ${
                  dragRatio == null ? "transition-[width] duration-150" : ""
                }`}
                style={{ width: `${progress * 100}%` }}
              />
            </span>

            <span
              className={`pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-rust shadow-card transition-transform duration-150 ${
                dragRatio != null
                  ? "scale-125"
                  : keyFocus
                    ? "scale-100"
                    : "scale-0 group-hover:scale-100"
              }`}
              style={{ left: `${progress * 100}%` }}
            />
          </div>

          <div className="mt-1 flex items-center justify-between font-mono text-[0.65rem] tabular-nums text-ink-muted">
            <span>{formatTime(shownTime)}</span>
            <span>{seekable ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => skip(-15)}
            className={controlClass}
            title="Back 15 seconds"
            aria-label="Rewind 15 seconds"
          >
            <SkipIcon seconds={15} back />
          </button>
          <button
            type="button"
            onClick={() => skip(30)}
            className={controlClass}
            title="Forward 30 seconds"
            aria-label="Skip forward 30 seconds"
          >
            <SkipIcon seconds={30} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={toggleMute}
              className={controlClass}
              title={muted ? "Unmute" : "Mute"}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5 6.5 9H4v6h2.5L11 19V5Z" />
                {muted || volume === 0 ? (
                  <path d="m15.5 10 4 4m0-4-4 4" />
                ) : (
                  <path d="M15 9.5a3.5 3.5 0 0 1 0 5M17.5 7a7 7 0 0 1 0 10" />
                )}
              </svg>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              aria-label="Volume"
              className="audio-volume h-1 w-20 cursor-pointer appearance-none rounded-full bg-line"
            />
          </div>

          <button
            type="button"
            onClick={cycleSpeed}
            title="Playback speed"
            aria-label={`Playback speed ${speed}×`}
            className="min-w-[3.1rem] rounded-full px-2.5 py-1.5 font-mono text-[0.68rem] font-medium text-ink-secondary transition hover:bg-surface hover:text-rust"
          >
            {speed}×
          </button>
        </div>
      </div>
    </div>
  );
}

export function AudioPlayer({
  value,
  title
}: {
  value: string;
  title: string;
}) {
  const decoded = decodeStoredHtml(value.trim());

  if (/\.(mp3|m4a|wav|ogg)(\?.*)?$/i.test(decoded)) {
    return <NativeAudioPlayer source={decoded} title={title} />;
  }

  if (/<iframe[\s>]/i.test(decoded)) {
    return (
      <div
        className="audio-embed overflow-hidden rounded-brand border border-line bg-surface shadow-card"
        dangerouslySetInnerHTML={{ __html: decoded }}
      />
    );
  }

  const embedUrl = spotifyEmbed(decoded) || anchorEmbed(decoded);
  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={`Listen to ${title}`}
        width="100%"
        height="152"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="block w-full rounded-brand border border-line bg-surface shadow-card"
      />
    );
  }

  return (
    <a
      href={decoded}
      target="_blank"
      rel="noreferrer"
      className="inline-flex bg-blue px-5 py-3 text-sm font-bold text-white"
    >
      Open audio episode →
    </a>
  );
}
