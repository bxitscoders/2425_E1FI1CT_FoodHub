import type { Actions } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/auth-schema";
import { posts } from "$lib/server/db/post-schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "$lib/server/admin";
import { MINIO_BUCKET_NAME, minioClient } from "$lib/server/minio";

export const actions: Actions = {
    deleteAllPosts: async ({ locals, params }) => {
        const currentUser = locals.user as any;
        
        // Admin-Check
        if (!isAdmin(currentUser)) {
            error(403, "Forbidden: Admin access required");
        }

        // Finde User
        const profileUser = await db.select()
            .from(user)
            .where(eq(user.handle, params.userhandle));
        
        if (profileUser.length === 0) {
            error(404, "User not found");
        }

        const userId = profileUser[0].id;

        // Alle Posts des Benutzers finden
        const userPosts = await db
            .select({ id: posts.id })
            .from(posts)
            .where(eq(posts.userId, userId));

        // Posts und Bilder löschen
        for (const post of userPosts) {
            await db.delete(posts).where(eq(posts.id, post.id));
            
            try {
                await minioClient.removeObject(MINIO_BUCKET_NAME, `${post.id}.webp`);
            } catch (e) {
                console.warn(`Failed to delete image for post ${post.id}:`, e);
            }
        }

        return { success: true, deletedCount: userPosts.length };
    }
};
