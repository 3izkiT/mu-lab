import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth-utils";
import { setUserSessionCookie } from "@/lib/auth-session";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("mu_lab_uid")?.value;
  const user = await getCurrentUser();
  const response = NextResponse.json({ user });
  if (user && userId) {
    // Sliding session: refresh expiration while user is actively using the app.
    setUserSessionCookie(response, request, userId);
  }
  return response;
}
