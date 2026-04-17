import type { Metadata } from "next";
import Link from "next/link";
import { ParallaxNebula } from "@/components/CinematicCelestial";
import { formatThaiArticleDateLabel } from "@/components/DailyHoroscopeArticleView";
import { listDailyHoroscopeArchives } from "@/lib/daily-horoscope-archive";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "ดูดวงรายวัน · คลังย้อนหลัง",
  description: "อ่านบทความดวงรายวันย้อนหลังจาก Mu-Lab ตามวันที่ (ปฏิทินกรุงเทพฯ)",
  alternates: { canonical: "/daily-horoscope/archive" },
  openGraph: {
    title: "ดูดวงรายวัน · คลังย้อนหลัง",
    description: "อ่านบทความดวงรายวันย้อนหลังจาก Mu-Lab ตามวันที่ (ปฏิทินกรุงเทพฯ)",
    url: "/daily-horoscope/archive",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function DailyHoroscopeArchiveIndexPage() {
  const rows = await listDailyHoroscopeArchives(180);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParallaxNebula />
      <div className="pointer-events-none fixed inset-0 z-[3] mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="mu-lab-glass rounded-[1.35rem] border border-[rgba(247,231,206,0.22)] p-5 shadow-[0_16px_42px_rgba(1,4,16,0.42)] backdrop-blur-xl sm:rounded-3xl sm:p-10">
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-[var(--gold)]/70">คลังบทความ</p>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-[#eef1ff] sm:text-4xl">ดูดวงรายวัน · ย้อนหลัง</h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#dbe1ff]/80">
            แต่ละวันที่มีบทความถูกเก็บเป็นสแนปช็อตจากห้องแล็บ — ลิงก์ถาวรใช้แชร์หรือกลับมาอ่านภายหลังได้
          </p>

          {rows.length === 0 ? (
            <p className="mt-10 text-center text-sm font-light text-[#dbe1ff]/60">
              ยังไม่มีรายการในคลัง — เปิด{" "}
              <Link href="/daily-horoscope" className="text-[var(--gold)]/85 underline-offset-2 hover:underline">
                ฉบับวันนี้
              </Link>{" "}
              ครั้งหนึ่งเพื่อให้ระบบบันทึกวันนี้ลงคลัง
            </p>
          ) : (
            <ul className="mt-10 space-y-3">
              {rows.map((row) => (
                <li key={row.dateKey}>
                  <Link
                    href={`/daily-horoscope/${row.dateKey}`}
                    className="group flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-[rgba(5,10,24,0.35)] px-4 py-3 transition hover:border-[rgba(247,231,206,0.22)] hover:bg-[rgba(247,231,206,0.04)] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <span className="text-sm font-light text-[var(--gold)]/90 group-hover:text-[var(--gold)]">
                      {formatThaiArticleDateLabel(row.dateKey)}
                    </span>
                    <span className="line-clamp-3 min-w-0 flex-1 break-words text-sm font-light text-[#dbe1ff]/78 sm:text-right">
                      {row.headlineTh}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-10 text-center text-xs font-light text-[#dbe1ff]/45">
            <Link href="/" className="text-[var(--gold)]/70 underline-offset-2 hover:underline">
              หน้าแรก
            </Link>
            {" · "}
            <span className="break-all text-[#dbe1ff]/40">{siteUrl}</span>
          </p>
        </div>
      </section>
    </main>
  );
}
