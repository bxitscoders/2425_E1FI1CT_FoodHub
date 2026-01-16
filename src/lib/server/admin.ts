import type { User } from "$lib/auth-client";

// Liste der GitHub-Usernames, die Admin-Rechte haben
const ADMIN_GITHUB_HANDLES = [
	"janiklohyn", // Füge hier weitere GitHub-Usernames hinzu
	// "another-admin",
];

/**
 * Prüft, ob ein Benutzer Admin-Rechte hat
 */
export function isAdmin(user: User | null | undefined): boolean {
	if (!user?.handle) return false;
	return ADMIN_GITHUB_HANDLES.includes(user.handle);
}

/**
 * Wirft einen 403 Fehler, wenn der Benutzer kein Admin ist
 */
export function requireAdmin(user: User | null | undefined): void {
	if (!isAdmin(user)) {
		throw new Error("Forbidden: Admin access required");
	}
}
