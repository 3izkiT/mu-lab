import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ensureMvpUsers } from "@/lib/auth-mvp";
import { isAdminUserId } from "@/lib/auth-utils";
import { fulfillCheckoutSession } from "@/lib/checkout-fulfillment";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await ensureMvpUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value || null;
  if (!userId) return NextResponse.json({ message: "login required" }, { status: 401 });
  if (!isAdminUserId(userId)) return NextResponse.json({ message: "forbidden" }, { status: 403 });

  const body = (await request.json().catch(() => ({}))) as { eventId?: string };
  if (!body.eventId) return NextResponse.json({ message: "eventId is required" }, { status: 400 });

  const event = await prisma.webhookEvent.findUnique({ where: { id: body.eventId } });
  if (!event || event.provider !== "slip") {
    return NextResponse.json({ message: "slip event not found" }, { status: 404 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(event.payload || "{}");
  } catch {
    return NextResponse.json({ message: "invalid slip payload" }, { status: 400 });
  }

  const sessionId = typeof payload.sessionId === "string" ? payload.sessionId : null;
  const referenceCode = typeof payload.referenceCode === "string" ? payload.referenceCode : "admin-manual";
  if (!sessionId) return NextResponse.json({ message: "missing sessionId in payload" }, { status: 400 });

  const fulfilled = await fulfillCheckoutSession({
    sessionId,
    providerRef: `slip-admin:${referenceCode}`,
    status: "completed",
  });
  if (!fulfilled.ok) return NextResponse.json({ message: fulfilled.message }, { status: fulfilled.status });

  await prisma.webhookEvent.update({
    where: { id: body.eventId },
    data: { status: "processed", eventType: "slip.manual_approved" },
  });
  return NextResponse.json({ ok: true, unlocked: fulfilled.unlocked });
}

