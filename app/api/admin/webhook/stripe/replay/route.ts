import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { isAdminUserId } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { processStripeWebhookEvent, type StripeEventLike } from "@/lib/stripe-webhook";

async function runReplay(eventId: string, userId?: string | null) {
  if (!isAdminUserId(userId)) {
    return NextResponse.json({ message: "forbidden" }, { status: 403 });
  }

  const source = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (!source) return NextResponse.json({ message: "webhook event not found" }, { status: 404 });

  let parsed: StripeEventLike = {};
  try {
    parsed = JSON.parse(source.payload) as StripeEventLike;
  } catch {
    parsed = {};
  }

  const replayEventId = `${source.id}:replay:${nanoid(6)}`;
  const result = await processStripeWebhookEvent({
    raw: source.payload,
    body: parsed,
    eventIdOverride: replayEventId,
    allowDuplicate: true,
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message, replayEventId }, { status: result.status });
  }

  return NextResponse.json({ ok: true, replayEventId, unlocked: result.unlocked });
}

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  let eventId = "";
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as { eventId?: string };
    eventId = body.eventId?.trim() || "";
  } else {
    const form = await request.formData().catch(() => null);
    eventId = String(form?.get("eventId") ?? "").trim();
  }
  if (!eventId) return NextResponse.json({ message: "eventId is required" }, { status: 400 });
  return runReplay(eventId, userId);
}

