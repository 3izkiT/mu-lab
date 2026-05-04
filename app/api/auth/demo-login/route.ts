import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { setUserSessionCookie } from "@/lib/auth-session";

export async function POST(request: Request) {
  const allowDemoLogin = process.env.ALLOW_DEMO_LOGIN === "1";
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (isProd && !allowDemoLogin) {
    return NextResponse.json({ message: "disabled" }, { status: 403 });
  }

  await ensureMvpUsers();
  const body = (await request.json()) as { userId?: string; nextPath?: string };
  const userId = body.userId?.trim() || "demo-user";
  const nextPath = body.nextPath?.trim() || "/vault";
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, name: userId === "demo-user" ? "Demo User" : "Member", credits: 120 },
  });

  const response = NextResponse.json({ ok: true, redirectUrl: nextPath });
  setUserSessionCookie(response, request, userId);
  return response;
}
