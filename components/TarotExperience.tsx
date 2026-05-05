"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getTarotCardArt } from "@/lib/tarot-cards";

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

const SLOT_LABELS = ["อดีต", "ปัจจุบัน", "อนาคต"] as const;

function CardBack() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_30%_25%,rgba(247,231,206,0.18)_0%,transparent_55%),linear-gradient(140deg,#1a1235_0%,#0a0a22_55%,#020314_100%)]">
      <div className="pointer-events-none absolute inset-[6px] rounded-[14px] border border-[rgba(247,231,206,0.32)] shadow-[inset_0_0_24px_rgba(247,231,206,0.12)]" />
      <div className="pointer-events-none absolute inset-[14px] rounded-[10px] border border-[rgba(247,231,206,0.16)]" />
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 100 140" className="h-3/5 w-auto text-[var(--gold)] opacity-80" aria-hidden>
          <defs>
            <radialGradient id="cb-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(247,231,206,0.55)" />
              <stop offset="100%" stopColor="rgba(247,231,206,0)" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="70" r="36" fill="url(#cb-glow)" />
          <circle cx="50" cy="70" r="22" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="50" cy="70" r="14" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.85">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6;
              const x1 = 50 + Math.cos(a) * 14;
              const y1 = 70 + Math.sin(a) * 14;
              const x2 = 50 + Math.cos(a) * 26;
              const y2 = 70 + Math.sin(a) * 26;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <text
            x="50"
            y="74"
            textAnchor="middle"
            fontSize="6"
            fill="currentColor"
            style={{ letterSpacing: "0.2em" }}
            opacity="0.95"
          >
            μ-Lab
          </text>
          <text x="50" y="22" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.7">
            ✦ TAROT ✦
          </text>
          <text x="50" y="124" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.7">
            ✦ ✦ ✦
          </text>
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_85%,rgba(163,175,255,0.18)_0%,transparent_60%)]" />
    </div>
  );
}

function CardFace({ name }: { name: string }) {
  const art = getTarotCardArt(name);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#0a1024]">
      {art ? (
        <Image
          src={`/tarot/${art.slug}.webp`}
          alt={art.nameTh ?? art.name}
          fill
          sizes="(max-width: 640px) 30vw, 220px"
          className="object-cover"
          priority={false}
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-sm text-[var(--gold)]">{name}</div>
      )}
      <div className="pointer-events-none absolute inset-[6px] rounded-[14px] border border-[rgba(247,231,206,0.34)] shadow-[inset_0_0_18px_rgba(247,231,206,0.16)]" />
    </div>
  );
}

type Slot = {
  key: string;
  name: string | null;
  flipped: boolean;
};

const EMPTY_SLOTS: Slot[] = [
  { key: "s1", name: null, flipped: false },
  { key: "s2", name: null, flipped: false },
  { key: "s3", name: null, flipped: false },
];

