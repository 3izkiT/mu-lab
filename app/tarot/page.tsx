import { getCurrentUser } from "@/lib/auth-utils";

export default async function TarotPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const freeQuotaUsed = true;
  const needsTopup = freeQuotaUsed && user.credits < 10;

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <div className="mu-lab-glass rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Quantum Tarot</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">Sacred Geometry Deck</h1>
        <p className="mt-3 text-sm text-[#dbe1ff]/82">สุ่มฟรี 1 ใบ/วัน และใช้เครดิตเมื่อถามแบบหลายใบ</p>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`card-${idx}`}
              className="mu-lab-glass aspect-[3/5] rounded-xl border border-[rgba(247,231,206,0.2)]"
            />
          ))}
        </div>

        {needsTopup ? (
          <div className="mt-6 rounded-2xl border border-[rgba(247,231,206,0.25)] bg-[rgba(247,231,206,0.08)] p-4">
            <p className="text-sm text-[#eef1ff]">เครดิตไม่พอสำหรับการเปิดไพ่เพิ่ม กรุณาเติมเครดิตเพื่อใช้งานต่อ</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
