<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { authClient } from "$lib/auth-client";
	import Upload from "@lucide/svelte/icons/upload";
	import Logo from "./Logo.svelte";

	const session = authClient.useSession();

	async function signOut() {
		await authClient.signOut();
		await goto("/", { invalidateAll: true });
	}

	async function signIn() {
		await authClient.signIn.social({
			provider: "github",
			callbackURL: page.url.toString()
		});
	}
</script>

<nav class="sticky top-0 z-50 h-[53px] border-b border-gray-800 bg-black bg-black/65 text-white backdrop-blur-md">
	<div class="mx-auto flex h-full max-w-[600px] flex-row items-center justify-between gap-10 px-4">
		<div class="flex h-full items-center pr-4">
			<a href="/">
				<Logo />
			</a>
		</div>

		{#if $session.data}
			{@const user = $session.data.user}
			<div class="flex flex-row items-center gap-3">
				<a
					href="/upload"
					class="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
				>
					<Upload size={18} />
				</a>
				<a href="/@{user.handle}">
					<img class="h-8 w-8 rounded-full transition-opacity hover:opacity-90" src={user.image} alt="User" />
				</a>
				<button
					class="rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/10"
					onclick={() => signOut()}>Log out</button
				>
			</div>
		{:else}
			<button
				class="rounded-full bg-orange-400 px-4 py-1.5 font-bold text-black transition-colors hover:bg-orange-500"
				onclick={signIn}>Log in</button
			>
		{/if}
	</div>
</nav>
