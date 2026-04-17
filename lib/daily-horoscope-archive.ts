import type { DailyForecastPayload } from "@/lib/daily-forecast-data";
import type { BirthWeekdayId, DailyHoroscopeArticle, DailyHoroscopeSection } from "@/lib/daily-horoscope-article-data";
import { prisma } from "@/lib/prisma";

type LooseSection = { id: string; titleTh: string; body: string };

/** ลำดับเดียวกับ BIRTH_WEEKDAY_ORDER ใน article-data — ประกาศซ้ำเพื่อไม่ circular-import ตอน runtime */
const ARCHIVE_SECTION_ORDER: readonly BirthWeekdayId[] = [
  "mon",
  "tue",
  "wed_day",
  "wed_night",
  "thu",
  "fri",
  "sat",
  "sun",
];

function numScore(v: unknown): number | null {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function parseForecast(raw: unknown): DailyForecastPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const f = raw as Record<string, unknown>;
  const dateKey = typeof f.dateKey === "string" ? f.dateKey : "";
  const scores = f.scores as Record<string, unknown> | undefined;
  const w = scores ? numScore(scores.work) : null;
  const l = scores ? numScore(scores.love) : null;
  const h = scores ? numScore(scores.health) : null;
  if (w == null || l == null || h == null) return null;
  const source = f.source === "gemini" || f.source === "fallback" ? f.source : "fallback";
  return {
    dateKey,
    scores: { work: Math.round(w), love: Math.round(l), health: Math.round(h) },
    weatherTag: String(f.weatherTag ?? ""),
    labNote: String(f.labNote ?? ""),
    luckyItem: String(f.luckyItem ?? ""),
    luckyColor: String(f.luckyColor ?? ""),
    ritualOfTheDay: String(f.ritualOfTheDay ?? ""),
    source,
  };
}

/** รองรับคลังเก่า (7 หัวข้อ + id wed) และรูปแบบใหม่ 8 หัวข้อ */
function parseSections(raw: unknown): DailyHoroscopeSection[] | null {
  if (!Array.isArray(raw)) return null;

  const rows: LooseSection[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") return null;
    const o = row as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.titleTh !== "string" || typeof o.body !== "string") return null;
    rows.push({ id: o.id, titleTh: o.titleTh, body: o.body });
  }

  let expanded = rows;

  if (rows.length === 7) {
    const i = rows.findIndex((r) => r.id === "wed");
    if (i < 0) return null;
    const w = rows[i];
    expanded = [
      ...rows.slice(0, i),
      { id: "wed_day", titleTh: "คนเกิดวันพุธกลางวัน", body: w.body },
      { id: "wed_night", titleTh: "คนเกิดวันพุธกลางคืน", body: w.body },
      ...rows.slice(i + 1),
    ];
  }

  if (expanded.length !== 8) return null;

  const byId = new Map(expanded.map((r) => [r.id, r]));
  const out: DailyHoroscopeSection[] = [];
  for (const id of ARCHIVE_SECTION_ORDER) {
    const r = byId.get(id);
    if (!r) return null;
    out.push({ id, titleTh: r.titleTh, body: r.body });
  }
  return out;
}

export async function saveDailyHoroscopeArchive(article: DailyHoroscopeArticle): Promise<void> {
  try {
    await prisma.dailyHoroscopeArchive.upsert({
      where: { dateKey: article.dateKey },
      create: {
        dateKey: article.dateKey,
        headlineTh: article.headlineTh,
        intro: article.intro,
        sectionsJson: JSON.stringify(article.sections),
        forecastJson: JSON.stringify(article.forecast),
        source: article.source,
      },
      update: {
        headlineTh: article.headlineTh,
        intro: article.intro,
        sectionsJson: JSON.stringify(article.sections),
        forecastJson: JSON.stringify(article.forecast),
        source: article.source,
      },
    });
  } catch (err) {
    console.error("saveDailyHoroscopeArchive", err);
  }
}

export async function getDailyHoroscopeArchiveByDateKey(dateKey: string): Promise<DailyHoroscopeArticle | null> {
  let row: {
    dateKey: string;
    headlineTh: string;
    intro: string;
    sectionsJson: string;
    forecastJson: string;
    source: string;
  } | null;
  try {
    row = await prisma.dailyHoroscopeArchive.findUnique({ where: { dateKey } });
  } catch (err) {
    console.error("getDailyHoroscopeArchiveByDateKey", err);
    return null;
  }
  if (!row) return null;

  let sections: DailyHoroscopeSection[];
  try {
    const parsed = parseSections(JSON.parse(row.sectionsJson));
    if (!parsed) return null;
    sections = parsed;
  } catch {
    return null;
  }

  let forecast: DailyForecastPayload;
  try {
    const parsed = parseForecast(JSON.parse(row.forecastJson));
    if (!parsed) return null;
    forecast = parsed;
  } catch {
    return null;
  }

  const source = row.source === "gemini" || row.source === "fallback" ? row.source : "fallback";

  return {
    dateKey: row.dateKey,
    headlineTh: row.headlineTh,
    intro: row.intro,
    sections,
    forecast,
    source,
  };
}

export type ArchiveListItem = {
  dateKey: string;
  headlineTh: string;
  updatedAt: Date;
};

export async function listDailyHoroscopeArchives(limit = 120): Promise<ArchiveListItem[]> {
  try {
    return await prisma.dailyHoroscopeArchive.findMany({
      orderBy: { dateKey: "desc" },
      take: limit,
      select: { dateKey: true, headlineTh: true, updatedAt: true },
    });
  } catch (err) {
    console.error("listDailyHoroscopeArchives", err);
    return [];
  }
}

export function isValidArchiveDateKey(key: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key);
}
