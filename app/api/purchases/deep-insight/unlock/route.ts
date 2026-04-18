import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) return NextResponse.json({ message: "login required" }, { status: 401 });

  const body = (await request.json()) as { analysisId?: string };
  if (!body.analysisId) {
    return NextResponse.json({ message: "analysisId is required" }, { status: 400 });
  }

  await prisma.purchase.create({
    data: {
      id: nanoid(10),
      userId,
      featureType: "deep-insight",
      targetId: body.analysisId,
      amountTHB: 99,
      status: "completed",
    },
  });

  return NextResponse.json({ ok: true });
}
