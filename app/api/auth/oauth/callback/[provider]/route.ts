import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, withRetry } from "@/lib/prisma";
import { getCallbackUrl, getOAuthConfig, type SocialProvider } from "@/lib/social-auth";
import { shouldUseSecureCookie } from "@/lib/cookie-security";

async function exchangeGoogleCode(code: string, request: Request) {
  const cfg = getOAuthConfig("google");
  if (!cfg.clientId || !cfg.clientSecret) throw new Error("google_not_configured");
  const token = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: getCallbackUrl("google", request),
      grant_type: "authorization_code",
    }),
  }).then((r) => r.json() as Promise<{ access_token?: string }>);
  if (!token.access_token) throw new Error("google_token_failed");
  const profile = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  }).then((r) => r.json() as Promise<{ sub?: string; email?: string; name?: string }>);
  if (!profile.sub) throw new Error("google_profile_failed");
  return { providerId: profile.sub, email: profile.email ?? null, name: profile.name ?? "Google User" };
}

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const { provider } = await params;
    if (provider !== "google") {
      return NextResponse.redirect("/login?error=provider");
    }
    const p = provider as SocialProvider;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    
    console.log("[OAuth Callback] Starting callback for provider:", p, "with code:", code?.substring(0, 10) + "...");
    
    if (!code || !state) {
      console.warn("[OAuth Callback] Missing code or state");
      return NextResponse.redirect("/login?error=oauth");
    }

    const cookieStore = await cookies();
    const expectedState = cookieStore.get("mu_oauth_state")?.value;
    const nextPath = cookieStore.get("mu_oauth_next")?.value || "/vault";
    
    if (!expectedState || expectedState !== state) {
      console.warn("[OAuth Callback] State mismatch - expected:", expectedState, "got:", state);
      return NextResponse.redirect("/login?error=state");
    }

    let profile: { providerId: string; email: string | null; name: string };
    try {
      console.log("[OAuth Callback] Exchanging code for token...");
      profile = await exchangeGoogleCode(code, request);
      console.log("[OAuth Callback] Got profile:", { sub: profile.providerId, email: profile.email });
    } catch (err) {
      console.error("[OAuth Callback] Exchange error:", err instanceof Error ? err.message : String(err));
      return NextResponse.redirect(`/login?error=${p}_config`);
    }

    const userId = `${p}:${profile.providerId}`;
    try {
      console.log("[OAuth Callback] Creating/updating user:", userId);
      await withRetry(
        () => prisma.user.upsert({
          where: { id: userId },
          update: { name: profile.name, email: profile.email ?? undefined },
          create: { id: userId, name: profile.name, email: profile.email, credits: 80 },
        }),
        3,
        2000
      );
      console.log("[OAuth Callback] User upsert successful");
    } catch (err) {
      console.error("[OAuth Callback] User upsert error after retries:", err instanceof Error ? err.message : String(err));
      console.error("[OAuth Callback] Full error:", err);
      return NextResponse.json(
        { error: "database_error", details: err instanceof Error ? err.message : String(err) },
        { status: 500 }
      );
    }

    console.log("[OAuth Callback] Setting cookies and redirecting to:", nextPath);
    const response = NextResponse.redirect(nextPath);
    response.cookies.set("mu_lab_uid", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: shouldUseSecureCookie(request),
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set("mu_oauth_state", "", { path: "/", maxAge: 0 });
    response.cookies.set("mu_oauth_next", "", { path: "/", maxAge: 0 });
    
    console.log("[OAuth Callback] Successfully logged in user:", userId);
    return response;
  } catch (err) {
    console.error("[OAuth Callback] Unexpected error:", err instanceof Error ? err.message : String(err));
    console.error("[OAuth Callback] Full error:", err);
    return NextResponse.json(
      { error: "unexpected_error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
