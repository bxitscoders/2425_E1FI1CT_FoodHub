import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/auth-schema";
import { postRatings } from "$lib/server/db/post-schema";
import { eq, count, avg } from "drizzle-orm";
import { loadPostsByUserId } from "../post.remote";

export const load: LayoutServerLoad = async ({ locals, params }) => {
    if (!locals.user) return redirect(302, "/");

    const profileUser = await db.select()
        .from(user)
        .where(eq(user.handle, params.userhandle));
    if (profileUser.length === 0) return error(404, "User not found");

    // Get ratings given by this user
    const userRatingsResult = await db
        .select({
            count: count(postRatings.id),
            average: avg(postRatings.rating)
        })
        .from(postRatings)
        .where(eq(postRatings.userId, profileUser[0].id));

    const userRatings = {
        count: Number(userRatingsResult[0]?.count ?? 0),
        average: Number(userRatingsResult[0]?.average ?? 0)
    };

    return { 
        profileUser: profileUser[0], 
        posts: await loadPostsByUserId({ userId: profileUser[0].id }),
        userRatings
    };
};
