"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ONE_OFF_ACCESS_DAYS, PRICING_THB } from "@/lib/billing-config";
import { getTarotCardArt, TAROT_DRAW_DECK } from "@/lib/tarot-cards";

type GlobalPassPurchaseType = "vip-daily" | "vip-weekly" | "premium-monthly";

export type TarotResponse = {
  readingId: string;
  dateKey: string;
  spreadCount: 3 | 5 | 10;
  spreadPositions: string[];
  cards: string[];
  preview: string;
  freeLimitPerDay: number;
  freeRemainingToday: number;
  deepUnlocked: boolean;
  guestMode?: boolean;
  deepInsight?: string;
  checkout?: { readingId: string };
};

type TarotExperienceProps = {
  initialResult?: TarotResponse | null;
};

const BASE_SLOT_LABELS = ["อดีต", "ปัจจุบัน", "อนาคต"] as const;
const SPREAD_OPTIONS = [3, 5, 10] as const;
const BTN_BASE =
  "transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:brightness-95";

function CardBack() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#060a1a]">
      {/* Background gloss */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(247,231,206,0.14)_0%,transparent_55%),linear-gradient(140deg,#0f0a2a_0%,#0a0a22_45%,#020314_100%)]" />

      {/* Brand poster scaled down (~50%) */}
      <div className="pointer-events-none absolute inset-0 p-10">
        <Image
          src="/logo-brand-v2.png"
          alt="Mu-Lab logo card back"
          fill
          sizes="220px"
          className="object-contain"
          priority={false}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,12,0.10)_0%,rgba(2,4,12,0.55)_100%)]" />

      <div className="pointer-events-none absolute inset-[6px] rounded-[14px] border border-[rgba(247,231,206,0.28)] shadow-[inset_0_0_18px_rgba(247,231,206,0.12)]" />
      <div className="pointer-events-none absolute inset-[14px] rounded-[10px] border border-[rgba(247,231,206,0.18)]" />
    </div>
  );
}

