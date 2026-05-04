import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 config:
 * - migrate ใช้ direct/session connection (รองรับ DDL/migrations)
 *   - บน Vercel: Supabase integration ตั้ง `POSTGRES_URL_NON_POOLING` ให้
 *   - บน local: ตั้ง `DIRECT_URL` ใน .env.local
 *   - fallback: `DATABASE_URL`
 * - PrismaClient runtime ใช้ adapter ใน lib/prisma.ts ตามปกติ
 */
const migrateUrl =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!migrateUrl) {
  throw new Error(
    "Missing POSTGRES_URL_NON_POOLING/DIRECT_URL/DATABASE_URL — set in .env.local or environment.",
  );
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: migrateUrl,
  },
});
