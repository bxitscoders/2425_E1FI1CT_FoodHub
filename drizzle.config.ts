import { defineConfig } from 'drizzle-kit';

if (!process.env.POSTGRES_USER) throw new Error("POSTGRES_USER is not set");
if (!process.env.POSTGRES_PASSWORD) throw new Error("POSTGRES_PASSWORD is not set");
if (!process.env.POSTGRES_HOST) throw new Error("POSTGRES_HOST is not set");
if (!process.env.POSTGRES_DB) throw new Error("POSTGRES_DB is not set");

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: `postgres://${process.env.PRIVATE_POSTGRES_USER}:${process.env.PRIVATE_POSTGRES_PASSWORD}@${process.env.PRIVATE_POSTGRES_HOST}:${process.env.PRIVATE_POSTGRES_PORT ?? 5432}/${process.env.PRIVATE_POSTGRES_DB}`
	},
	verbose: true,
	strict: true
});
