import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isPurchaseType, getPurchaseTitleTh } from "@/lib/purchase-labels";

type SuccessPageProps = {
  searchParams: Promise<{
    sessionId?: string;
    purchaseType?: string;
    targetType?: "analysis" | "tarot" | "dashboard";
    targetId?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { sessionId, purchaseType, targetType, targetId } = await searchParams;

  let resolvedPurchaseType = purchaseType ?? "";
  let resolvedTargetType = targetType ?? "dashboard";
  let resolvedTargetId = targetId ?? "";

  if (sessionId) {
    const session = await prisma.checkoutSession.findUnique({
      where: { id: sessionId },
      select: { purchaseType: true, analysisId: true, status: true, amountTHB: true },
    });
    if (session) {
      resolvedPurchaseType = resolvedPurchaseType || session.purchaseType;
      resolvedTargetId = resolvedTargetId || session.analysisId || "";
      if (!targetType) {
        resolvedTargetType =
          session.purchaseType === "tarot-deep"
            ? "tarot"
            : session.purchaseType === "premium-monthly" || session.purchaseType === "vip-daily" || session.purchaseType === "vip-weekly"
              ? "dashboard"
              : "analysis";
      }
      if (session.status !== "completed") {
        const slipLabel = isPurchaseType(session.purchaseType)
          ? `${getPurchaseTitleTh(session.purchaseType)} · ฿${session.amountTHB}`
          : `ยืนยันการชำระ · ฿${session.amountTHB}`;
        return (
          <main className="mx-auto max-w-3xl px-4 py-20">
            <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.24)] p-8 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80 sm:text-sm">Awaiting Payment Confirmation</p>
              <h1 className="mt-3 font-serif text-2xl text-[#eef1ff] sm:text-3xl">กำลังรอยืนยันยอดชำระ</h1>
              <p className="mt-4 text-base leading-relaxed text-[#dbe1ff]/86 sm:text-lg">
                หากโอนแล้ว ให้แจ้งสลิปในขั้นตอนถัดไป ทีมจะตรวจและปลดล็อกให้ (ไม่ปลดอัตโนมัติจากฟอร์มเพื่อความปลอดภัย)
              </p>
              <p className="mt-3 font-serif text-lg font-semibold text-[var(--gold)] sm:text-xl">{slipLabel}</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/checkout/slip?sessionId=${encodeURIComponent(sessionId)}&amount=${session.amountTHB}&purchaseType=${encodeURIComponent(session.purchaseType)}`}
                  className="inline-block rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-base font-semibold text-[#241d16] sm:text-lg"
                >
                  แจ้งโอน / แนบสลิป
                </Link>
                <Link
                  href="/vault"
                  className="inline-block rounded-full border border-white/20 px-6 py-2.5 text-base font-semibold text-[#eef1ff] sm:text-lg"
                >
                  กลับไป Vault
                </Link>
              </div>
            </div>
          </main>
        );
      }
    }
  }

  const redirectHref =
    resolvedTargetType === "tarot"
      ? `/tarot${resolvedTargetId ? `?readingId=${encodeURIComponent(resolvedTargetId)}` : ""}`
      : resolvedTargetType === "analysis" && resolvedTargetId
        ? `/analysis/${encodeURIComponent(resolvedTargetId)}`
        : "/vault";

  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <div className="mu-lab-glass rounded-3xl border border-[rgba(247,231,206,0.24)] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Payment Success</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff]">Divine Connection Established</h1>
        <p className="mt-3 text-sm text-[#dbe1ff]/82">สิทธิ์ของคุณถูกอัปเดตแล้ว พร้อมใช้งานทันที</p>
        {resolvedPurchaseType ? (
          <p className="mt-1 text-xs text-[#dbe1ff]/62">แพ็กที่ปลดล็อก: {resolvedPurchaseType}</p>
        ) : null}
        <Link
          href={redirectHref}
          className="mt-6 inline-block rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-6 py-2.5 text-sm font-semibold text-[#241d16]"
        >
          ไปที่ผลลัพธ์ของคุณ
        </Link>
      </div>
    </main>
  );
}
