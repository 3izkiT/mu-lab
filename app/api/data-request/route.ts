import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

type RequestBody = {
  requestType?: "access" | "delete" | "rectify" | "withdraw-consent";
  fullName?: string;
  email?: string;
  details?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const requestType = body.requestType;
  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const details = body.details?.trim() ?? "";

  if (!requestType || !fullName || !email || !details) {
    return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
  }

  await prisma.dataRequest.create({
    data: {
      id: nanoid(10),
      requestType,
      fullName,
      email,
      details,
      status: "received",
    },
  });

  return NextResponse.json({
    ok: true,
    message: "ระบบได้รับคำขอแล้ว และจะติดต่อกลับทางอีเมลที่ระบุ",
  });
}
