import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureMvpUsers } from "@/lib/auth-mvp";

export async function POST(request: Request) {
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
  response.cookies.set("mu_lab_uid", userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
