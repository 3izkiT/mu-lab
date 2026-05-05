"use client";

type PaywallOverlayProps = {
  analysisId: string;
};

export default function PaywallOverlay({ analysisId }: PaywallOverlayProps) {
  const startCheckout = async (purchaseType: "deep-insight" | "premium-monthly") => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseType, analysisId }),
    });

    const payload = (await response.json()) as { redirectUrl?: string };
    if (payload.redirectUrl) window.location.href = payload.redirectUrl;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[rgba(3,7,18,0.72)] p-4 backdrop-blur-sm">
      <div className="mu-lab-glass w-full max-w-md rounded-2xl border border-[rgba(247,231,206,0.25)] p-6 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Premium Access</p>
        <h3 className="mt-3 font-serif text-2xl text-[#eef1ff]">Unlock Deep Insight</h3>
        <p className="mt-3 text-sm text-[#dbe1ff]/80">
          เนื้อหาส่วนนี้ถูกล็อกไว้สำหรับสมาชิกหรือการปลดล็อกรายครั้ง
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <div className="rounded-2xl border border-[rgba(247,231,206,0.2)] bg-[rgba(247,231,206,0.06)] p-3 text-left">
            <button
              type="button"
              onClick={() => startCheckout("deep-insight")}
              className="w-full rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-5 py-2.5 text-sm font-semibold text-[#241d16]"
            >
              ปลดล็อกเฉพาะรายงานนี้ 19 บาท
            </button>
            <p className="mt-2 text-xs leading-relaxed text-[#dbe1ff]/80">
              ใช้ได้กับรายงานนี้ครั้งเดียว เหมาะกับคนที่อยากตัดสินใจเรื่องเร่งด่วนแบบทันที
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(247,231,206,0.2)] bg-[rgba(247,231,206,0.04)] p-3 text-left">
            <button
              type="button"
              onClick={() => startCheckout("premium-monthly")}
              className="w-full rounded-full border border-[rgba(247,231,206,0.4)] bg-[rgba(247,231,206,0.08)] px-5 py-2.5 text-sm font-semibold text-[var(--gold)]"
            >
              อัปเกรด Premium 159 บาท/เดือน
            </button>
            <p className="mt-2 text-xs leading-relaxed text-[#dbe1ff]/80">
              ใช้งานได้ไม่จำกัดตลอด 30 วัน สำหรับทุกรายงานใหม่และรายงานเดิมในบัญชีเดียวกัน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
