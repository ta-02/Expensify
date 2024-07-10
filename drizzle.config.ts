import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./server/db/schema.ts",
  dialect: "postgresql", // "postgresql" | "mysql"
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  migration: {
    table: "migrations",
    schema: "public",
  },
});
