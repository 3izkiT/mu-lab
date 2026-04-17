import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { shouldUseSecureCookie } from "@/lib/cookie-security";

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

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) {
    return NextResponse.json({ message: "invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ message: "invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, redirectUrl: nextPath });
  response.cookies.set("mu_lab_uid", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

