export function getYouTubeId(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return validId(url.pathname.split("/").filter(Boolean)[0]);
    }
    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") return validId(url.searchParams.get("v"));
      const parts = url.pathname.split("/").filter(Boolean);
      if (["shorts", "embed", "live"].includes(parts[0])) {
        return validId(parts[1]);
      }
    }
  } catch {
    return validId(value);
  }

  return null;
}

function validId(value: string | null | undefined): string | null {
  if (!value) return null;
  const id = value.split(/[?&#/]/)[0];
  return /^[a-zA-Z0-9_-]{6,15}$/.test(id) ? id : null;
}

