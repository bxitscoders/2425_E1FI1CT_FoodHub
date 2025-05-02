import { betterAuth } from "better-auth";
import type { GithubProfile } from "better-auth/social-providers";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "bun";
import * as schema from "@/db/auth-schema";
import { userHandlePlugin } from "./plugins/user-handle";

if (!env.GITHUB_CLIENT_ID) throw new Error("GITHUB_CLIENT_ID is not set");
if (!env.GITHUB_CLIENT_SECRET) throw new Error("GITHUB_CLIENT_SECRET is not set");

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
	plugins: [userHandlePlugin()],
	trustedOrigins: ["http://localhost:5173"]
});
