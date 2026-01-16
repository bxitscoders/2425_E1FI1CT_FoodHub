import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/auth-schema";
import { eq } from "drizzle-orm";
import { loadPostsByUserId } from "../post.remote";

export const load: LayoutServerLoad = async ({ locals, params }) => {
    if (!locals.user) return redirect(302, "/");

    const profileUser = await db.select()
        .from(user)
        .where(eq(user.handle, params.userhandle));
    if (profileUser.length === 0) return error(404, "User not found");

    return { 
        profileUser: profileUser[0], 
        posts: await loadPostsByUserId({ userId: profileUser[0].id }) 
    };
};
