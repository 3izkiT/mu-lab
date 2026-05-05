import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { createOrGetTarotReading, getTarotReadingForUser } from "@/lib/tarot-engine";
import { shouldUseSecureCookie } from "@/lib/cookie-security";
import { prisma } from "@/lib/prisma";
import { rateLimitOrThrow } from "@/lib/rate-limit";

type ReadBody = { question?: string; readingId?: string; spreadCount?: number };
type MaybeRetry = { retryAfterSeconds?: number };

export async function POST(request: Request) {
  await ensureMvpUsers();
  try {
    rateLimitOrThrow(request, { keyPrefix: "tarot-read", limit: 12, windowMs: 60_000 });
  } catch (err) {
    const retryAfterSeconds = (err as MaybeRetry)?.retryAfterSeconds;
    return NextResponse.json(
      { message: "too many requests" },
      {
        status: 429,
        headers: retryAfterSeconds ? { "retry-after": String(retryAfterSeconds) } : undefined,
      },
    );
  }

  const cookieStore = await cookies();
  const memberUserId = cookieStore.get("mu_lab_uid")?.value;
  const existingGuestId = cookieStore.get("mu_guest_uid")?.value;
  let createdGuestId: string | null = null;

  let userId = memberUserId;
  let guestMode = false;
  if (!userId) {
    guestMode = true;
    const guestId = existingGuestId || `g_${nanoid(10)}`;
    if (!existingGuestId) createdGuestId = guestId;
    userId = `guest:${guestId}`;
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: "Guest Tarot", credits: 0 },
    });
  }

  const body = (await request.json().catch(() => ({}))) as ReadBody;
  if (body.readingId) {
    const existing = await getTarotReadingForUser(userId, body.readingId);
    if (!existing) return NextResponse.json({ message: "reading not found" }, { status: 404 });
    const response = NextResponse.json({ ...existing, guestMode });
    if (createdGuestId) {
      response.cookies.set("mu_guest_uid", createdGuestId, {
        httpOnly: true,
        sameSite: "lax",
        secure: shouldUseSecureCookie(request),
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  }

  const spreadCount = body.spreadCount === 5 || body.spreadCount === 10 ? body.spreadCount : 3;
  const reading = await createOrGetTarotReading(userId, body.question ?? "ภาพรวมวันนี้", spreadCount);
  const response = NextResponse.json({ ...reading, guestMode });
  if (createdGuestId) {
    response.cookies.set("mu_guest_uid", createdGuestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: shouldUseSecureCookie(request),
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}
