import Link from "next/link";
import PaywallOverlay from "@/components/ui/PaywallOverlay";
import { BirthSignDisplay } from "@/components/BirthSignDisplay";
import { checkFeatureAccess, getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

type MyFortunePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MyFortunePage({ params }: MyFortunePageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  
  const analysis = await prisma.analysis.findUnique({ where: { id } });
  if (!analysis || !user || analysis.userId !== user.id) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20">
        <div className="mu-lab-glass rounded-2xl p-8">
          <h1 className="font-serif text-3xl text-[#eef1ff]">ไม่พบผลวิเคราะห์</h1>
          <Link href="/" className="mt-4 inline-block text-[var(--gold)] underline underline-offset-4">
            กลับหน้าแรก
          </Link>
        </div>
      </main>
    );
  }

  const hasAccess = await checkFeatureAccess(user.id, "deep-insight", id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mu-lab-glass rounded-3xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Your Fortune</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff] sm:text-4xl">คำทำนายของคุณ</h1>
        <p className="mt-2 text-sm text-[#dbe1ff]/70">อ่านผลวิเคราะห์แบบเต็มและสมบูรณ์ของคุณ</p>

        <section className="mt-8 rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(247,231,206,0.06)] p-6 sm:p-8">
          <h2 className="font-serif text-xl font-semibold text-[#eef1ff] sm:text-2xl">ภาพรวมดวงของคุณ</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#e8eeff]/88">{analysis.summary}</p>
        </section>

        <section className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="mu-lab-glass rounded-xl p-4 text-center sm:p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/80">Career</p>
            <p className="mt-3 font-serif text-3xl sm:text-4xl text-[#eef1ff]">{analysis.career}</p>
          </div>
          <div className="mu-lab-glass rounded-xl p-4 text-center sm:p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/80">Wealth</p>
            <p className="mt-3 font-serif text-3xl sm:text-4xl text-[#eef1ff]">{analysis.wealth}</p>
          </div>
          <div className="mu-lab-glass rounded-xl p-4 text-center sm:p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/80">Love</p>
            <p className="mt-3 font-serif text-3xl sm:text-4xl text-[#eef1ff]">{analysis.love}</p>
          </div>
        </section>

        <section className="mt-8 relative">
          <article className={`mu-lab-glass rounded-2xl border border-[rgba(247,231,206,0.12)] p-6 sm:p-8 ${!hasAccess ? "overflow-hidden" : ""}`}>
            <h2 className="font-serif text-2xl font-semibold text-[#eef1ff] sm:text-3xl">ความเห็นที่ลึกซึ้ง</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#dbe1ff]/84 sm:text-base">
              {hasAccess
                ? analysis.deepInsight
                : "เนื้อหานี้เป็นส่วนพิเศษสำหรับสมาชิกที่ปลดล็อกเท่านั้น ล๊อกอินและปลดล็อกเพื่ออ่านเพิ่ม"}
            </p>
          </article>
          {!hasAccess ? <PaywallOverlay analysisId={id} /> : null}
        </section>

        {analysis.birthSign && <BirthSignDisplay signName={analysis.birthSign} />}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link 
            href="/" 
            className="rounded-full border border-[rgba(247,231,206,0.4)] px-6 py-2.5 text-sm font-medium text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.1)]"
          >
            ทำนายอีกครั้ง
          </Link>
          <Link 
            href="/vault" 
            className="rounded-full border border-[rgba(247,231,206,0.24)] px-6 py-2.5 text-sm font-medium text-[#e8eeff]/88 transition hover:bg-[rgba(247,231,206,0.06)]"
          >
            ไปยัง Personal Vault
          </Link>
        </div>
      </div>
    </main>
  );
}
