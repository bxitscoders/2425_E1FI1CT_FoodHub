import { env } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/bun-sql/migrator";

if (!env.POSTGRES_USER) throw new Error("POSTGRES_USER is not set");
if (!env.POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not set");
if (!env.POSTGRES_HOST) throw new Error("POSTGRES_HOST is not set");
if (!env.POSTGRES_DB) throw new Error("POSTGRES_DB is not set");

const databaseUrl = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT ?? 5432}/${env.POSTGRES_DB}`;
export const db = drizzle(databaseUrl, { schema });

console.log("Running migrations...");
migrate(db, { migrationsFolder: "drizzle" });
console.log("Done running migrations");
