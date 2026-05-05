import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { prisma } from "@/lib/prisma";
import { rateLimitOrThrow } from "@/lib/rate-limit";

type SubmitSlipBody = {
  sessionId?: string;
  paidAmountTHB?: number;
  paidAtIso?: string;
  referenceCode?: string;
  slipImageDataUrl?: string;
  source?: "promptpay" | "truemoney" | "bank-transfer" | "unknown";
};

const MAX_IMAGE_CHARS = 380_000;

function isValidReference(ref: string): boolean {
  return /^[A-Za-z0-9-]{12,96}$/.test(ref.trim());
}

function isValidSlipImage(dataUrl: string): boolean {
  const t = dataUrl.trim();
  if (t.length < 800 || t.length > MAX_IMAGE_CHARS) return false;
  if (!t.startsWith("data:image/jpeg") && !t.startsWith("data:image/jpg") && !t.startsWith("data:image/png")) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  await ensureMvpUsers();
  try {
    rateLimitOrThrow(request, { keyPrefix: "slip-submit", limit: 6, windowMs: 60_000 });
  } catch {
    return NextResponse.json({ message: "too many requests" }, { status: 429 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) return NextResponse.json({ message: "login required" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as SubmitSlipBody;
  if (!body.sessionId) return NextResponse.json({ message: "sessionId is required" }, { status: 400 });
  if (typeof body.paidAmountTHB !== "number") return NextResponse.json({ message: "paidAmountTHB is required" }, { status: 400 });

  const session = await prisma.checkoutSession.findUnique({ where: { id: body.sessionId } });
  if (!session || session.userId !== userId) {
    return NextResponse.json({ message: "checkout session not found" }, { status: 404 });
  }

  const ref = (body.referenceCode ?? "").trim();
  const img = (body.slipImageDataUrl ?? "").trim();
  if (!isValidReference(ref) && !isValidSlipImage(img)) {
    return NextResponse.json(
      {
        message:
          "กรุณากรอกรหัสอ้างอิงจากสลิปจริงอย่างน้อย 12 ตัว (ตัวเลข/อักษร/ขีด) หรือแนบรูปสลิป JPG/PNG ชัดเจน — ระบบจะไม่ปลดล็อกอัตโนมัติจากข้อมูลไม่ครบ",
      },
      { status: 400 },
    );
  }

  if (session.amountTHB !== Math.round(body.paidAmountTHB)) {
    return NextResponse.json({ message: "ยอดเงินไม่ตรงกับรายการชำระ กรุณาตรวจสอบยอดที่ต้องจ่าย" }, { status: 400 });
  }

  const eventId = `slip:${body.sessionId}:${nanoid(6)}`;

  await prisma.webhookEvent.create({
    data: {
      id: eventId,
      provider: "slip",
      eventType: "slip.pending_review",
      payload: JSON.stringify({
        sessionId: body.sessionId,
        paidAmountTHB: body.paidAmountTHB,
        paidAtIso: body.paidAtIso,
        referenceCode: ref || null,
        slipImagePresent: Boolean(img),
        slipImageDataUrl: img ? img.slice(0, MAX_IMAGE_CHARS) : null,
        source: body.source ?? "unknown",
        submittedBy: userId,
      }),
      status: "received",
    },
  });

  return NextResponse.json({
    ok: true,
    autoVerified: false,
    message:
      "ส่งข้อมูลแล้ว — ทีมจะตรวจสลิปและปลดล็อกให้ภายในเวลาทำการ (ไม่มีการปลดล็อกอัตโนมัติจากฟอร์มนี้เพื่อความปลอดภัย)",
    eventId,
  });
}
