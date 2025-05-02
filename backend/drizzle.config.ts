import { env } from "bun";
import { defineConfig } from "drizzle-kit";

if (!env.POSTGRES_USER) throw new Error("POSTGRES_USER is not set");
if (!env.POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not set");
if (!env.POSTGRES_HOST) throw new Error("POSTGRES_HOST is not set");
if (!env.POSTGRES_DB) throw new Error("POSTGRES_DB is not set");

export default defineConfig({
	schema: "./src/db/schema.ts",

	dbCredentials: {
		url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB}`
	},

	verbose: true,
	strict: true,
	dialect: "postgresql"
});
