import { loadPostById, loadImageByPostId } from "../../post.remote";
import { loadRatingsByPostId } from "../../rating.remote";
import { loadUserById } from "../../user.remote";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { isAdmin } from "$lib/server/admin";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/post-schema";
import { eq } from "drizzle-orm";
import { MINIO_BUCKET_NAME, minioClient } from "$lib/server/minio";

export const load: PageServerLoad = async ({ params }) => {
	const postId = Number(params.id);

	if (isNaN(postId)) {
		error(400, "Invalid post ID");
	}

	try {
		const postsList = await loadPostById({ id: postId });

		if (!postsList || postsList.length === 0) {
			error(404, "Post not found");
		}

		const post = postsList[0];

		// Lade Bild
		const imageUrl = await loadImageByPostId({ postId });

		// Lade Creator
		let creator = null;
		if (post.creatorUserId) {
			try {
				creator = await loadUserById({ userId: post.creatorUserId });
			} catch (e) {
				console.error("Failed to load creator:", e);
			}
		}

		// Lade Ratings
		let ratings: any[] = [];
		try {
			ratings = await loadRatingsByPostId({ postId });
		} catch (e) {
			console.error("Failed to load ratings:", e);
		}

		return {
			post,
			imageUrl,
			creator,
			ratings
		};
	} catch (e) {
		console.error("Error loading post:", e);
		error(500, "Failed to load post");
	}
};

export const actions: Actions = {
	deletePost: async ({ params, locals }) => {
		const user = locals.user as any;
		
		// Admin-Check
		if (!isAdmin(user)) {
			error(403, "Forbidden: Admin access required");
		}

		const postId = Number(params.id);

		// Post aus DB löschen (Cascade löscht auch Ratings und Messages)
		await db.delete(posts).where(eq(posts.id, postId));

		// Bild aus MinIO löschen
		try {
			await minioClient.removeObject(MINIO_BUCKET_NAME, `${postId}.webp`);
		} catch (e) {
			console.warn(`Failed to delete image for post ${postId}:`, e);
		}

		throw redirect(303, '/');
	}
};