# Django source study

This document records the source facts used for the Next.js migration. The
reference application is `../geospatially-africa-podcast`; it was not modified.

## Design tokens and visual language

The brief describes the navy/orange version of the site. Those exact values are
present in the repository's `4aa764e` stylesheet revision:

| Token | Exact value |
| --- | --- |
| Navy | `#0c1e32` |
| Navy light | `#152d47` |
| Orange accent | `#e85d3a` |
| Orange dark | `#c9472a` |
| Orange soft | `rgba(232, 93, 58, 0.08)` |
| Charcoal / primary text | `#1a1a2e` |
| Secondary text | `#64748b` |
| Muted text | `#94a3b8` |
| Surface | `#f8fafc` |
| Warm surface | `#faf8f5` |
| White | `#ffffff` |
| Border | `#e2e8f0` |
| Light border | `#f1f5f9` |

The fonts are `DM Sans` for display and body copy and `DM Mono` for episode
numbers, metadata, eyebrows, roles, locations, and statistics. The source uses
body line-height `1.7`, headings at `1.2`, and long show-note text up to `1.9`.

The navy/orange stylesheet defines radii of `6px`, `10px`, `16px`, `24px`, and
`32px`. The migration brief tightens the new interface to the small end of that
scale, so interactive controls and cards use 4–6px. Common source spacing is
24px horizontal container padding, 14–24px internal card gaps, 16–24px card
padding, and 56–80px section padding (88–100px for large heroes). The requested
new rhythm is 48px on mobile and 64–80px on desktop.

Cards in the source are white, use a 1px cool-gray border, and have restrained
shadows. Episode cards use a 16:9 media region, compact mono season/episode
metadata, a strong DM Sans title, secondary summary text, and soft-accent tag
pills. The new implementation retains that language while removing lift and
scale animations.

### Current checkout discrepancy

The checked-out `podcast/static/css/main.css` is a later committed redesign. Its
current extracted tokens are: `#ffffff` background, `#f6f7f9` soft background,
`#14171c` ink, `#5b6472` secondary ink, `#98a2b3` muted ink, `#e5e8eb` border,
`#eef0f2` light border, `#801625` maroon accent, `#5c101b` accent dark,
`#98839f` logo mauve, and `#14161a` dark band. It uses 8/12/16/20/28px radii.
Because the migration brief explicitly and repeatedly makes navy + orange +
small radii non-negotiable, this build uses the exact earlier navy/orange
tokens above rather than silently substituting the newer maroon redesign.

### Current public palette

The active interface is a restrained, mobile-first alternative rather than a
logo-led or graphics-heavy treatment. It uses deep green ink `#15231f`, forest
accent `#287a59`, muted terracotta `#c85d3f`, warm off-white `#fbfaf6`, and
light gray-green surfaces `#f5f6f3`. Layout relies on typography, borders, and
compact vertical rhythm; shadows and decorative graphics are deliberately
minimal. The historical values above remain documented as source facts.

## Django models and database tables

### `Episode` → `podcast_episode`

- `id`: Django `BigAutoField`
- `season`: nullable integer
- `episode`: nullable integer
- `title`: string, max 200
- `link`: string, max 1500; stored audio embed HTML
- `applepodcast`: string, max 1500
- `youtube`: nullable/blank URL, max 1500
- `spotify`: string, max 1500
- `summary`: string, max 1500
- `description`: text containing HTML
- `tag`: many-to-many relation to `Tags`
- `host`: string, max 500
- `cohost`: nullable/blank string, max 500
- `guest`: string, max 200
- `guest_bio`: string, max 1000
- `guest_image`: image path
- `slug`: unique auto-generated slug
- `episode_image`: image path
- `created_date`: datetime
- `published_date`: nullable datetime
- `chapters`: nullable text, one `00:00 Title` entry per line
- `links_mentioned`: nullable text, one `Label | URL` entry per line

The initial migration also had `googlepodcast`; migration `0003` removes it.
The direct migration script tolerates and drops it if an older database still
has the column.

### `Hosts` → `podcast_hosts`

- `id`: Django `BigAutoField`
- `name`: string, max 255
- `role`: blankable string, max 100
- `bio`: text
- `image`: image path
- `location`: blankable string, max 255
- `linkedin`: blankable URL
- `twitter`: blankable URL

### `Tags` → `podcast_tags`

- `id`: Django `BigAutoField`
- `tags`: string, max 30

### `Subscriber` → `podcast_subscriber`

- `id`: Django `BigAutoField`
- `email`: unique email string
- `created_at`: automatically created datetime
- `is_active`: boolean, default true

### Episode/tag through table

The `Episode.tag` many-to-many field produces `podcast_episode_tag`, with
`episode_id` referencing `podcast_episode.id` and `tags_id` referencing
`podcast_tags.id`. Django also creates a unique constraint over that pair.

## Page inventory

- `index.html`: centered show hero and platform links; compact about strip;
  latest published episode cards; what/who/why explainer cards; latest YouTube
  facades; host teasers; optional latest blog articles; shared newsletter.
- `episodes.html`: archive hero with search form, followed by a responsive grid
  of all published episodes showing artwork, season/episode/date, guest, and
  summary; includes a no-results state.
- `episode_detail.html`: episode hero with metadata, tags, title, host/co-host/
  guest byline, artwork, and audio; then summary, platform links, optional
  YouTube facade, HTML show notes, optional chapters/resources, sharing,
  featured-person profiles, other/more episode links, and admin actions.
- `about.html`: story hero and topic pills; What we do, Our approach, and Our
  mission story rows; a statistics band; full host profiles with social links
  and up to three episodes each.
- `tags.html`: selected-tag hero and filtered episode-card grid, or a no-results
  state linking back to the archive.
- `search.html`: search-results hero and search input; title/description result
  cards or a no-results state.
- `support.html`: support hero; listen/share, guest nomination, and sponsorship
  summaries; Pageclip guest and sponsor forms; alternate email contact.
- `blog/blog.html`: blog hero, featured article, remaining article grid,
  contribution prompt, and podcast/follow/write sidebars.
- `blog/blog_detail.html`: optional cover, breadcrumb, categories, title,
  author/date/reading time, rich HTML article, sharing controls, related posts,
  and authenticated edit/delete/publish controls.

Blog, search, support, Django authentication, and all admin/editor screens are
intentionally deferred in the Next.js migration. Supabase Table Editor will be
the content editor for the first release.
