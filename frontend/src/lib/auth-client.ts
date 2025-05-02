import { createAuthClient } from "better-auth/svelte";
import { userHandleClientPlugin } from "./plugins/user-handle";
import { env } from "$env/dynamic/public";

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_BACKEND_BASE_URL,
	plugins: [userHandleClientPlugin()]
});

export type Session = typeof authClient.$Infer.Session.session;
export type User = typeof authClient.$Infer.Session.user;
