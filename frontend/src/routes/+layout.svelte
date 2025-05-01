<script lang="ts">
	import "../app.css";
	import type { LayoutProps } from "./$types";
	import Navbar from "$lib/components/Navbar.svelte";

	const { data, children }: LayoutProps = $props();
</script>

<Navbar />

<div class="m-2">
	{@render children()}
</div>
