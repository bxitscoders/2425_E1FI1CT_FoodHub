import { drizzle } from 'drizzle-orm/libsql';
import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';

if (!env.PRIVATE_DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: `file:${process.env.PRIVATE_DATABASE_URL!}` });
export const db = drizzle(client);