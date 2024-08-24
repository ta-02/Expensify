import { drizzle } from "drizzle-orm/postgres-js";
import { z } from "zod";
import postgres from "postgres";
import "dotenv/config";

//@ts-ignore
const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient);
