import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from  "$lib/server/db/auth-schema";

import { env } from "$env/dynamic/private";
import { userHandlePlugin } from "$lib/auth/plugins/user-handle";
import type { GithubProfile } from "better-auth/social-providers";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification
		}
	}),
	socialProviders: {
		github: {
			clientId: env.PRIVATE_GITHUB_CLIENT_ID as string,
			clientSecret: env.PRIVATE_GITHUB_CLIENT_SECRET as string,
			mapProfileToUser: (profile: GithubProfile) => ({ handle: profile.login })
		}
	},
	plugins: [userHandlePlugin()]
});
