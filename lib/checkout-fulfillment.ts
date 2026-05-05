import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

type FulfillResult =
  | { ok: true; unlocked: boolean; alreadyCompleted: boolean; sessionId: string }
  | { ok: false; status: number; message: string; sessionId: string };

type FulfillInput = {
  sessionId: string;
  providerRef?: string | null;
  status: "completed" | "failed";
};

export async function fulfillCheckoutSession(input: FulfillInput): Promise<FulfillResult> {
  const { sessionId, providerRef, status } = input;
  const session = await prisma.checkoutSession.findUnique({ where: { id: sessionId } });
  if (!session) return { ok: false, status: 404, message: "session not found", sessionId };

  if (status !== "completed") {
    await prisma.checkoutSession.update({
      where: { id: sessionId },
      data: { status: "failed", providerRef: providerRef ?? undefined },
    });
    return { ok: true, unlocked: false, alreadyCompleted: false, sessionId };
  }

  if (session.status === "completed") {
    return { ok: true, unlocked: true, alreadyCompleted: true, sessionId };
  }

  await prisma.$transaction(async (tx) => {
    await tx.checkoutSession.update({
      where: { id: sessionId },
      data: { status: "completed", providerRef: providerRef ?? undefined },
    });

    if (
      session.purchaseType === "deep-insight" ||
      session.purchaseType === "tarot-deep" ||
      session.purchaseType === "vip-daily" ||
      session.purchaseType === "vip-weekly"
    ) {
      const exists = await tx.purchase.findFirst({
        where: {
          userId: session.userId,
          featureType: session.purchaseType,
          targetId: session.analysisId ?? undefined,
          status: "completed",
        },
      });
      if (!exists) {
        await tx.purchase.create({
          data: {
            id: nanoid(12),
            userId: session.userId,
            featureType: session.purchaseType,
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

  return { ok: true, unlocked: true, alreadyCompleted: false, sessionId };
}

