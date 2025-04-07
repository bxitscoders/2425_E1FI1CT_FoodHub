import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "$env/dynamic/private";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

if (!env.POSTGRES_USER) throw new Error("POSTGRES_USER is not set");
if (!env.POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not set");
if (!env.POSTGRES_HOST) throw new Error("POSTGRES_HOST is not set");
if (!env.POSTGRES_DB) throw new Error("POSTGRES_DB is not set");

const client = postgres(
	`postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT ?? 5432}/${env.POSTGRES_DB}`
);
export const db = drizzle(client, { schema });

migrate(db, { migrationsFolder: "drizzle" });
