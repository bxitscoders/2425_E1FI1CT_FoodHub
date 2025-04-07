import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "$env/dynamic/private";

import * as schema from "./db/auth-schema";
import { userHandlePlugin } from "../plugins/user-handle-plugin";
import type { GithubProfile } from "better-auth/social-providers";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts,
			verification: schema.verifications
		}
	}),
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID!,
			clientSecret: env.GITHUB_CLIENT_SECRET!,
			mapProfileToUser: (profile: GithubProfile) => ({ handle: profile.login })
		}
	},
	plugins: [userHandlePlugin()]
});
