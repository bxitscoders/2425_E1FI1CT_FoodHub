import { createAuthClient } from "better-auth/svelte";
import { userHandleClientPlugin } from "./auth/plugins/user-handle";
export const authClient = createAuthClient({
	plugins: [userHandleClientPlugin()]
});
