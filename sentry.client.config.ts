/**
 * Sentry client-side config — โหลดเฉพาะเมื่อมี DSN
 * Public DSN ใช้ NEXT_PUBLIC_SENTRY_DSN เพื่อให้ bundle bundle เข้า client ได้
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    enabled: process.env.NODE_ENV === "production",
  });
}
