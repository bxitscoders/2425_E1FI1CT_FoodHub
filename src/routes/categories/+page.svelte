<script lang="ts">
	const categories = [
		{ name: 'Pizza', icon: '🍕', color: '#ff6b35' },
		{ name: 'Burger', icon: '🍔', color: '#ff9000' },
		{ name: 'Vegan', icon: '🥗', color: '#4caf50' },
		{ name: 'Asiatisch', icon: '🍜', color: '#ffd700' },
		{ name: 'Desserts', icon: '🍰', color: '#ff4081' },
		{ name: 'Italienisch', icon: '🍝', color: '#e74c3c' },
		{ name: 'Mexikanisch', icon: '�', color: '#f39c12' },
	];
</script>

<svelte:head>
	<title>Foodhub - Kategorien</title>
</svelte:head>

<main class="main-content">
	<h1>📂 Kategorien</h1>
	<p class="subtitle">Entdecke Gerichte nach deinen Vorlieben</p>

	<div class="categories-grid">
		{#each categories as category}
			<a href="/?filter={category.name.toLowerCase()}" class="category-card">
				<div class="category-icon" style="color: {category.color}">
					{category.icon}
				</div>
				<h3 class="category-name">{category.name}</h3>
				<div class="category-arrow">→</div>
			</a>
		{/each}
	</div>

	<section class="popular-section">
		<h2>🔥 Beliebte Kategorien</h2>
		<div class="popular-grid">
			<div class="popular-card" style="background: linear-gradient(135deg, #ff9000, #e07e00);">
				<div class="popular-info">
					<h3>Burger</h3>
					<p>Die beliebteste Kategorie mit über 200 Bewertungen</p>
				</div>
				<div class="popular-icon">🍔</div>
			</div>
			
			<div class="popular-card" style="background: linear-gradient(135deg, #ffd700, #ffaa00);">
				<div class="popular-info">
					<h3>Asiatisch</h3>
					<p>Von Sushi bis Ramen - die Vielfalt Asiens</p>
				</div>
				<div class="popular-icon">🍜</div>
			</div>
			
			<div class="popular-card" style="background: linear-gradient(135deg, #ff6b35, #ff4757);">
				<div class="popular-info">
					<h3>Pizza</h3>
					<p>Klassisch italienisch oder modern interpretiert</p>
				</div>
				<div class="popular-icon">🍕</div>
			</div>
		</div>
	</section>
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
		margin-bottom: 50px;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 30px;
		margin-bottom: 80px;
	}

	.category-card {
		background: linear-gradient(135deg, #222, #181818);
		border-radius: 15px;
		padding: 40px 20px;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 0 12px rgba(255, 144, 0, 0.2);
		border: 2px solid #333;
		position: relative;
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.category-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 8px 25px rgba(255, 144, 0, 0.4);
		border-color: #ff9000;
	}

	.category-icon {
		font-size: 80px;
		margin-bottom: 20px;
		transition: transform 0.3s ease;
	}

	.category-card:hover .category-icon {
		transform: scale(1.15) rotate(5deg);
	}

	.category-name {
		font-size: 24px;
		font-weight: bold;
		margin: 0 0 30px 0;
		color: #fff;
	}

	.category-arrow {
		position: absolute;
		bottom: 15px;
		right: 20px;
		font-size: 24px;
		color: #ff9000;
		opacity: 0;
		transition: all 0.3s ease;
	}

	.category-card:hover .category-arrow {
		opacity: 1;
		right: 15px;
	}

	.popular-section {
		margin-top: 80px;
	}

	.popular-section h2 {
		font-size: 32px;
		font-weight: bold;
		margin-bottom: 30px;
		text-align: center;
	}

	.popular-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 25px;
	}

	.popular-card {
		border-radius: 15px;
		padding: 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s ease;
		cursor: pointer;
	}

	.popular-card:hover {
		transform: scale(1.05);
	}

	.popular-info h3 {
		font-size: 24px;
		font-weight: bold;
		margin: 0 0 10px 0;
		color: #fff;
	}

	.popular-info p {
		font-size: 14px;
		margin: 0;
		color: rgba(255, 255, 255, 0.9);
		max-width: 200px;
	}

	.popular-icon {
		font-size: 64px;
		opacity: 0.8;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 32px;
		}

		.categories-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 20px;
		}

		.category-card {
			padding: 30px 15px;
		}

		.category-icon {
			font-size: 60px;
		}

		.popular-grid {
			grid-template-columns: 1fr;
		}

		.popular-card {
			flex-direction: column;
			text-align: center;
		}

		.popular-info p {
			max-width: none;
		}
	}
</style>
