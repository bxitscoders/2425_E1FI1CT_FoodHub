<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { authClient } from "$lib/auth-client";
	import Upload from "@lucide/svelte/icons/upload";
	import Logo from "./Logo.svelte";

	const session = authClient.useSession();

	async function signOut() {
		await authClient.signOut();
		await goto("/", { invalidateAll: true });
	}

	async function signIn() {
		await authClient.signIn.social({
			provider: "github",
			callbackURL: page.url.toString()
		});
	}
</script>

<nav class="foodhub-nav">
	<div class="nav-container">
		<div class="logo-section">
			<a href="/">
				<Logo />
			</a>
		</div>

		<div class="nav-links">
			<a href="/" class="nav-link">Startseite</a>
			<a href="/top" class="nav-link">Top Gerichte</a>
			<a href="/categories" class="nav-link">Kategorien</a>
			<a href="/upload" class="nav-link">Bewerten</a>
			<a href="/clicker" class="nav-link">Clicker Game</a>
		</div>

		{#if $session.data}
			{@const user = $session.data.user}
			<div class="user-section">
				<a
					href="/upload"
					class="icon-btn"
					title="Hochladen"
				>
					<Upload size={18} />
				</a>
				<a href="/@{user.handle}" class="user-profile">
					<img class="user-avatar" src={user.image} alt="User" />
				</a>
				<button
					class="logout-btn"
					onclick={() => signOut()}>Log out</button
				>
			</div>
		{:else}
			<button
				class="login-btn"
				onclick={() => signIn()}>Log in</button
			>
		{/if}
	</div>
</nav>

<style>
	.foodhub-nav {
		background-color: #000;
		box-shadow: 0 2px 8px rgba(255, 144, 0, 0.3);
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 1px solid rgba(255, 144, 0, 0.2);
	}

	.nav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 40px;
		max-width: 1600px;
		margin: 0 auto;
	}

	.logo-section {
		display: flex;
		align-items: center;
	}

	.nav-links {
		display: flex;
		gap: 32px;
		flex: 1;
		justify-content: center;
	}

	.nav-link {
		font-weight: 600;
		font-size: 16px;
		color: #ddd;
		text-decoration: none;
		transition: color 0.3s ease;
		position: relative;
	}

	.nav-link:hover {
		color: #ff9000;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		display: block;
		margin-top: 6px;
		right: 0;
		background: #ff9000;
		transition: width 0.3s ease;
	}

	.nav-link:hover::after {
		width: 100%;
		left: 0;
		background: #ff9000;
	}

	.user-section {
		display: flex;
		align-items: center;
		gap: 15px;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		transition: background-color 0.3s ease;
		color: #ddd;
	}

	.icon-btn:hover {
		background-color: rgba(255, 144, 0, 0.1);
		color: #ff9000;
	}

	.user-profile {
		display: flex;
		align-items: center;
	}

	.user-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		transition: opacity 0.3s ease;
		border: 2px solid transparent;
	}

	.user-avatar:hover {
		border-color: #ff9000;
	}

	.logout-btn {
		background: transparent;
		border: 1px solid #ff9000;
		color: #ff9000;
		padding: 8px 16px;
		border-radius: 20px;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.logout-btn:hover {
		background-color: #ff9000;
		color: #000;
	}

	.login-btn {
		background-color: #ff9000;
		border: none;
		color: #000;
		padding: 10px 24px;
		border-radius: 25px;
		font-weight: bold;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.login-btn:hover {
		background-color: #e07e00;
	}

	@media (max-width: 1024px) {
		.nav-links {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 14px 20px;
		}
	}
</style>