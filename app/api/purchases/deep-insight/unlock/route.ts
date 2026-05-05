import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { getPriceTHB } from "@/lib/billing-config";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "manual unlock disabled in production" }, { status: 410 });
  }
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) return NextResponse.json({ message: "login required" }, { status: 401 });

  const body = (await request.json()) as { analysisId?: string; sessionId?: string };
  if (!body.analysisId) {
    return NextResponse.json({ message: "analysisId is required" }, { status: 400 });
  }
  if (!body.sessionId) {
    return NextResponse.json({ message: "sessionId is required" }, { status: 400 });
  }

  const session = await prisma.checkoutSession.findUnique({ where: { id: body.sessionId } });
  const validSession =
    session &&
    session.userId === userId &&
    session.purchaseType === "deep-insight" &&
    session.analysisId === body.analysisId &&
    session.status === "completed";
  if (!validSession) {
    return NextResponse.json({ message: "payment not verified" }, { status: 403 });
  }

  await prisma.purchase.create({
    data: {
      id: nanoid(10),
      userId,
      featureType: "deep-insight",
      targetId: body.analysisId,
      amountTHB: getPriceTHB("deep-insight"),
      status: "completed",
    },
  });

  return NextResponse.json({ ok: true });
}
