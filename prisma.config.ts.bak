import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Local development defaults to SQLite if DATABASE_URL is not set.
    // Production should set DATABASE_URL and DATABASE_PROVIDER accordingly.
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
