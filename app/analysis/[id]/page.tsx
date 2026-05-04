import Link from "next/link";
import { SiteNavHeader } from "@/components/SiteNavHeader";
import { BirthSignDisplay } from "@/components/BirthSignDisplay";
import { MarkdownText } from "@/components/MarkdownText";
import PaywallOverlay from "@/components/ui/PaywallOverlay";
import { checkFeatureAccess, getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

type AnalysisPageProps = {
  params: Promise<{ id: string }>;
};

const SIGN_SYMBOL: Record<string, string> = {
  เมษ: "♈︎",
  พฤษภ: "♉︎",
  เมถุน: "♊︎",
  กรกฎ: "♋︎",
  สิงห์: "♌︎",
  กันย์: "♍︎",
  ตุลย์: "♎︎",
  พิจิก: "♏︎",
  ธนู: "♐︎",
  มังกร: "♑︎",
  กุมภ์: "♒︎",
  มีน: "♓︎",
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

  return (
    <>
      <SiteNavHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mu-lab-glass rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">ผลทำนายส่วนตัว</p>
          <h1 className="mt-3 font-serif text-3xl text-[#eef1ff] sm:text-4xl">ลักขณาและดวงชะตาของคุณ</h1>

          <section className="mt-6 grid gap-4 rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(247,231,206,0.05)] p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">ข้อมูลกำเนิด</p>
              <p className="mt-3 text-sm text-[#e8eeff]/88">ชื่อ: {analysis.fullName ?? "ไม่ได้ระบุ"}</p>
              <p className="mt-1 text-sm text-[#e8eeff]/88">วันเกิด: {analysis.birthDate ?? "ไม่ได้ระบุ"}</p>
              <p className="mt-1 text-sm text-[#e8eeff]/88">เวลาเกิด: {analysis.birthTime ?? "ไม่ได้ระบุ"}</p>
              <p className="mt-1 text-sm text-[#e8eeff]/88">จังหวัดเกิด: {analysis.birthProvince ?? "ไม่ได้ระบุ"}</p>
            </div>
            <div className="rounded-xl border border-[rgba(247,231,206,0.2)] bg-[rgba(7,16,36,0.55)] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">ลักขณา (ราศีขึ้น)</p>
              <p className="mt-3 font-serif text-3xl text-[#f5dfb6]">{analysis.birthSign ?? "ไม่พบข้อมูล"}</p>
              <p className="mt-3 text-4xl text-[#f5dfb6]">{analysis.birthSign ? SIGN_SYMBOL[analysis.birthSign] ?? "✦" : "✦"}</p>
              <p className="mt-2 text-xs text-[#dbe1ff]/66">โครงวางผลลักขณาแบบเรือนชะตา (สไตล์วงล้อ) สามารถขยายเพิ่มได้ในรอบถัดไป</p>
            </div>
          </section>

          {analysis.birthSign ? (
            <div className="mt-8">
              <BirthSignDisplay signName={analysis.birthSign} />
            </div>
          ) : null}

          <section className="mt-8 rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(247,231,206,0.05)] p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">ส่วนฟรี · ภาพรวมเบื้องต้น</p>
            <div className="mt-3 max-w-none">
              <MarkdownText source={analysis.summary} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="mu-lab-glass rounded-xl p-4 text-center">
                <p className="text-xs text-[var(--gold)]/80">Career</p>
                <p className="mt-2 text-2xl text-[#eef1ff]">{analysis.career}</p>
              </div>
              <div className="mu-lab-glass rounded-xl p-4 text-center">
                <p className="text-xs text-[var(--gold)]/80">Wealth</p>
                <p className="mt-2 text-2xl text-[#eef1ff]">{analysis.wealth}</p>
              </div>
              <div className="mu-lab-glass rounded-xl p-4 text-center">
                <p className="text-xs text-[var(--gold)]/80">Love</p>
                <p className="mt-2 text-2xl text-[#eef1ff]">{analysis.love}</p>
              </div>
            </div>
          </section>

          <section className="relative mt-8">
            <article
              className={`mu-lab-glass rounded-2xl border border-[rgba(247,231,206,0.12)] p-5 transition ${
                hasAccess ? "" : "select-none blur-xl"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">ส่วนชำระเงิน · คำทำนายเชิงลึก</p>
              <h2 className="mt-2 font-serif text-2xl text-[#eef1ff]">Deep Insight</h2>
              <div className="mt-3 max-w-none">
                <MarkdownText source={analysis.deepInsight} />
              </div>
            </article>
            {!hasAccess ? <PaywallOverlay analysisId={id} /> : null}
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            {!user ? (
              <Link href="/login?next=/vault" className="rounded-full border border-[rgba(247,231,206,0.4)] px-4 py-2 text-sm text-[var(--gold)]">
                Login to Save & Read Full
              </Link>
            ) : null}
            <Link href="/vault" className="rounded-full border border-[rgba(247,231,206,0.24)] px-4 py-2 text-sm text-[#e8eeff]/88">
              ไปยัง Personal Vault
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
