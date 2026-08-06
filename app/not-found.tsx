import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <section className="grid min-h-[66vh] place-items-center bg-navy py-16 text-white">
      <Container className="grid gap-10 md:grid-cols-[0.45fr_1fr] md:items-center">
        <p className="font-mono text-8xl font-medium text-orange sm:text-9xl">
          404
        </p>
        <div className="border-l border-white/20 pl-7">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/40">
            Lost coordinate
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            This page is not on the map.
          </h1>
          <p className="mt-4 max-w-md leading-8 text-white/60">
            The page may have moved, or the address may be incomplete.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex bg-orange px-6 py-3 text-sm font-bold text-white hover:opacity-85"
          >
            Return home
          </Link>
        </div>
      </Container>
    </section>
  );
}
