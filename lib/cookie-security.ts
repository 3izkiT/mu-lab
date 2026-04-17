export function shouldUseSecureCookie(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto && forwardedProto.toLowerCase().includes("https")) return true;
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}
