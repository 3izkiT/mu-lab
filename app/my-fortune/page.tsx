import Link from "next/link";
import { FortuneResultView } from "@/components/FortuneResultView";
import { checkFeatureAccess, getCurrentUser } from "@/lib/auth-utils";
import { getBirthSignDetail, parseStoredBirthClock } from "@/lib/birth-sign";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

  const clock = parseStoredBirthClock(analysis.birthTime);
  const lagna =
    analysis.birthDate != null && analysis.birthDate !== ""
      ? getBirthSignDetail(
          analysis.birthDate,
          clock?.hour,
          clock?.minute,
          analysis.birthProvince ?? undefined,
        )
      : null;

  const ascendantSignName = lagna?.signName ?? analysis.birthSign ?? "เมษ";
  const ascendantIndex = lagna?.signIndex ?? 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <FortuneResultView
        analysisId={id}
        summary={analysis.summary}
        deepInsight={analysis.deepInsight}
        career={analysis.career}
        wealth={analysis.wealth}
        love={analysis.love}
        hasAccess={hasAccess}
        ascendantSignName={ascendantSignName}
        ascendantIndex={ascendantIndex}
      />
    </main>
  );
}
