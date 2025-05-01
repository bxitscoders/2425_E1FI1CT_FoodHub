import { createAuthClient } from "better-auth/svelte";
import { userHandleClientPlugin } from "./plugins/user-handle-plugin/client";
export const authClient = createAuthClient({
    plugins: [userHandleClientPlugin()]
});
