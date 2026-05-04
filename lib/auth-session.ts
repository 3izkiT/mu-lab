import { shouldUseSecureCookie } from "@/lib/cookie-security";

export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

type CookieSetter = {
  cookies: {
    set: (name: string, value: string, options: Record<string, unknown>) => void;
  };
};

export function setUserSessionCookie(response: CookieSetter, request: Request, userId: string) {
  response.cookies.set("mu_lab_uid", userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
}

