import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "$env/dynamic/private";

if (!env.PRIVATE_POSTGRES_USER) throw new Error("POSTGRES_USER is not set");
if (!env.PRIVATE_POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not set");
if (!env.PRIVATE_POSTGRES_HOST) throw new Error("POSTGRES_HOST is not set");
if (!env.PRIVATE_POSTGRES_DB) throw new Error("POSTGRES_DB is not set");

const client = postgres(
	`postgres://${env.PRIVATE_POSTGRES_USER}:${env.PRIVATE_POSTGRES_PASSWORD}@${env.PRIVATE_POSTGRES_HOST}:${env.PRIVATE_POSTGRES_PORT ?? 5432}/${env.PRIVATE_POSTGRES_DB}`
);
export const db = drizzle(client);
