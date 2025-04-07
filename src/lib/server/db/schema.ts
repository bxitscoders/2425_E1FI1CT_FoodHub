import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export * from "./auth-schema";

export const foods = pgTable("foods", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	message: text("message").notNull(),
	createdAt: timestamp("createdAt").notNull(),
	createdBy: text("createdBy").references(() => users.id, { onDelete: "set null" })
});

export const tags = pgTable("tags", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	color: varchar('color', { length: 7 }).notNull(),
	createdAt: timestamp("createdAt").notNull(),
	createdBy: text("createdBy").references(() => users.id, { onDelete: "set null" }),
});

export const foodTags = pgTable(
	"food_tags",
	{
		foodId: integer("food_id")
			.notNull()
			.references(() => foods.id, { onDelete: "cascade" }),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tags.id, { onDelete: "cascade" })
	},
	(foodTag) => [
		{
			compositePK: primaryKey({
				columns: [foodTag.foodId, foodTag.tagId]
			})
		}
	]
);
