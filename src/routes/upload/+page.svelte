<script lang="ts">
	import { createPost } from "../post.remote";
	import { Upload as UploadIcon } from "@lucide/svelte";

	let { form } = $props();

	let imageFile = $state<File | null>(null);
	let previewUrl = $state('');
	let isDragOver = $state(false);

	// File handling
	function handleFileInput(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			handleFile(file);
		}
	}

	function handleFile(file: File) {
		if (file && file.type.startsWith('image/')) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result;
				if (typeof result === 'string') {
					previewUrl = result;
				}
			};
			reader.readAsDataURL(file);
			
			// Set the file to the actual input element
			const fileInput = document.getElementById('file-input') as HTMLInputElement;
			if (fileInput) {
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(file);
				fileInput.files = dataTransfer.files;
			}
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
		const files = event.dataTransfer?.files;
		if (files && files.length) {
			handleFile(files[0]);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	function triggerFileInput() {
		document.getElementById('file-input')?.click();
	}
</script>

<div class="max-w-4xl mx-auto my-10 px-5">
	<h1 class="text-4xl font-bold mb-3 text-white">Create Post</h1>
	<p class="text-lg text-gray-300 mb-10">Share your content with the community!</p>

	<form {...createPost} class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 shadow-xl shadow-orange-500/20" enctype="multipart/form-data">
		<!-- Dish Name -->
		<div class="mb-6">
			<label for="title" class="block text-base font-semibold text-white mb-3">
				Title <span class="text-orange-500">*</span>
			</label>
			<input 
				{...createPost.fields.title.as("text")}
				id="title"
				class="w-full px-5 py-4 text-base bg-gray-700 border-2 border-gray-600 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-orange-500 focus:bg-gray-600" 
				placeholder="Enter your post title..."
				required 
			/>
		</div>

		<!-- Description -->
		<div class="mb-6">
			<label for="content" class="block text-base font-semibold text-white mb-3">
				Description <span class="text-orange-500">*</span>
			</label>
			<textarea 
				{...createPost.fields.content.as("text")}
				id="content"
				class="w-full px-5 py-4 text-base bg-gray-700 border-2 border-gray-600 rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-orange-500 focus:bg-gray-600 resize-y min-h-32 font-inherit" 
				placeholder="Describe your post content..."
				required
			></textarea>
		</div>

		<!-- Image Upload -->
		<div class="mb-6">
			<label for="file-input" class="block text-base font-semibold text-white mb-3">
				Image <span class="text-orange-500">*</span>
			</label>
			<div 
				role="button"
				tabindex="0"
				aria-label="Upload photo by clicking or drag and drop"
				class="border-3 border-dashed border-gray-600 rounded-2xl py-16 px-5 text-center bg-gray-800 cursor-pointer transition-all duration-300 relative hover:border-orange-500 hover:bg-gray-700 hover:scale-105"
				class:border-orange-500={isDragOver}
				class:bg-gray-700={isDragOver}
				class:scale-105={isDragOver}
				ondrop={handleDrop}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				onclick={triggerFileInput}
				onkeydown={(e) => e.key === 'Enter' && triggerFileInput()}
			>
				<div class="text-6xl mb-4">📸</div>
				<div class="text-lg text-gray-300 mb-3">Drop photo here or click</div>
				<div class="text-sm text-gray-400">PNG, JPG, JPEG or GIF (max. 20MB)</div>
			</div>
			<input 
				{...createPost.fields.image.as("file")}
				id="file-input" 
				accept="image/png, image/jpeg, image/jpg, image/gif" 
				class="hidden"
				onchange={handleFileInput}
				required 
			/>
			{#if previewUrl}
				<div class="mt-5">
					<img src={previewUrl} alt="Preview" class="w-full max-h-80 object-cover rounded-2xl border-3 border-orange-500" />
					<div class="mt-4 py-3 px-5 bg-gray-700 rounded-xl text-orange-500 font-semibold text-center">
						{imageFile?.name}
					</div>
				</div>
			{/if}
		</div>

		<!-- Submit Button -->
		<button type="submit" class="bg-orange-500 hover:bg-orange-600 border-none text-black py-4 px-10 font-bold text-lg rounded-full cursor-pointer w-full transition-all duration-300 mt-5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/50">
			Create Post
		</button>
	</form>
</div>