<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const { post, imageUrl, creator, ratings } = data;
</script>

<svelte:head>
	<title>{post.title} - Foodhub</title>
</svelte:head>

<main class="post-detail">
	<div class="hero-section">
		{#if imageUrl}
			<img src={imageUrl} alt={post.title} class="hero-image" />
			<div class="hero-overlay"></div>
		{:else}
			<div class="hero-placeholder">
				<span class="hero-icon">🍽️</span>
			</div>
		{/if}
	</div>

	<div class="post-container">
		<div class="post-header">
			<h1 class="post-title">{post.title}</h1>
			
			<div class="post-rating">
				<div class="rating-display">
					{post.rating.average > 0 ? post.rating.average.toFixed(1) : 'Neu'}
				</div>
				<div class="rating-info">
					<div class="rating-stars">{'★'.repeat(Math.round(post.rating.average))}{'☆'.repeat(5 - Math.round(post.rating.average))}</div>
					<div class="rating-count">{post.rating.amount} Bewertungen</div>
				</div>
			</div>

			{#if creator}
				<div class="post-creator">
					<img src={creator.image} alt={creator.name} class="creator-avatar" />
					<div class="creator-info">
						<div class="creator-label">Bewertet von</div>
						<a href="/@{creator.handle}" class="creator-name">{creator.name}</a>
					</div>
				</div>
			{/if}

			<div class="post-meta">
				<span class="meta-item">📅 {new Date(post.createdAt).toLocaleDateString('de-DE')}</span>
			</div>
		</div>

		<div class="post-content">
			<h2>Beschreibung</h2>
			<p class="content-text">{post.content}</p>
		</div>

		<div class="reviews-section">
			<h2>Bewertungen ({ratings.length})</h2>
			
			{#if ratings.length === 0}
				<div class="no-reviews">
					<p>Noch keine Bewertungen vorhanden.</p>
					<p class="no-reviews-hint">Sei der Erste, der dieses Gericht bewertet!</p>
				</div>
			{:else}
				<div class="reviews-list">
					{#each ratings as rating}
						<div class="review-card">
							<div class="review-header">
								<div class="review-user">
									<img src={rating.user?.image || '/default-avatar.png'} alt="User" class="review-avatar" />
									<div>
										<div class="review-username">{rating.user?.name || 'Anonym'}</div>
										<div class="review-date">{new Date(rating.createdAt).toLocaleDateString('de-DE')}</div>
									</div>
								</div>
								<div class="review-rating">
									{rating.rating.toFixed(1)} ★
								</div>
							</div>
							{#if rating.comment}
								<p class="review-comment">{rating.comment}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="actions">
			<a href="/upload" class="rate-btn">Bewerten</a>
			<a href="/" class="back-link">← Zurück zur Übersicht</a>
		</div>
	</div>
</main>

<style>
	:global(body) {
		background-color: #181818;
		color: #fff;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.hero-section {
		width: 100%;
		height: 450px;
		position: relative;
		overflow: hidden;
		background: #000;
	}

	.hero-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to bottom, transparent, rgba(24, 24, 24, 0.8));
	}

	.hero-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #333, #222);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-icon {
		font-size: 120px;
		opacity: 0.3;
	}

	.post-container {
		max-width: 1000px;
		margin: -80px auto 60px auto;
		padding: 0 20px;
		position: relative;
		z-index: 10;
	}

	.post-header {
		background: linear-gradient(135deg, #222, #181818);
		border-radius: 15px;
		padding: 40px;
		box-shadow: 0 4px 15px rgba(255, 144, 0, 0.2);
		margin-bottom: 30px;
		border: 2px solid #333;
	}

	.post-title {
		font-size: 42px;
		font-weight: bold;
		margin: 0 0 30px 0;
		color: #fff;
	}

	.post-rating {
		display: flex;
		align-items: center;
		gap: 24px;
		margin-bottom: 25px;
		padding: 20px;
		background: #282828;
		border-radius: 12px;
	}

	.rating-display {
		font-size: 56px;
		font-weight: bold;
		color: #ff9000;
	}

	.rating-info {
		flex: 1;
	}

	.rating-stars {
		font-size: 28px;
		color: #ff9000;
		margin-bottom: 5px;
	}

	.rating-count {
		font-size: 16px;
		color: #999;
	}

	.post-creator {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 15px;
		background: #282828;
		border-radius: 10px;
		margin-bottom: 20px;
	}

	.creator-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 2px solid #ff9000;
	}

	.creator-label {
		font-size: 12px;
		color: #999;
		margin-bottom: 3px;
	}

	.creator-name {
		font-size: 18px;
		font-weight: 600;
		color: #ff9000;
		text-decoration: none;
	}

	.creator-name:hover {
		text-decoration: underline;
	}

	.post-meta {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		color: #999;
		font-size: 14px;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.post-content {
		background: #222;
		border-radius: 15px;
		padding: 35px;
		margin-bottom: 30px;
		border: 2px solid #333;
	}

	.post-content h2 {
		font-size: 24px;
		margin: 0 0 20px 0;
		color: #ff9000;
	}

	.content-text {
		font-size: 18px;
		line-height: 1.7;
		color: #ddd;
		margin: 0;
	}

	.reviews-section {
		background: #222;
		border-radius: 15px;
		padding: 35px;
		margin-bottom: 30px;
		border: 2px solid #333;
	}

	.reviews-section h2 {
		font-size: 24px;
		margin: 0 0 25px 0;
		color: #ff9000;
	}

	.no-reviews {
		text-align: center;
		padding: 40px 20px;
		color: #999;
	}

	.no-reviews-hint {
		font-size: 14px;
		color: #666;
		margin-top: 10px;
	}

	.reviews-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.review-card {
		background: #282828;
		border-radius: 12px;
		padding: 20px;
		border: 1px solid #333;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.review-user {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.review-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.review-username {
		font-weight: 600;
		color: #fff;
	}

	.review-date {
		font-size: 13px;
		color: #999;
		margin-top: 3px;
	}

	.review-rating {
		font-size: 20px;
		font-weight: bold;
		color: #ff9000;
	}

	.review-comment {
		color: #ddd;
		line-height: 1.6;
		margin: 0;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		flex-wrap: wrap;
	}

	.rate-btn {
		padding: 16px 32px;
		background-color: #ff9000;
		color: #000;
		text-decoration: none;
		border-radius: 25px;
		font-weight: bold;
		font-size: 16px;
		transition: background-color 0.3s ease;
	}

	.rate-btn:hover {
		background-color: #e07e00;
	}

	.back-link {
		color: #ff9000;
		text-decoration: none;
		font-size: 16px;
		transition: color 0.3s ease;
	}

	.back-link:hover {
		color: #ffaa33;
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.post-title {
			font-size: 32px;
		}

		.rating-display {
			font-size: 42px;
		}

		.post-rating {
			flex-direction: column;
			text-align: center;
		}

		.actions {
			flex-direction: column;
			align-items: stretch;
		}

		.rate-btn,
		.back-link {
			text-align: center;
		}
	}
</style>
