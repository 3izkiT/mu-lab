import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

type WebhookTx = Pick<typeof prisma, "checkoutSession" | "purchase" | "subscription">;

type WebhookBody = {
  eventType?: string;
  sessionId?: string;
  status?: "completed" | "failed";
  providerRef?: string;
};

export async function POST(request: Request) {
  const raw = await request.text();
  let body: WebhookBody = {};
  try {
    body = JSON.parse(raw) as WebhookBody;
  } catch {
    body = {};
  }

  const eventType = body.eventType || "unknown";
  const sessionId = body.sessionId;
  const status = body.status || "failed";

  await prisma.webhookEvent.create({
    data: {
      id: nanoid(12),
      provider: "stripe",
      eventType,
      payload: raw || "{}",
      status: sessionId ? "received" : "rejected",
    },
  });

  if (!sessionId) {
    return NextResponse.json({ message: "missing sessionId" }, { status: 400 });
  }

  const session = await prisma.checkoutSession.findUnique({ where: { id: sessionId } });
  if (!session) {
    return NextResponse.json({ message: "session not found" }, { status: 404 });
  }

  if (status !== "completed") {
    await prisma.checkoutSession.update({
      where: { id: sessionId },
      data: { status: "failed", providerRef: body.providerRef || null },
    });
    return NextResponse.json({ ok: true, unlocked: false });
  }

  await prisma.$transaction(async (tx: WebhookTx) => {
    await tx.checkoutSession.update({
      where: { id: sessionId },
      data: { status: "completed", providerRef: body.providerRef || null },
    });

    if (session.purchaseType === "deep-insight") {
      const exists = await tx.purchase.findFirst({
        where: {
          userId: session.userId,
          featureType: "deep-insight",
          targetId: session.analysisId ?? undefined,
          status: "completed",
        },
      });
      if (!exists) {
        await tx.purchase.create({
          data: {
            id: nanoid(12),
            userId: session.userId,
            featureType: "deep-insight",
            targetId: session.analysisId,
            amountTHB: session.amountTHB,
            status: "completed",
          },
        });
      }
      return;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    await tx.subscription.upsert({
      where: { id: `premium-${session.userId}` },
      create: {
        id: `premium-${session.userId}`,
        userId: session.userId,
        planType: "premium",
        status: "active",
        expiryDate,
      },
      update: {
        status: "active",
        expiryDate,
      },
    });
    await tx.purchase.create({
      data: {
        id: nanoid(12),
        userId: session.userId,
        featureType: "premium-monthly",
        amountTHB: session.amountTHB,
        status: "completed",
      },
    });
  });

  return NextResponse.json({ ok: true, unlocked: true });
}
