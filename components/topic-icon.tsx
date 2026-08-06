function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21c-2.3-2.5-3.5-5.5-3.5-9S9.7 5.5 12 3Z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3-9 5 9 5 9-5-9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </svg>
  );
}

function SatelliteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 16-5 5M14 3l7 7-4 4-7-7 4-4ZM9 8l-3 3M16 15l-3 3" />
      <path d="M5 13a6 6 0 0 0 6 6M3 16a5 5 0 0 0 5 5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6V20" />
    </svg>
  );
}

export function TopicIcon({ name }: { name: string }) {
  const topic = name.toLocaleLowerCase();
  const Icon = topic.includes("software") || topic.includes("tool")
    ? CodeIcon
    : topic.includes("earth") || topic.includes("remote") || topic.includes("satellite")
      ? SatelliteIcon
      : topic.includes("community") || topic.includes("career") || topic.includes("people")
        ? PeopleIcon
        : topic.includes("data") || topic.includes("gis")
          ? LayersIcon
          : topic.includes("map")
            ? PinIcon
            : GlobeIcon;

  return (
    <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-current">
      <span className="h-5 w-5 [&_circle]:fill-none [&_circle]:stroke-current [&_circle]:stroke-[1.7] [&_path]:fill-none [&_path]:stroke-current [&_path]:stroke-[1.7] [&_path]:stroke-linecap-round [&_path]:stroke-linejoin-round">
        <Icon />
      </span>
    </span>
  );
}
