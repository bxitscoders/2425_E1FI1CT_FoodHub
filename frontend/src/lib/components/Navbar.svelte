<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { authClient } from "$lib/auth-client";
	import Logo from "./Logo.svelte";

	const session = authClient.useSession();

	async function signOut() {
		await authClient.signOut();
		await goto("/", { invalidateAll: true });
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
				<a href="/@{user.handle}" class="h-full">
					<img class="h-full rounded-full" src={user.image} alt="User" />
				</a>
				<button onclick={() => signOut()}>Log out</button>
			</div>
		{:else}
			<button
				onclick={() =>
					authClient.signIn.social({
						provider: "github",
						callbackURL: page.url.pathname
					})}
			>
				<span class="font-medium">Log in</span>
			</button>
		{/if}
	</div>
</nav>
