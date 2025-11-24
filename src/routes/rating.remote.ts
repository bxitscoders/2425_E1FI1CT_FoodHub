import { form, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { postRatings } from "$lib/server/db/post-schema";
import { error } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";

export const createRating = form(
	v.object({
		postId: v.pipe(v.number()),
		rating: v.pipe(v.number(), v.minValue(0.5), v.maxValue(5)),
		content: v.pipe(v.string(), v.maxLength(2056))
	}),
	async (schema) => {
		const event = getRequestEvent();
		const user = event.locals.user;
		if (!user) error(401, "Unauthorized");

		const { postId, rating, content } = schema;

		const [existingRating] = await db
            .select({ id: postRatings.id })
            .from(postRatings)
            .where(and(eq(postRatings.postId, postId), eq(postRatings.userId, user.id)));
        if (existingRating) return;
        
        await db
            .insert(postRatings)
            .values({
                postId,
                userId: user.id,
                rating,
                content
            });
	}
);