export default function TarotExperience({ initialResult = null }: TarotExperienceProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TarotResponse | null>(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [slots, setSlots] = useState<Slot[]>(() => {
    if (initialResult?.cards?.length) {
      return initialResult.cards.slice(0, 3).map((name, i) => ({ key: `init-${i}`, name, flipped: true }));
    }
    return EMPTY_SLOTS;
  });
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    if (!result) return;
    const cards = result.cards.slice(0, 3);
    setSlots(cards.map((name, i) => ({ key: `${result.readingId}-${i}`, name, flipped: false })));
    cards.forEach((_, i) => {
      setTimeout(() => {
        setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, flipped: true } : s)));
      }, 350 + i * 380);
    });
  }, [result]);

  const totalRemaining = result?.freeRemainingToday ?? 1;
  const totalLimit = result?.freeLimitPerDay ?? 1;
  const cardArts = useMemo(
    () => slots.map((slot) => (slot.name ? getTarotCardArt(slot.name) : null)),
    [slots],
  );

  async function onDraw() {
    if (loading) return;
    setError(null);
    setLoading(true);
    setShuffling(true);
    setSlots((prev) => prev.map((s) => ({ ...s, flipped: false })));
    try {
      await new Promise((r) => setTimeout(r, 700));
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
      setShuffling(false);
    }
  }

  async function onUnlockDeep() {
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
  }

  return (
    <div className="mu-lab-glass overflow-hidden rounded-3xl p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Quantum Tarot</p>
          <h1 className="mt-2 font-serif text-2xl text-[#eef1ff] sm:text-3xl">Sacred Geometry · Rider-Waite</h1>
        </div>
        <div className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-[#dbe1ff]/80">
          สิทธิ์ฟรีวันนี้ · {totalRemaining}/{totalLimit}
        </div>
      </div>
      <p className="mt-3 text-sm text-[#dbe1ff]/82">
        ตั้งคำถามในใจ แล้วกด <span className="text-[var(--gold)]">"สับและเปิดไพ่"</span>{" "}
        หรือคลิกที่ไพ่ด้านหลังเพื่อเปิด ไพ่ที่ขึ้นมาคือ <em className="not-italic text-[var(--gold)]/85">อดีต · ปัจจุบัน · อนาคต</em> ของคำถามนั้น
      </p>
      {result?.guestMode ? (
        <p className="mt-2 text-xs text-[#dbe1ff]/65">
          โหมดทดลอง: เปิดไพ่ฟรีได้ทันทีโดยไม่ต้องสมัครสมาชิก หากต้องการเก็บประวัติ/ปลดล็อกบทอ่านลึก ให้เข้าสู่ระบบ
        </p>
      ) : null}

      <div className="relative mt-7 flex justify-center [perspective:1400px]">
        <div
          className={`grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-5 ${shuffling ? "tarot-shuffle" : ""}`}
        >
          {slots.map((slot, i) => {
            const art = cardArts[i];
            const interactive = !loading;
            const isFlipped = slot.flipped && Boolean(slot.name);
            return (
              <div key={slot.key} className="flex flex-col items-center gap-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/70">
                  {SLOT_LABELS[i]}
                </div>
                <button
                  type="button"
                  onClick={onDraw}
                  disabled={!interactive}
                  aria-label={`เปิดไพ่ ${SLOT_LABELS[i]}`}
                  className={`group relative aspect-[2/3.4] w-full max-w-[200px] cursor-pointer rounded-[20px] outline-none transition will-change-transform [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  } ${interactive ? "hover:-translate-y-1.5 focus-visible:-translate-y-1.5" : "cursor-default"}`}
                  style={{ transitionProperty: "transform", transitionDuration: "650ms" }}
                >
                  <div
                    className="absolute inset-0 [backface-visibility:hidden] drop-shadow-[0_18px_40px_rgba(3,5,16,0.6)]"
                  >
                    <CardBack />
                    <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_30%_20%,rgba(247,231,206,0.22)_0%,transparent_55%)] opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div
                    className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] drop-shadow-[0_18px_40px_rgba(3,5,16,0.6)]"
                  >
                    {slot.name ? <CardFace name={slot.name} /> : null}
                  </div>
                </button>
                {art && isFlipped ? (
                  <div className="text-center">
                    <p className="font-serif text-sm text-[var(--gold)] sm:text-base">{art.nameTh}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#dbe1ff]/55">{art.name}</p>
                  </div>
                ) : (
                  <div className="h-9" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <label className="mt-8 block text-sm text-[#dbe1ff]/85">
        คำถามของคุณ <span className="text-[#dbe1ff]/55">(ใส่หรือไม่ใส่ก็ได้)</span>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-2 min-h-20 w-full rounded-2xl border border-white/15 bg-[#071024]/70 px-4 py-3 text-sm text-[#eef1ff] outline-none focus:border-[var(--gold)]/50"
          placeholder="เช่น งานใหม่ไตรมาสนี้จะไปทางไหน?"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onDraw}
          disabled={loading}
          className="rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] shadow-[0_0_28px_rgba(247,231,206,0.22)] transition hover:brightness-105 disabled:opacity-60"
        >
          {loading ? "กำลังสับไพ่..." : result ? "สับและเปิดไพ่อีกครั้ง" : "สับและเปิดไพ่"}
        </button>
        <p className="text-xs text-[#dbe1ff]/55">
          {totalRemaining > 0 ? "สิทธิ์ฟรียังเหลืออยู่ในวันนี้" : "วันนี้ใช้สิทธิ์ฟรีแล้ว — ปลดล็อกบทอ่านลึกได้ด้านล่าง"}
        </p>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      {result ? (
        <div className="mt-8 grid gap-5">
          <div className="rounded-2xl border border-white/12 bg-[rgba(5,10,24,0.55)] p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/75">Quick Reading</p>
            <p className="mt-3 text-sm leading-relaxed text-[#dbe1ff]/88">{result.preview}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {cardArts.map((art, i) =>
                art ? (
                  <div key={`m-${art.slug}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]/60">{SLOT_LABELS[i]}</p>
                    <p className="mt-1 font-serif text-sm text-[var(--gold)]">{art.nameTh}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[#dbe1ff]/76">{art.meaningTh}</p>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-[rgba(5,10,24,0.55)] p-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/75">Deep Insight</p>
            {result.deepUnlocked ? (
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#dbe1ff]/86">
                {result.deepInsight}
              </pre>
            ) : (
              <div>
                <p className="mt-3 text-sm leading-relaxed text-[#dbe1ff]/72">
                  ปลดล็อกเพื่ออ่านบทเจาะลึกเฉพาะคำถามนี้: แผน 30 วัน, สัญญาณดี/ข้อควรเลี่ยง, จังหวะที่ใช่
                </p>
                <button
                  type="button"
                  onClick={onUnlockDeep}
                  disabled={unlocking}
                  className="mt-4 rounded-full border border-[rgba(247,231,206,0.5)] bg-[rgba(247,231,206,0.06)] px-5 py-2 text-sm font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.12)] disabled:opacity-60"
                >
                  {unlocking ? "กำลังปลดล็อก..." : "ปลดล็อกบทอ่านลึก 39 บาท"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
