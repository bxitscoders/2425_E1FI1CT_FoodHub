<script lang="ts">
	import { createPost } from "../post.remote";
	import X from "@lucide/svelte/icons/x";
	import Image from "@lucide/svelte/icons/image";

	let { form } = $props();

	let imageFile = $state<File | null>(null);
	let previewUrl = $state("");
	let textContent = $state("");
	let titleContent = $state("");

	// File handling
	function handleFileInput(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			handleFile(file);
		}
	}

	function handleFile(file: File) {
		if (file && file.type.startsWith("image/")) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result;
				if (typeof result === "string") {
					previewUrl = result;
				}
			};
			reader.readAsDataURL(file);

			// Set the file to the actual input element
			const fileInput = document.getElementById("file-input") as HTMLInputElement;
			if (fileInput) {
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(file);
				fileInput.files = dataTransfer.files;
			}
		}
	}

	function removeImage() {
		imageFile = null;
		previewUrl = "";
		const fileInput = document.getElementById("file-input") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	}

	function triggerFileInput() {
		document.getElementById("file-input")?.click();
	}
</script>

<div class="mx-auto max-w-[600px] border-x border-gray-800">
	<form {...createPost} class="border-b border-gray-800" enctype="multipart/form-data">
		<div class="p-4">
			<!-- Title Input -->
			<input
				{...createPost.fields.title.as("text")}
				id="title"
				bind:value={titleContent}
				class="w-full resize-none border-none bg-transparent px-0 py-2 text-xl font-semibold text-[#e7e9ea] placeholder-[#71767b] focus:outline-none"
				placeholder="Title"
				required
			/>

			<!-- Content Textarea -->
			<textarea
				{...createPost.fields.content.as("text")}
				id="content"
				bind:value={textContent}
				class="min-h-[120px] w-full resize-none border-none bg-transparent px-0 py-2 text-[15px] leading-5 font-normal text-[#e7e9ea] placeholder-[#71767b] focus:outline-none"
				placeholder="What's happening?"
				required
			></textarea>

			<!-- Image Preview -->
			{#if previewUrl}
				<div class="relative mt-3 overflow-hidden rounded-2xl border border-gray-800">
					<button
						type="button"
						onclick={removeImage}
						class="absolute top-2 left-2 rounded-full bg-gray-900/75 p-1.5 text-white transition-colors hover:bg-gray-900"
					>
						<X size={18} />
					</button>
					<img src={previewUrl} alt="Preview" class="max-h-[500px] w-full object-contain" />
				</div>
			{/if}
		</div>

		<!-- Divider -->
		<div class="border-t border-gray-800"></div>

		<!-- Bottom Actions -->
		<div class="flex items-center justify-between px-4 py-3">
			<div class="flex items-center gap-1">
				<button
					type="button"
					onclick={triggerFileInput}
					class="rounded-full p-2 text-orange-400 transition-colors hover:bg-orange-400/10"
					title="Add image"
				>
					<Image size={20} />
				</button>
				<input
					{...createPost.fields.image.as("file")}
					id="file-input"
					accept="image/png, image/jpeg, image/jpg, image/gif"
					class="hidden"
					onchange={handleFileInput}
					required
				/>
			</div>

			<button
				type="submit"
				disabled={!titleContent.trim() || !textContent.trim() || !imageFile}
				class="rounded-full bg-orange-400 px-6 py-2 font-bold text-black transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-400/50"
			>
				Post
			</button>
		</div>
	</form>
</div>
