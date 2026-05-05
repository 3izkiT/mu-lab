import Link from "next/link";
import { SiteNavHeader } from "@/components/SiteNavHeader";
import Ascendant3D from "@/components/Ascendant3D";
import { MarkdownText } from "@/components/MarkdownText";
import PaywallOverlay from "@/components/ui/PaywallOverlay";
import { checkFeatureAccess, getCurrentUser } from "@/lib/auth-utils";
import { getBirthSignDetail, parseStoredBirthClock, type ThaiBirthSignDetail } from "@/lib/birth-sign";
import { getZodiacMeta } from "@/lib/zodiac-meta";
import { prisma } from "@/lib/prisma";

type AnalysisPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const analysis = await prisma.analysis.findUnique({ where: { id } });
  const user = await getCurrentUser();
  const hasAccess = user ? await checkFeatureAccess(user.id, "deep-insight", id) : false;

  if (!analysis) {
    return (
      <>
        <SiteNavHeader />
        <main className="mx-auto max-w-3xl px-4 py-20">
          <div className="mu-lab-glass rounded-2xl p-8">
            <h1 className="font-serif text-3xl text-[#eef1ff]">ไม่พบผลวิเคราะห์</h1>
            <Link href="/" className="mt-4 inline-block text-[var(--gold)] underline underline-offset-4">
              กลับหน้าแรก
            </Link>
          </div>
        </main>
      </>
    );
  }

  const clock = parseStoredBirthClock(analysis.birthTime);
  const lagnaFresh =
    analysis.birthDate != null && analysis.birthDate !== ""
      ? getBirthSignDetail(
          analysis.birthDate,
          clock?.hour,
          clock?.minute,
          analysis.birthProvince ?? undefined,
        )
      : null;

  const ascName = lagnaFresh?.signName ?? analysis.birthSign ?? "";
  const degInSignOnlyIfTimed =
    lagnaFresh?.hasTimeAndPlace === true && typeof lagnaFresh.degInSign === "number"
      ? lagnaFresh.degInSign
      : undefined;
  const meta = ascName ? getZodiacMeta(ascName) : null;
  const provinceFootnote = provinceMatchFootnote(lagnaFresh?.provinceResolved);

  return (
    <>
      <SiteNavHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="space-y-6">
          {/* Header strip */}
          <div className="rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(7,16,36,0.55)] px-5 py-4 sm:px-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold)]/75">ผลทำนายส่วนตัว · Mu-Lab</p>
            <h1 className="mt-1.5 font-serif text-2xl text-[#eef1ff] sm:text-3xl">
              ลักขณาและดวงชะตาของ {analysis.fullName ?? "คุณ"}
            </h1>
            <p className="mt-1 text-xs text-[#dbe1ff]/60">
              ลัคนาคำนวณแบบสุริยยาตร์ไทย (อันตรนาที + อาทิตย์อุทัยต่อจังหวัด) ผ่านเอนจินมาตรฐานเปิดโค้ด · เก็บไว้ใน Personal Vault
            </p>
          </div>

          {/* Hero — 3D ascendant + birth profile */}
          {ascName ? (
            <Ascendant3D mode="signature" signName={ascName} degInSign={degInSignOnlyIfTimed} footnote={provinceFootnote} />
          ) : (
            <div className="rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(7,16,36,0.55)] p-6 text-center">
              <p className="text-sm text-[#e8eeff]/80">ยังไม่มีข้อมูลเวลา-สถานที่เกิดสำหรับคำนวณลักขณา</p>
            </div>
          )}

          {/* Birth profile compact */}
          <section className="grid gap-4 rounded-2xl border border-[rgba(247,231,206,0.12)] bg-[rgba(247,231,206,0.04)] p-5 text-sm sm:grid-cols-4 sm:p-6">
            <ProfileItem label="ชื่อ" value={analysis.fullName ?? "ไม่ได้ระบุ"} />
            <ProfileItem label="วันเกิด" value={analysis.birthDate ?? "ไม่ได้ระบุ"} />
            <ProfileItem label="เวลาเกิด" value={analysis.birthTime ?? "ไม่ได้ระบุ"} />
            <ProfileItem label="จังหวัดเกิด" value={analysis.birthProvince ?? "ไม่ได้ระบุ"} />
          </section>

          {/* Zodiac value cards (from static meta) — gives free reader something tangible */}
          {meta ? (
            <section className="grid gap-4 sm:grid-cols-3">
              <ValueCard
                title="จุดเด่นที่จะพาคุณไปไกล"
                accent={meta.color}
                items={meta.strengths}
              />
              <ValueCard
                title="ข้อควรระวังที่คนรอบตัวสังเกตได้"
                accent={meta.accent}
                items={meta.challenges}
              />
              <ValueCard
                title="เส้นทางอาชีพที่ลักขณานี้รุ่ง"
                accent={meta.color}
                items={meta.careerThemes}
              />
            </section>
          ) : null}

          {/* Free analysis (markdown) */}
          <section className="rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(247,231,206,0.05)] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[rgba(247,231,206,0.12)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--gold)]/85">
                ฟรี
              </span>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/75">ภาพรวมจากระบบ Mu-Lab</p>
            </div>
            <div className="mt-3 max-w-none">
              <MarkdownText source={analysis.summary} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Meter label="การงาน" value={analysis.career} />
              <Meter label="การเงิน" value={analysis.wealth} />
              <Meter label="ความรัก" value={analysis.love} />
            </div>
          </section>

          {/* Premium / Deep insight teaser */}
          <section className="relative">
            <article
              className={`rounded-2xl border border-[rgba(247,231,206,0.18)] bg-[radial-gradient(circle_at_18%_0%,rgba(247,231,206,0.16)_0%,transparent_55%),radial-gradient(circle_at_82%_100%,rgba(99,118,228,0.22)_0%,transparent_60%),linear-gradient(160deg,#0d1638_0%,#070b22_55%,#03050f_100%)] p-5 sm:p-7 ${
                hasAccess ? "" : "select-none blur-[10px]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[rgba(247,231,206,0.18)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Premium
                </span>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/85">Deep Insight</p>
              </div>
              <h2 className="mt-2 font-serif text-2xl text-[#eef1ff] sm:text-3xl">
                แผนชีวิต 12 เรือนชะตา · เจาะลึกตามลักขณา{ascName || "ของคุณ"}
              </h2>
              <p className="mt-2 text-sm text-[#dbe1ff]/80">
                ฟรีด้านบนคุณได้กรอบความเข้าใจจากลักขณาและมิเตอร์แล้ว — Deep Insight เติมมุมมองเป็นรายเรือนชะตาและจังหวะเดือนต่อเดือน
                พร้อมคำถามที่ควรให้ความชัด และหัวข้อที่ปกติต้องนั่งกับโหรเป็นเท่า เพื่อคุณเอากลับไปตัดสินใจเองอย่างมั่นใจขึ้น
              </p>
              <div className="mt-4 max-w-none">
                <MarkdownText source={analysis.deepInsight} />
              </div>
            </article>
            {!hasAccess ? <PaywallOverlay analysisId={id} /> : null}
          </section>

          {/* เมื่อฟิลด์ birthSign ใน DB (ตอนบันทึกครั้งเก่า) ไม่ตรงผลจากสูตร+จังหวัดใน Vault ปัจจุบัน */}
          {analysis.birthSign && ascName && analysis.birthSign !== ascName ? (
            <p className="rounded-xl border border-amber-500/25 bg-amber-500/6 px-4 py-3 text-[11px] leading-relaxed text-[#fde8bf]/92">
              ใน Vault เคยเก็บลักขณาเป็น 「{analysis.birthSign}」 — จากวันเกิดเวลาเกิดและจังหวัดในโปรไฟล์ตอนนี้ Mu-Lab คำนวณใหม่ได้ 「{ascName}」หลังปรับระบบจัดการจังหวัดและสูตร
              ผลในหน้านี้เลยใช้ค่าชุดล่าสุดจากบรรทัดโปรไฟล์ด้านบน (ไม่ใช่ข้อความที่บันทึกไว้ในครั้งเก่า)
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {!user ? (
              <Link
                href="/login?next=/vault"
                className="rounded-full border border-[rgba(247,231,206,0.4)] bg-[rgba(247,231,206,0.06)] px-4 py-2 text-sm text-[var(--gold)]"
              >
                เข้าสู่ระบบเพื่อบันทึกผล
              </Link>
            ) : null}
            <Link
              href="/vault"
              className="rounded-full border border-[rgba(247,231,206,0.24)] bg-[rgba(247,231,206,0.04)] px-4 py-2 text-sm text-[#e8eeff]/88"
            >
              ไปยัง Personal Vault
            </Link>
            <Link
              href="/#fortune-form"
              className="rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-4 py-2 text-sm font-semibold text-[#241d16]"
            >
              วิเคราะห์ดวงคนใหม่
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/65">{label}</p>
      <p className="mt-1.5 text-sm text-[#eef1ff]/95">{value}</p>
    </div>
  );
}

function ValueCard({ title, accent, items }: { title: string; accent: string; items: string[] }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[rgba(247,231,206,0.14)] bg-[rgba(7,16,36,0.55)] p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${accent}55 0%, transparent 55%)`,
        }}
      />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/70">{title}</p>
        <ul className="mt-3 space-y-2 text-sm text-[#eef1ff]/92">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-xl border border-[rgba(247,231,206,0.14)] bg-[rgba(7,16,36,0.55)] p-3.5 text-center">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/70">{label}</p>
      <p className="mt-1 text-2xl font-light text-[#eef1ff]">{v}</p>
      <div className="mx-auto mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#f7e7ce,#ead2a6,#d9bb85)]"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

