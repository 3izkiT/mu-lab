import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * SQLite บน Vercel:
 * - ไฟล์ใน bundle อ่านอย่างเดียว และ `prisma/dev.db` ถูก .vercelignore ไม่ขึ้น production
 * - เขียนได้จริงที่ `/tmp` — จึงคัดลอก `prisma/baseline.sqlite` (schema ครบ) ไป `/tmp/mu-lab-runtime.db`
 *
 * Local: ใช้ `prisma/dev.db` ตามเดิม
 */
function resolveSqliteFilePath(): string {
  const onVercel = process.env.VERCEL === "1";
  const fromEnv = process.env.DATABASE_URL?.trim();

  if (fromEnv?.startsWith("file:")) {
    const p = fromEnv.replace(/^file:/, "").replace(/^\.\//, "");
    return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  }

  if (onVercel) {
    const baseline = path.join(process.cwd(), "prisma", "baseline.sqlite");
    const runtime = "/tmp/mu-lab-runtime.db";
    if (!fs.existsSync(baseline)) {
      console.error("[prisma] Missing prisma/baseline.sqlite in deployment bundle");
      return runtime;
    }
    try {
      const needCopy =
        !fs.existsSync(runtime) || fs.statSync(baseline).mtimeMs > fs.statSync(runtime).mtimeMs;
      if (needCopy) {
        fs.copyFileSync(baseline, runtime);
      }
    } catch (e) {
      console.error("[prisma] Failed to copy baseline SQLite to /tmp", e);
    }
    return runtime;
  }

  return path.join(process.cwd(), "prisma", "dev.db");
}

const sqlitePath = resolveSqliteFilePath();
try {
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
} catch {
  // ignore
}

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
