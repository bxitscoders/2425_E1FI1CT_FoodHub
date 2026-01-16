<script lang="ts">
	import PostSummary from "$lib/components/posts/PostSummary.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};
</script>

<div class="profile-container mx-auto max-w-5xl px-5 py-10">
	<!-- Profile Header -->
	<div
		class="profile-header mb-8 flex flex-col gap-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 shadow-lg shadow-orange-500/20 md:flex-row md:items-center"
	>
		<!-- Avatar -->
		<div
			class="profile-avatar flex h-36 w-36 items-center justify-center rounded-full border-4 border-orange-500 bg-zinc-800 text-5xl font-bold shadow-lg shadow-orange-500/40"
		>
			{#if data.profileUser.image}
				<img src={data.profileUser.image} alt={data.profileUser.name} class="h-full w-full rounded-full object-cover" />
			{:else}
				{getInitials(data.profileUser.name)}
			{/if}
		</div>

		<!-- Profile Info -->
		<div class="profile-info flex-1">
			<h1 class="profile-name mb-2 text-4xl font-bold text-white">{data.profileUser.name}</h1>
			<p class="profile-username mb-4 text-lg text-orange-500">@{data.profileUser.handle}</p>

			<!-- Stats -->
			<div class="profile-stats mt-6 flex gap-8">
				<div class="stat">
					<div class="stat-number text-3xl font-bold text-orange-500">{data.posts.length}</div>
					<div class="stat-label text-sm text-gray-400">Posts</div>
				</div>
				<div class="stat">
					<div class="stat-number text-3xl font-bold text-orange-500">
						{data.posts.reduce((sum, post) => sum + post.rating.amount, 0)}
					</div>
					<div class="stat-label text-sm text-gray-400">Ratings Received</div>
				</div>
				<div class="stat">
					<div class="stat-number text-3xl font-bold text-orange-500">
						{data.posts.length > 0
							? (
									data.posts.reduce((sum, post) => sum + post.rating.average, 0) / data.posts.length
								).toFixed(1)
							: "0.0"}
					</div>
					<div class="stat-label text-sm text-gray-400">Avg Rating</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Posts Section -->
	<div class="section-title mb-6 border-b-2 border-orange-500 pb-3 text-2xl font-bold text-white">
		Posts
	</div>

	{#if data.posts.length > 0}
		<div class="rounded-xl border border-gray-800 bg-black">
			{#each data.posts as post (post.id)}
				<PostSummary {post} />
			{/each}
		</div>
	{:else}
		<div class="rounded-xl border border-gray-800 bg-zinc-900 p-12 text-center">
			<p class="text-lg text-gray-400">No posts yet</p>
		</div>
	{/if}
</div>