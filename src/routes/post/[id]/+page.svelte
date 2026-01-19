<script lang="ts">
	import { onMount } from "svelte";
	import { loadUserById } from "../../user.remote";
	import { loadImageByPostId } from "../../post.remote";
	import { createComment, loadCommentsByPostId } from "../../comment.remote";
	import { getRatings, upsertRating } from "../../rating.remote";
	import Rating from "$lib/components/posts/Rating.svelte";
	import { authClient } from "$lib/auth-client";
	import type { User } from "$lib/auth-client";
	import type { RatingDTO } from "$lib/dto/rating";

	let { data } = $props();

	let postCreator: User | null = $state(null);
	let commentText = $state("");
	let comments = $state(data.comments);
	let userRating = $state(0);
	let ratingChangeable = $state(false);

	const session = authClient.useSession();

	onMount(async () => {
		postCreator = await loadUserById({ userId: data.post.creatorUserId });

		if (!$session.data?.user) return;

		const ratings = await getRatings({ postId: data.post.id });
		const existingRating = ratings.find((rating: RatingDTO) => rating.userId === $session.data!.user.id);

		if (existingRating) {
			userRating = existingRating.value;
			return;
		}

		ratingChangeable = true;
	});

	const handleRatingChange = async (newValue: number) => {
		if (!$session.data?.user) return;
		await upsertRating({ postId: data.post.id, ratingValue: newValue });
		userRating = newValue;
	};

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

<div class="mx-auto max-w-3xl px-4 py-6">
	<!-- Back button -->
	<a href="/" class="mb-4 inline-flex items-center gap-2 text-orange-500 transition-colors hover:text-orange-400">
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
		Back
	</a>

	<!-- Post Detail -->
	<div class="rounded-xl border border-gray-800 bg-black">
		<div class="px-6 py-4">
			<!-- Post Header -->
			<div class="mb-4 flex items-start gap-3">
				<img src={postCreator?.image} class="h-12 w-12 rounded-full" alt="User Avatar" />
				<div class="flex-1">
					<div class="flex items-center gap-2">
						<a href="/@{postCreator?.handle}" class="font-bold text-[#e7e9ea] hover:underline">
							{postCreator?.name}
						</a>
						<a href="/@{postCreator?.handle}" class="text-[#71767b] hover:underline">
							@{postCreator?.handle}
						</a>
					</div>
					<div class="text-sm text-[#71767b]">
						{formatDate(data.post.createdAt)}
					</div>
				</div>
			</div>

			<!-- Post Content -->
			{#if data.post.title}
				<h1 class="mb-3 text-2xl font-bold text-[#e7e9ea]">{data.post.title}</h1>
			{/if}

			<p class="mb-4 text-[15px] leading-6 whitespace-pre-wrap text-[#e7e9ea]">
				{data.post.content}
			</p>

			<!-- Post Image -->
			{#await loadImageByPostId({ postId: data.post.id })}
				<div class="mb-4 h-96 w-full animate-pulse rounded-2xl border border-gray-800 bg-gray-800"></div>
			{:then imageUrl}
				{#if imageUrl}
					<img src={imageUrl} class="mb-4 w-full rounded-2xl border border-gray-800" alt="Post" />
				{/if}
			{/await}

			<!-- Rating -->
			<div class="flex items-center gap-3 border-t border-gray-800 pt-4">
				<Rating
					max={5}
					changable={!!$session.data?.user && ratingChangeable}
					bind:value={data.post.rating.average}
					onchange={handleRatingChange}
				/>
				{#if data.post.rating.amount > 0}
					{@const suffix = data.post.rating.amount === 1 ? "" : "s"}
					<span class="text-[13px] text-[#71767b]">
						{data.post.rating.amount} Rating{suffix} · Average: {data.post.rating.average.toFixed(1)}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Comments Section -->
	<div class="mt-6">
		<h2 class="mb-4 text-xl font-bold text-white">
			Comments ({comments.length})
		</h2>

		<!-- Comment Form -->
		{#if $session.data?.user}
			<form
				{...createComment}
				class="mb-6 rounded-xl border border-gray-800 bg-black p-4"
				onsubmit={() => {
					setTimeout(async () => {
						comments = await loadCommentsByPostId({ postId: data.post.id });
						commentText = "";
					}, 100);
				}}
			>
				<input {...createComment.fields.postId.as("number")} type="hidden" value={data.post.id} />
				<div class="mb-3">
					<textarea
						{...createComment.fields.content.as("text")}
						bind:value={commentText}
						placeholder="Write a comment..."
						class="w-full resize-none rounded-lg border border-gray-700 bg-zinc-900 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
						rows="3"
					></textarea>
				</div>
				<div class="flex justify-end">
					<button
						type="submit"
						disabled={!commentText.trim()}
						class="rounded-full bg-orange-500 px-6 py-2 font-bold text-black transition-all hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Post Comment
					</button>
				</div>
			</form>
		{:else}
			<div class="mb-6 rounded-xl border border-gray-800 bg-zinc-900 p-6 text-center">
				<p class="text-gray-400">Please log in to comment</p>
			</div>
		{/if}

		<!-- Comments List -->
		<div class="space-y-4">
			{#each comments as comment (comment.id)}
				<div class="rounded-xl border border-gray-800 bg-black p-4">
					<div class="mb-3 flex items-start gap-3">
						<img src={comment.user.image} class="h-10 w-10 rounded-full" alt={comment.user.name} />
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<a href="/@{comment.user.handle}" class="font-bold text-[#e7e9ea] hover:underline">
									{comment.user.name}
								</a>
								<a href="/@{comment.user.handle}" class="text-sm text-[#71767b] hover:underline">
									@{comment.user.handle}
								</a>
								<span class="text-[#71767b]">·</span>
								<span class="text-sm text-[#71767b]">{formatDate(comment.createdAt)}</span>
							</div>
						</div>
					</div>
					<p class="text-[15px] whitespace-pre-wrap text-[#e7e9ea]">
						{comment.content}
					</p>
				</div>
			{:else}
				<div class="rounded-xl border border-gray-800 bg-zinc-900 p-8 text-center">
					<p class="text-gray-400">No comments yet. Be the first to comment!</p>
				</div>
			{/each}
		</div>
	</div>
</div>
