import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Schema ใช้ SQLite — ต้องใช้ Better-SQLite3 adapter เสมอ
 * (ห้ามใช้ adapter-pg ขณะที่ `schema.prisma` ยังเป็น provider sqlite จะทำให้ build พัง)
 * ถ้าต้องการ Neon/Postgres จริง ให้เปลี่ยน provider เป็น postgresql + migration แยก
 */
const dbUrl = process.env.DATABASE_URL?.trim() || "file:./prisma/dev.db";
const effectiveFileUrl = dbUrl.startsWith("file:") ? dbUrl : "file:./prisma/dev.db";
const sqlitePath = effectiveFileUrl.replace(/^file:/, "");

const adapter = new PrismaBetterSqlite3({ url: sqlitePath });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Retry helper for database operations on Vercel
 * Database may not be ready immediately after deployment
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
