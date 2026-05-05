"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutSlipPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = useMemo(() => search.get("sessionId") || "", [search]);
  const expected = useMemo(() => Number(search.get("amount") || "0"), [search]);

  const [amount, setAmount] = useState(expected || 0);
  const [referenceCode, setReferenceCode] = useState("");
  const [paidAtIso, setPaidAtIso] = useState(() => new Date().toISOString().slice(0, 16));
  const [source, setSource] = useState("promptpay");

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <section className="mu-lab-glass rounded-3xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]/80">Fallback Payment Verification</p>
        <h1 className="mt-2 font-serif text-3xl text-[#eef1ff]">อัปโหลดข้อมูลสลิปเพื่อปลดล็อคอัตโนมัติ</h1>
        <p className="mt-2 text-sm text-[#dbe1ff]/78">
          ระบบจะตรวจยอดเงินและรหัสอ้างอิงให้อัตโนมัติทันที ถ้าไม่ผ่านจะเข้าคิวฉุกเฉินของแอดมิน
        </p>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-[#dbe1ff]/80">
          session: {sessionId || "-"} {expected ? `· ยอดที่ควรจ่าย ฿${expected}` : ""}
        </div>

        <form
          className="mt-5 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setMessage(null);
            startTransition(async () => {
              const res = await fetch("/api/slip/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sessionId,
                  paidAmountTHB: Number(amount),
                  paidAtIso: new Date(paidAtIso).toISOString(),
                  referenceCode,
                  source,
                }),
              });
              const body = (await res.json().catch(() => ({}))) as { message?: string; autoVerified?: boolean };
              if (!res.ok) {
                setError(body.message || "ส่งสลิปไม่สำเร็จ");
                return;
              }
              if (body.autoVerified) {
                setMessage("ยืนยันสลิปสำเร็จ ปลดล็อคเรียบร้อย");
                setTimeout(() => router.push("/vault"), 900);
                return;
              }
              setMessage(body.message || "ส่งสลิปแล้ว อยู่ระหว่างตรวจสอบ");
            });
          }}
        >
          <label className="grid gap-1 text-sm text-[#dbe1ff]/86">
            ยอดที่โอนจริง (บาท)
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="rounded-lg border border-white/15 bg-[#0d1224]/90 px-3 py-2 text-[#eef1ff] outline-none"
            />
          </label>
          <label className="grid gap-1 text-sm text-[#dbe1ff]/86">
            วัน-เวลาที่โอน
            <input
              type="datetime-local"
              required
              value={paidAtIso}
              onChange={(e) => setPaidAtIso(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#0d1224]/90 px-3 py-2 text-[#eef1ff] outline-none"
            />
          </label>
          <label className="grid gap-1 text-sm text-[#dbe1ff]/86">
            รหัสอ้างอิงในสลิป
            <input
              required
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#0d1224]/90 px-3 py-2 text-[#eef1ff] outline-none"
            />
          </label>
          <label className="grid gap-1 text-sm text-[#dbe1ff]/86">
            ช่องทางจ่ายเงิน
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#0d1224]/90 px-3 py-2 text-[#eef1ff] outline-none"
            >
              <option value="promptpay">PromptPay</option>
              <option value="truemoney">TrueMoney</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="unknown">อื่นๆ</option>
            </select>
          </label>

          <button
            disabled={isPending || !sessionId}
            className="mt-2 rounded-full bg-gradient-to-r from-[var(--gold)] to-[#f6db86] px-5 py-2 text-sm font-semibold text-[#2b1a07] disabled:opacity-60"
          >
            {isPending ? "กำลังยืนยัน..." : "ส่งสลิปและยืนยันยอด"}
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
      </section>
    </main>
  );
}

