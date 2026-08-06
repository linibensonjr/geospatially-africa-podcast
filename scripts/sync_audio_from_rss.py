#!/usr/bin/env python3
"""Match public RSS enclosures to Supabase episodes by normalized title."""

from __future__ import annotations

import html
import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from difflib import get_close_matches

import psycopg2
from dotenv import load_dotenv


RSS_URL = "https://anchor.fm/s/4d881ba0/podcast/rss"


def normalize(value: str) -> str:
    value = re.sub(r"[^\w\s]", " ", html.unescape(value))
    return re.sub(r"\s+", " ", value).strip().casefold()


ITUNES_IMAGE = "{http://www.itunes.com/dtds/podcast-1.0.dtd}image"


def feed_media() -> dict[str, tuple[str, str]]:
    request = urllib.request.Request(
        RSS_URL,
        headers={"User-Agent": "GeospatiallyAfricaSite/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        root = ET.fromstring(response.read())

    result: dict[str, tuple[str, str]] = {}
    for item in root.findall("./channel/item"):
        title = item.findtext("title", default="")
        enclosure = item.find("enclosure")
        url = enclosure.get("url", "").strip() if enclosure is not None else ""
        image = item.find(ITUNES_IMAGE)
        image_url = image.get("href", "").strip() if image is not None else ""
        if title and url:
            result[normalize(title)] = (url, image_url)
    return result


def main() -> None:
    load_dotenv()
    database_url = os.getenv("SUPABASE_DB_URL", "").strip()
    if not database_url:
        raise RuntimeError("SUPABASE_DB_URL is missing from .env")

    media_by_title = feed_media()
    matched = 0
    missing: list[str] = []

    with psycopg2.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "alter table public.episodes "
                "add column if not exists audio_url text"
            )
            cursor.execute("select id, title from public.episodes order by id")
            episodes = cursor.fetchall()
            for episode_id, title in episodes:
                normalized_title = normalize(title)
                media = media_by_title.get(normalized_title)
                if not media:
                    close = get_close_matches(
                        normalized_title,
                        media_by_title,
                        n=1,
                        cutoff=0.78,
                    )
                    media = media_by_title.get(close[0]) if close else None
                if not media:
                    missing.append(title)
                    continue
                audio_url, image_url = media
                cursor.execute(
                    "update public.episodes "
                    "set audio_url = %s, "
                    "episode_image = coalesce(nullif(%s, ''), episode_image) "
                    "where id = %s",
                    (audio_url, image_url, episode_id),
                )
                matched += 1

    print(f"Audio URLs synced: {matched}/{len(episodes)}")
    if missing:
        print("No exact RSS match:")
        for title in missing:
            print(f"- {title}")


if __name__ == "__main__":
    main()
