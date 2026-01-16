<script lang="ts">
	import PostSummary from "$lib/components/posts/PostSummary.svelte";
	import { onMount } from "svelte";
	import { loadPostsByOffset, loadImageByPostId } from "./post.remote";
	import { page } from '$app/stores';

	let allPosts: (PostDTO & { imageUrl?: string })[] = $state([]);
	let filteredPosts: (PostDTO & { imageUrl?: string })[] = $state([]);
	let isLoading: boolean = $state(false);
	let searchQuery = $state('');
	let activeFilter = $state('Alle');
	let sortBy = $state('newest'); // newest, topRated, mostReviewed

	let sentinel: HTMLDivElement | undefined = $state(undefined);

	const filters = ['Alle', 'Pizza', 'Burger', 'Vegan', 'Asiatisch', 'Desserts'];

	// URL-Parameter lesen
	$effect(() => {
		const filterParam = $page.url.searchParams.get('filter');
		if (filterParam) {
			// Kapitalisiere ersten Buchstaben für Filter-Namen
			const capitalizedFilter = filterParam.charAt(0).toUpperCase() + filterParam.slice(1);
			if (filters.includes(capitalizedFilter)) {
				activeFilter = capitalizedFilter;
			}
		}
	});

	// Filter und Such-Logik
	$effect(() => {
		let result = [...allPosts];
		
		// Suche
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(post => 
				post.title.toLowerCase().includes(query) ||
				post.content.toLowerCase().includes(query)
			);
		}
		
		// Filter nach Kategorie
		if (activeFilter !== 'Alle') {
			result = result.filter(post => {
				const titleLower = post.title.toLowerCase();
				const contentLower = post.content.toLowerCase();
				const combined = titleLower + ' ' + contentLower;
				const postCategory = post.category?.toLowerCase() || '';
				
				// Prüfe zuerst die echte Kategorie
				if (postCategory && postCategory === activeFilter.toLowerCase()) {
					return true;
				}
				
				// Fallback: Keyword-basierte Erkennung
				switch(activeFilter) {
					case 'Pizza':
						return combined.includes('pizza');
					case 'Burger':
						return combined.includes('burger');
					case 'Vegan':
						return combined.includes('vegan') || combined.includes('vegetarisch');
					case 'Asiatisch':
						return combined.includes('asia') || combined.includes('sushi') || 
						       combined.includes('ramen') || combined.includes('thai') ||
						       combined.includes('chinesisch') || combined.includes('japan') ||
						       combined.includes('curry') || combined.includes('pho');
					case 'Desserts':
						return combined.includes('dessert') || combined.includes('kuchen') ||
						       combined.includes('eis') || combined.includes('süß') ||
						       combined.includes('cake') || combined.includes('torte') ||
						       combined.includes('pudding') || combined.includes('nachspeise') ||
						       combined.includes('schokolade');
					default:
						return combined.includes(activeFilter.toLowerCase());
				}
			});
		}
		
		// Sortierung
		if (sortBy === 'topRated') {
			result.sort((a, b) => b.rating.average - a.rating.average);
		} else if (sortBy === 'mostReviewed') {
			result.sort((a, b) => b.rating.amount - a.rating.amount);
		} else {
			// newest - nach ID sortieren (höhere ID = neuer)
			result.sort((a, b) => b.id - a.id);
		}
		
		filteredPosts = result;
	});

	const loadMore = async () => {
		if (isLoading) return;
		isLoading = true;

		const newPosts = await loadPostsByOffset({ offset: allPosts.length, limit: 10 });
		
		// Lade Bilder für jeden Post
		const postsWithImages = await Promise.all(
			newPosts.map(async (post) => {
				const imageUrl = await loadImageByPostId({ postId: post.id });
				return { ...post, imageUrl: imageUrl || undefined };
			})
		);
		
		allPosts = [...allPosts, ...postsWithImages];

		isLoading = false;
	};

	function handleSearch() {
		// Search wird automatisch durch $effect getriggert
	}

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
		onkeydown={(e) => e.key === 'Enter' && handleSearch()}
	/>
	<button onclick={handleSearch}>Suchen</button>
</section>

<section class="controls">
	<div class="filters">
		{#each filters as filter}
			<button
				class:active={activeFilter === filter}
				onclick={() => (activeFilter = filter)}
			>
				{filter}
			</button>
		{/each}
	</div>
	
	<div class="sort-controls">
		<label for="sort">Sortieren:</label>
		<select id="sort" bind:value={sortBy}>
			<option value="newest">Neueste</option>
			<option value="topRated">Beste Bewertung</option>
			<option value="mostReviewed">Meiste Bewertungen</option>
		</select>
	</div>
</section>

<section class="card-container">
	{#each filteredPosts as post}
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
	{:else}
		<div class="no-results">
			<h2>😢 Keine Ergebnisse gefunden</h2>
			<p>Versuche es mit anderen Suchbegriffen oder Filtern</p>
		</div>
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

	.controls {
		max-width: 1200px;
		margin: 0 auto 30px auto;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 20px;
	}

	.filters {
		display: flex;
		justify-content: center;
		gap: 12px;
		flex-wrap: nowrap;
		flex: 1;
		overflow-x: auto;
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
		white-space: nowrap;
		flex-shrink: 0;
	}

	.filters button:hover,
	.filters button.active {
		background-color: #ff9000;
		color: black;
	}

	.sort-controls {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.sort-controls label {
		color: #ddd;
		font-weight: 600;
		font-size: 14px;
	}

	.sort-controls select {
		padding: 10px 16px;
		border-radius: 10px;
		border: none;
		background-color: #222;
		color: #fff;
		font-size: 14px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		font-weight: 600;
	}

	.sort-controls select:hover {
		background-color: #333;
	}

	.sort-controls select:focus {
		outline: 2px solid #ff9000;
	}

	.card-container {
		max-width: 1200px;
		margin: 0 auto 80px auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 30px;
		padding: 0 20px;
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
		height: 200px;
		object-fit: cover;
		display: block;
		border-bottom: 3px solid #ff9000;
	}

	.card-placeholder {
		width: 100%;
		height: 200px;
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
