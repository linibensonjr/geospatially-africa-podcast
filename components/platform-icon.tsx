type PlatformName = "Spotify" | "Apple Podcasts" | "YouTube" | "RSS";

export function PlatformIcon({
  platform,
  className = "h-6 w-6"
}: {
  platform: PlatformName;
  className?: string;
}) {
  if (platform === "Spotify") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.58 14.42a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.36.21.47.68.25 1.03Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.55-11.97-1.4a.94.94 0 1 1-.54-1.8c4.36-1.31 9.78-.67 13.49 1.6.44.27.58.85.31 1.29Zm.13-3.4C14.3 7.45 7.9 7.23 4.2 8.35a1.12 1.12 0 1 1-.65-2.15c4.25-1.29 11.33-1.03 15.77 1.6a1.12 1.12 0 0 1-1.14 1.94Z"
        />
      </svg>
    );
  }

  if (platform === "Apple Podcasts") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3.25a7.25 7.25 0 0 0-3 13.85.9.9 0 0 0 .74-1.64 5.45 5.45 0 1 1 4.52 0 .9.9 0 1 0 .74 1.64A7.25 7.25 0 0 0 12 3.25Zm0 3.1a4.15 4.15 0 0 0-1.58 7.99.9.9 0 1 0 .68-1.67 2.35 2.35 0 1 1 1.8 0 .9.9 0 1 0 .68 1.67A4.15 4.15 0 0 0 12 6.35Zm0 3.05a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1Zm-1.25 4.45-.82 5.03A1.8 1.8 0 0 0 11.7 21h.6a1.8 1.8 0 0 0 1.77-2.12l-.82-5.03a3.1 3.1 0 0 1-2.5 0Z"
        />
      </svg>
    );
  }

  if (platform === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.11C17.63 4.58 12 4.58 12 4.58s-5.63 0-7.48.5a2.98 2.98 0 0 0-2.1 2.11A31.1 31.1 0 0 0 1.92 12c0 1.63.17 3.25.5 4.81a2.98 2.98 0 0 0 2.1 2.11c1.85.5 7.48.5 7.48.5s5.63 0 7.48-.5a2.98 2.98 0 0 0 2.1-2.11c.33-1.56.5-3.18.5-4.81 0-1.63-.17-3.25-.5-4.81ZM10 15.4V8.6l5.88 3.4L10 15.4Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM3.75 9v2.25c4.97 0 9 4.03 9 9H15C15 14.04 9.96 9 3.75 9Zm0 4.5v2.25a4.5 4.5 0 0 1 4.5 4.5h2.25a6.75 6.75 0 0 0-6.75-6.75Zm0 4.5v2.25H6A2.25 2.25 0 0 0 3.75 18Z"
      />
    </svg>
  );
}

export type { PlatformName };
