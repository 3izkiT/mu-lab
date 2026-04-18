import "dotenv/config";
import { defineConfig } from "@prisma/config"; // เช็กว่ามี @ ด้วยนะครับ

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
