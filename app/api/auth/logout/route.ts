import { NextResponse } from "next/server";
import { shouldUseSecureCookie } from "@/lib/cookie-security";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("mu_lab_uid", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 0,
  });
  return response;
}
