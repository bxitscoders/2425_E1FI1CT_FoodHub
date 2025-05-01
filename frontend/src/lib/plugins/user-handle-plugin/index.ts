import type { BetterAuthPlugin } from "better-auth";

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
