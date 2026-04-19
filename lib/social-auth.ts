import { getSiteUrl, normalizeSiteUrl } from "@/lib/site-url";

export type SocialProvider = "google";

function envOrNull(name: string): string | null {
  const raw = process.env[name];
  if (!raw) return null;
  const value = raw.trim();
  return value.length ? value : null;
}

export function getOAuthConfig(_provider: SocialProvider) {
  return {
    clientId: envOrNull("GOOGLE_CLIENT_ID"),
    clientSecret: envOrNull("GOOGLE_CLIENT_SECRET"),
  };
}

function getRequestSiteUrl(request: Request): string | null {
  const headers = request.headers;
  const host = headers.get("x-forwarded-host") || headers.get("host");
  const proto = headers.get("x-forwarded-proto") || headers.get("x-forwarded-protocol") || headers.get("x-forwarded-server") || headers.get("x-url-scheme") || "https";
  if (!host) return null;
  return normalizeSiteUrl(`${proto}://${host}`);
}

export function getCallbackUrl(provider: SocialProvider, request?: Request): string {
  if (request) {
    const siteUrl = getRequestSiteUrl(request);
    if (siteUrl) {
      return `${siteUrl}/api/auth/oauth/callback/${provider}`;
    }
  }
  return `${getSiteUrl()}/api/auth/oauth/callback/${provider}`;
}

export function buildOAuthStartUrl(provider: SocialProvider, state: string, request?: Request): string | null {
  const cfg = getOAuthConfig(provider);
  if (!cfg.clientId) return null;
  const redirectUri = getCallbackUrl(provider, request);
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "offline",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
