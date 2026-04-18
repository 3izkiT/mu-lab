import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { createOrGetTarotReading, getTarotReadingForUser } from "@/lib/tarot-engine";
import { rateLimitOrThrow } from "@/lib/rate-limit";
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; 
type ReadBody = { question?: string; readingId?: string };

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
  const userId = cookieStore.get("mu_lab_uid")?.value;
  if (!userId) {
    return NextResponse.json({ message: "login required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as ReadBody;
  if (body.readingId) {
    const existing = await getTarotReadingForUser(userId, body.readingId);
    if (!existing) return NextResponse.json({ message: "reading not found" }, { status: 404 });
    return NextResponse.json(existing);
  }

  const reading = await createOrGetTarotReading(userId, body.question ?? "ภาพรวมวันนี้");
  return NextResponse.json(reading);
}
