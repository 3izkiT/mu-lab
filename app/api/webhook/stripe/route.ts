import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type WebhookTx = Pick<typeof prisma, "checkoutSession" | "purchase" | "subscription">;

type StripeEventLike = {
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

function timingSafeHexCompare(a: string, b: string): boolean {
  try {
    const aa = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (aa.length !== bb.length) return false;
    return crypto.timingSafeEqual(aa, bb);
  } catch {
    return false;
  }
}

function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(",").map((x) => x.trim());
  const t = parts.find((p) => p.startsWith("t="))?.slice(2);
  const v1s = parts.filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || v1s.length === 0) return false;

  const payload = `${t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return v1s.some((sig) => timingSafeHexCompare(expected, sig));
}

function resolveSessionId(body: StripeEventLike): string | null {
  const fromMock = body.sessionId;
  if (fromMock) return fromMock;
  const fromMetadata = body.data?.object?.metadata?.sessionId;
  if (fromMetadata) return fromMetadata;
  const fromClientRef = body.data?.object?.client_reference_id;
  if (fromClientRef) return fromClientRef;
  return null;
}

function resolveStatus(body: StripeEventLike): "completed" | "failed" {
  if (body.status === "completed" || body.type === "checkout.session.completed") return "completed";
  if (body.status === "failed" || body.type === "checkout.session.expired") return "failed";
  return "failed";
}

function resolveEventType(body: StripeEventLike): string {
  return body.type || body.eventType || "unknown";
}

export async function POST(request: Request) {
  const raw = await request.text();
  let body: StripeEventLike = {};
  try {
    body = JSON.parse(raw) as StripeEventLike;
  } catch {
    body = {};
  }

  const signatureHeader = request.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    if (!webhookSecret) {
      return NextResponse.json({ message: "missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    }
    if (!signatureHeader || !verifyStripeSignature(raw, signatureHeader, webhookSecret)) {
      return NextResponse.json({ message: "invalid stripe signature" }, { status: 401 });
    }
  }

  const eventType = resolveEventType(body);
  const sessionId = resolveSessionId(body);
  const status = resolveStatus(body);
  const providerRef = body.providerRef || body.data?.object?.payment_intent || body.data?.object?.id || null;
  const eventId = body.id || `manual:${sessionId ?? "none"}:${status}`;

  const alreadyHandled = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (alreadyHandled) {
    return NextResponse.json({ ok: true, duplicate: true });
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
    return NextResponse.json({ message: "missing sessionId" }, { status: 400 });
  }

  const session = await prisma.checkoutSession.findUnique({ where: { id: sessionId } });
  if (!session) {
    return NextResponse.json({ message: "session not found" }, { status: 404 });
  }

  if (status !== "completed") {
    await prisma.checkoutSession.update({
      where: { id: sessionId },
      data: { status: "failed", providerRef },
    });
    await prisma.webhookEvent.update({ where: { id: eventId }, data: { status: "processed" } });
    return NextResponse.json({ ok: true, unlocked: false });
  }

  await prisma.$transaction(async (tx: WebhookTx) => {
    await tx.checkoutSession.update({
      where: { id: sessionId },
      data: { status: "completed", providerRef },
    });

    if (session.purchaseType === "deep-insight" || session.purchaseType === "tarot-deep") {
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

  return NextResponse.json({ ok: true, unlocked: true });
}
