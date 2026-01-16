import { loadPostById, loadImageByPostId } from "../../post.remote";
import { loadRatingsByPostId } from "../../rating.remote";
import { loadUserById } from "../../user.remote";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const postId = Number(params.id);

	if (isNaN(postId)) {
		error(400, "Invalid post ID");
	}

	try {
		const posts = await loadPostById({ id: postId });

		if (!posts || posts.length === 0) {
			error(404, "Post not found");
		}

		const post = posts[0];

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
		let ratings = [];
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
