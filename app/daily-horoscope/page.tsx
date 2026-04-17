import type { Metadata } from "next";
import { ParallaxNebula } from "@/components/CinematicCelestial";
import { DailyHoroscopeArticleView } from "@/components/DailyHoroscopeArticleView";
import { getDailyHoroscopeArticle } from "@/lib/daily-horoscope-article-data";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const article = await getDailyHoroscopeArticle();
  const title = `ดูดวงรายวัน · ${article.headlineTh}`;
  const description = article.intro.slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: "/daily-horoscope" },
    openGraph: {
      title,
      description,
      url: "/daily-horoscope",
      type: "article",
    },
  };
}

export default async function DailyHoroscopePage() {
  const article = await getDailyHoroscopeArticle();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParallaxNebula />
      <div className="pointer-events-none fixed inset-0 z-[3] mu-lab-starfield" aria-hidden />

      <DailyHoroscopeArticleView
        article={article}
        siteUrl={siteUrl}
        canonicalPath="/daily-horoscope"
        variant="today"
      />
    </main>
  );
}
