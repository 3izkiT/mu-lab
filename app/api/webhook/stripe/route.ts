import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { processStripeWebhookEvent, type StripeEventLike } from "@/lib/stripe-webhook";

function timingSafeHexCompare(a: string, b: string): boolean {
  try {
    const aa = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (aa.length !== bb.length) return false;
    return crypto.timingSafeEqual(aa, bb);
  } catch {
    return false;
  }
}

function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(",").map((x) => x.trim());
  const t = parts.find((p) => p.startsWith("t="))?.slice(2);
  const v1s = parts.filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || v1s.length === 0) return false;

  const payload = `${t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return v1s.some((sig) => timingSafeHexCompare(expected, sig));
}

export async function POST(request: Request) {
  const raw = await request.text();
  let body: StripeEventLike = {};
  try {
    body = JSON.parse(raw) as StripeEventLike;
  } catch {
    body = {};
  }

  const signatureHeader = request.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    if (!webhookSecret) {
      return NextResponse.json({ message: "missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    }
    if (!signatureHeader || !verifyStripeSignature(raw, signatureHeader, webhookSecret)) {
      return NextResponse.json({ message: "invalid stripe signature" }, { status: 401 });
    }
  }

  const result = await processStripeWebhookEvent({ raw, body });
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }
  return NextResponse.json({ ok: true, duplicate: result.duplicate, unlocked: result.unlocked });
}
