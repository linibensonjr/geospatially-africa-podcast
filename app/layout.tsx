import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Analytics } from "@/components/analytics";
import { PodcastSeriesJsonLd } from "@/components/podcast-json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-fraunces"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://geospatiallyafrica.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Geospatially Africa Podcast",
  authors: [{ name: "Geospatially Africa" }],
  creator: "Geospatially Africa",
  publisher: "Geospatially Africa",
  category: "Technology",
  keywords: [
    "African geospatial podcast",
    "GIS Africa",
    "remote sensing",
    "earth observation",
    "mapping",
    "GeoAI"
  ],
  alternates: { canonical: "/" },
  title: {
    default: "Geospatially Africa Podcast",
    template: "%s | Geospatially Africa"
  },
  description:
    "Meaningful conversations about the geospatial industry in Africa and around the world.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Geospatially Africa Podcast",
    description: "Meaningful conversations about the geospatial industry in Africa and around the world.",
    siteName: "Geospatially Africa Podcast",
    locale: "en_US",
    images: ["/images/podcast-art.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Geospatially Africa Podcast",
    description: "Meaningful conversations about the geospatial industry in Africa and around the world.",
    images: ["/images/podcast-art.png"]
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}
    >
      <body>
        <Analytics />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <PodcastSeriesJsonLd />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
