import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { shouldUseSecureCookie } from "@/lib/cookie-security";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = { email?: string; password?: string; name?: string; nextPath?: string };

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export async function POST(request: Request) {
  await ensureMvpUsers();

  const body = (await request.json().catch(() => ({}))) as Body;
  const emailRaw = body.email ?? "";
  const password = body.password ?? "";
  const email = normalizeEmail(emailRaw);
  const name = (body.name ?? "").trim() || email.split("@")[0] || "Member";
  const nextPath = (body.nextPath ?? "").trim() || "/vault";

  if (!email || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ message: "invalid email" }, { status: 400 });
  }
  if (password.length < 8 || password.length > 200) {
    return NextResponse.json({ message: "password must be 8+ characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.passwordHash) {
      return NextResponse.json({ message: "email already registered" }, { status: 409 });
    }
    // Email exists from social login; allow setting password to convert to email login.
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = existing?.id ?? `email:${email}`;

  await prisma.user.upsert({
    where: { id: userId },
    update: { email, name, passwordHash },
    create: { id: userId, email, name, passwordHash, credits: 80 },
  });

  const response = NextResponse.json({ ok: true, redirectUrl: nextPath });
  response.cookies.set("mu_lab_uid", userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

