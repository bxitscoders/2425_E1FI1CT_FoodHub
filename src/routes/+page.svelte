<script>
	import { loadPosts } from "./post.remote";
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#await loadPosts()}
    <p>nasty</p>
{:then posts}
    <p>{JSON.stringify(posts)}</p>
{/await}