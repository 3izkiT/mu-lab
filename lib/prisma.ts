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
