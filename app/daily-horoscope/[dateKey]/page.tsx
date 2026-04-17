import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParallaxNebula } from "@/components/CinematicCelestial";
import { DailyHoroscopeArticleView } from "@/components/DailyHoroscopeArticleView";
import { getBangkokDateKey } from "@/lib/daily-forecast-data";
import { getDailyHoroscopeArchiveByDateKey, isValidArchiveDateKey, listDailyHoroscopeArchives } from "@/lib/daily-horoscope-archive";
import { getDailyHoroscopeArticle } from "@/lib/daily-horoscope-article-data";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

type PageProps = { params: Promise<{ dateKey: string }> };

export const revalidate = 86400;

async function resolveArticle(dateKey: string) {
  const todayKey = getBangkokDateKey();
  if (dateKey > todayKey) return null;

  const archived = await getDailyHoroscopeArchiveByDateKey(dateKey);
  if (archived) return { article: archived, variant: "archive" as const };

  if (dateKey === todayKey) {
    const live = await getDailyHoroscopeArticle();
    return { article: live, variant: "today" as const };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { dateKey } = await params;
  if (!isValidArchiveDateKey(dateKey)) return { title: "ไม่พบบทความ" };

  const resolved = await resolveArticle(dateKey);
  if (!resolved) return { title: "ไม่พบบทความ" };

  const { article } = resolved;
  const title = `ดูดวงรายวัน · ${article.headlineTh}`;
  const description = article.intro.slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `/daily-horoscope/${dateKey}` },
    openGraph: {
      title,
      description,
      url: `/daily-horoscope/${dateKey}`,
      type: "article",
    },
  };
}

export default async function DailyHoroscopeArchivePage({ params }: PageProps) {
  const { dateKey } = await params;
  if (!isValidArchiveDateKey(dateKey)) notFound();

  const resolved = await resolveArticle(dateKey);
  if (!resolved) notFound();

  const { article, variant } = resolved;
  const recent = await listDailyHoroscopeArchives(30);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParallaxNebula />
      <div className="pointer-events-none fixed inset-0 z-[3] mu-lab-starfield" aria-hidden />

      <DailyHoroscopeArticleView
        article={article}
        siteUrl={siteUrl}
        canonicalPath={`/daily-horoscope/${dateKey}`}
        variant={variant}
        recentDateKeys={recent.map((r) => r.dateKey)}
      />
    </main>
  );
}
