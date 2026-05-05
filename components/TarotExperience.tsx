"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ONE_OFF_ACCESS_DAYS, PRICING_THB } from "@/lib/billing-config";
import { getTarotCardArt } from "@/lib/tarot-cards";

type TarotCheckoutPurchaseType = "vip-daily" | "tarot-deep" | "vip-weekly" | "premium-monthly";

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
  checkout?: { purchaseType: TarotCheckoutPurchaseType; readingId: string; amountTHB: number };
};

type TarotExperienceProps = {
  initialResult?: TarotResponse | null;
};

const BASE_SLOT_LABELS = ["อดีต", "ปัจจุบัน", "อนาคต"] as const;
const SPREAD_OPTIONS = [3, 5, 10] as const;

function CardBack() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#060a1a]">
      <Image src="/logo-brand-v2.png" alt="Mu-Lab logo card back" fill sizes="220px" className="object-cover" priority={false} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,12,0.18)_0%,rgba(2,4,12,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-[6px] rounded-[14px] border border-[rgba(247,231,206,0.36)] shadow-[inset_0_0_20px_rgba(247,231,206,0.14)]" />
      <div className="pointer-events-none absolute inset-[14px] rounded-[10px] border border-[rgba(247,231,206,0.2)]" />
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
  const [spreadCount, setSpreadCount] = useState<3 | 5 | 10>(3);
  const [unlocking, setUnlocking] = useState(false);
  const [slots, setSlots] = useState<Slot[]>(() => {
    if (initialResult?.cards?.length) {
      return initialResult.cards.map((name, i) => ({ key: `init-${i}`, name, flipped: true }));
    }
    return EMPTY_SLOTS.slice(0, 3);
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
  const slotLabels = useMemo(
    () =>
      slots.map((_, i) => {
        if (i < BASE_SLOT_LABELS.length) return BASE_SLOT_LABELS[i];
        return `ตำแหน่ง ${i + 1}`;
      }),
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
        body: JSON.stringify({ question, spreadCount }),
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

  async function startCheckout(purchaseType: TarotCheckoutPurchaseType) {
    if (!result?.checkout) return;
    setUnlocking(true);
    setError(null);
    try {
      const targetType = purchaseType === "tarot-deep" ? "tarot" : "dashboard";
      const checkout = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseType,
          targetId: result.checkout.readingId,
          targetType,
        }),
      });
      const c = (await checkout.json()) as { sessionId?: string; redirectUrl?: string; message?: string };
      if (checkout.status === 401) {
        const next = encodeURIComponent(`/tarot?readingId=${result.readingId}`);
        window.location.href = `/login?next=${next}`;
        return;
      }
      if (!checkout.ok || !c.sessionId || !c.redirectUrl) throw new Error(c.message || "checkout failed");
      window.location.href = c.redirectUrl;
      return;
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
        หรือคลิกที่ไพ่ด้านหลังเพื่อเปิด เลือกได้ 3 / 5 / 10 ใบตามความลึกที่ต้องการ
      </p>
      {result?.guestMode ? (
        <p className="mt-2 text-xs text-[#dbe1ff]/65">
          โหมดทดลอง: เปิดไพ่ฟรีได้ทันทีโดยไม่ต้องสมัครสมาชิก หากต้องการเก็บประวัติ/ปลดล็อกบทอ่านลึก ให้เข้าสู่ระบบ
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-xs text-[#dbe1ff]/72">รูปแบบการเปิดไพ่:</p>
        {SPREAD_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            disabled={loading}
            onClick={() => setSpreadCount(n)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              spreadCount === n
                ? "border border-[rgba(247,231,206,0.5)] bg-[rgba(247,231,206,0.08)] text-[var(--gold)]"
                : "border border-white/15 bg-white/[0.03] text-[#dbe1ff]/82"
            }`}
          >
            {n} ใบ
          </button>
        ))}
      </div>

      <div className="relative mt-7 flex justify-center [perspective:1400px]">
        <div
          className={`grid w-full max-w-4xl gap-3 sm:gap-5 ${shuffling ? "tarot-shuffle" : ""}`}
          style={{ gridTemplateColumns: `repeat(${Math.min(slots.length, 5)}, minmax(0, 1fr))` }}
        >
          {slots.map((slot, i) => {
            const art = cardArts[i];
            const interactive = !loading;
            const isFlipped = slot.flipped && Boolean(slot.name);
            return (
              <div key={slot.key} className="flex flex-col items-center gap-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/70">
                  {slotLabels[i]}
                </div>
                <button
                  type="button"
                  onClick={onDraw}
                  disabled={!interactive}
                  aria-label={`เปิดไพ่ ${slotLabels[i]}`}
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
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]/60">{slotLabels[i]}</p>
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
                  ปลดล็อกเพื่ออ่านบทเจาะลึกเฉพาะคำถามนี้ (สิทธิ์ย้อนหลัง {ONE_OFF_ACCESS_DAYS} วัน): แผน 30 วัน, สัญญาณดี/ข้อควรเลี่ยง, จังหวะที่ใช่
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => startCheckout("vip-daily")}
                    disabled={unlocking}
                    className="rounded-full border border-white/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-[#dbe1ff] transition hover:bg-white/[0.08] disabled:opacity-60"
                  >
                    {unlocking ? "กำลังพาไปจ่าย..." : `ทั้งระบบ 1 วัน ฿${PRICING_THB["vip-daily"]}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => startCheckout("tarot-deep")}
                    disabled={unlocking}
                    className="rounded-full border border-[rgba(247,231,206,0.5)] bg-[rgba(247,231,206,0.06)] px-4 py-2 text-xs font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.12)] disabled:opacity-60"
                  >
                    {unlocking ? "กำลังพาไปจ่าย..." : `เฉพาะบทนี้ ฿${PRICING_THB["tarot-deep"]}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => startCheckout("vip-weekly")}
                    disabled={unlocking}
                    className="rounded-full border border-white/25 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-[#dbe1ff] transition hover:bg-white/[0.08] disabled:opacity-60"
                  >
                    {unlocking ? "กำลังพาไปจ่าย..." : `ทั้งระบบ 7 วัน ฿${PRICING_THB["vip-weekly"]}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => startCheckout("premium-monthly")}
                    disabled={unlocking}
                    className="rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-4 py-2 text-xs font-semibold text-[#241d16] transition hover:brightness-105 disabled:opacity-60"
                  >
                    {unlocking ? "กำลังพาไปจ่าย..." : `พรีเมียมรายเดือน ฿${PRICING_THB["premium-monthly"]}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
