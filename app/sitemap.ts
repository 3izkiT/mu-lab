import type { MetadataRoute } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

function segmentToPath(segment: string): string {
  if (segment === "page.tsx") return "";
  if (segment.startsWith("(") && segment.endsWith(")")) return "";
  if (segment.startsWith("@")) return "";
  return segment;
}

function isCrawlableRoute(route: string): boolean {
  if (!route.startsWith("/")) return false;
  return !route.includes("[") && !route.startsWith("/api");
}

async function collectRoutes(dir: string, segments: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    if (entry.name === "api") continue;
    if (entry.name.startsWith("_")) continue;

    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nextSegment = segmentToPath(entry.name);
      const nextSegments = nextSegment ? [...segments, nextSegment] : [...segments];
      const nested = await collectRoutes(absolute, nextSegments);
      routes.push(...nested);
      continue;
    }

    if (entry.isFile() && entry.name === "page.tsx") {
      const route = `/${segments.filter(Boolean).join("/")}`.replace(/\/+/g, "/");
      routes.push(route === "/" ? "/" : route.replace(/\/$/, ""));
    }
  }

  return routes;
}

/**
 * Dynamic sitemap: auto-discovers App Router pages (excluding api, dynamic params).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appDir = path.join(process.cwd(), "app");
  const discoveredRoutes = await collectRoutes(appDir);
  const uniqueRoutes = [...new Set(discoveredRoutes)].filter(isCrawlableRoute);

  return uniqueRoutes.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.4,
  }));
}
