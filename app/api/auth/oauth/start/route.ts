import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { buildOAuthStartUrl, type SocialProvider } from "@/lib/social-auth";
import { shouldUseSecureCookie } from "@/lib/cookie-security";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") as SocialProvider | null;
  const nextPath = searchParams.get("next") || "/vault";
  if (provider !== "google") {
    return NextResponse.json({ message: "provider not supported" }, { status: 400 });
  }

  const state = `${provider}.${nanoid(14)}`;
  const authUrl = buildOAuthStartUrl(provider, state);
  if (!authUrl) {
    return NextResponse.json(
      { message: `${provider} login not configured`, missingEnv: "GOOGLE_CLIENT_ID" },
      { status: 503 },
    );
  }

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("mu_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 60 * 10,
  });
  response.cookies.set("mu_oauth_next", nextPath, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}
