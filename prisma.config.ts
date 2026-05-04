import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 config:
 * - migrate ใช้ DIRECT_URL (Session pooler, รองรับ DDL/migrations) — fallback DATABASE_URL
 * - PrismaClient runtime ใช้ adapter ใน lib/prisma.ts ตามปกติ
 */
const migrateUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!migrateUrl) {
  throw new Error("Missing DATABASE_URL/DIRECT_URL — set in .env.local or environment.");
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
