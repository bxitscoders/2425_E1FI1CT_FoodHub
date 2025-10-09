import type { User } from "better-auth";
import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/auth-schema";
import { eq } from "drizzle-orm";
import { loadPostsByUserId } from "../post.remote";

export const load: LayoutServerLoad = async ({ locals, params }): Promise<{ user: User, posts: PostDTO[] }> => {
    if (!locals.user) return redirect(302, "/");

    const userExists = await db.select()
        .from(user)
        .where(eq(user.handle, params.userhandle));
    if (userExists.length === 0) return error(404, "User not found");

    return { user: locals.user, posts: await loadPostsByUserId({ userId: userExists[0].id }) }
};
