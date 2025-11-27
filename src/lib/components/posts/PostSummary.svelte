<script lang="ts">
	import { onMount } from "svelte";
	import { loadUserById } from "../../../routes/user.remote";
	import type { User } from "$lib/auth-client";
	import { loadImageByPostId } from "../../../routes/post.remote";
	import Rating from "./Rating.svelte";

	let { post }: { post: PostDTO } = $props();
	let postCreator = $state<User | null>(null);

	onMount(async () => (postCreator = await loadUserById({ userId: post.creatorUserId })));

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

<div class="flex flex-col gap-y-2 p-2">
	<div class="flex flex-row items-start gap-x-2">
		<!-- Avatar -->
		<img src={postCreator?.image} height="50px" width="50px" class="shrink-0 rounded-full" alt="User Avatar" />

		<div class="flex flex-col">
			<div>
				<span class="font-bold">{postCreator?.name}</span>
				<span class="text-gray-800">@{postCreator?.handle}</span>
				<span class="text-gray-700">•</span>
				<span class="text-gray-700">{formatDate(post.createdAt ?? Date.now())}</span>
			</div>

			<div>{post.title}</div>
		</div>
	</div>

	<span>{post.content}</span>

	{#await loadImageByPostId({ postId: post.id }) then imageUrl}
		{#if imageUrl}
			<img src={imageUrl} height="150px" width="150px" class="mt-2 rounded-lg" />
		{/if}
	{/await}

	<div class="mt-2 flex gap-x-2">
		<Rating max={5} changable={false} value={post.rating.average} />

		{#if post.rating.amount > 0}
			{@const suffix = post.rating.amount === 1 ? "" : "s"}
			<span class="ml-2 text-gray-600 italic">({post.rating.amount} Rating{suffix})</span>
		{/if}
	</div>
</div>
