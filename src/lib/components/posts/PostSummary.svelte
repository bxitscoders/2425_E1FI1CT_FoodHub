<script lang="ts">
	import { onMount } from "svelte";
	import { loadUserById } from "../../../routes/user.remote";
	import type { User } from "$lib/auth-client";
	import { loadImageByPostId } from "../../../routes/post.remote";

	let { post }: { post: PostDTO } = $props();

	let postCreator: User | null = $state(null);

	onMount(async () => {
		postCreator = await loadUserById({ userId: post.creatorUserId });
	});

	const formatDate = (dateInput: Date): string => {
		const created = new Date(dateInput);
		if (isNaN(created.getTime())) return "";

		const now = new Date();
		const diffMs = now.getTime() - created.getTime();
		const seconds = Math.floor(diffMs / 1000);
		if (seconds < 10) return "just now";
		if (seconds < 60) return `${seconds}s`;

		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m`;

		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h`;

		const days = Math.floor(hours / 24);
		if (days < 7) return `${days}d`;

		return created.toLocaleDateString(undefined, { month: "short", day: "numeric" });
	};
</script>

<div class="flex cursor-pointer flex-row gap-x-3 border-b border-gray-800 px-4 py-3 transition-colors hover:bg-white/[0.03]">
	<!-- Avatar -->
	<a href="/@{postCreator?.handle}" class="flex-shrink-0">
		<img src={postCreator?.image} class="h-10 w-10 rounded-full" alt="User Avatar" />
	</a>

	<div class="min-w-0 flex-1">
		<div class="mb-0.5 flex items-center gap-1">
			<a href="/@{postCreator?.handle}" class="font-bold text-[#e7e9ea] hover:underline">{postCreator?.name}</a>
			<a href="/@{postCreator?.handle}" class="text-[#71767b] hover:underline">@{postCreator?.handle}</a>
			<span class="text-[#71767b]">·</span>
			<span class="text-[#71767b] hover:underline">{formatDate(post.createdAt ?? Date.now())}</span>
		</div>

		<a href="/post/{post.id}" class="block">
			{#if post.title}
				<div class="mb-1 font-semibold text-[#e7e9ea]">{post.title}</div>
			{/if}

			<div class="text-[15px] leading-5 break-words whitespace-pre-wrap text-[#e7e9ea]">
				{post.content}
			</div>

			{#await loadImageByPostId({ postId: post.id })}
				<div class="mt-3 h-64 w-full animate-pulse rounded-2xl border border-gray-800 bg-gray-800"></div>
			{:then imageUrl}
				{#if imageUrl}
					<img
						src={imageUrl}
						class="mt-3 max-w-full cursor-pointer rounded-2xl border border-gray-800 transition-all hover:brightness-95"
						alt="Post"
					/>
				{/if}
			{/await}
		</a>

		{#if post.rating.amount > 0}
			{@const suffix = post.rating.amount === 1 ? "" : "s"}
			<div class="mt-3 flex items-center gap-2">
				<span class="text-[13px] text-orange-400">★ {post.rating.average.toFixed(1)}</span>
				<span class="text-[13px] text-[#71767b]">({post.rating.amount} review{suffix})</span>
			</div>
		{/if}
	</div>
</div>
