import type { BetterAuthClientPlugin } from "better-auth";
import type { userHandlePlugin } from "./index"; // make sure to import the server plugin as a type

type UserHandlePlugin = typeof userHandlePlugin;

export const userHandleClientPlugin = () => {
	return {
		id: "userHandlePlugin",
		$InferServerPlugin: {} as ReturnType<UserHandlePlugin>
	} satisfies BetterAuthClientPlugin;
};
