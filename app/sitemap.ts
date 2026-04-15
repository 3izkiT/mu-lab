import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mu-lab.vercel.app";

/**
 * Dynamic sitemap for current and future app routes.
 * Add new route objects here when expanding the site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Keep this list for crawlable pages only (exclude API endpoints).
  const routes = [""];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.4,
  }));
}
