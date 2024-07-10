import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
console.log("migration complete!");
