export const dynamic = 'force-dynamic';
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { createOrGetTarotReading, getTarotReadingForUser } from "@/lib/tarot-engine";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

type ReadBody = { question?: string; readingId?: string };

async function createGuestUser() {
  const userId = `guest-${nanoid(10)}`;
  await prisma.user.create({
    data: {
      id: userId,
      name: "Guest",
      email: null,
      passwordHash: "",
      credits: 0,
    },
  });
  return userId;
}

export async function POST(request: Request) {
  await ensureMvpUsers();
  try {
    rateLimitOrThrow(request, { keyPrefix: "tarot-read", limit: 12, windowMs: 60_000 });
  } catch (err) {
    const retryAfterSeconds = (err as any)?.retryAfterSeconds as number | undefined;
    return NextResponse.json(
      { message: "too many requests" },
      {
        status: 429,
        headers: retryAfterSeconds ? { "retry-after": String(retryAfterSeconds) } : undefined,
      },
    );
  }

  const cookieStore = await cookies();
  let userId = cookieStore.get("mu_lab_uid")?.value;
  let shouldSetCookie = false;

  if (!userId) {
    userId = await createGuestUser();
    shouldSetCookie = true;
  } else {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      userId = await createGuestUser();
      shouldSetCookie = true;
    }
  }

  const body = (await request.json().catch(() => ({}))) as ReadBody;
  if (body.readingId) {
    const existing = await getTarotReadingForUser(userId, body.readingId);
    if (!existing) return NextResponse.json({ message: "reading not found" }, { status: 404 });
    const existingResponse = NextResponse.json(existing);
    if (shouldSetCookie) {
      existingResponse.cookies.set("mu_lab_uid", userId, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
      });
    }
    return existingResponse;
  }

  const reading = await createOrGetTarotReading(userId, body.question ?? "ภาพรวมวันนี้");
  const finalResponse = NextResponse.json(reading);
  if (shouldSetCookie) {
    finalResponse.cookies.set("mu_lab_uid", userId, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }
  return finalResponse;
}
