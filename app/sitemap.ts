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

  return uniqueRoutes.map((route) => {
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "weekly";
    let priority = 0.6;

    if (route === "/") {
      changeFrequency = "daily";
      priority = 1.0;
    } else if (route === "/daily-horoscope" || route === "/daily-horoscope/archive") {
      changeFrequency = "daily";
      priority = 0.9;
    } else if (["/tarot", "/vault", "/tracking"].some((p) => route.includes(p))) {
      changeFrequency = "weekly";
      priority = 0.8;
    } else if (["/privacy", "/terms", "/cookie-policy"].some((p) => route.includes(p))) {
      changeFrequency = "monthly";
      priority = 0.3;
    }

    return {
      url: `${SITE_URL}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}
