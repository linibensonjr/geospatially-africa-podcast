#!/usr/bin/env python3
"""Safely copy podcast data from Heroku Postgres into Supabase Postgres."""

from __future__ import annotations

import argparse
import os
import sys
from collections import defaultdict
from typing import Any, Iterable

import psycopg2
from dotenv import load_dotenv
from psycopg2 import sql
from psycopg2.extras import RealDictCursor


SOURCE_TABLES = {
    "episodes": "podcast_episode",
    "hosts": "podcast_hosts",
    "subscribers": "podcast_subscriber",
    "tags": "podcast_tags",
    "episode_tags": "podcast_episode_tag",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Migrate Django podcast rows from Heroku to Supabase."
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip the confirmation prompt after source introspection.",
    )
    parser.add_argument(
        "--inspect-only",
        action="store_true",
        help="Print discovered tables, columns, and counts without migrating.",
    )
    parser.add_argument(
        "--only-tags",
        action="store_true",
        help=(
            "Migrate only tags and episode/tag relationships. This safely "
            "repairs missing tags without updating episode content."
        ),
    )
    return parser.parse_args()


def connection_value(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"{name} is missing. Add it to .env before continuing.")
    return value


def table_columns(conn: Any, table: str) -> list[str]:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            select column_name
            from information_schema.columns
            where table_schema = 'public' and table_name = %s
            order by ordinal_position
            """,
            (table,),
        )
        return [row[0] for row in cursor.fetchall()]


def table_count(conn: Any, table: str) -> int:
    with conn.cursor() as cursor:
        cursor.execute(
            sql.SQL("select count(*) from {}").format(sql.Identifier(table))
        )
        return int(cursor.fetchone()[0])


def inspect_source(conn: Any) -> dict[str, list[str]]:
    discovered: dict[str, list[str]] = {}
    print("\nDiscovered Django source schema (connection strings are never shown):")
    for label, table in SOURCE_TABLES.items():
        columns = table_columns(conn, table)
        if not columns:
            raise RuntimeError(f"Required source table {table!r} was not found.")
        discovered[label] = columns
        print(f"- {table}: {table_count(conn, table)} rows")
        print(f"  columns: {', '.join(columns)}")
    return discovered


def read_all(conn: Any, table: str) -> list[dict[str, Any]]:
    with conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(sql.SQL("select * from {}").format(sql.Identifier(table)))
        return [dict(row) for row in cursor.fetchall()]


def clean(value: Any) -> Any:
    if isinstance(value, str):
        value = value.strip()
        return value or None
    return value


def upsert(
    conn: Any,
    table: str,
    values: dict[str, Any],
    conflict_column: str,
) -> int:
    columns = list(values)
    assignments = [
        sql.SQL("{} = excluded.{}").format(sql.Identifier(col), sql.Identifier(col))
        for col in columns
        if col != conflict_column
    ]
    if not assignments:
        # A one-column table such as tags still needs a valid update clause so
        # RETURNING id works for both new and existing natural keys.
        assignments = [
            sql.SQL("{} = excluded.{}").format(
                sql.Identifier(conflict_column),
                sql.Identifier(conflict_column),
            )
        ]
    query = sql.SQL(
        "insert into {table} ({columns}) values ({placeholders}) "
        "on conflict ({conflict}) do update set {assignments} returning id"
    ).format(
        table=sql.Identifier("public", table),
        columns=sql.SQL(", ").join(map(sql.Identifier, columns)),
        placeholders=sql.SQL(", ").join(sql.Placeholder() for _ in columns),
        conflict=sql.Identifier(conflict_column),
        assignments=sql.SQL(", ").join(assignments),
    )
    with conn.cursor() as cursor:
        cursor.execute(query, [values[col] for col in columns])
        target_id = int(cursor.fetchone()[0])
    conn.commit()
    return target_id


def record_failure(
    failures: list[str], conn: Any, table: str, key: Any, error: Exception
) -> None:
    conn.rollback()
    reason = " ".join(str(error).split())
    failures.append(f"{table} [{key!r}]: {reason}")


def migrate_named_rows(
    target: Any,
    rows: Iterable[dict[str, Any]],
    table: str,
    mapper: Any,
    conflict: str,
    key_name: str,
    failures: list[str],
) -> tuple[dict[Any, int], int]:
    id_map: dict[Any, int] = {}
    migrated = 0
    for row in rows:
        key = row.get(key_name)
        try:
            values = mapper(row)
            target_id = upsert(target, table, values, conflict)
            id_map[row.get("id")] = target_id
            migrated += 1
        except Exception as error:  # continue so one legacy row cannot stop the run
            record_failure(failures, target, table, key, error)
    return id_map, migrated


def run_migration(source: Any, target: Any) -> tuple[dict[str, int], list[str]]:
    failures: list[str] = []
    summary: dict[str, int] = defaultdict(int)

    host_rows = read_all(source, SOURCE_TABLES["hosts"])
    _, summary["hosts"] = migrate_named_rows(
        target,
        host_rows,
        "hosts",
        lambda row: {
            "name": clean(row.get("name")) or "Unknown host",
            "role": clean(row.get("role")),
            "bio": clean(row.get("bio")) or "",
            "image": clean(row.get("image")),
            "location": clean(row.get("location")),
            "linkedin": clean(row.get("linkedin")),
            "twitter": clean(row.get("twitter")),
        },
        "name",
        "name",
        failures,
    )

    tag_rows = read_all(source, SOURCE_TABLES["tags"])
    tag_id_map, summary["tags"] = migrate_named_rows(
        target,
        tag_rows,
        "tags",
        lambda row: {"name": clean(row.get("tags")) or "Uncategorized"},
        "name",
        "tags",
        failures,
    )

    episode_rows = read_all(source, SOURCE_TABLES["episodes"])
    episode_id_map, summary["episodes"] = migrate_named_rows(
        target,
        episode_rows,
        "episodes",
        lambda row: {
            "slug": clean(row.get("slug")),
            "title": clean(row.get("title")) or "Untitled episode",
            "summary": clean(row.get("summary")) or "",
            "description": clean(row.get("description")) or "",
            "season": row.get("season"),
            "episode": row.get("episode"),
            "published_date": row.get("published_date"),
            "host": clean(row.get("host")),
            "cohost": clean(row.get("cohost")),
            "guest": clean(row.get("guest")),
            "guest_bio": clean(row.get("guest_bio")),
            "guest_image": clean(row.get("guest_image")),
            "episode_image": clean(row.get("episode_image")),
            "link": clean(row.get("link")),
            "spotify": clean(row.get("spotify")),
            "applepodcast": clean(row.get("applepodcast")),
            "youtube": clean(row.get("youtube")),
            "chapters": clean(row.get("chapters")),
            "links_mentioned": clean(row.get("links_mentioned")),
            "created_at": row.get("created_date"),
        },
        "slug",
        "slug",
        failures,
    )

    subscriber_rows = read_all(source, SOURCE_TABLES["subscribers"])
    _, summary["subscribers"] = migrate_named_rows(
        target,
        subscriber_rows,
        "subscribers",
        lambda row: {
            "email": (clean(row.get("email")) or "").lower(),
            "is_active": row.get("is_active", True),
            "created_at": row.get("created_at"),
        },
        "email",
        "email",
        failures,
    )

    relationship_rows = read_all(source, SOURCE_TABLES["episode_tags"])
    for row in relationship_rows:
        source_episode_id = row.get("episode_id")
        source_tag_id = row.get("tags_id", row.get("tag_id"))
        try:
            episode_id = episode_id_map[source_episode_id]
            tag_id = tag_id_map[source_tag_id]
            with target.cursor() as cursor:
                cursor.execute(
                    """
                    insert into public.episode_tags (episode_id, tag_id)
                    values (%s, %s)
                    on conflict (episode_id, tag_id) do nothing
                    """,
                    (episode_id, tag_id),
                )
            target.commit()
            summary["episode_tags"] += 1
        except Exception as error:
            record_failure(
                failures,
                target,
                "episode_tags",
                f"{source_episode_id}/{source_tag_id}",
                error,
            )

    return dict(summary), failures


def migrate_tags_only(
    source: Any, target: Any
) -> tuple[dict[str, int], list[str]]:
    """Repair tags without touching any episode fields."""
    failures: list[str] = []
    summary: dict[str, int] = defaultdict(int)

    tag_rows = read_all(source, SOURCE_TABLES["tags"])
    tag_id_map, summary["tags"] = migrate_named_rows(
        target,
        tag_rows,
        "tags",
        lambda row: {"name": clean(row.get("tags")) or "Uncategorized"},
        "name",
        "tags",
        failures,
    )

    source_episodes = read_all(source, SOURCE_TABLES["episodes"])
    target_episode_ids: dict[Any, int] = {}
    with target.cursor() as cursor:
        for row in source_episodes:
            cursor.execute(
                "select id from public.episodes where slug = %s",
                (row.get("slug"),),
            )
            result = cursor.fetchone()
            if not result:
                # Some historical migrations used a shorter AutoSlugField
                # value. The episode title is a safe secondary match for
                # repairing relationships without updating episode content.
                cursor.execute(
                    "select id from public.episodes where title = %s",
                    (row.get("title"),),
                )
                result = cursor.fetchone()
            if result:
                target_episode_ids[row.get("id")] = int(result[0])

    relationship_rows = read_all(source, SOURCE_TABLES["episode_tags"])
    for row in relationship_rows:
        source_episode_id = row.get("episode_id")
        source_tag_id = row.get("tags_id", row.get("tag_id"))
        try:
            episode_id = target_episode_ids[source_episode_id]
            tag_id = tag_id_map[source_tag_id]
            with target.cursor() as cursor:
                cursor.execute(
                    """
                    insert into public.episode_tags (episode_id, tag_id)
                    values (%s, %s)
                    on conflict (episode_id, tag_id) do nothing
                    """,
                    (episode_id, tag_id),
                )
            target.commit()
            summary["episode_tags"] += 1
        except Exception as error:
            record_failure(
                failures,
                target,
                "episode_tags",
                f"{source_episode_id}/{source_tag_id}",
                error,
            )

    return dict(summary), failures


def main() -> int:
    load_dotenv()
    args = parse_args()

    try:
        source = psycopg2.connect(connection_value("HEROKU_DATABASE_URL"))
        source.set_session(readonly=True, autocommit=True)
        inspect_source(source)

        if args.inspect_only:
            print("\nInspection complete. No rows were written.")
            source.close()
            return 0

        if not args.yes:
            answer = input(
                "\nMigrate these rows into the configured Supabase database? "
                "Type MIGRATE to continue: "
            )
            if answer != "MIGRATE":
                print("Cancelled. No rows were written.")
                source.close()
                return 0

        target = psycopg2.connect(connection_value("SUPABASE_DB_URL"))
        if args.only_tags:
            summary, failures = migrate_tags_only(source, target)
        else:
            summary, failures = run_migration(source, target)
        target.close()
        source.close()

        print("\nMigration summary:")
        report_tables = (
            ("tags", "episode_tags")
            if args.only_tags
            else ("hosts", "tags", "episodes", "subscribers", "episode_tags")
        )
        for table in report_tables:
            print(f"- {table}: {summary.get(table, 0)} rows migrated")

        if failures:
            print("\nFailed rows:")
            for failure in failures:
                print(f"- {failure}")
            return 1

        print("\nMigration finished without row-level failures.")
        return 0
    except Exception as error:
        print(f"\nMigration stopped: {' '.join(str(error).split())}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
