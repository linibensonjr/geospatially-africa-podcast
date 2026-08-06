export function formatEpisodeMarker(
  season: number | null,
  episode: number | null
): string {
  const parts = [];
  if (season != null) parts.push(`S${season}`);
  if (episode != null) parts.push(`E${episode}`);
  return parts.join(" · ") || "EPISODE";
}

export function formatDate(value: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}

export function mediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("https://") || value.startsWith("http://")) return value;
  if (value.startsWith("/")) return value;

  const clean = value.replace(/^\/+/, "");
  if (clean.startsWith("image/upload/")) {
    return `https://res.cloudinary.com/linibenson/${clean}`;
  }
  return `https://res.cloudinary.com/linibenson/image/upload/${clean}`;
}

export function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function slugify(value: string): string {
  return value
    .toLocaleLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseChapters(
  value: string | null
): Array<{ time: string; title: string }> {
  if (!value) return [];
  return value.split(/\r?\n/).flatMap((line) => {
    const clean = line.trim();
    if (!clean) return [];
    const match = clean.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/);
    return match
      ? [{ time: match[1], title: match[2] }]
      : [{ time: "", title: clean }];
  });
}

export function parseLinks(
  value: string | null
): Array<{ label: string; url: string }> {
  if (!value) return [];
  return value.split(/\r?\n/).flatMap((line) => {
    const clean = line.trim();
    if (!clean) return [];
    const [label, ...urlParts] = clean.split("|");
    const url = (urlParts.join("|") || label).trim();
    return [{ label: (urlParts.length ? label : url).trim(), url }];
  });
}
