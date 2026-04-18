import Link from "next/link";
import PaywallOverlay from "@/components/ui/PaywallOverlay";
import { checkFeatureAccess, getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mu-lab-glass rounded-3xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Initial Result</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff] sm:text-4xl">ภาพรวมดวงของคุณ</h1>

        <section className="mt-6 rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(247,231,206,0.06)] p-4">
          <p className="text-sm leading-relaxed text-[#e8eeff]/88">{analysis.summary}</p>
        </section>

        <section className="mt-6 grid grid-cols-3 gap-3">
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
        </section>

        <section className="relative mt-8">
          <article
            className={`mu-lab-glass rounded-2xl border border-[rgba(247,231,206,0.12)] p-5 transition ${
              hasAccess ? "" : "select-none blur-xl"
            }`}
          >
            <h2 className="font-serif text-2xl text-[#eef1ff]">Deep Insight</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#dbe1ff]/84">
              {analysis.deepInsight}
            </p>
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
  );
}
