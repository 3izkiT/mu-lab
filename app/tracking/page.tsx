import Link from "next/link";
import { checkFeatureAccess, getCurrentUser } from "@/lib/auth-utils";

export default async function TrackingPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isPremium = await checkFeatureAccess(user.id, "premium");

  if (!isPremium) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14">
        <div className="mu-lab-glass rounded-3xl p-8 text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Fate Tracking</p>
          <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">Premium Required</h1>
          <div className="mt-6 rounded-2xl border border-[rgba(247,231,206,0.12)] bg-[rgba(255,255,255,0.02)] p-8 opacity-65">
            <p className="text-sm text-[#dbe1ff]/80">Preview Chart Placeholder (7 / 14 / 30 days)</p>
          </div>
          <Link
            href="/vault"
            className="mt-6 inline-block rounded-full border border-[rgba(247,231,206,0.4)] px-4 py-2 text-sm text-[var(--gold)]"
          >
            Upgrade to Premium
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-14">
      <div className="mu-lab-glass rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Fate Tracking</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">30-Day Premium Dashboard</h1>
        <p className="mt-3 text-sm text-[#dbe1ff]/82">หน้านี้พร้อมเชื่อมกราฟจริงและระบบแจ้งเตือนในขั้นถัดไป</p>
      </div>
    </main>
  );
}
