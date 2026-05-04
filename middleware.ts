import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/vault", "/tracking"];

export function middleware(request: NextRequest) {
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const userId = request.cookies.get("mu_lab_uid")?.value;
  if (userId) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/vault/:path*", "/tracking/:path*"],
};
