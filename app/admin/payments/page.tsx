import { redirect } from "next/navigation";
import { SlipApproveButton } from "@/components/admin/SlipApproveButton";
import WebhookReplayButton from "@/components/admin/WebhookReplayButton";
import { getCurrentUser, isAdminUserId } from "@/lib/auth-utils";
import { ENTITLEMENT_MATRIX } from "@/lib/entitlement-matrix";
import { prisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/payments");
  if (!isAdminUserId(user.id)) redirect("/vault");

  const now = Date.now();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [
    pending,
    completed24h,
    failed24h,
    completedSessions24h,
    purchases7d,
    revenueToday,
    webhookReceived24h,
    webhookFailed24h,
    recentWebhookEvents,
    slipPending24h,
    slipProcessed24h,
    slipFailed24h,
    recentSlipEvents,
  ] = await Promise.all([
    prisma.checkoutSession.count({ where: { status: "pending" } }),
    prisma.checkoutSession.count({ where: { status: "completed", updatedAt: { gte: dayAgo } } }),
    prisma.checkoutSession.count({ where: { status: "failed", updatedAt: { gte: dayAgo } } }),
    prisma.checkoutSession.findMany({
      where: { status: "completed", updatedAt: { gte: dayAgo } },
      select: { createdAt: true, updatedAt: true },
      take: 200,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.purchase.groupBy({
      by: ["featureType"],
      where: { createdAt: { gte: weekAgo }, status: "completed" },
      _count: { featureType: true },
      _sum: { amountTHB: true },
      orderBy: { _count: { featureType: "desc" } },
    }),
    prisma.purchase.aggregate({
      where: { status: "completed", createdAt: { gte: dayAgo } },
      _sum: { amountTHB: true },
    }),
    prisma.webhookEvent.count({ where: { provider: "stripe", status: "processed", createdAt: { gte: dayAgo } } }),
    prisma.webhookEvent.count({ where: { provider: "stripe", status: "failed", createdAt: { gte: dayAgo } } }),
    prisma.webhookEvent.findMany({
      where: { provider: "stripe" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, eventType: true, status: true, createdAt: true },
    }),
    prisma.webhookEvent.count({ where: { provider: "slip", status: "received", createdAt: { gte: dayAgo } } }),
    prisma.webhookEvent.count({ where: { provider: "slip", status: "processed", createdAt: { gte: dayAgo } } }),
    prisma.webhookEvent.count({ where: { provider: "slip", status: "failed", createdAt: { gte: dayAgo } } }),
    prisma.webhookEvent.findMany({
      where: { provider: "slip" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, eventType: true, status: true, createdAt: true, payload: true },
    }),
  ]);

  const avgUnlockSeconds = completedSessions24h.length
    ? Math.round(
        completedSessions24h.reduce(
          (acc, item) => acc + (item.updatedAt.getTime() - item.createdAt.getTime()) / 1000,
          0,
        ) / completedSessions24h.length,
      )
    : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mu-lab-glass rounded-3xl p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">Admin · Payments Ops</p>
        <h1 className="mt-2 font-serif text-3xl text-[#eef1ff]">Checkout & Unlock Health</h1>
        <p className="mt-2 text-sm text-[#dbe1ff]/78">
          ภาพรวมนี้ใช้เช็ก conversion ฝั่งชำระเงินและความเร็วการปลดล็อกสิทธิ์แบบ real-time
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Revenue (24h)" value={`฿${revenueToday._sum.amountTHB ?? 0}`} />
          <KpiCard label="Pending Sessions" value={String(pending)} />
          <KpiCard label="Completed (24h)" value={String(completed24h)} />
          <KpiCard label="Failed (24h)" value={String(failed24h)} />
          <KpiCard label="Avg Unlock (sec)" value={String(avgUnlockSeconds)} />
          <KpiCard label="Webhook OK (24h)" value={String(webhookReceived24h)} />
          <KpiCard label="Webhook Failed (24h)" value={String(webhookFailed24h)} />
          <KpiCard label="Slip Pending (24h)" value={String(slipPending24h)} />
          <KpiCard label="Slip Auto/Manual OK (24h)" value={String(slipProcessed24h)} />
          <KpiCard label="Slip Failed (24h)" value={String(slipFailed24h)} />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
          <p className="text-sm font-semibold text-[#eef1ff]">Top Product Mix (7 days)</p>
          <div className="mt-3 grid gap-2">
            {purchases7d.map((item) => (
              <div
                key={item.featureType}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm"
              >
                <p className="text-[#dbe1ff]/86">{item.featureType}</p>
                <p className="text-[var(--gold)]">
                  {item._count.featureType} ครั้ง · ฿{item._sum.amountTHB ?? 0}
                </p>
              </div>
            ))}
            {purchases7d.length === 0 ? (
              <p className="text-sm text-[#dbe1ff]/65">ยังไม่มีธุรกรรมในรอบ 7 วัน</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
          <p className="text-sm font-semibold text-[#eef1ff]">Slip Monitor (Emergency Queue)</p>
          <p className="mt-1 text-xs text-[#dbe1ff]/70">
            คิวนี้ใช้เฉพาะกรณีออโต้ยืนยันไม่ผ่านเท่านั้น แอดมินกดปลดล็อคฉุกเฉินได้จากรายการด้านล่าง
          </p>
          <div className="mt-3 grid gap-2">
            {recentSlipEvents.map((event) => {
              let sessionId = "-";
              let amount = "-";
              try {
                const p = JSON.parse(event.payload || "{}") as { sessionId?: string; paidAmountTHB?: number };
                sessionId = p.sessionId ?? "-";
                amount = typeof p.paidAmountTHB === "number" ? `฿${p.paidAmountTHB}` : "-";
              } catch {}
              return (
                <div key={event.id} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[#dbe1ff]/86">
                      {event.eventType} · {amount} · {sessionId}
                    </p>
                    <p
                      className={
                        event.status === "processed" ? "text-emerald-300" : event.status === "failed" ? "text-rose-300" : "text-amber-300"
                      }
                    >
                      {event.status}
                    </p>
                  </div>
                  {event.status === "received" ? <SlipApproveButton eventId={event.id} /> : null}
                </div>
              );
            })}
            {recentSlipEvents.length === 0 ? (
              <p className="text-sm text-[#dbe1ff]/65">ยังไม่มีรายการสลิป</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
          <p className="text-sm font-semibold text-[#eef1ff]">Recent Stripe Webhooks</p>
          <div className="mt-3 grid gap-2">
            {recentWebhookEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[#dbe1ff]/86">{event.eventType}</p>
                  <p
                    className={
                      event.status === "processed" ? "text-emerald-300" : event.status === "failed" ? "text-rose-300" : "text-amber-300"
                    }
                  >
                    {event.status}
                  </p>
                </div>
                {event.status === "failed" ? (
                  <WebhookReplayButton eventId={event.id} />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
          <p className="text-sm font-semibold text-[#eef1ff]">Entitlement Matrix (Current)</p>
          <div className="mt-3 grid gap-2">
            {ENTITLEMENT_MATRIX.map((rule) => (
              <div key={rule.key} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="text-sm text-[var(--gold)]">{rule.label}</p>
                <p className="mt-1 text-[11px] text-[#dbe1ff]/70">{rule.tier}</p>
                <p className="mt-1 text-xs text-[#dbe1ff]/82">{rule.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[#dbe1ff]/62">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#eef1ff]">{value}</p>
    </article>
  );
}

