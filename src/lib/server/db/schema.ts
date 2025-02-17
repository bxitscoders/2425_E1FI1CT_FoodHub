import { boolean, integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	handle: text("handle"),
	email: text("email").unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image")
});

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state")
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId]
			})
		}
	]
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull()
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull()
	},
	(verificationToken) => [
		{
			compositePk: primaryKey({
				columns: [verificationToken.identifier, verificationToken.token]
			})
		}
	]
);

export const authenticators = pgTable(
	"authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports")
	},
	(authenticator) => [
		{
			compositePK: primaryKey({
				columns: [authenticator.userId, authenticator.credentialID]
			})
		}
	]
);

export const foods = pgTable("foods", {
	id: serial("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	message: text("message").notNull(),
	createdAt: timestamp("createdAt").notNull(),
	createdBy: serial("createdBy").references(() => users.id, { onDelete: "set null" })
});

export const tags = pgTable("tags", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	color: varchar('color', { length: 7 }).notNull(),
	createdAt: timestamp("createdAt").notNull(),
	createdBy: serial("createdBy").references(() => users.id, { onDelete: "set null" }),
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
