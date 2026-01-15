<script lang="ts">
	import PostSummary from "$lib/components/posts/PostSummary.svelte";
	import { onMount } from "svelte";
	import { loadPostsByOffset } from "./post.remote";

	let posts: PostDTO[] = $state([]);
	let isLoading: boolean = $state(false);

	let sentinel: HTMLDivElement | undefined = $state(undefined);

	const loadMore = async () => {
		if (isLoading) return;
		isLoading = true;

		const newPosts = await loadPostsByOffset({ offset: posts.length, limit: 10 });
		posts = [...posts, ...newPosts];

		isLoading = false;
	};

	onMount(() => {
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				loadMore();
			},
			{
				rootMargin: "200px"
			}
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<div>
	{#each posts as post}
		<PostSummary {post} />
	{/each}
</div>

<div bind:this={sentinel}></div>
