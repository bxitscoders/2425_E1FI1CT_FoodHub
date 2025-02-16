import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";
import { env } from "$env/dynamic/private";

declare module "@auth/sveltekit" {
	interface User {
		handle: string;
	}
}

declare module "@auth/core/adapters" {
	interface AdapterUser {
		handle: string;
	}
}

declare module "@auth/core/jwt" {
	interface JWT {
		handle: string
	}
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: schema.users,
		accountsTable: schema.accounts,
		sessionsTable: schema.sessions,
		verificationTokensTable: schema.verificationTokens,
		authenticatorsTable: schema.authenticators
	}),
	providers: [
		GitHub({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			profile(profile) {
				return {
					id: profile.id?.toString(),
					name: profile.name,
					handle: profile.login,
					email: profile.email,
					image: profile.avatar_url
				};
			}
		})
	],
	callbacks: {
		session({ session, user }) {
			if (session.user && user) {
				session.user.handle = user.handle; // 'handle' is stored in your DB
			}
			return session;
		}
	}
});
