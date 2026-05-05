import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { getPriceTHB } from "@/lib/billing-config";

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) return NextResponse.json({ message: "login required" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { readingId?: string };
  if (!body.readingId) return NextResponse.json({ message: "readingId is required" }, { status: 400 });

  const exists = await prisma.purchase.findFirst({
    where: { userId, featureType: "tarot-deep", targetId: body.readingId, status: "completed" },
  });
  if (!exists) {
    await prisma.purchase.create({
      data: {
        id: nanoid(10),
        userId,
        featureType: "tarot-deep",
        targetId: body.readingId,
        amountTHB: getPriceTHB("tarot-deep"),
        status: "completed",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
