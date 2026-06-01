import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Use DIRECT_URL for migrations (advisory locks are not supported on connection poolers)
    // and fallback to DATABASE_URL if direct is not provided.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
