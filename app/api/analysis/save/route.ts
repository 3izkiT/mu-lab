import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers, GUEST_USER_ID } from "@/lib/auth-mvp";

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value || GUEST_USER_ID;

  const body = (await request.json()) as {
    message?: string;
    meters?: { career?: number; wealth?: number; love?: number };
  };

  if (!body.message?.trim()) {
    return NextResponse.json({ message: "missing analysis message" }, { status: 400 });
  }

  const id = nanoid(10);
  const lines = body.message.trim().split("\n").filter(Boolean);
  const summary = lines.slice(0, 3).join(" ").slice(0, 300);

  await prisma.analysis.create({
    data: {
      id,
      userId,
      summary,
      deepInsight: body.message.trim(),
      career: body.meters?.career ?? 50,
      wealth: body.meters?.wealth ?? 50,
      love: body.meters?.love ?? 50,
    },
  });

  return NextResponse.json({ id });
}
