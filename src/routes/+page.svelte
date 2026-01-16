<script lang="ts">
	import PostSummary from "$lib/components/posts/PostSummary.svelte";
	import { onMount } from "svelte";
	import { loadPostsByOffset, loadImageByPostId } from "./post.remote";

	let posts: (PostDTO & { imageUrl?: string })[] = $state([]);
	let isLoading: boolean = $state(false);
	let searchQuery = $state('');
	let activeFilter = $state('Alle');

	let sentinel: HTMLDivElement | undefined = $state(undefined);

	const filters = ['Alle', 'Pizza', 'Burger', 'Vegan', 'Asiatisch', 'Desserts'];

	const loadMore = async () => {
		if (isLoading) return;
		isLoading = true;

		const newPosts = await loadPostsByOffset({ offset: posts.length, limit: 10 });
		
		// Lade Bilder für jeden Post
		const postsWithImages = await Promise.all(
			newPosts.map(async (post) => {
				const imageUrl = await loadImageByPostId({ postId: post.id });
				return { ...post, imageUrl: imageUrl || undefined };
			})
		);
		
		posts = [...posts, ...postsWithImages];

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

<svelte:head>
	<title>Foodhub - Essen bewerten</title>
</svelte:head>

<section class="search-container">
	<input
		type="text"
		bind:value={searchQuery}
		placeholder="Suche nach Gerichten, Restaurants oder Usern..."
	/>
	<button>Suchen</button>
</section>

<section class="filters">
	{#each filters as filter}
		<button
			class:active={activeFilter === filter}
			onclick={() => (activeFilter = filter)}
		>
			{filter}
		</button>
	{/each}
</section>

<section class="card-container">
	{#each posts as post}
		<a href="/post/{post.id}" class="card">
			{#if post.imageUrl}
				<img src={post.imageUrl} alt={post.title || 'Food post'} />
			{:else}
				<div class="card-placeholder">
					<span class="placeholder-icon">🍽️</span>
				</div>
			{/if}
			<div class="info">
				<h3>{post.title}</h3>
				<div class="desc">{post.content}</div>
				<span class="score">
					{post.rating.average > 0 ? post.rating.average.toFixed(1) : 'Neu'} ★
				</span>
				<div class="rating-count">
					{post.rating.amount} {post.rating.amount === 1 ? 'Bewertung' : 'Bewertungen'}
				</div>
			</div>
		</a>
	{/each}
</section>

<div bind:this={sentinel}></div>

<style>
	:global(body) {
		margin: 0;
		background-color: #181818;
		color: #fff;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.search-container {
		max-width: 920px;
		margin: 40px auto 20px auto;
		text-align: center;
		padding: 0 15px;
	}

	.search-container input[type='text'] {
		width: 72%;
		padding: 16px 20px;
		font-size: 18px;
		border-radius: 30px 0 0 30px;
		border: none;
		outline: none;
		background-color: #222;
		color: #fff;
		transition: background-color 0.3s ease;
	}

	.search-container input[type='text']:focus {
		background-color: #333;
	}

	.search-container button {
		background-color: #ff9000;
		border: none;
		color: black;
		padding: 16px 28px;
		font-weight: bold;
		font-size: 18px;
		border-radius: 0 30px 30px 0;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.search-container button:hover {
		background-color: #e07e00;
	}

	.filters {
		margin: 15px auto 40px auto;
		max-width: 920px;
		display: flex;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
		padding: 0 15px;
	}

	.filters button {
		background-color: #222;
		border: none;
		padding: 10px 20px;
		border-radius: 20px;
		color: #bbb;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.filters button:hover,
	.filters button.active {
		background-color: #ff9000;
		color: black;
	}

	.card-container {
		max-width: 940px;
		margin: 0 auto 80px auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 25px;
		padding: 0 15px;
	}

	.card {
		background: #222;
		border-radius: 12px;
		color: white;
		box-shadow: 0 0 8px #ff9000;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.25s ease;
		text-decoration: none;
		display: block;
	}

	.card:hover {
		transform: scale(1.08);
		box-shadow: 0 0 15px #ffb84d;
	}

	.card img {
		width: 100%;
		height: 160px;
		object-fit: cover;
		display: block;
		border-bottom: 3px solid #ff9000;
	}

	.card-placeholder {
		width: 100%;
		height: 160px;
		background: linear-gradient(135deg, #333, #222);
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 3px solid #ff9000;
	}

	.placeholder-icon {
		font-size: 60px;
		opacity: 0.3;
	}

	.card .info {
		padding: 15px 18px 18px 18px;
	}

	.card .info h3 {
		margin: 0 0 10px 0;
		font-size: 20px;
		font-weight: 700;
		line-height: 1.2;
	}

	.card .info .desc {
		font-size: 14px;
		color: #bbb;
		margin: 0 0 12px 0;
		height: 36px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.score {
		display: inline-block;
		padding: 5px 11px;
		border-radius: 15px;
		background-color: #ff9000;
		color: black;
		font-weight: bold;
		font-size: 14px;
		margin-bottom: 10px;
	}

	.rating-count {
		font-size: 13px;
		color: #999;
		margin-top: 8px;
	}
</style>
