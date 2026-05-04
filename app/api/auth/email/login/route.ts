import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { setUserSessionCookie } from "@/lib/auth-session";

function prismaErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    return String((err as { code?: string }).code);
  }
  return undefined;
}

type Body = { email?: string; password?: string; nextPath?: string };

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export async function POST(request: Request) {
  await ensureMvpUsers();

  const body = (await request.json().catch(() => ({}))) as Body;
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";
  const nextPath = (body.nextPath ?? "").trim() || "/vault";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "invalid email" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ message: "password required" }, { status: 400 });
  }

  let user: { id: string; passwordHash: string | null } | null;
  try {
    user = await prisma.user.findUnique({ where: { email }, select: { id: true, passwordHash: true } });
  } catch (err) {
    console.error("[email/login]", err);
    if (prismaErrorCode(err) === "P2022") {
      return NextResponse.json(
        {
          message:
            "ฐานข้อมูลยังไม่อัปเดตสคีมาล่าสุด — รัน prisma migrate deploy บนเซิร์ฟเวอร์ หรือตรวจ DATABASE_URL",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ message: "login failed" }, { status: 500 });
  }

  if (!user?.passwordHash) {
    return NextResponse.json({ message: "invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ message: "invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, redirectUrl: nextPath });
  setUserSessionCookie(response, request, user.id);
  return response;
}