function CardFace({ name }: { name: string }) {
  const art = getTarotCardArt(name);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-[#0a1024]">
      {art?.hasArtwork ? (
        <Image
          src={`/tarot/${art.slug}.webp`}
          alt={art.nameTh ?? art.name}
          fill
          sizes="(max-width: 640px) 30vw, 220px"
          className="object-cover"
          priority={false}
        />
      ) : art ? (
        <div className="grid h-full w-full place-content-center bg-[linear-gradient(135deg,#171033_0%,#0b1228_100%)] p-2 text-center">
          <p className="font-serif text-base text-[var(--gold)]">{art.nameTh}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#dbe1ff]/72">{art.name}</p>
        </div>
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
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  useEffect(() => {
    if (result) return;
    setSlots(
      Array.from({ length: spreadCount }, (_, i) => ({
        key: `empty-${spreadCount}-${i}`,
        name: null,
        flipped: false,
      })),
    );
  }, [spreadCount, result]);

  useEffect(() => {
    if (!result) return;
    // Lock UI selector to whatever the API actually returned for this reading.
    // If today's free quota is already used, the API will return the latest saved reading,
    // so cards count will remain the same for the rest of the day.
    const actualCount = result.cards.length;
    if (actualCount === 3 || actualCount === 5 || actualCount === 10) {
      setSpreadCount(actualCount);
    }
    const cards = result.cards;
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
        if (result?.spreadPositions?.[i]) return result.spreadPositions[i];
        if (i < BASE_SLOT_LABELS.length) return BASE_SLOT_LABELS[i];
        return `ตำแหน่ง ${i + 1}`;
      }),
    [slots, result?.spreadPositions],
  );
  const selectionComplete = selectedCards.length === spreadCount;

  function toggleSelectCard(cardName: string) {
    if (loading) return;
    setSelectedCards((prev) => {
      if (prev.includes(cardName)) return prev.filter((v) => v !== cardName);
      if (prev.length >= spreadCount) return prev;
      return [...prev, cardName];
    });
  }

  async function onDraw() {
    if (loading || !selectionComplete) return;
    setError(null);
    setLoading(true);
    setShuffling(true);
    setSlots((prev) => prev.map((s) => ({ ...s, flipped: false })));
    try {
      await new Promise((r) => setTimeout(r, 700));
      const response = await fetch("/api/tarot/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, spreadCount, selectedCards }),
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

  async function startCheckout(purchaseType: GlobalPassPurchaseType) {
    if (!result?.checkout) return;
    setUnlocking(true);
    setError(null);
    try {
      const targetType = "dashboard";
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
        เริ่มจากเลือกไพ่จากสำรับเต็ม 72 ใบก่อน จากนั้นกดทำนายตามสเปรดที่เลือก (3 / 5 / 10 ใบ)
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
            onClick={() => {
              setSpreadCount(n);
              setSelectedCards([]);
              setResult(null);
            }}
            className={`${BTN_BASE} rounded-full px-3 py-1 text-xs ${
              spreadCount === n
                ? "border border-[rgba(247,231,206,0.5)] bg-[rgba(247,231,206,0.08)] text-[var(--gold)]"
                : "border border-white/15 bg-white/[0.03] text-[#dbe1ff]/82"
            }`}
          >
            {n} ใบ
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/12 bg-[rgba(5,10,24,0.55)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/75">Full Deck · 72 Cards</p>
          <p className="text-xs text-[#dbe1ff]/72">
            เลือกแล้ว {selectedCards.length}/{spreadCount} ใบ
          </p>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {TAROT_DRAW_DECK.map((card) => {
            const selected = selectedCards.includes(card.name);
            return (
              <button
                key={card.name}
                type="button"
                onClick={() => toggleSelectCard(card.name)}
                disabled={loading || (!selected && selectedCards.length >= spreadCount)}
                className={`${BTN_BASE} relative overflow-hidden rounded-xl border ${
                  selected
                    ? "border-[var(--gold)] bg-[rgba(247,231,206,0.12)] -translate-y-2 shadow-[0_10px_24px_rgba(247,231,206,0.22)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
                title={card.name}
              >
                <div className="aspect-[2/3] p-1.5">
                  <CardBack />
                </div>
                <div className="px-1 pb-1 text-[10px] text-[#dbe1ff]/75">{selected ? "เลือกแล้ว" : "แตะเพื่อเลือก"}</div>
              </button>
            );
          })}
        </div>
      </div>

      {!result ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onDraw}
            disabled={!selectionComplete || loading}
            className={`${BTN_BASE} inline-flex min-w-[240px] items-center justify-center rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-8 py-3 text-base font-semibold text-[#241d16] shadow-[0_0_34px_rgba(247,231,206,0.32)] disabled:opacity-50`}
          >
            {loading ? "กำลังทำนาย..." : `ทำนายจากไพ่ที่เลือก (${spreadCount} ใบ)`}
          </button>
        </div>
      ) : null}

      <div className="relative mt-7 flex justify-center [perspective:1400px]">
        <div
          className={`grid w-full max-w-5xl gap-3 sm:gap-5 ${shuffling ? "tarot-shuffle" : ""}`}
          style={{
            gridTemplateColumns:
              spreadCount === 10
                ? "repeat(6, minmax(0, 1fr))"
                : spreadCount === 5
                  ? "repeat(3, minmax(0, 1fr))"
                  : "repeat(3, minmax(0, 1fr))",
          }}
        >
          {slots.map((slot, i) => {
            const art = cardArts[i];
            const interactive = !loading;
            const isFlipped = slot.flipped && Boolean(slot.name);
            return (
              <div
                key={slot.key}
                className={`flex flex-col items-center gap-3 ${
                  spreadCount === 5
                    ? ["col-start-2 row-start-2", "col-start-1 row-start-2", "col-start-3 row-start-2", "col-start-2 row-start-1", "col-start-2 row-start-3"][i] ?? ""
                    : spreadCount === 10
                      ? [
                          "col-start-3 row-start-2",
                          "col-start-3 row-start-3",
                          "col-start-2 row-start-2",
                          "col-start-4 row-start-2",
                          "col-start-3 row-start-1",
                          "col-start-3 row-start-4",
                          "col-start-5 row-start-1",
                          "col-start-5 row-start-2",
                          "col-start-5 row-start-3",
                          "col-start-5 row-start-4",
                        ][i] ?? ""
                      : ""
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/70">
                  {slotLabels[i]}
                </div>
                <button
                  type="button"
                  disabled
                  aria-label={`เปิดไพ่ ${slotLabels[i]}`}
                  className={`group relative aspect-[2/3.4] w-full max-w-[200px] cursor-default rounded-[20px] outline-none transition will-change-transform [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
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
            <p className="mt-3 text-base leading-relaxed text-[#dbe1ff]/88 sm:text-lg">{result.preview}</p>
            <div
              className={`mt-4 grid gap-3 ${
                result.cards.length <= 3
                  ? "sm:grid-cols-3"
                  : result.cards.length <= 5
                    ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
              }`}
            >
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
                <p className="mt-3 text-base leading-relaxed text-[#dbe1ff]/82 sm:text-lg">
                  ปลดล็อกทั้งระบบเพื่ออ่านบทเจาะลึกของคำถามนี้ (สิทธิ์ย้อนหลัง {ONE_OFF_ACCESS_DAYS} วัน): แผน 30 วัน, สัญญาณดี/ข้อควรเลี่ยง, จังหวะที่ใช่
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => startCheckout("vip-daily")}
                    disabled={unlocking}
                    className={`${BTN_BASE} rounded-full border border-white/25 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-[#dbe1ff] hover:bg-white/[0.08] disabled:opacity-60`}
                  >
                    {unlocking ? "กำลังพาไปจ่าย..." : `ทั้งระบบ 1 วัน ฿${PRICING_THB["vip-daily"]}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => startCheckout("vip-weekly")}
                    disabled={unlocking}
                    className={`${BTN_BASE} rounded-full border border-white/25 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-[#dbe1ff] hover:bg-white/[0.08] disabled:opacity-60`}
                  >
                    {unlocking ? "กำลังพาไปจ่าย..." : `ทั้งระบบ 7 วัน ฿${PRICING_THB["vip-weekly"]}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => startCheckout("premium-monthly")}
                    disabled={unlocking}
                    className={`${BTN_BASE} rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-4 py-2 text-sm font-semibold text-[#241d16] hover:brightness-105 disabled:opacity-60`}
                  >
                    {unlocking ? "กำลังพาไปจ่าย..." : `พรีเมียมรายเดือน ฿${PRICING_THB["premium-monthly"]}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setSelectedCards([]);
              setSlots(Array.from({ length: spreadCount }, (_, i) => ({ key: `reset-${i}`, name: null, flipped: false })));
            }}
            className={`${BTN_BASE} rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-[#e8eeff] hover:bg-white/[0.06]`}
          >
            เริ่มจัดไพ่ใหม่
          </button>
        </div>
      ) : null}
    </div>
  );
}
