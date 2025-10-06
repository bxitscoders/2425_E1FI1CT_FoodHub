<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import Logo from "$lib/components/Logo.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="bg-black text-white sticky top-0 border-white/35 border-b-1 h-15">
	<div class="flex flex-row justify-between gap-10 items-center mx-10 *:py-2 h-full">
		<div class="pr-4 h-full flex items-center">
			<a href="/">
				<Logo />
			</a>
		</div>
	</div>
</nav>

{@render children?.()}