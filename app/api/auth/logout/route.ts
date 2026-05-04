import { NextResponse } from "next/server";
import { shouldUseSecureCookie } from "@/lib/cookie-security";

function buildLogoutResponse(request: Request, prefersForm: boolean) {
  const response = prefersForm
    ? NextResponse.redirect(new URL("/", request.url), { status: 303 })
    : NextResponse.json({ ok: true });
  response.cookies.set("mu_lab_uid", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function POST(request: Request) {
  const accept = request.headers.get("accept") ?? "";
  const contentType = request.headers.get("content-type") ?? "";
  const prefersForm =
    accept.includes("text/html") || contentType.includes("application/x-www-form-urlencoded");
  return buildLogoutResponse(request, prefersForm);
}
