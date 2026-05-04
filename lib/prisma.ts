import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Prisma client (PostgreSQL via Supabase pooler).
 *
 * - `DATABASE_URL` ใช้ Transaction pooler (port 6543) — เหมาะกับ Vercel serverless
 * - `DIRECT_URL` ใช้ Session pooler (port 5432) — สำหรับ `prisma migrate deploy` ตอน build
 *
 * Prisma 7 ต้องใช้ adapter ส่ง connection string เข้าไปเอง (ไม่อ่าน datasource.url
 * ใน schema อีก) — ฉะนั้นเราอ่าน env แล้วยัดเข้า PrismaPg
 */
function buildPrisma(): PrismaClient {
  // Vercel + Supabase integration ตั้ง POSTGRES_PRISMA_URL (transaction pooler + pgbouncer flags)
  // Local dev ตั้ง DATABASE_URL ใน .env.local
  const url = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL/POSTGRES_PRISMA_URL is not set. ตั้งค่าใน .env.local (dev) หรือ Vercel env (production).",
    );
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? buildPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Retry helper — มีไว้สำหรับ transient connection errors (เช่นช่วง pooler restart)
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      const isLastAttempt = attempt === maxAttempts;
      const message = lastError.message || String(err);

      console.warn(`[withRetry] Attempt ${attempt}/${maxAttempts} failed:`, message.substring(0, 80));

      if (isLastAttempt) {
        throw lastError;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError || new Error("Unknown error");
}
