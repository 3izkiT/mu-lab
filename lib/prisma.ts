import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const sqlitePath = dbUrl.replace(/^file:/, "");
const adapter = dbUrl.startsWith("file:")
  ? new PrismaBetterSqlite3({ url: sqlitePath })
  : new PrismaPg({ connectionString: dbUrl });

type PrismaClientOptionsWithAdapter = {
  adapter?: typeof adapter;
  log?: string[];
};

const prismaClientOptions: PrismaClientOptionsWithAdapter = {
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
};

if (adapter) {
  prismaClientOptions.adapter = adapter;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaClientOptions as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Retry helper for database operations on Vercel
 * Database may not be ready immediately after deployment
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      const isLastAttempt = attempt === maxAttempts;
      const message = lastError.message || String(err);

      console.warn(
        `[withRetry] Attempt ${attempt}/${maxAttempts} failed:`,
        message.substring(0, 80)
      );

      if (isLastAttempt) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError || new Error("Unknown error");
}
