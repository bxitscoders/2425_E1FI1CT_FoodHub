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
		const searchParam = $page.url.searchParams.get('search');
		
		if (filterParam) {
			// Kapitalisiere ersten Buchstaben für Filter-Namen
			const capitalizedFilter = filterParam.charAt(0).toUpperCase() + filterParam.slice(1);
			if (filters.includes(capitalizedFilter)) {
				activeFilter = capitalizedFilter;
			}
		}
		
		if (searchParam) {
			searchQuery = searchParam;
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
	<meta name="description" content="Entdecke und bewerte die besten Restaurants und Gerichte in deiner Nähe" />
</svelte:head>

<!-- Welcome Banner für neue Besucher -->
{#if filteredPosts.length === 0 && allPosts.length === 0 && !isLoading}
	<div class="welcome-banner">
		<h1>🍔 Willkommen bei FoodHub!</h1>
		<p>Die Community-Plattform für Food-Lovers</p>
		<div class="welcome-features">
			<div class="feature">
				<span class="feature-icon">📸</span>
				<h3>Teilen</h3>
				<p>Poste deine Food-Erlebnisse</p>
			</div>
			<div class="feature">
				<span class="feature-icon">⭐</span>
				<h3>Bewerten</h3>
				<p>Rate Restaurants & Gerichte</p>
			</div>
			<div class="feature">
				<span class="feature-icon">🎮</span>
				<h3>Spielen</h3>
				<p>Baue dein Burger-Imperium</p>
			</div>
		</div>
		<button class="cta-button" onclick={() => window.location.href = '/upload'}>
			Jetzt ersten Post erstellen! 🚀
		</button>
	</div>
{/if}

<section class="search-container">
	<div class="search-wrapper">
		<span class="search-icon">🔍</span>
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Suche nach Gerichten, Restaurants oder Usern..."
			onkeydown={(e) => e.key === 'Enter' && handleSearch()}
			aria-label="Suchfeld"
		/>
		{#if searchQuery}
			<button class="clear-button" onclick={() => searchQuery = ''} title="Suche löschen">✖</button>
		{/if}
	</div>
	<button class="search-button" onclick={handleSearch} title="Suchen (Enter)">
		<span class="button-text">Suchen</span>
		<span class="button-icon">→</span>
	</button>
</section>

<section class="controls">
	<div class="filters">
		<span class="filter-label">Kategorien:</span>
		{#each filters as filter}
			<button
				class="filter-btn"
				class:active={activeFilter === filter}
				onclick={() => (activeFilter = filter)}
				title={filter === 'Alle' ? 'Alle Kategorien anzeigen' : `Nur ${filter} anzeigen`}
			>
				{#if filter === 'Pizza'}🍕
				{:else if filter === 'Burger'}🍔
				{:else if filter === 'Vegan'}🥗
				{:else if filter === 'Asiatisch'}🍜
				{:else if filter === 'Desserts'}🍰
				{:else}📋{/if}
				<span>{filter}</span>
			</button>
		{/each}
	</div>
	
	<div class="sort-controls">
		<label for="sort">
			<span class="sort-icon">⚡</span>
			Sortierung:
		</label>
		<select id="sort" bind:value={sortBy} class="sort-select">
			<option value="newest">🆕 Neueste zuerst</option>
			<option value="topRated">⭐ Beste Bewertung</option>
			<option value="mostReviewed">💬 Meiste Bewertungen</option>
		</select>
	</div>
</section>

<!-- Results Info -->
{#if searchQuery || activeFilter !== 'Alle'}
	<div class="results-info">
		<p>
			<strong>{filteredPosts.length}</strong> 
			{filteredPosts.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
			{#if searchQuery}für "<em>{searchQuery}</em>"{/if}
			{#if activeFilter !== 'Alle'}in Kategorie <strong>{activeFilter}</strong>{/if}
		</p>
		{#if filteredPosts.length === 0}
			<button class="reset-filters" onclick={() => { searchQuery = ''; activeFilter = 'Alle'; }}>
				Filter zurücksetzen
			</button>
		{/if}
	</div>
{/if}

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
			<span class="no-results-icon">🔍</span>
			<h2>Keine Ergebnisse gefunden</h2>
			<p>Versuche es mit anderen Suchbegriffen oder Filtern</p>
			<button class="reset-button" onclick={() => { searchQuery = ''; activeFilter = 'Alle'; }}>
				Alle Posts anzeigen
			</button>
		</div>
	{/each}
</section>

{#if isLoading}
	<div class="loading-spinner">
		<div class="spinner"></div>
		<p>Lade weitere Posts...</p>
	</div>
{/if}

<div bind:this={sentinel}></div>

<style>
	:global(body) {
		margin: 0;
		background-color: #181818;
		color: #fff;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	/* Welcome Banner */
	.welcome-banner {
		max-width: 1000px;
		margin: 40px auto;
		padding: 60px 40px;
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border-radius: 20px;
		text-align: center;
		border: 2px solid rgba(255, 144, 0, 0.3);
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
	}

	.welcome-banner h1 {
		font-size: 48px;
		margin: 0 0 15px 0;
		background: linear-gradient(135deg, #ff9000, #ffb347);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.welcome-banner > p {
		font-size: 20px;
		color: #bbb;
		margin-bottom: 40px;
	}

	.welcome-features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 30px;
		margin-bottom: 40px;
	}

	.feature {
		background: rgba(0, 0, 0, 0.3);
		padding: 30px 20px;
		border-radius: 15px;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		border: 1px solid rgba(255, 144, 0, 0.2);
	}

	.feature:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 25px rgba(255, 144, 0, 0.3);
		border-color: rgba(255, 144, 0, 0.5);
	}

	.feature-icon {
		font-size: 48px;
		display: block;
		margin-bottom: 15px;
	}

	.feature h3 {
		color: #ff9000;
		margin: 0 0 10px 0;
		font-size: 22px;
	}

	.feature p {
		color: #aaa;
		margin: 0;
		font-size: 14px;
	}

	.cta-button {
		background: linear-gradient(135deg, #ff9000, #e07e00);
		border: none;
		color: #000;
		padding: 18px 40px;
		font-size: 20px;
		font-weight: bold;
		border-radius: 30px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 5px 20px rgba(255, 144, 0, 0.4);
	}

	.cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px rgba(255, 144, 0, 0.6);
	}

	/* Enhanced Search Container */
	.search-container {
		max-width: 920px;
		margin: 40px auto 20px auto;
		text-align: center;
		padding: 0 15px;
		display: flex;
		gap: 0;
	}

	.search-wrapper {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: 20px;
		font-size: 20px;
		color: #888;
		pointer-events: none;
	}

	.search-container input[type='text'] {
		width: 100%;
		padding: 16px 50px 16px 55px;
		font-size: 18px;
		border-radius: 30px 0 0 30px;
		border: 2px solid #333;
		outline: none;
		background-color: #222;
		color: #fff;
		transition: all 0.3s ease;
	}

	.search-container input[type='text']:focus {
		background-color: #2a2a2a;
		border-color: #ff9000;
	}

	.clear-button {
		position: absolute;
		right: 15px;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		color: #888;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		font-size: 14px;
	}

	.clear-button:hover {
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
	}

	.search-button {
		background-color: #ff9000;
		border: none;
		color: black;
		padding: 16px 32px;
		font-weight: bold;
		font-size: 18px;
		border-radius: 0 30px 30px 0;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.search-button:hover {
		background-color: #e07e00;
		transform: translateX(2px);
	}

	.button-text {
		font-weight: bold;
	}

	.button-icon {
		font-size: 20px;
		transition: transform 0.3s ease;
	}

	.search-button:hover .button-icon {
		transform: translateX(5px);
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
		flex-wrap: wrap;
		flex: 1;
		align-items: center;
	}

	.filter-label {
		color: #888;
		font-weight: 600;
		font-size: 14px;
		margin-right: 5px;
	}

	.filter-btn {
		background-color: #222;
		border: 2px solid #333;
		padding: 10px 18px;
		border-radius: 25px;
		color: #bbb;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 15px;
	}

	.filter-btn:hover {
		background-color: #2a2a2a;
		border-color: #ff9000;
		transform: translateY(-2px);
	}

	.filter-btn.active {
		background-color: #ff9000;
		color: black;
		border-color: #ff9000;
		box-shadow: 0 4px 15px rgba(255, 144, 0, 0.4);
	}

	.sort-controls {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #222;
		padding: 10px 20px;
		border-radius: 25px;
		border: 2px solid #333;
	}

	.sort-icon {
		font-size: 16px;
	}

	.sort-controls label {
		color: #ddd;
		font-weight: 600;
		font-size: 14px;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.sort-select {
		padding: 8px 16px;
		border-radius: 15px;
		border: none;
		background-color: #2a2a2a;
		color: #fff;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: 600;
	}

	.sort-select:hover {
		background-color: #333;
	}

	.sort-select:focus {
		outline: 2px solid #ff9000;
	}

	/* Results Info */
	.results-info {
		max-width: 1200px;
		margin: 0 auto 20px auto;
		padding: 15px 25px;
		background: rgba(255, 144, 0, 0.1);
		border-radius: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid rgba(255, 144, 0, 0.3);
		margin-left: 20px;
		margin-right: 20px;
	}

	.results-info p {
		margin: 0;
		color: #fff;
		font-size: 16px;
	}

	.results-info strong {
		color: #ff9000;
	}

	.results-info em {
		color: #ffb347;
		font-style: normal;
		font-weight: 600;
	}

	.reset-filters,
	.reset-button {
		background: #ff9000;
		border: none;
		color: #000;
		padding: 8px 20px;
		border-radius: 20px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 14px;
	}

	.reset-filters:hover,
	.reset-button:hover {
		background: #e07e00;
		transform: translateY(-2px);
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

	/* No Results & Loading Styles */
	.no-results {
		grid-column: 1 / -1;
		text-align: center;
		padding: 80px 20px;
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border-radius: 20px;
		border: 2px dashed rgba(255, 144, 0, 0.3);
	}

	.no-results-icon {
		font-size: 80px;
		display: block;
		margin-bottom: 20px;
		animation: searchBounce 2s ease-in-out infinite;
	}

	@keyframes searchBounce {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-15px) rotate(10deg);
		}
	}

	.no-results h2 {
		color: #ff9000;
		font-size: 32px;
		margin: 0 0 15px 0;
	}

	.no-results p {
		color: #aaa;
		font-size: 18px;
		margin: 0 0 30px 0;
	}

	/* Loading Spinner */
	.loading-spinner {
		text-align: center;
		padding: 40px;
		color: #888;
	}

	.spinner {
		width: 50px;
		height: 50px;
		margin: 0 auto 20px auto;
		border: 4px solid #333;
		border-top-color: #ff9000;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-spinner p {
		color: #888;
		font-size: 16px;
		font-weight: 600;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.welcome-banner h1 {
			font-size: 32px;
		}

		.welcome-banner > p {
			font-size: 16px;
		}

		.welcome-features {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.search-container {
			flex-direction: column;
		}

		.search-button {
			border-radius: 30px;
			width: 100%;
			margin-top: 10px;
		}

		.search-container input[type='text'] {
			border-radius: 30px;
		}

		.controls {
			flex-direction: column;
			align-items: stretch;
		}

		.filters {
			order: 2;
		}

		.sort-controls {
			order: 1;
			justify-content: center;
		}

		.card-container {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 20px;
		}
	}
</style>
