import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Local: SQLite, Production (Vercel): PostgreSQL from DATABASE_URL
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
});
