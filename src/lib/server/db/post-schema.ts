import { integer, pgTable, serial, text, timestamp, doublePrecision, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth-schema";

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	userId: text("user_id", {})
		.notNull()
		.references(() => user.id),
	title: text("title").notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const postRatings = pgTable("post_ratings", {
	id: serial("id").primaryKey(),
	postId: integer("post_id")
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	rating: doublePrecision("rating").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`),
	content: text("content").notNull()
}, (table) => [
	unique().on(table.postId, table.userId)
]);
