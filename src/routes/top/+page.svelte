<script lang="ts">
	import { onMount } from "svelte";
	import { loadPostsByOffset, loadImageByPostId } from "../post.remote";

	let posts: (PostDTO & { imageUrl?: string })[] = $state([]);
	let isLoading = $state(false);
	let timeFilter = $state('all-time');
	let categoryFilter = $state('all');
	let minRating = $state(0);

	async function loadTopPosts() {
		isLoading = true;
		const allPosts = await loadPostsByOffset({ offset: 0, limit: 50 });
		
		// Lade Bilder für jeden Post
		const postsWithImages = await Promise.all(
			allPosts.map(async (post) => {
				const imageUrl = await loadImageByPostId({ postId: post.id });
				return { ...post, imageUrl: imageUrl || undefined };
			})
		);

		// Sortiere nach Rating (höchstes zuerst)
		const sorted = postsWithImages
			.filter(p => p.rating.amount > 0) // Nur Posts mit Bewertungen
			.sort((a, b) => {
				// Erst nach Average sortieren, dann nach Anzahl
				if (b.rating.average !== a.rating.average) {
					return b.rating.average - a.rating.average;
				}
				return b.rating.amount - a.rating.amount;
			});

		posts = sorted;
		isLoading = false;
	}

	onMount(() => {
		loadTopPosts();
	});
</script>

<svelte:head>
	<title>Foodhub - Top Gerichte</title>
</svelte:head>

<main class="main-content">
	<h1>🏆 Top Gerichte</h1>
	<p class="subtitle">Die am besten bewerteten Gerichte unserer Community</p>

	<div class="filter-container">
		<div class="filter-group">
			<label for="time">Zeitraum</label>
			<select id="time" bind:value={timeFilter}>
				<option value="all-time">Alle Zeit</option>
				<option value="month">Letzter Monat</option>
				<option value="week">Letzte Woche</option>
			</select>
		</div>

		<div class="filter-group">
			<label for="category">Kategorie</label>
			<select id="category" bind:value={categoryFilter}>
				<option value="all">Alle Kategorien</option>
				<option value="pizza">Pizza</option>
				<option value="burger">Burger</option>
				<option value="vegan">Vegan</option>
				<option value="asiatisch">Asiatisch</option>
				<option value="desserts">Desserts</option>
			</select>
		</div>

		<div class="filter-group">
			<label for="rating">Mind. Bewertung</label>
			<select id="rating" bind:value={minRating}>
				<option value={0}>Alle</option>
				<option value={3}>3+ Sterne</option>
				<option value={4}>4+ Sterne</option>
				<option value={4.5}>4.5+ Sterne</option>
			</select>
		</div>
	</div>

	{#if isLoading}
		<div class="loading">Lädt Top Gerichte...</div>
	{:else}
		<div class="ranking-list">
			{#each posts as post, index}
				<a href="/post/{post.id}" class="rank-card">
					<div class="rank-badge" class:gold={index === 0} class:silver={index === 1} class:bronze={index === 2}>
						#{index + 1}
					</div>
					<div class="rank-image">
						{#if post.imageUrl}
							<img src={post.imageUrl} alt={post.title} />
						{:else}
							<div class="placeholder">🍽️</div>
						{/if}
					</div>
					<div class="rank-info">
						<h3>{post.title}</h3>
						<p class="description">{post.content}</p>
					</div>
					<div class="rank-stats">
						<div class="stat-rating">
							<span class="rating-value">{post.rating.average.toFixed(1)}</span>
							<span class="rating-stars">★</span>
						</div>
						<div class="stat-count">{post.rating.amount} Bewertungen</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>

<style>
	:global(body) {
		background-color: #181818;
		color: #fff;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	h1 {
		font-size: 42px;
		font-weight: 700;
		margin-bottom: 15px;
		text-align: center;
		color: #fff;
	}

	.subtitle {
		text-align: center;
		font-size: 18px;
		color: #bbb;
		margin-bottom: 40px;
	}

	.filter-container {
		background: #222;
		padding: 24px;
		border-radius: 15px;
		box-shadow: 0 0 15px rgba(255, 144, 0, 0.14);
		margin-bottom: 40px;
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		align-items: flex-end;
		max-width: 900px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 40px;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		min-width: 180px;
		flex: 1;
	}

	.filter-group label {
		margin-bottom: 8px;
		font-weight: 600;
		font-size: 14px;
		color: #ddd;
	}

	.filter-group select,
	.filter-group input {
		padding: 12px 16px;
		border-radius: 10px;
		border: none;
		background-color: #181818;
		color: #fff;
		font-size: 15px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.filter-group select:hover,
	.filter-group input:hover {
		background-color: #282828;
	}

	.filter-group select:focus,
	.filter-group input:focus {
		outline: 2px solid #ff9000;
	}

	.loading {
		text-align: center;
		padding: 60px;
		font-size: 18px;
		color: #999;
	}

	.ranking-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.rank-card {
		background: linear-gradient(135deg, #222, #181818);
		border-radius: 15px;
		padding: 20px;
		display: flex;
		align-items: center;
		gap: 24px;
		transition: all 0.3s ease;
		box-shadow: 0 0 12px rgba(255, 144, 0, 0.2);
		border: 2px solid #333;
		text-decoration: none;
		color: inherit;
	}

	.rank-card:hover {
		transform: translateX(10px);
		box-shadow: 0 0 20px rgba(255, 144, 0, 0.4);
		border-color: #ff9000;
	}

	.rank-badge {
		font-size: 28px;
		font-weight: bold;
		min-width: 60px;
		text-align: center;
		color: #999;
	}

	.rank-badge.gold {
		color: #ffd700;
		font-size: 36px;
	}

	.rank-badge.silver {
		color: #c0c0c0;
		font-size: 32px;
	}

	.rank-badge.bronze {
		color: #cd7f32;
		font-size: 30px;
	}

	.rank-image {
		width: 120px;
		height: 120px;
		border-radius: 12px;
		overflow: hidden;
		flex-shrink: 0;
		background: #333;
	}

	.rank-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48px;
		opacity: 0.3;
	}

	.rank-info {
		flex: 1;
	}

	.rank-info h3 {
		margin: 0 0 10px 0;
		font-size: 24px;
		font-weight: 700;
		color: #fff;
	}

	.description {
		margin: 0;
		color: #bbb;
		font-size: 15px;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.rank-stats {
		text-align: right;
	}

	.stat-rating {
		display: flex;
		align-items: center;
		gap: 8px;
		justify-content: flex-end;
		margin-bottom: 8px;
	}

	.rating-value {
		font-size: 36px;
		font-weight: bold;
		color: #ff9000;
	}

	.rating-stars {
		font-size: 28px;
		color: #ff9000;
	}

	.stat-count {
		font-size: 14px;
		color: #999;
	}

	@media (max-width: 768px) {
		.rank-card {
			flex-direction: column;
			text-align: center;
		}

		.rank-badge {
			position: absolute;
			top: 15px;
			left: 15px;
		}

		.rank-image {
			width: 100%;
			height: 200px;
		}

		.rank-stats {
			text-align: center;
		}
	}
</style>
