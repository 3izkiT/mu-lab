import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers, GUEST_USER_ID } from "@/lib/auth-mvp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 1. ตรวจสอบ User พื้นฐานก่อน
    await ensureMvpUsers();

    // 2. อ่านคุกกี้แบบ "ระมัดระวัง" (จุดตายอยู่ที่นี่)
    let userId = GUEST_USER_ID;
    try {
      const cookieStore = await cookies();
      const muUid = cookieStore.get("mu_lab_uid")?.value;
      if (muUid) userId = muUid;
    } catch (cookieError) {
      // ถ้าอ่านคุกกี้ไม่ได้ (เช่น ตอน Build) ให้ใช้ Guest ID ไปเลย ไม่ต้องพัง
      console.log("Cookie read skipped during build/error");
    }

    // 3. อ่าน Body
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

    // 4. บันทึกลงฐานข้อมูล
    const result = await prisma.analysis.create({
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

    return NextResponse.json({ id: result.id });
  } catch (error) {
    // ถ้าพังที่ Prisma หรือส่วนอื่น ให้คืนค่า 500 ไปตามปกติ
    console.error("Analysis Save Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}