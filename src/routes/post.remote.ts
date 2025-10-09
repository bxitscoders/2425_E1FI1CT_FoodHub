import { query } from "$app/server";
import { db } from "$lib/server/db";
import { posts, postRatings } from "$lib/server/db/post-schema";
import { eq, sql } from "drizzle-orm";
import * as v from 'valibot';

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

    return userPosts.map(r => ({
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

    return userPosts.map(r => ({
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

    return userPosts.map(r => ({
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

    return userPosts.map(r => ({
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

/* TODO:
export async function createPost(
    event: RequestEvent,
    data: { title: string; content: string }
) {
    const user = event.locals.user;
    if (!user) throw error(401, "Unauthorized");

    const [newPost] = await db
        .insert(posts)
        .values({
            userId: user.id,
            title: data.title,
            content: data.content
        })
        .returning();

    return newPost;
}
*/