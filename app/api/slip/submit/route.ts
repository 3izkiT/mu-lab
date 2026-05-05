import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { fulfillCheckoutSession } from "@/lib/checkout-fulfillment";
import { prisma } from "@/lib/prisma";

type SubmitSlipBody = {
  sessionId?: string;
  paidAmountTHB?: number;
  paidAtIso?: string;
  referenceCode?: string;
  source?: "promptpay" | "truemoney" | "bank-transfer" | "unknown";
};

function isWithin36Hours(dateIso?: string): boolean {
  if (!dateIso) return false;
  const t = Date.parse(dateIso);
  if (Number.isNaN(t)) return false;
  const diffMs = Math.abs(Date.now() - t);
  return diffMs <= 36 * 60 * 60 * 1000;
}

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) return NextResponse.json({ message: "login required" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as SubmitSlipBody;
  if (!body.sessionId) return NextResponse.json({ message: "sessionId is required" }, { status: 400 });
  if (typeof body.paidAmountTHB !== "number") return NextResponse.json({ message: "paidAmountTHB is required" }, { status: 400 });

  const session = await prisma.checkoutSession.findUnique({ where: { id: body.sessionId } });
  if (!session || session.userId !== userId) {
    return NextResponse.json({ message: "checkout session not found" }, { status: 404 });
  }

  const amountMatch = session.amountTHB === Math.round(body.paidAmountTHB);
  const hasReference = Boolean(body.referenceCode?.trim());
  const paidAtValid = isWithin36Hours(body.paidAtIso);
  const autoVerified = amountMatch && hasReference && paidAtValid;
  const eventId = `slip:${body.sessionId}:${nanoid(6)}`;
  const providerRef = `slip:${body.referenceCode ?? "noref"}`;

  await prisma.webhookEvent.create({
    data: {
      id: eventId,
      provider: "slip",
      eventType: autoVerified ? "slip.auto_verified" : "slip.pending_review",
      payload: JSON.stringify({
        sessionId: body.sessionId,
        paidAmountTHB: body.paidAmountTHB,
        paidAtIso: body.paidAtIso,
        referenceCode: body.referenceCode,
        source: body.source ?? "unknown",
        submittedBy: userId,
      }),
      status: autoVerified ? "processed" : "received",
    },
  });

  if (!autoVerified) {
    return NextResponse.json({
      ok: true,
      autoVerified: false,
      message: "ส่งสลิปแล้ว อยู่ระหว่างตรวจสอบอัตโนมัติ/ฉุกเฉิน",
      eventId,
    });
  }

  const fulfilled = await fulfillCheckoutSession({
    sessionId: body.sessionId,
    providerRef,
    status: "completed",
  });

  if (!fulfilled.ok) {
    await prisma.webhookEvent.update({ where: { id: eventId }, data: { status: "failed" } });
    return NextResponse.json({ message: fulfilled.message }, { status: fulfilled.status });
  }

  return NextResponse.json({
    ok: true,
    autoVerified: true,
    unlocked: fulfilled.unlocked,
    eventId,
  });
}

