<script>
	import Post from "$lib/components/Post.svelte";
	import { loadPosts } from "./post.remote";
</script>

{#await loadPosts()}
    <p>Loading...</p>
{:then posts}
    {#each posts as post}
        <Post {post} />
    {/each}
{/await}