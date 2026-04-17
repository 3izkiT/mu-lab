import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function readSecret(name: string): string | null {
  const raw = process.env[name];
  if (raw == null) return null;
  const normalized = raw.replace(/^\uFEFF/, "").trim();
  return normalized.length > 0 ? normalized : null;
}

function isAuthorized(request: NextRequest): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const secret = readSecret("CRON_SECRET");
  const auth = request.headers.get("authorization");
  return Boolean(secret && auth === `Bearer ${secret}`);
}

function has(name: string): boolean {
  return Boolean(readSecret(name));
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  const required = [
    "NEXT_PUBLIC_SITE_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "STRIPE_WEBHOOK_SECRET",
  ] as const;

  const missing = required.filter((key) => !has(key));

  const demoUiEnabled = process.env.NEXT_PUBLIC_ALLOW_DEMO_LOGIN === "1";
  const demoApiEnabled = process.env.ALLOW_DEMO_LOGIN === "1";

  return NextResponse.json({
    ok: missing.length === 0 && (!isProd || (!demoUiEnabled && !demoApiEnabled)),
    env: {
      isProd,
      missing,
    },
    demoLogin: {
      uiEnabled: demoUiEnabled,
      apiEnabled: demoApiEnabled,
      recommendation: isProd ? "set NEXT_PUBLIC_ALLOW_DEMO_LOGIN=0 and ALLOW_DEMO_LOGIN=0" : "optional",
    },
    oauth: {
      callbackGoogle: "/api/auth/oauth/callback/google",
      callbackFacebook: "/api/auth/oauth/callback/facebook",
      note: "Callback URLs must match NEXT_PUBLIC_SITE_URL domain exactly in provider consoles.",
    },
    stripe: {
      webhookEndpoint: "/api/webhook/stripe",
      note: "In production, requests must include a valid Stripe signature (STRIPE_WEBHOOK_SECRET).",
    },
  });
}

