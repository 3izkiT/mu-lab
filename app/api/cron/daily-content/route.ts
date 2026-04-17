import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getBangkokDateKey } from "@/lib/daily-forecast-data";
import { getDailyHoroscopeArticle } from "@/lib/daily-horoscope-article-data";

function readCronSecret(): string | null {
  const raw = process.env.CRON_SECRET;
  if (raw == null) return null;
  const normalized = raw.replace(/^\uFEFF/, "").trim();
  return normalized.length > 0 ? normalized : null;
}

function verifyCronRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV === "development") return true;

  const secret = readCronSecret();
  const auth = request.headers.get("authorization");
  if (secret && auth === `Bearer ${secret}`) return true;

  const onVercel = process.env.VERCEL === "1";
  if (onVercel && request.headers.get("x-vercel-cron") === "1") return true;

  return false;
}

/**
 * เรียกทุกเช้า (เช่น Vercel Cron ใน vercel.json: `5 23 * * *` UTC ≈ 06:05 Asia/Bangkok)
 * เพื่อล้างแคชพยากรณ์รายวันและบทความดวงรายวันของ «วันที่ไทย» ปัจจุบัน
 * ให้เจนเนื้อหาใหม่เมื่อมีผู้เข้าชมครั้งถัดไป
 *
 * Auth production: Bearer CRON_SECRET หรือ (บน Vercel เท่านั้น) header x-vercel-cron: 1
 */
export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const dateKey = getBangkokDateKey();
  revalidateTag(`daily-forecast-${dateKey}`, "max");
  revalidateTag(`daily-horoscope-${dateKey}`, "max");

  await getDailyHoroscopeArticle().catch((err) => {
    console.error("cron daily-content warm", err);
  });

  return NextResponse.json({ ok: true, dateKey, revalidated: ["daily-forecast", "daily-horoscope"], warmed: true });
}
