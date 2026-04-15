function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/**
 * Canonical site URL for SEO/schema.
 * In production, NEXT_PUBLIC_SITE_URL must be set explicitly.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return normalizeSiteUrl(configured);

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required in production for canonical SEO URLs.");
  }

  return "http://localhost:3000";
}
