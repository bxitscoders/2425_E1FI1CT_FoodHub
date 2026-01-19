import { form, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { postMessages } from "$lib/server/db/post-schema";
import { user } from "$lib/server/db/auth-schema";
import { error } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
import * as v from "valibot";

export const loadCommentsByPostId = query(v.object({ postId: v.number() }), async (schema) => {
	const { postId } = schema;
	
	const comments = await db
		.select({
			id: postMessages.id,
			content: postMessages.content,
			createdAt: postMessages.createdAt,
			userId: postMessages.userId,
			userName: user.name,
			userHandle: user.handle,
			userImage: user.image
		})
		.from(postMessages)
		.innerJoin(user, eq(postMessages.userId, user.id))
		.where(eq(postMessages.postId, postId))
		.orderBy(desc(postMessages.createdAt));

	return comments.map((c) => ({
		id: c.id,
		content: c.content,
		createdAt: c.createdAt,
		user: {
			id: c.userId,
			name: c.userName,
			handle: c.userHandle,
			image: c.userImage
		}
	}));
});

export const createComment = form(
	v.object({
		postId: v.number(),
		content: v.pipe(v.string(), v.nonEmpty(), v.maxLength(1000))
	}),
	async ({ postId, content }) => {
		const event = getRequestEvent();
		const currentUser = event.locals.user;
		if (!currentUser) error(401, "Unauthorized");

		await db.insert(postMessages).values({
			postId,
			userId: currentUser.id,
			content
		});

		return { success: true };
	}
);
