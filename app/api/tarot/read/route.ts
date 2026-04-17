import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { createOrGetTarotReading, getTarotReadingForUser } from "@/lib/tarot-engine";

type ReadBody = { question?: string; readingId?: string };

export async function POST(request: Request) {
  await ensureMvpUsers();
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
