type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

function nowMs() {
  return Date.now();
}

function cleanup() {
  const t = nowMs();
  for (const [k, v] of buckets.entries()) {
    if (v.resetAt <= t) buckets.delete(k);
  }
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function rateLimitOrThrow(request: Request, opts: { keyPrefix: string; limit: number; windowMs: number }) {
  cleanup();
  const ip = getClientIp(request);
  const key = `${opts.keyPrefix}:${ip}`;
  const t = nowMs();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= t) {
    buckets.set(key, { count: 1, resetAt: t + opts.windowMs });
    return { remaining: opts.limit - 1, resetAt: t + opts.windowMs };
  }

  if (existing.count >= opts.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - t) / 1000));
    const error = new Error("rate_limited");
    (error as any).retryAfterSeconds = retryAfterSeconds;
    throw error;
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { remaining: opts.limit - existing.count, resetAt: existing.resetAt };
}

