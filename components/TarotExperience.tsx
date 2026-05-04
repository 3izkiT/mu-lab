"use client";

import { useState } from "react";

export type TarotResponse = {
  readingId: string;
  dateKey: string;
  cards: string[];
  preview: string;
  freeLimitPerDay: number;
  freeRemainingToday: number;
  deepUnlocked: boolean;
  guestMode?: boolean;
  deepInsight?: string;
  checkout?: { purchaseType: "tarot-deep"; readingId: string; amountTHB: number };
};

type TarotExperienceProps = {
  initialResult?: TarotResponse | null;
};

export default function TarotExperience({ initialResult = null }: TarotExperienceProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TarotResponse | null>(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  const onDraw = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tarot/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = (await response.json()) as TarotResponse & { message?: string };
      if (!response.ok) throw new Error(payload.message || "tarot unavailable");
      setResult(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ไม่สามารถเปิดไพ่ได้");
    } finally {
      setLoading(false);
    }
  };

  const onUnlockDeep = async () => {
    if (!result?.checkout) return;
    setUnlocking(true);
    setError(null);
    try {
      const checkout = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseType: result.checkout.purchaseType,
          analysisId: result.checkout.readingId,
        }),
      });
      const c = (await checkout.json()) as { sessionId?: string; message?: string };
      if (checkout.status === 401) {
        const next = encodeURIComponent(`/tarot?readingId=${result.readingId}`);
        window.location.href = `/login?next=${next}`;
        return;
      }
      if (!checkout.ok || !c.sessionId) throw new Error(c.message || "checkout failed");

      const unlock = await fetch("/api/purchases/tarot-deep/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: result.readingId }),
      });
      if (!unlock.ok) throw new Error("unlock failed");

      const refreshed = await fetch("/api/tarot/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: result.readingId }),
      });
      const payload = (await refreshed.json()) as TarotResponse & { message?: string };
      if (!refreshed.ok) throw new Error(payload.message || "refresh failed");
      setResult(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ปลดล็อกไม่สำเร็จ");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="mu-lab-glass rounded-3xl p-8">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Quantum Tarot</p>
      <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">Sacred Geometry Deck</h1>
      <p className="mt-3 text-sm text-[#dbe1ff]/82">ฟรีวันละ 1 ครั้ง/คน แล้วปลดล็อกโหมดเจาะลึกได้ด้วยแพ็กเกจ 79 บาท</p>
      {result?.guestMode ? (
        <p className="mt-2 text-xs text-[#dbe1ff]/70">
          โหมดทดลองใช้งานโดยไม่ต้องสมัครสมาชิก: เปิดไพ่ฟรีได้ทันที หากต้องการปลดล็อกเชิงลึกหรือเก็บประวัติข้ามอุปกรณ์ ให้เข้าสู่ระบบ
        </p>
      ) : null}
      <p className="mt-2 text-xs text-[#dbe1ff]/62">
        สิทธิ์ฟรีคงเหลือวันนี้: {result?.freeRemainingToday ?? 1}/{result?.freeLimitPerDay ?? 1}
      </p>

      <label className="mt-6 block text-sm text-[#dbe1ff]/85">
        คำถามของคุณ
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-2 min-h-20 w-full rounded-2xl border border-white/15 bg-[#071024]/70 px-4 py-3 text-sm text-[#eef1ff] outline-none focus:border-[var(--gold)]/50"
          placeholder="เช่น งานใหม่ไตรมาสนี้จะไปทางไหน?"
        />
      </label>
      <button
        type="button"
        onClick={onDraw}
        disabled={loading}
        className="mt-4 rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] disabled:opacity-60"
      >
        {loading ? "กำลังเปิดไพ่..." : "เปิดไพ่ (สิทธิ์ฟรีวันละ 1 ครั้ง)"}
      </button>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      {result ? (
        <div className="mt-8 space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {result.cards.map((card) => (
              <div key={card} className="mu-lab-glass rounded-xl border border-[rgba(247,231,206,0.2)] p-4 text-center">
                <p className="text-xs text-[var(--gold)]/75">Card</p>
                <p className="mt-2 font-serif text-lg text-[#eef1ff]">{card}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.5)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">Free Preview</p>
            <p className="mt-2 text-sm text-[#dbe1ff]/86">{result.preview}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.5)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">Deep Insight</p>
            {result.deepUnlocked ? (
              <pre className="mt-2 whitespace-pre-wrap text-sm text-[#dbe1ff]/86">{result.deepInsight}</pre>
            ) : (
              <div>
                <p className="mt-2 text-sm text-[#dbe1ff]/70">ปลดล็อกเพื่อดูคำแนะนำเจาะลึก, แผน 30 วัน และจุดเสี่ยงเฉพาะคำถามนี้</p>
                <button
                  type="button"
                  onClick={onUnlockDeep}
                  disabled={unlocking}
                  className="mt-3 rounded-full border border-[rgba(247,231,206,0.45)] px-5 py-2 text-sm font-semibold text-[var(--gold)] disabled:opacity-60"
                >
                  {unlocking ? "กำลังปลดล็อก..." : "ปลดล็อกเจาะลึก 79 บาท"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
