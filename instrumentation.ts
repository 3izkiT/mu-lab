/**
 * Next.js 16 instrumentation hook — เริ่ม Sentry ใน server / edge runtimes
 * Sentry จะ no-op ถ้า SENTRY_DSN ไม่ถูกตั้ง (graceful)
 */
export async function register() {
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export async function onRequestError(
  err: unknown,
  request: unknown,
  context: unknown,
) {
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  const { captureRequestError } = await import("@sentry/nextjs");
  return captureRequestError(err, request as never, context as never);
}
