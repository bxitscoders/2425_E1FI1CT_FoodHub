import { query } from "$app/server";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/post-schema";
import { eq } from "drizzle-orm";
import * as v from 'valibot';

export const loadPosts = query(async () => {
    const existingPosts = await db
        .select()
        .from(posts)
        .orderBy(posts.createdAt)
        .limit(10);
    return existingPosts;
});

const PostQueryWithSkipSchema = v.object({
    index: v.number(),
    skip: v.number()
});

export const loadPostsByIndex = query(PostQueryWithSkipSchema, async (schema) => {
    const { index, skip } = schema;
    const existingPosts = await db
        .select()
        .from(posts)
        .orderBy(posts.createdAt)
        .limit(index)
        .offset(skip);
    return existingPosts;
});

export const loadPostById = query(v.object({ id: v.number() }), async (schema) => {
    const { id } = schema;
    const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1);
    return post;
});

export const loadPostsByUserId = query(v.object({ userId: v.string() }), async (schema) => {
    const { userId } = schema;
    const userPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))
        .orderBy(posts.createdAt);
    return userPosts;
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