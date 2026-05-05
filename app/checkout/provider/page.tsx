"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutProviderPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = params.get("sessionId") || "";
  const successUrl = params.get("successUrl") || "/checkout/success";

  const canProceed = useMemo(() => sessionId.length > 0, [sessionId]);

  async function onPayNow() {
    if (!canProceed || processing) return;
    setProcessing(true);
    setError(null);
    try {
      const webhookResp = await fetch("/api/webhook/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `mock_${sessionId}_${Date.now()}`,
          eventType: "checkout.session.completed",
          sessionId,
          status: "completed",
        }),
      });
      if (!webhookResp.ok) throw new Error("payment confirmation failed");
      router.replace(successUrl);
    } catch {
      setError("ยืนยันการชำระเงินไม่สำเร็จ กรุณาลองอีกครั้ง");
      setProcessing(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.24)] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Provider Checkout</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">Secure Payment Gateway</h1>
        <p className="mt-3 text-sm text-[#dbe1ff]/82">
          หน้านี้จำลอง provider payment ในสภาพแวดล้อมพัฒนาเพื่อทดสอบ flow unlock แบบครบลูป
        </p>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        <button
          type="button"
          disabled={!canProceed || processing}
          onClick={onPayNow}
          className="mt-6 rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16] disabled:opacity-60"
        >
          {processing ? "กำลังยืนยันการชำระเงิน..." : "Pay Now"}
        </button>
      </div>
    </main>
  );
}

