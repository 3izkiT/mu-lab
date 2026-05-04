import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCallbackUrl, getOAuthConfig, type SocialProvider } from "@/lib/social-auth";
import { shouldUseSecureCookie } from "@/lib/cookie-security";

function safeNextUrl(rawPath: string | null | undefined, requestUrl: string): URL {
  const fallback = new URL("/vault", requestUrl);
  if (!rawPath) return fallback;

  // Allow only same-origin absolute path to avoid open-redirect.
  if (!rawPath.startsWith("/")) return fallback;
  if (rawPath.startsWith("//")) return fallback;
  return new URL(rawPath, requestUrl);
}

async function exchangeGoogleCode(code: string) {
  const cfg = getOAuthConfig("google");
  if (!cfg.clientId || !cfg.clientSecret) throw new Error("google_not_configured");
  const token = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: getCallbackUrl("google"),
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
  const { provider } = await params;
  if (provider !== "google") {
    return NextResponse.redirect(new URL("/login?error=provider", request.url));
  }
  const p = provider as SocialProvider;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code || !state) return NextResponse.redirect(new URL("/login?error=oauth", request.url));

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("mu_oauth_state")?.value;
  const nextPath = cookieStore.get("mu_oauth_next")?.value;
  const nextUrl = safeNextUrl(nextPath, request.url);
  if (!expectedState || expectedState !== state) return NextResponse.redirect(new URL("/login?error=state", request.url));

  let profile: { providerId: string; email: string | null; name: string };
  try {
    profile = await exchangeGoogleCode(code);
  } catch {
    return NextResponse.redirect(new URL(`/login?error=${p}_config`, request.url));
  }

  const userId = `${p}:${profile.providerId}`;
  await prisma.user.upsert({
    where: { id: userId },
    update: { name: profile.name, email: profile.email ?? undefined },
    create: { id: userId, name: profile.name, email: profile.email, credits: 80 },
  });

  const response = NextResponse.redirect(nextUrl);
  response.cookies.set("mu_lab_uid", userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set("mu_oauth_state", "", { path: "/", maxAge: 0 });
  response.cookies.set("mu_oauth_next", "", { path: "/", maxAge: 0 });
  return response;
}
