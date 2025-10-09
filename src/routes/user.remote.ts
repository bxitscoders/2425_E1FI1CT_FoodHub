import { query } from "$app/server";
import { db } from "$lib/server/db";
import * as v from 'valibot';
import { eq } from "drizzle-orm";
import { user } from "$lib/server/db/auth-schema";

export const loadUserById = query(v.object({ userId: v.string() }), async (schema) => {
    const { userId } = schema;
    return (await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .groupBy(user.id))[0];
});