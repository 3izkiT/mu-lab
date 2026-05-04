function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/**
 * Canonical site URL for SEO/schema.
 * Prefer NEXT_PUBLIC_SITE_URL in all environments.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return normalizeSiteUrl(configured);

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return normalizeSiteUrl(`https://${vercelUrl}`);
  }

  // Final local fallback to keep builds/dev from crashing.
  return "http://localhost:3000";
}
