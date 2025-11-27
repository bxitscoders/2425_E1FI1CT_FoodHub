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

<nav class="bg-black text-white sticky top-0 border-white/35 border-b-1 h-15">
	<div class="flex flex-row justify-between gap-10 items-center mx-10 *:py-2 h-full">
		<div class="pr-4 h-full flex items-center">
			<a href="/">
				<Logo />
			</a>
		</div>

		{#if $session.data}
			{@const user = $session.data.user}
			<div class="flex flex-row gap-4 h-full">
				<a href="/upload" class="border border-white/35 hover:border-white/50 hover:bg-white/10 rounded-md p-2 flex items-center justify-center transition-colors">
					<Upload size={18} />
				</a>
				<a href="/@{user.handle}" class="h-full">
					<img class="h-full rounded-full" src={user.image} alt="User" />
				</a>
				<button class="font-medium" onclick={() => signOut()}>Log out</button>
			</div>
		{:else}
			<button class="font-medium" onclick={signIn}>Log in</button>
		{/if}
	</div>
</nav>