function provinceMatchFootnote(
  provinceResolved?: ThaiBirthSignDetail["provinceResolved"],
): string | undefined {
  if (!provinceResolved) return undefined;

  const { matchedBy, canonicalName, userInputRaw } = provinceResolved;

  if (matchedBy === "fallback-unknown") {
    if (!(userInputRaw?.trim()?.length ?? 0)) {
      return "ยังไม่ได้ระบุจังหวัดเกิด — Mu-Lab ใช้พิกัดกลางเป็นมาตรฐาน หากคุณใส่จังหวัดจริงได้ ผลของลักขณาจะสัมพันธ์กับพื้นที่เกิดได้มากขึ้น";
    }
    return `จังหวัดจากข้อความที่คุณพิมพ์ยังจับเข้ากับรายการมาตรฐานไม่ได้ชัดเจน — ระบบใช้พิกัดสำรอง (กทม.) อยู่ ตรวจคำว่า 「${userInputRaw}」 และลองเลือกจังหวัดจากเมนูเมื่อประมวลผลครั้งใหม่`;
  }

  if (matchedBy === "levenshtein") {
    return `จัดจังหวัดโดยค้นชื่อที่ใกล้เคียงกับ「${userInputRaw ?? "?"}» เป็น「${canonicalName}» — แนะนำเลือกจังหวัดจากเมนูเพื่อลดความเพี้ยนเล็กจากการเดาสะกด`;
  }

  if (matchedBy === "fuzzy-short") {
    const rawBit = userInputRaw?.trim() ? `จากคำว่า 「${userInputRaw.trim()}」 ` : "";
    return `${rawBit}จับเข้ากับ「${canonicalName}» เพื่อคำนวณ — เลือกจังหวัดมาตรฐานในรายการจะเป็นผลที่สมบูรณ์ที่สุด`;
  }

  return undefined;
}
