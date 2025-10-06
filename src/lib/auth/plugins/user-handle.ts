import type { BetterAuthClientPlugin, BetterAuthPlugin } from "better-auth";

export const userHandlePlugin = () => {
	return {
		id: "userHandlePlugin",
		schema: {
			user: {
				fields: {
					handle: {
						type: "string",
						required: true,
						fieldName: "handle",
						unique: true
					}
				}
			}
		}
	} satisfies BetterAuthPlugin;
};

type UserHandlePlugin = typeof userHandlePlugin;

export const userHandleClientPlugin = () => {
	return {
		id: "userHandlePlugin",
		$InferServerPlugin: {} as ReturnType<UserHandlePlugin>
	} satisfies BetterAuthClientPlugin;
};