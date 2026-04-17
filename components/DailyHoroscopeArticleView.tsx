import Link from "next/link";
import type { DailyHoroscopeArticle } from "@/lib/daily-horoscope-article-data";
import { getWeekdayHoroscopeStyle } from "@/lib/weekday-horoscope-styles";

const goldBorder = "border border-[rgba(247,231,206,0.22)]";

export function formatThaiArticleDateLabel(dateKey: string): string {
  const iso = `${dateKey}T12:00:00+07:00`;
  return new Date(iso).toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Props = {
  article: DailyHoroscopeArticle;
  siteUrl: string;
  /** path เช่น /daily-horoscope หรือ /daily-horoscope/2026-04-17 */
  canonicalPath: string;
  variant: "today" | "archive";
};

export function DailyHoroscopeArticleView({ article, siteUrl, canonicalPath, variant }: Props) {
  const { forecast } = article;
  const dateLabel = formatThaiArticleDateLabel(article.dateKey);
  const canonicalUrl = `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
  const shareText = `${article.headlineTh} · ดูดวงรายวัน Mu-Lab`;
  const encodedUrl = encodeURIComponent(canonicalUrl);
  const encodedText = encodeURIComponent(shareText);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headlineTh,
    datePublished: `${article.dateKey}T07:00:00+07:00`,
    author: { "@type": "Organization", name: "Mu-Lab" },
    publisher: { "@type": "Organization", name: "Mu-Lab", url: siteUrl },
    mainEntityOfPage: canonicalUrl,
    description: article.intro.slice(0, 200),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <article className={`mu-lab-glass rounded-[1.35rem] ${goldBorder} p-5 shadow-[0_16px_42px_rgba(1,4,16,0.42)] backdrop-blur-xl sm:rounded-3xl sm:p-10`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-[10px] font-light uppercase tracking-[0.34em] text-[var(--gold)]/70">
              ดูดวงรายวัน · อ่านฟรี
            </p>
            {variant === "archive" ? (
              <span className="rounded-full border border-[rgba(247,231,206,0.28)] bg-[rgba(247,231,206,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/85">
                คลังบทความ
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-white/12 bg-white/[0.02] px-3 py-1 font-light text-[#dbe1ff]/72">{dateLabel}</span>
            <Link
              href="/daily-horoscope/archive"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1 font-light text-[var(--gold)]/85 transition hover:bg-[rgba(247,231,206,0.08)]"
            >
              ดูย้อนหลังตามวันที่
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/12 px-3 py-1 text-[#dbe1ff]/80 transition hover:bg-white/[0.08]"
            >
              แชร์ Facebook
            </a>
            <a
              href={`https://line.me/R/msg/text/?${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/12 px-3 py-1 text-[#dbe1ff]/80 transition hover:bg-white/[0.08]"
            >
              แชร์ LINE
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/12 px-3 py-1 text-[#dbe1ff]/80 transition hover:bg-white/[0.08]"
            >
              แชร์ X
            </a>
          </div>
          <h1 className="mt-4 break-words font-serif text-3xl font-light leading-snug tracking-tight text-[#eef1ff] sm:text-4xl">
            {article.headlineTh}
          </h1>
          <p className="mt-6 text-base font-light leading-relaxed text-[#dbe1ff]/88">{article.intro}</p>

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[rgba(5,10,24,0.45)] p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">สรุปพลังงานวันนี้ (ห้องแล็บ)</p>
            <p className="mt-2 text-sm font-light text-[#dbe1ff]/82">{forecast.weatherTag}</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#dbe1ff]/78">{forecast.labNote}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#dbe1ff]/70">
              <span className="rounded-full border border-white/10 px-3 py-1">งาน {forecast.scores.work}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">ความรัก {forecast.scores.love}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">สุขภาพ {forecast.scores.health}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{forecast.luckyColor}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{forecast.luckyItem}</span>
            </div>
          </div>

          <div className="mt-10 space-y-6 sm:space-y-7">
            {article.sections.map((s) => {
              const style = getWeekdayHoroscopeStyle(s.id);
              const Icon = style.Icon;
              return (
                <section
                  key={s.id}
                  className={`overflow-hidden rounded-2xl border border-white/[0.07] ${style.panelClass} shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`}
                >
                  <div
                    className={`flex flex-col gap-3 border-l-[3px] p-4 sm:flex-row sm:gap-5 sm:p-5 ${style.railClass}`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14 ${style.iconShell}`}
                      aria-hidden
                    >
                      <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${style.iconClass}`} strokeWidth={1.65} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-serif text-xl leading-snug tracking-tight text-[var(--gold)] sm:text-2xl">
                        {s.titleTh}
                      </h2>
                      <p className="mt-3 text-base font-light leading-relaxed text-[#dbe1ff]/86">{s.body}</p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <p className="mt-6 rounded-xl border border-emerald-500/15 bg-[rgba(16,40,36,0.35)] px-4 py-3 text-xs font-light leading-relaxed text-[#dbe1ff]/72">
            <span className="font-medium text-emerald-200/90">หมายเหตุโหราไทย:</span> วันพุธแบ่งเป็น{" "}
            <span className="text-[#eef1ff]/88">พุธกลางวัน</span> กับ <span className="text-[#eef1ff]/88">พุธกลางคืน</span>{" "}
            เส้นแบ่งเวลาที่แม่นต้องอิงชั่วโมง–นาทีเกิดและจังหวัด (ลักขณา) — บทความรายวันนี้แยกสองแบบให้อ่านคนละมุม หากต้องการยืนยันว่าคุณอยู่ฝั่งไหน ให้ใช้แบบฟอร์มวิเคราะห์ส่วนตัวด้านล่าง
          </p>

          <div className="mt-10 rounded-2xl border border-[rgba(247,231,206,0.2)] bg-[rgba(247,231,206,0.06)] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#eef1ff]">อยากลงลึกถึงชั่วโมงเกิดและจังหวัด</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#dbe1ff]/85">
              บทความรายวันนี้เป็นมุมมองเชิงสัญลักษณ์ตามวันเกิดในสัปดาห์ (รวมพุธกลางวัน/กลางคืน) หากต้องการคำอ่านที่อิงลักขณาและบริบทชีวิตของคุณจริง ๆ ให้กรอกแบบฟอร์มวิเคราะห์ส่วนตัว
              จากนั้นเลือกแพ็กเกจที่เหมาะกับจังหวะ — เริ่มจาก Quick Reading แล้วค่อยขยับเป็นโหมดลึกเมื่อพร้อม
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/#fortune-form"
                className="inline-flex justify-center rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] transition hover:brightness-105"
              >
                ไปกรอกข้อมูลวิเคราะห์
              </Link>
              <Link
                href="/#services"
                className="inline-flex justify-center rounded-full border border-[rgba(247,231,206,0.45)] px-6 py-2.5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.1)]"
              >
                ดูแพ็กเกจและราคา
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs font-light text-[#dbe1ff]/45">
            {variant === "today" ? (
              <>
                อัปเดตชุดพลังงานรายวันตามปฏิทินกรุงเทพฯ · รีเฟรชแคชอัตโนมัติราว 06:05 น. (เวลาไทย) ผ่าน Cron · บันทึกคลัง (upsert) ทุกครั้งที่โหลดบทความวันนี้
                {" · "}
                <Link href="/daily-horoscope/archive" className="text-[var(--gold)]/75 underline-offset-2 hover:underline">
                  คลังย้อนหลัง
                </Link>
              </>
            ) : (
              <>
                บทความจากคลัง Mu-Lab — เนื้อหาตรงกับวันที่เผยแพร่ ({article.dateKey}) ·{" "}
                <Link href="/daily-horoscope" className="text-[var(--gold)]/75 underline-offset-2 hover:underline">
                  ไปฉบับวันนี้
                </Link>
              </>
            )}
          </p>
        </article>
      </section>
    </>
  );
}
