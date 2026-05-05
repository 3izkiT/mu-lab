import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { getPriceTHB, type PurchaseType } from "@/lib/billing-config";
import { rateLimitOrThrow } from "@/lib/rate-limit";

type CheckoutBody = {
  purchaseType?: PurchaseType;
  targetId?: string;
  targetType?: "analysis" | "tarot" | "dashboard";
};

export async function POST(request: Request) {
  await ensureMvpUsers();
  try {
    rateLimitOrThrow(request, { keyPrefix: "checkout", limit: 8, windowMs: 60_000 });
  } catch (err) {
    const retryAfterSeconds = (err as any)?.retryAfterSeconds as number | undefined;
    return NextResponse.json(
      { message: "too many requests" },
      {
        status: 429,
        headers: retryAfterSeconds ? { "retry-after": String(retryAfterSeconds) } : undefined,
      },
    );
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;

  if (!userId) {
    return NextResponse.json({ message: "login required" }, { status: 401 });
  }

  const body = (await request.json()) as CheckoutBody;
  if (!body.purchaseType) {
    return NextResponse.json({ message: "purchaseType is required" }, { status: 400 });
  }

  const amountTHB = getPriceTHB(body.purchaseType);
  const sessionId = nanoid(12);
  await prisma.checkoutSession.create({
    data: {
      id: sessionId,
      userId,
      purchaseType: body.purchaseType,
      analysisId: body.targetId,
      amountTHB,
      status: "pending",
      provider: "stripe",
    },
  });

  const targetType = body.targetType ?? "analysis";
  const targetId = body.targetId ?? "";
  const successUrl = `/checkout/success?sessionId=${encodeURIComponent(sessionId)}&purchaseType=${encodeURIComponent(body.purchaseType)}&targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`;
  const cancelUrl = `/checkout/cancel?sessionId=${encodeURIComponent(sessionId)}`;
  const providerBaseUrl = process.env.PAYMENT_PROVIDER_CHECKOUT_URL?.trim();
  if (!providerBaseUrl && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { message: "payment provider is not configured in production" },
      { status: 503 },
    );
  }
  const redirectUrl = providerBaseUrl
    ? `${providerBaseUrl}?sessionId=${encodeURIComponent(sessionId)}&successUrl=${encodeURIComponent(successUrl)}&cancelUrl=${encodeURIComponent(cancelUrl)}`
    : `/checkout/provider?sessionId=${encodeURIComponent(sessionId)}&successUrl=${encodeURIComponent(successUrl)}`;

  return NextResponse.json({
    redirectUrl,
    sessionId,
  });
}
