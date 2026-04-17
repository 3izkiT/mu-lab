import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";

type CheckoutBody = {
  purchaseType?: "deep-insight" | "premium-monthly";
  analysisId?: string;
};

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;

  if (!userId) {
    return NextResponse.json({ message: "login required" }, { status: 401 });
  }

  const body = (await request.json()) as CheckoutBody;
  if (!body.purchaseType) {
    return NextResponse.json({ message: "purchaseType is required" }, { status: 400 });
  }

  const amountTHB = body.purchaseType === "deep-insight" ? 99 : 199;
  const sessionId = nanoid(12);
  await prisma.checkoutSession.create({
    data: {
      id: sessionId,
      userId,
      purchaseType: body.purchaseType,
      analysisId: body.analysisId,
      amountTHB,
      status: "pending",
      provider: "stripe",
    },
  });

  const successUrl = body.analysisId
    ? `/checkout/success?analysisId=${encodeURIComponent(body.analysisId)}&sessionId=${encodeURIComponent(sessionId)}`
    : "/checkout/success";
  return NextResponse.json({
    redirectUrl: successUrl,
    sessionId,
  });
}
