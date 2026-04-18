import Link from "next/link";
import { getCurrentUser, checkFeatureAccess } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function VaultPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const history = await prisma.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const tarotHistory = await prisma.tarotReading.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const isPremium = await checkFeatureAccess(user.id, "premium");

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="mu-lab-glass rounded-2xl p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/80">Personal Vault</p>
        <nav className="mt-4 space-y-2 text-sm text-[#dbe1ff]/85">
          <p>My Profile</p>
          <p>History</p>
          <p>My Stars</p>
          <p>Credits: {user.credits}</p>
        </nav>
      </aside>

      <section className="space-y-6">
        <div className="mu-lab-glass rounded-2xl p-6">
          <h1 className="font-serif text-3xl text-[#eef1ff]">Daily Personal Dashboard</h1>
          <p className="mt-2 text-sm text-[#dbe1ff]/82">สรุปสถานะดวงส่วนตัวของคุณในวันนี้ พร้อมประวัติย้อนหลัง</p>
          {!isPremium ? (
            <Link href="/tracking" className="mt-4 inline-block rounded-full border border-[rgba(247,231,206,0.4)] px-4 py-2 text-sm text-[var(--gold)]">
              Upgrade to Premium
            </Link>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {history.map((item: { id: string; createdAt: Date; summary: string }) => (
            <Link key={item.id} href={`/analysis/${item.id}`} className="mu-lab-glass rounded-2xl p-4">
              <p className="text-xs text-[var(--gold)]/80">{new Date(item.createdAt).toLocaleString("th-TH")}</p>
              <p className="mt-2 line-clamp-3 text-sm text-[#e8eeff]/88">{item.summary}</p>
            </Link>
          ))}
          {history.length === 0 ? (
            <div className="mu-lab-glass rounded-2xl p-4 text-sm text-[#dbe1ff]/75">ยังไม่มีประวัติการวิเคราะห์</div>
          ) : null}
        </div>

        <div className="mu-lab-glass rounded-2xl p-6">
          <h2 className="font-serif text-2xl text-[#eef1ff]">ประวัติการเปิดไพ่ยิปซี</h2>
          <p className="mt-2 text-sm text-[#dbe1ff]/80">อ่านย้อนหลังได้จาก Preview เดิม และกลับไปปลดล็อกโหมดเจาะลึกได้ทุกเมื่อ</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {tarotHistory.map((item) => (
              <Link key={item.id} href={`/tarot?readingId=${encodeURIComponent(item.id)}`} className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
                <p className="text-xs text-[var(--gold)]/80">{new Date(item.createdAt).toLocaleString("th-TH")}</p>
                <p className="mt-2 line-clamp-2 text-sm text-[#e8eeff]/88">{item.question}</p>
                <p className="mt-2 line-clamp-3 text-xs text-[#dbe1ff]/72">{item.preview}</p>
              </Link>
            ))}
            {tarotHistory.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4 text-sm text-[#dbe1ff]/70">
                ยังไม่มีประวัติไพ่ยิปซี
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
