<script lang="ts">
	import "../app.css";
	import Logo from "$lib/components/Logo.svelte";
	import type { LayoutProps } from "./$types";
	import { signIn, signOut } from "$lib/auth-client";
	import { page } from "$app/state";

	const { data, children }: LayoutProps = $props();
</script>

<nav class="bg-black text-white sticky top-0 border-white/35 border-b-1 h-15">
	<div class="flex flex-row justify-between gap-10 items-center mx-10 *:py-2 h-full">
		<div class="pr-4 h-full flex items-center">
			<a href="/">
				<Logo />
			</a>
		</div>

		{#if data.session}
			<div class="flex flex-row gap-4 h-full">
				<a href="/@{data.session?.user?.handle}" class="h-full">
					<img class="h-full rounded-full" src={data.session?.user?.image} alt="User" />
				</a>
				<button onclick={() => signOut()}>Log out</button>
			</div>
		{:else}
			<button
				onclick={() =>
					signIn.social({
						provider: "github",
						callbackURL: page.url.pathname
					})}
			>
				<span class="font-medium">Log in</span>
			</button>
		{/if}
	</div>
</nav>

<div class="m-2">
	{@render children()}
</div>
