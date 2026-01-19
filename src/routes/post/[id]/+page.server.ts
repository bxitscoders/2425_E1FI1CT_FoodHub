import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { loadPostById } from "../../post.remote";
import { loadCommentsByPostId } from "../../comment.remote";

export const load: PageServerLoad = async ({ params }) => {
	const postId = parseInt(params.id);
	
	if (isNaN(postId)) {
		error(400, "Invalid post ID");
	}

	const posts = await loadPostById({ id: postId });
	
	if (!posts || posts.length === 0) {
		error(404, "Post not found");
	}

	const comments = await loadCommentsByPostId({ postId });

	return {
		post: posts[0],
		comments
	};
};
