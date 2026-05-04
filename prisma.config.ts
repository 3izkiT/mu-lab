import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Allow build-time prisma generate on platforms without DATABASE_URL set.
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
