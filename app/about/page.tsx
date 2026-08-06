import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Newsletter } from "@/components/newsletter";
import { Eyebrow } from "@/components/section-title";
import { StatTile } from "@/components/stat-tile";
import { getHosts, getPublishedEpisodes, getTags } from "@/lib/data";
import { mediaUrl, slugify } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description:
    "The story, mission, and people behind the Geospatially Africa Podcast."
};

const REACH_STATS = [
  { value: "21+", label: "Episodes" },
  { value: "400+", label: "Subscribers" },
  { value: "2,000+", label: "Listens" },
  { value: "67+", label: "Countries" }
];

const SOURCE_BIOS: Record<string, string> = {
  "Iniobong Benson":
    "Iniobong is a Geospatial Developer and Analyst interested in contributing to the geospatial industry through research and software development.",
  "Opeyemi Kazeem-Jimoh":
    "Opeyemi is a Geospatial Data Analyst and Cartographer with interests in disaster risk reduction through geo-hazard mapping, GIS for business and sales process optimization, and promoting sustainable futures."
};

const VALUES = [
  {
    title: "African voices first",
    text: "We centre African perspectives in the global geospatial conversation, platforming talent, innovation, and expertise from the continent."
  },
  {
    title: "Knowledge sharing",
    text: "Every episode is a free resource. Open access to industry knowledge helps the entire geospatial community grow."
  },
  {
    title: "Community driven",
    text: "Built by the community, for the community. Our guests are nominated by listeners and our topics are shaped by what matters most."
  }
];

const JOURNEY = [
  ["APR 2021", "The first episode", "Launched as Geospatially Podcast with a single microphone and a mission to showcase Africa's geospatial community."],
  ["AUG 2021", "Rebranded to Geospatially Africa", "The name and focus became explicitly Africa-centric, reflecting our core mission of driving the continent's narrative."],
  ["2022", "Growing the community", "Reached listeners in 50+ countries and welcomed Opeyemi as co-host."],
  ["2023 — PRESENT", "Still going strong", "Continuing to amplify African geospatial stories with a growing community of listeners, contributors, and partners."]
] as const;

function hostFallback(name: string): string {
  if (name === "Iniobong Benson") return "/images/iniobong.jpg";
  if (name === "Opeyemi Kazeem-Jimoh") return "/images/ope.jpg";
  return "/images/guest-fallback.png";
}

export default async function AboutPage() {
  const [hosts, tags, episodes] = await Promise.all([
    getHosts(),
    getTags(),
    getPublishedEpisodes()
  ]);
  const activeTags = tags.filter((tag) =>
    episodes.some((episode) => episode.tags.some((item) => item.id === tag.id))
  );

  return (
    <>
      <section className="py-14 sm:py-20">
        <Container>
          <Eyebrow>About the show</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.1] text-ink sm:text-6xl">
            Africa&apos;s geospatial stories, told by the people shaping them.
          </h1>
          <p className="mt-6 max-w-2xl leading-8 text-ink-secondary">
            Geospatially Africa Podcast started in April 2021 and was originally
            called Geospatially Podcast. We changed the name to Geospatially
            Africa Podcast to make it more African-centric: a podcast holding
            interesting conversations about the industry in Africa and around
            the world.
          </p>
          <p className="mt-4 max-w-2xl leading-8 text-ink-secondary">
            We are one of the few media outlets showcasing Afro-centric
            geospatial talent, expertise, and innovation globally. We strive
            to drive the narrative of the immense potential within the
            African geospatial industry, while exploring how it contributes to
            Africa&apos;s individual and collective development.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-10 sm:grid-cols-4">
            {REACH_STATS.map((stat) => (
              <StatTile key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-14 sm:py-20">
        <Container>
          <Eyebrow>Our mission</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-display text-3xl text-ink sm:text-5xl">
            Driving the African geospatial narrative.
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-ink-secondary">
            From GIS and drones to machine learning and earth observation, we
            make space for the people building useful geospatial futures across
            Africa and around the world.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {VALUES.map((value) => (
              <article key={value.title} className="bg-surface-warm p-6 sm:p-8">
                <h3 className="font-display text-xl text-ink">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-secondary">{value.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-14 sm:py-20">
        <Container>
          <Eyebrow>Our journey</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-display text-3xl text-ink sm:text-5xl">
            From a microphone and an idea to Africa&apos;s geospatial voice.
          </h2>
          <div className="mt-10 grid gap-8 border-l-2 border-rust/30 pl-6 sm:pl-8">
            {JOURNEY.map(([date, title, text]) => (
              <article key={date} className="relative max-w-2xl">
                <span className="absolute -left-[2.05rem] top-1.5 h-3 w-3 rounded-full bg-rust ring-4 ring-surface-warm sm:-left-[2.55rem]" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-rust">{date}</p>
                <h3 className="mt-1 font-display text-xl text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-secondary">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-14 sm:py-20">
        <Container>
          <Eyebrow>Behind the mic</Eyebrow>
          <div className="mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
            {hosts.map((host) => (
              <article key={host.id} className="rounded-brand border border-line bg-surface-warm p-6 shadow-card sm:p-7">
                <Image
                  src={mediaUrl(host.image) || hostFallback(host.name)}
                  alt={host.name}
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-full object-cover"
                />
                <h3 className="mt-4 font-display text-xl text-ink">
                  {host.name}
                </h3>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-rust">
                  {host.role || "Cohost"}
                  {host.location ? ` · ${host.location}` : ""}
                </p>
                {(SOURCE_BIOS[host.name] || host.bio) && (
                  <p className="mt-3 max-w-sm text-sm leading-7 text-ink-secondary">
                    {(SOURCE_BIOS[host.name] || host.bio).replace(/<[^>]*>/g, " ")}
                  </p>
                )}
                {(host.twitter || host.linkedin) && (
                  <p className="mt-3 text-xs font-semibold text-ink-secondary">
                    {host.twitter && (
                      <a
                        href={host.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-rust"
                      >
                        X
                      </a>
                    )}
                    {host.twitter && host.linkedin && " · "}
                    {host.linkedin && (
                      <a
                        href={host.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-rust"
                      >
                        LinkedIn
                      </a>
                    )}
                  </p>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {activeTags.length > 0 && (
        <section className="border-t border-line py-10">
          <Container>
            <Eyebrow>Topics we cover</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/topics/${slugify(tag.name)}`}
                  className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink-secondary"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-line py-10">
        <Container>
          <Eyebrow>Episode partner</Eyebrow>
          <div className="mt-4 flex flex-col gap-4 border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-2xl text-ink">Satellogic</p>
              <p className="mt-1 max-w-xl text-sm leading-7 text-ink-secondary">
                Supporting our conversation on affordable satellite systems and
                the future of new space.
              </p>
            </div>
            <Link
              href="/episodes/accelerating-new-space-with-affordable-satell-20"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-rust px-5 py-3 text-sm font-semibold text-white transition hover:bg-rust-dark"
            >
              Listen to the episode
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-14 sm:py-20">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Get involved</Eyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
              Have a compelling geospatial story to share?
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-ink-secondary">
              If you are doing interesting work in Africa or beyond, we would
              love to hear from you.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-light"
          >
            Become a guest
          </Link>
        </Container>
      </section>

      <Newsletter />

    </>
  );
}
