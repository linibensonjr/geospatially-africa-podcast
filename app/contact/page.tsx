import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { NewsletterCard } from "@/components/newsletter-card";
import {
  PlatformIcon,
  type PlatformName
} from "@/components/platform-icon";
import { Eyebrow } from "@/components/section-title";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Nominate a guest, propose a partnership, or contact the Geospatially Africa Podcast."
};

const opportunities = [
  {
    label: "Nominate a guest",
    tagline: "Whose geospatial story should be heard?",
    body:
      "Recommend someone doing important work in Africa's geospatial ecosystem—or put yourself forward.",
    href:
      "mailto:gspatially@gmail.com?subject=Guest%20nomination%20for%20Geospatially%20Africa",
    action: "Send a nomination"
  },
  {
    label: "Partner with the show",
    tagline: "Support a conversation or series.",
    body:
      "Talk to the team about sponsorship, distribution, community partnerships, or a relevant collaboration.",
    href:
      "mailto:gspatially@gmail.com?subject=Partnership%20with%20Geospatially%20Africa",
    action: "Discuss a partnership"
  },
  {
    label: "General contact",
    tagline: "Questions, feedback, and ideas are welcome.",
    body:
      "Write to the team about an episode, a resource, or something the community should be paying attention to.",
    href: "mailto:gspatially@gmail.com",
    action: "Email the team"
  }
] as const;

const platforms: Array<{ label: PlatformName; href: string }> = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/7aqyurtRoF42hTysOqNa9v"
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/geospatially-africa-podcast-the-podcast-for/id1561204113"
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCh27HyKTvXvofv1TiPhcSpA"
  },
  { label: "RSS", href: "https://anchor.fm/geospatiallyafrica" }
];

export default function ContactPage() {
  return (
    <>
      <section className="py-14 sm:py-20">
        <Container>
          <Eyebrow>Get in touch</Eyebrow>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-6xl">
            Contact &amp; Subscribe
          </h1>
        </Container>
      </section>

      <section className="border-t border-line py-10">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {opportunities.map((item) => (
              <article key={item.label} className="rounded-brand border border-line bg-surface-warm p-6 shadow-card">
                <h2 className="font-display text-xl text-ink">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm font-semibold text-rust">
                  {item.tagline}
                </p>
                <p className="mt-3 text-sm leading-6 text-ink-secondary">
                  {item.body}
                </p>
                <a
                  href={item.href}
                  className="mt-5 inline-block text-sm font-semibold text-ink hover:text-rust"
                >
                  {item.action} →
                </a>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <ContactForm />

            <div className="space-y-6">
              <NewsletterCard />

              <div>
                <Eyebrow tone="muted">Where to listen</Eyebrow>
                <div className="mt-3 flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <a
                      key={platform.label}
                      href={platform.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <PlatformIcon
                        platform={platform.label}
                        className="h-4 w-4"
                      />
                      {platform.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
