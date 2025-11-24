<script lang="ts">
	import { onMount } from "svelte";
	import { loadUserById } from "../../../routes/user.remote";
	import type { User } from "$lib/auth-client";
	import { loadImageByPostId } from "../../../routes/post.remote";

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

<div class="flex flex-row items-start gap-x-2">
	<!-- Avatar -->
	<img src={postCreator?.image} height="40px" width="40px" class="rounded-full" alt="User Avatar" />

	<!-- Post Content -->
	<div class="flex flex-col">
		<!-- Post Header -->
		<div class="flex items-center gap-x-1">
			<span class="font-bold">{postCreator?.name}</span>
			<span class="text-gray-800">@{postCreator?.handle}</span>
			<span class="text-gray-700">•</span>
			<span class="text-gray-700">{formatDate(post.createdAt ?? Date.now())}</span>
		</div>

		<!-- Post Message -->
		<div>
			<p>{post.content}</p>
			{#await loadImageByPostId({ postId: post.id }) then imageUrl}
				{#if imageUrl}
					<img src={imageUrl} height="150px" width="150px" class="mt-2 rounded-lg" />
				{/if}
			{/await}
		</div>
	</div>
</div>
