<script>
	import PostSummary from "$lib/components/posts/PostSummary.svelte";
	import { loadPosts } from "./post.remote";
</script>

{#await loadPosts()}
    <p>Loading...</p>
{:then posts}
    {#each posts as post}
        <PostSummary {post} />
    {/each}
{/await}