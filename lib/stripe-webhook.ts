import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

type WebhookTx = Pick<typeof prisma, "checkoutSession" | "purchase" | "subscription" | "webhookEvent">;

export type StripeEventLike = {
  id?: string;
  type?: string;
  eventType?: string;
  sessionId?: string;
  status?: "completed" | "failed";
  providerRef?: string;
  data?: {
    object?: {
      id?: string;
      payment_intent?: string;
      client_reference_id?: string;
      metadata?: Record<string, string | undefined>;
    };
  };
};

export function resolveSessionId(body: StripeEventLike): string | null {
  const fromMock = body.sessionId;
  if (fromMock) return fromMock;
  const fromMetadata = body.data?.object?.metadata?.sessionId;
  if (fromMetadata) return fromMetadata;
  const fromClientRef = body.data?.object?.client_reference_id;
  if (fromClientRef) return fromClientRef;
  return null;
}

export function resolveStatus(body: StripeEventLike): "completed" | "failed" {
  if (body.status === "completed" || body.type === "checkout.session.completed") return "completed";
  if (body.status === "failed" || body.type === "checkout.session.expired") return "failed";
  return "failed";
}

export function resolveEventType(body: StripeEventLike): string {
  return body.type || body.eventType || "unknown";
}

type ProcessResult =
  | { ok: true; duplicate?: boolean; unlocked?: boolean; eventId: string }
  | { ok: false; status: number; message: string; eventId: string };

export async function processStripeWebhookEvent(args: {
  raw: string;
  body: StripeEventLike;
  eventIdOverride?: string;
  allowDuplicate?: boolean;
}): Promise<ProcessResult> {
  const { raw, body, eventIdOverride, allowDuplicate = false } = args;
  const eventType = resolveEventType(body);
  const sessionId = resolveSessionId(body);
  const status = resolveStatus(body);
  const providerRef = body.providerRef || body.data?.object?.payment_intent || body.data?.object?.id || null;
  const eventId = eventIdOverride || body.id || `manual:${sessionId ?? "none"}:${status}`;

  if (!allowDuplicate) {
    const alreadyHandled = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
    if (alreadyHandled) {
      return { ok: true, duplicate: true, eventId };
    }
  }

  await prisma.webhookEvent.create({
    data: {
      id: eventId,
      provider: "stripe",
      eventType,
      payload: raw || "{}",
      status: sessionId ? "received" : "rejected",
    },
  });

  if (!sessionId) {
    await prisma.webhookEvent.update({ where: { id: eventId }, data: { status: "failed" } });
    return { ok: false, status: 400, message: "missing sessionId", eventId };
  }

  const session = await prisma.checkoutSession.findUnique({ where: { id: sessionId } });
  if (!session) {
    await prisma.webhookEvent.update({ where: { id: eventId }, data: { status: "failed" } });
    return { ok: false, status: 404, message: "session not found", eventId };
  }

  if (status !== "completed") {
    await prisma.checkoutSession.update({
      where: { id: sessionId },
      data: { status: "failed", providerRef },
    });
    await prisma.webhookEvent.update({ where: { id: eventId }, data: { status: "processed" } });
    return { ok: true, unlocked: false, eventId };
  }

  try {
    await prisma.$transaction(async (tx: WebhookTx) => {
      await tx.checkoutSession.update({
        where: { id: sessionId },
        data: { status: "completed", providerRef },
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

    await prisma.webhookEvent.update({ where: { id: eventId }, data: { status: "processed" } });
    return { ok: true, unlocked: true, eventId };
  } catch {
    await prisma.webhookEvent.update({ where: { id: eventId }, data: { status: "failed" } });
    return { ok: false, status: 500, message: "webhook processing failed", eventId };
  }
}

