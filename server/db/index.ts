import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

// import { migrate } from 'drizzle-orm/postgres-js/migrator';
// for migrations
// const migrationClient = postgres("postgres://postgres:adminadmin@0.0.0.0:5432/db", { max: 1 });
// migrate(drizzle(migrationClient), ...)

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient);
