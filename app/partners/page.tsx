import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/section-title";

export const metadata: Metadata = {
  title: "Partners & Media",
  description: "Partner with Geospatially Africa to support geospatial conversations across Africa and the world."
};

export default function PartnersPage() {
  return (
    <>
      <section className="bg-ink py-16 text-white sm:py-24">
        <Container>
          <Eyebrow tone="light">Partners & media</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.08] sm:text-7xl">Support the conversations shaping Africa&apos;s geospatial future.</h1>
          <p className="mt-6 max-w-2xl leading-8 text-white/70">Geospatially Africa connects practitioners, innovators, researchers, and curious listeners across the continent and around the world.</p>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-rust px-6 py-3 text-sm font-semibold text-white hover:bg-rust-dark">Talk to the team</Link>
        </Container>
      </section>
      <section className="py-14 sm:py-20">
        <Container>
          <Eyebrow>What partnership can support</Eyebrow>
          <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {[
              ["Episode partnerships", "Support a focused conversation around a tool, project, or challenge in the geospatial ecosystem."],
              ["Community reach", "Help make practical knowledge, African expertise, and useful resources more visible and accessible."],
              ["Media collaborations", "Work with the show on interviews, events, explainers, newsletters, or video conversations."]
            ].map(([title, text]) => <article key={title} className="bg-surface-warm p-7"><h2 className="font-display text-2xl text-ink">{title}</h2><p className="mt-3 text-sm leading-7 text-ink-secondary">{text}</p></article>)}
          </div>
        </Container>
      </section>
      <section className="border-t border-line py-14 sm:py-20">
        <Container>
          <Eyebrow>Confirmed episode partner</Eyebrow>
          <div className="mt-5 flex flex-col gap-5 border border-line bg-surface p-7 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="font-display text-3xl text-ink">Satellogic</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-ink-secondary">Partner of the conversation “Accelerating New Space With Affordable Satellite Systems.”</p></div>
            <Link href="/episodes/accelerating-new-space-with-affordable-satell-20" className="shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-navy-light">View episode</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
