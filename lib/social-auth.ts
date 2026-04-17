import { getSiteUrl } from "@/lib/site-url";

export type SocialProvider = "google" | "facebook";

function envOrNull(name: string): string | null {
  const raw = process.env[name];
  if (!raw) return null;
  const value = raw.trim();
  return value.length ? value : null;
}

export function getOAuthConfig(provider: SocialProvider) {
  if (provider === "google") {
    return {
      clientId: envOrNull("GOOGLE_CLIENT_ID"),
      clientSecret: envOrNull("GOOGLE_CLIENT_SECRET"),
    };
  }
  return {
    clientId: envOrNull("FACEBOOK_CLIENT_ID"),
    clientSecret: envOrNull("FACEBOOK_CLIENT_SECRET"),
  };
}

export function getCallbackUrl(provider: SocialProvider): string {
  return `${getSiteUrl()}/api/auth/oauth/callback/${provider}`;
}

export function buildOAuthStartUrl(provider: SocialProvider, state: string): string | null {
  const cfg = getOAuthConfig(provider);
  if (!cfg.clientId) return null;
  const redirectUri = getCallbackUrl(provider);
  if (provider === "google") {
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

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "email,public_profile",
    state,
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}
