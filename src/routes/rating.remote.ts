import { form, getRequestEvent, query } from "$app/server";
import type { RatingDTO } from "$lib/dto/rating";
import { db } from "$lib/server/db";
import { postRatings, postMessages } from "$lib/server/db/post-schema";
import { error } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";

export const upsertRating = query(
	v.object({
		postId: v.pipe(v.number()),
		ratingValue: v.pipe(v.number(), v.minValue(0.5), v.maxValue(5))
	}),
	async (schema) => {
		const event = getRequestEvent();
		const user = event.locals.user;
		if (!user) error(401, "Unauthorized");

		const { postId, ratingValue } = schema;

		const [existingRating] = await db
			.select({ id: postRatings.id })
			.from(postRatings)
			.where(and(eq(postRatings.postId, postId), eq(postRatings.userId, user.id)));

		if (existingRating) {
			// Update existing rating
			await db
				.update(postRatings)
				.set({ rating: ratingValue })
				.where(and(eq(postRatings.id, existingRating.id), eq(postRatings.userId, user.id)));
		} else {
			// Create new rating
			await db.insert(postRatings).values({
				postId,
				userId: user.id,
				rating: ratingValue
			});
		}
	}
);

export const getRatings = query(
	v.object({
		postId: v.number()
	}),
	async (schema) => {
		const { postId } = schema;
		return (
			await db
				.select({
					userId: postRatings.userId,
					rating: postRatings.rating,
					createdAt: postRatings.createdAt
				})
				.from(postRatings)
				.where(eq(postRatings.postId, postId))
		).map(
			(rating) =>
				({
					userId: rating.userId,
					value: rating.rating,
					createdAt: rating.createdAt
				}) as RatingDTO
		);
	}
);

export const createMessage = form(
	v.object({
		postId: v.pipe(v.number()),
		content: v.pipe(v.string(), v.maxLength(2056))
	}),
	async (schema) => {
		const event = getRequestEvent();
		const user = event.locals.user;
		if (!user) error(401, "Unauthorized");

		const { postId, content } = schema;

		await db.insert(postMessages).values({
			postId,
			userId: user.id,
			content
		});
	}
);

export const getMessages = query(
	v.object({
		postId: v.number()
	}),
	async (schema) => {
		const { postId } = schema;
		return await db
			.select({
				id: postMessages.id,
				userId: postMessages.userId,
				content: postMessages.content,
				createdAt: postMessages.createdAt
			})
			.from(postMessages)
			.where(eq(postMessages.postId, postId))
			.orderBy(postMessages.createdAt);
	}
);
