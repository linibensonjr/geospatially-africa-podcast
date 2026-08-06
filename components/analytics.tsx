import Script from "next/script";

/**
 * Optional privacy-friendly analytics. Set NEXT_PUBLIC_ANALYTICS_SRC and
 * NEXT_PUBLIC_ANALYTICS_DOMAIN in the deployment environment to enable it.
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  if (!src) return null;
  return <Script defer data-domain={domain} src={src} />;
}
