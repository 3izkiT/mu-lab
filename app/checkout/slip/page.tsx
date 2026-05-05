"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isPurchaseType, getPurchaseTitleTh } from "@/lib/purchase-labels";

const PAYMENT_INSTRUCTIONS =
  process.env.NEXT_PUBLIC_PAYMENT_INSTRUCTIONS?.trim() ||
  "ตั้งค่า NEXT_PUBLIC_PAYMENT_INSTRUCTIONS ใน Vercel เพื่อแสดงเลขบัญชี / พร้อมเพย์ / QR สำหรับโอนเงินที่นี่";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.readAsDataURL(file);
  });
}

export default function CheckoutSlipPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = useMemo(() => search.get("sessionId") || "", [search]);
  const amount = useMemo(() => Number(search.get("amount") || "0"), [search]);
  const purchaseTypeParam = useMemo(() => search.get("purchaseType") || "", [search]);

  const planHeadline = useMemo(() => {
    if (isPurchaseType(purchaseTypeParam)) {
      return `${getPurchaseTitleTh(purchaseTypeParam)} · ฿${amount || "—"}`;
    }
    return amount ? `ยืนยันการชำระ · ฿${amount}` : "ยืนยันการชำระ";
  }, [purchaseTypeParam, amount]);

  const [paidAmount, setPaidAmount] = useState(amount || 0);
  const [referenceCode, setReferenceCode] = useState("");
  const [paidAtIso, setPaidAtIso] = useState(() => new Date().toISOString().slice(0, 16));
  const [source, setSource] = useState("promptpay");
  const [slipFile, setSlipFile] = useState<File | null>(null);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <section className="mu-lab-glass rounded-3xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]/85 sm:text-sm">ยืนยันการชำระแบบโอน / สลิป</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-[#eef1ff] sm:text-3xl">แจ้งโอนและแนบสลิป</h1>
        <p className="mt-3 text-base leading-relaxed text-[#dbe1ff]/88 sm:text-lg">
          ขั้นตอนนี้ใช้เมื่อยังไม่ได้เชื่อมต่อ Payment Gateway อัตโนมัติ หลังโอนแล้วให้กรอกข้อมูลด้านล่าง
          ทีมจะตรวจและปลดล็อกให้ —{" "}
          <span className="font-semibold text-[var(--gold)]">ระบบจะไม่ปลดล็อกอัตโนมัติจากเลขมั่วหรือข้อมูลไม่ครบ</span>
        </p>

        <div className="mt-6 rounded-2xl border border-[rgba(247,231,206,0.22)] bg-[rgba(7,16,36,0.45)] px-4 py-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]/80 sm:text-sm">รายการที่ต้องชำระ</p>
          <p className="mt-2 font-serif text-xl font-semibold text-[#eef1ff] sm:text-2xl">{planHeadline}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/12 bg-[rgba(5,10,24,0.5)] px-4 py-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]/80 sm:text-sm">โอนเข้าที่ไหน</p>
          <div className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-[#e8eeff]/90 sm:text-lg">{PAYMENT_INSTRUCTIONS}</div>
          <p className="mt-4 text-base leading-relaxed text-[#dbe1ff]/78 sm:text-lg">
            <span className="font-semibold text-[var(--gold)]">แนะนำ:</span> แนบรูปสลิป (JPG/PNG) ชัดเจน
            จะตรวจได้เร็วกว่ากรอกรหัสอ้างอิงอย่างเดียว หากไม่สะดวกแนบรูป ให้กรอกรหัสอ้างอิงจากสลิปจริงอย่างน้อย 12 ตัว
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-base leading-relaxed text-[#dbe1ff]/82 sm:text-lg">
          <p>
            <span className="font-semibold text-[var(--gold)]">ก่อนมีช่องทางจ่ายอัตโนมัติ:</span> ต้องตั้งค่า{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-[var(--gold)]">PAYMENT_PROVIDER_CHECKOUT_URL</code> หรือเชื่อม PSP
            (เช่น 2C2P / Xendit / Omise) ให้สร้าง session ชำระเงินและยิง webhook เข้า{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-[var(--gold)]">/api/webhook/stripe</code>{" "}
            จนกว่านั้น ให้ใช้โอน + แจ้งสลิปที่นี่
          </p>
        </div>

        <form
          className="mt-8 grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setMessage(null);
            startTransition(async () => {
              try {
                let slipImageDataUrl: string | undefined;
                if (slipFile) {
                  if (slipFile.size > 1_800_000) {
                    setError("ไฟล์รูปใหญ่เกินไป (สูงสุด ~1.8MB) กรุณาย่อขนาดหรือบีบอัดก่อน");
                    return;
                  }
                  slipImageDataUrl = await fileToDataUrl(slipFile);
                }
                const res = await fetch("/api/slip/submit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    sessionId,
                    paidAmountTHB: Number(paidAmount),
                    paidAtIso: new Date(paidAtIso).toISOString(),
                    referenceCode: referenceCode.trim(),
                    slipImageDataUrl,
                    source,
                  }),
                });
                const body = (await res.json().catch(() => ({}))) as { message?: string };
                if (!res.ok) {
                  setError(body.message || "ส่งข้อมูลไม่สำเร็จ");
                  return;
                }
                setMessage(body.message || "ส่งข้อมูลแล้ว รอทีมตรวจสอบ");
                setTimeout(() => router.push("/vault"), 1400);
              } catch (err) {
                setError(err instanceof Error ? err.message : "ส่งไม่สำเร็จ");
              }
            });
          }}
        >
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--gold)] sm:text-base">ยอดที่โอนจริง (บาท)</span>
            <input
              type="number"
              required
              min={1}
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="rounded-xl border border-white/15 bg-[#0d1224]/90 px-4 py-3 text-lg text-[#eef1ff] outline-none focus:border-[var(--gold)]/45 sm:text-xl"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--gold)] sm:text-base">วัน-เวลาที่โอน</span>
            <input
              type="datetime-local"
              required
              value={paidAtIso}
              onChange={(e) => setPaidAtIso(e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0d1224]/90 px-4 py-3 text-lg text-[#eef1ff] outline-none focus:border-[var(--gold)]/45 sm:text-xl"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--gold)] sm:text-base">รหัสอ้างอิงในสลิป (ไม่บังคับถ้าแนบรูป)</span>
            <input
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              placeholder="อย่างน้อย 12 ตัว จากสลิปจริง"
              className="rounded-xl border border-white/15 bg-[#0d1224]/90 px-4 py-3 text-lg text-[#eef1ff] outline-none placeholder:text-[#dbe1ff]/45 focus:border-[var(--gold)]/45 sm:text-xl"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--gold)] sm:text-base">แนบรูปสลิป (JPG / PNG)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => setSlipFile(e.target.files?.[0] ?? null)}
              className="text-base text-[#dbe1ff]/90 file:mr-3 file:rounded-lg file:border-0 file:bg-[rgba(247,231,206,0.15)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#241d16] sm:text-lg"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--gold)] sm:text-base">ช่องทางที่ใช้โอน</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="rounded-xl border border-white/15 bg-[#0d1224]/90 px-4 py-3 text-lg text-[#eef1ff] outline-none sm:text-xl"
            >
              <option value="promptpay">PromptPay</option>
              <option value="truemoney">TrueMoney</option>
              <option value="bank-transfer">โอนธนาคาร</option>
              <option value="unknown">อื่นๆ</option>
            </select>
          </label>

          <button
            disabled={isPending || !sessionId}
            className="mt-2 rounded-full bg-gradient-to-r from-[var(--gold)] to-[#f6db86] px-6 py-3 text-base font-semibold text-[#2b1a07] disabled:opacity-60 sm:text-lg"
          >
            {isPending ? "กำลังส่ง..." : "ส่งข้อมูลให้ทีมตรวจสลิป"}
          </button>
        </form>

        {error ? <p className="mt-4 text-base text-rose-300 sm:text-lg">{error}</p> : null}
        {message ? <p className="mt-4 text-base text-emerald-300 sm:text-lg">{message}</p> : null}
      </section>
    </main>
  );
}
