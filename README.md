# Geospatially Africa — Next.js migration

This is the new Geospatially Africa Podcast website. It uses Next.js App
Router, TypeScript, Tailwind CSS, Supabase, and Netlify. The Django project next
to this directory was studied as a read-only reference and was not changed.

The website is deliberately safe to run before Supabase has any data. You will
see clear empty states until the migration is complete.

## What is included

- Homepage with the existing show story, latest episodes, topic links, and
  click-to-load YouTube videos
- Searchable published episode list with `?tag=Topic` filtering
- Episode detail pages with audio, video, show notes, chapters, resources,
  profiles, platform links, and previous/next navigation
- About page with live episode/season/guest counts and host profiles
- Contact page for guest nominations, partnerships, and general feedback
- Newsletter signup stored in Supabase with validation and a bot honeypot
- Supabase schema with Row Level Security
- Read-only, repeatable Heroku-to-Supabase migration script
- Dynamic sitemap, robots file, custom 404, and Netlify configuration

Blog, full-text search, support forms/pages, and any custom admin interface are
future work. For now, edit content in Supabase Dashboard → Table Editor.

## Setup checklist

Work through these sections in order. Keep Heroku running until the new site has
been tested on its real domain.

### 1. Create the Supabase project

1. Sign in to [Supabase](https://supabase.com/) and create a project.
2. Save the database password in your password manager.
3. In the project, open **SQL Editor**.
4. Copy all of [`supabase/schema.sql`](./supabase/schema.sql) into a new query
   and run it.
5. Open **Table Editor** and check that these tables exist:
   `episodes`, `hosts`, `tags`, `episode_tags`, and `subscribers`.
6. In **Project Settings → API**, copy the Project URL and anonymous/public key.
7. In **Project Settings → Database**, copy a Postgres connection string. Use
   the direct connection if your network supports IPv6; otherwise use the
   session pooler connection. This value is `SUPABASE_DB_URL` and is secret.

### 2. Back up Heroku before touching data

From a terminal where the Heroku CLI is signed in, replace `YOUR_HEROKU_APP`
with the real app name:

```bash
heroku pg:backups:capture --app YOUR_HEROKU_APP
heroku pg:backups:download --app YOUR_HEROKU_APP
```

The download creates `latest.dump`. Move that file somewhere safe **outside
this repository** and keep it until the migration and DNS change are fully
verified. Do not commit database dumps or connection strings.

Get the live Heroku database URL:

```bash
heroku config:get DATABASE_URL --app YOUR_HEROKU_APP
```

The URL is temporary and sensitive. Do not paste it into source code, chat,
screenshots, or a Git commit.

### 3. Add local environment values

1. Copy `.env.local.example` to `.env`.
2. Fill in all five values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
HEROKU_DATABASE_URL=postgresql://YOUR_HEROKU_CONNECTION
SUPABASE_DB_URL=postgresql://YOUR_SUPABASE_CONNECTION
```

Only the three `NEXT_PUBLIC_` values may be exposed to the web application.
`HEROKU_DATABASE_URL` and `SUPABASE_DB_URL` are database administrator secrets
used only by the Python migration script.

The `.gitignore` excludes `.env`, `.env.local`, database dumps, and common
connection-string files. Still check `git status` before every commit.

### 4. Inspect and migrate the database

Use a separate Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r scripts/requirements.txt
```

First inspect Heroku without writing anything:

```bash
python scripts/migrate_from_heroku.py --inspect-only
```

The script prints the discovered Django tables, columns, and row counts. Confirm
that they look right. It never prints either database URL.

Then run the migration:

```bash
python scripts/migrate_from_heroku.py
```

If episodes already migrated but their tags are missing, repair only the tags
and relationships without touching episode fields:

```bash
python scripts/migrate_from_heroku.py --only-tags
```

After inspection, type `MIGRATE` exactly when prompted. The source Heroku
connection is put in read-only mode, so the script only selects from it.
Supabase writes use upserts on:

- episode slug
- host name
- tag name
- subscriber email
- episode/tag pair

That means the script can be run again without creating duplicates. It prints a
per-table summary and lists failed rows with reasons. The retired
`googlepodcast` source column is ignored.

Afterward, compare counts in Supabase Table Editor with the counts printed by
the script. Spot-check several episode pages, images, tags, host profiles,
audio embeds, chapters, and resource links.

The custom website player uses the show&apos;s public RSS enclosures. Sync
direct audio URLs and episode artwork after the main migration, or whenever
the feed changes:

```bash
python scripts/sync_audio_from_rss.py
```

The sync matches feed items to existing episodes by normalized title and does
not create or delete episodes.

### 5. Install and run the website locally

Node.js 20 is recommended:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Also test:

- `/episodes`
- an episode detail link
- `/episodes?tag=GIS` using a real migrated tag
- `/about`
- newsletter signup with a test address
- a deliberately missing URL to see the 404 page

Before deployment, run:

```bash
npm run build
```

### 6. Deploy to Netlify

1. Create a new Git repository in this directory and push it to your Git host.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the repository. `netlify.toml` already sets `npm run build`.
4. In **Site configuration → Environment variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` set to the final `https://` domain
5. Do **not** add `HEROKU_DATABASE_URL` or `SUPABASE_DB_URL` to Netlify. The
   deployed site does not use them.
6. Deploy, open the Netlify preview URL, and repeat the local test checklist.
7. Test newsletter signup again and confirm the address appears in the
   `subscribers` table.

### 7. Flip DNS only after verification

1. Add the production domain in Netlify.
2. Follow Netlify's displayed DNS records at your DNS provider.
3. Wait for HTTPS to become active.
4. Open the production domain and check the home, archive, several episodes,
   about page, sitemap at `/sitemap.xml`, and newsletter.
5. Keep Heroku running during this period. DNS changes can take time to reach
   everyone.

### 8. Decommission Heroku last

Only decommission Heroku after:

- the Supabase migration counts and content have been checked
- the Netlify production site is healthy
- DNS and HTTPS work reliably
- the final Heroku database dump is stored safely outside the repo
- you have allowed enough time to catch missed links or content

Cancel or remove the Heroku app and database **last**. Do not delete the backup.

## Project structure

```text
app/                    Next.js routes, metadata, API, and global styles
components/             Shared cards, navigation, newsletter, and video facade
lib/                    Supabase client, queries, types, and parsing utilities
public/images/          Artwork copied from the Django site
scripts/                Standalone Python migration and requirements
supabase/schema.sql     Tables, indexes, grants, and RLS policies
DESIGN_NOTES.md         Exact source study and design decisions
netlify.toml            Netlify build configuration
```

## Content and security notes

- Public users can read podcast content and insert newsletter subscriptions.
- Row Level Security prevents public select/update/delete on subscribers.
- The website displays only episodes whose `published_date` is set and is not
  in the future, even though content tables are publicly readable as requested.
- Stored show-note and host-bio HTML is rendered as trusted editor content.
  Only give Supabase Table Editor access to trusted administrators.
- Images can load from YouTube thumbnails, Cloudinary legacy URLs, and Supabase
  project storage domains.
- YouTube does not load an iframe or tracking-heavy player until a visitor
  presses play.
