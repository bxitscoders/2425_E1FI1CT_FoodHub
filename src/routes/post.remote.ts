import { form, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { posts, postRatings } from "$lib/server/db/post-schema";
import { MINIO_BUCKET_NAME, minioClient } from "$lib/server/minio";
import { error } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
import sharp from "sharp";
import * as v from "valibot";

export const loadPosts = query(async () => {
	const userPosts = await db
		.select({
			post: posts,
			ratingAmount: sql`COUNT(${postRatings.id})`,
			ratingAverage: sql`AVG(${postRatings.rating})`
		})
		.from(posts)
		.leftJoin(postRatings, eq(postRatings.postId, posts.id))
		.groupBy(posts.id)
		.orderBy(posts.createdAt)
		.limit(10);

	return userPosts.map((r) => ({
		id: r.post.id,
		creatorUserId: r.post.userId,
		title: r.post.title,
		content: r.post.content,
		createdAt: r.post.createdAt.getTime(),
		rating: {
			amount: Number(r.ratingAmount ?? 0),
			average: r.ratingAverage ? Number(r.ratingAverage) : 0
		}
	})) as PostDTO[];
});

export const loadPostsByOffset = query(v.object({ offset: v.number() }), async (schema) => {
	const { offset } = schema;
	const userPosts = await db
		.select({
			post: posts,
			ratingAmount: sql`COUNT(${postRatings.id})`,
			ratingAverage: sql`AVG(${postRatings.rating})`
		})
		.from(posts)
		.leftJoin(postRatings, eq(postRatings.postId, posts.id))
		.groupBy(posts.id)
		.orderBy(posts.createdAt)
		.limit(15)
		.offset(offset);

	return userPosts.map((r) => ({
		id: r.post.id,
		creatorUserId: r.post.userId,
		title: r.post.title,
		content: r.post.content,
		createdAt: r.post.createdAt.getTime(),
		rating: {
			amount: Number(r.ratingAmount ?? 0),
			average: r.ratingAverage ? Number(r.ratingAverage) : 0
		}
	})) as PostDTO[];
});

export const loadPostById = query(v.object({ id: v.number() }), async (schema) => {
	const { id } = schema;
	const userPosts = await db
		.select({
			post: posts,
			ratingAmount: sql`COUNT(${postRatings.id})`,
			ratingAverage: sql`AVG(${postRatings.rating})`
		})
		.from(posts)
		.leftJoin(postRatings, eq(postRatings.postId, posts.id))
		.where(eq(posts.id, id))
		.groupBy(posts.id);

	return userPosts.map((r) => ({
		id: r.post.id,
		creatorUserId: r.post.userId,
		title: r.post.title,
		content: r.post.content,
		createdAt: r.post.createdAt.getTime(),
		rating: {
			amount: Number(r.ratingAmount ?? 0),
			average: r.ratingAverage ? Number(r.ratingAverage) : 0
		}
	})) as PostDTO[];
});

export const loadPostsByUserId = query(v.object({ userId: v.string() }), async (schema) => {
	const { userId } = schema;
	const userPosts = await db
		.select({
			post: posts,
			ratingAmount: sql`COUNT(${postRatings.id})`,
			ratingAverage: sql`AVG(${postRatings.rating})`
		})
		.from(posts)
		.leftJoin(postRatings, eq(postRatings.postId, posts.id))
		.where(eq(posts.userId, userId))
		.groupBy(posts.id)
		.orderBy(posts.createdAt);

	return userPosts.map((r) => ({
		id: r.post.id,
		creatorUserId: r.post.userId,
		title: r.post.title,
		content: r.post.content,
		createdAt: r.post.createdAt.getTime(),
		rating: {
			amount: Number(r.ratingAmount ?? 0),
			average: r.ratingAverage ? Number(r.ratingAverage) : 0
		}
	})) as PostDTO[];
});

export const createPost = form(
	v.object({
		title: v.pipe(v.string(), v.maxLength(256), v.nonEmpty()),
		content: v.pipe(v.string(), v.maxLength(2056), v.nonEmpty()),
		image: v.pipe(v.file(), v.mimeType(["image/png", "image/jpg", "image/jpeg", "image/gif"]))
	}),
	async ({ title, content, image }) => {
		const event = getRequestEvent();
		const user = event.locals.user;
		if (!user) error(401, "Unauthorized");

		const imageBuffer = await sharp(await image.arrayBuffer(), {
			animated: true,
			limitInputPixels: false
		})
			.webp({})
			.rotate()
			.toBuffer();

		const [newPost] = await db
			.insert(posts)
			.values({
				userId: user.id,
				title,
				content
			})
			.returning();

		await minioClient.putObject(MINIO_BUCKET_NAME, `${newPost.id}.webp`, imageBuffer, imageBuffer.length, {
			"Content-Type": "image/webp"
		});

		return newPost;
	}
);

export const loadImageByPostId = query(v.object({ postId: v.number() }), async (schema) => {
	const { postId } = schema;

	const post = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId));
	if (!post || post.length === 0) return null;

	const presignedUrl = await minioClient.presignedGetObject(MINIO_BUCKET_NAME, post[0].id.toString() + ".webp", 3600);
	return presignedUrl;
});
