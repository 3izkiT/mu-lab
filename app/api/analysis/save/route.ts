import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { getThaiBirthSign } from "@/lib/birth-sign";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers, GUEST_USER_ID } from "@/lib/auth-mvp";

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value || GUEST_USER_ID;

  const body = (await request.json()) as {
    message?: string;
    meters?: { career?: number; wealth?: number; love?: number };
    fullName?: string;
    birthDate?: string;
    birthHour?: string;
    birthMinute?: string;
    birthProvince?: string;
  };

  if (!body.message?.trim()) {
    return NextResponse.json({ message: "missing analysis message" }, { status: 400 });
  }

  const id = nanoid(10);
  const trimmed = body.message.trim();
  // Keep enough lines for 4 sections of free content (was 6 — too short)
  const summaryLines = trimmed.split("\n").slice(0, 28);
  const summary = summaryLines.join("\n").slice(0, 1800);

  let birthSign: string | null = null;
  const d = body.birthDate?.trim();
  const h = body.birthHour?.trim();
  const m = body.birthMinute?.trim();
  const p = body.birthProvince?.trim();
  const fullName = body.fullName?.trim();
  const birthTime = h && m ? `${h.padStart(2, "0")}:${m.padStart(2, "0")}` : null;
  if (d && h && m && p) {
    birthSign = getThaiBirthSign(d, h, m, p);
  }

  await prisma.analysis.create({
    data: {
      id,
      userId,
      summary,
      deepInsight: trimmed,
      career: body.meters?.career ?? 50,
      wealth: body.meters?.wealth ?? 50,
      love: body.meters?.love ?? 50,
      birthSign,
      fullName: fullName || null,
      birthDate: d || null,
      birthTime,
      birthProvince: p || null,
    },
  });

  return NextResponse.json({ id });
}
