<script lang="ts">
	import { createPost } from "../post.remote";

	let { form } = $props();

	let imageFile = $state<File | null>(null);
	let previewUrl = $state("");
	let textContent = $state("");
	let titleContent = $state("");
	let categoryContent = $state("Pizza");
	let isDragging = $state(false);

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

	// Drag and drop handlers
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const files = e.dataTransfer?.files;
		if (files && files[0]) {
			handleFile(files[0]);
		}
	}
</script>

<svelte:head>
	<title>Foodhub - Essen bewerten</title>
</svelte:head>

<div class="upload-container">
	<h1 class="page-title">Bewerte dein Essen</h1>
	<p class="page-subtitle">Teile deine kulinarischen Erlebnisse mit der Community</p>

	<form {...createPost} class="upload-form" enctype="multipart/form-data">
		<!-- Title -->
		<div class="form-group">
			<label for="title" class="form-label">
				Gericht-Name <span class="required">*</span>
			</label>
			<input
				{...createPost.fields.title.as("text")}
				type="text"
				id="title"
				bind:value={titleContent}
				class="form-input"
				placeholder="z.B. Lasagne Bolognese"
				required
			/>
		</div>

		<!-- Description -->
		<div class="form-group">
			<label for="content" class="form-label">
				Beschreibung <span class="required">*</span>
			</label>
			<textarea
				{...createPost.fields.content.as("text")}
				id="content"
				bind:value={textContent}
				class="form-input"
				placeholder="Erzähle uns von deinem Gericht..."
				required
			></textarea>
		</div>

		<!-- Category -->
		<div class="form-group">
			<label for="category" class="form-label">Kategorie</label>
			<select id="category" name="category" bind:value={categoryContent} class="form-select">
				<option value="Pizza">Pizza</option>
				<option value="Burger">Burger</option>
				<option value="Vegan">Vegan</option>
				<option value="Asiatisch">Asiatisch</option>
				<option value="Desserts">Desserts</option>
				<option value="Italienisch">Italienisch</option>
				<option value="Mexikanisch">Mexikanisch</option>
				<option value="Andere">Andere</option>
			</select>
		</div>

		<!-- Image Upload -->
		<div class="form-group">
			<label class="form-label" for="drop-zone-area">Bild hochladen</label>

			{#if !previewUrl}
				<div
					id="drop-zone-area"
					class="drop-zone"
					class:dragover={isDragging}
					onclick={triggerFileInput}
					onkeydown={(e) => e.key === 'Enter' && triggerFileInput()}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					ondrop={handleDrop}
					role="button"
					tabindex="0"
				>
					<div class="drop-zone-icon">📸</div>
					<div class="drop-zone-text">Klicke hier oder ziehe ein Bild hierher</div>
					<div class="drop-zone-hint">PNG, JPG oder WEBP (max. 10MB)</div>
				</div>
			{:else}
				<div class="preview-container">
					<img src={previewUrl} alt="Preview" class="preview-image" />
					{#if imageFile}
						<div class="file-name">📄 {imageFile.name}</div>
					{/if}
					<button type="button" class="btn-remove" onclick={removeImage}>
						Bild entfernen ✕
					</button>
				</div>
			{/if}

			<input
				{...createPost.fields.image.as("file")}
				type="file"
				id="file-input"
				accept="image/*"
				onchange={handleFileInput}
				class="file-input"
			/>
		</div>

		<!-- Submit Button -->
		<button type="submit" class="btn-submit">Bewertung veröffentlichen 🚀</button>
	</form>
</div>

<style>
	:global(body) {
		background-color: #181818;
		color: #fff;
	}

	.upload-container {
		max-width: 800px;
		margin: 40px auto;
		padding: 0 20px;
	}

	.page-title {
		font-size: 32px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.page-subtitle {
		font-size: 16px;
		color: #bbb;
		margin-bottom: 40px;
	}

	.upload-form {
		background: linear-gradient(135deg, #222, #181818);
		border-radius: 15px;
		padding: 40px;
		box-shadow: 0 4px 15px rgba(255, 144, 0, 0.2);
	}

	.form-group {
		margin-bottom: 25px;
	}

	.form-label {
		display: block;
		font-size: 16px;
		font-weight: 600;
		color: #fff;
		margin-bottom: 10px;
	}

	.form-label .required {
		color: #ff9000;
	}

	.form-input {
		width: 100%;
		padding: 14px 18px;
		font-size: 16px;
		background-color: #333;
		border: 2px solid #444;
		border-radius: 10px;
		color: #fff;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.form-input:focus {
		outline: none;
		border-color: #ff9000;
		background-color: #3a3a3a;
	}

	textarea.form-input {
		resize: vertical;
		min-height: 120px;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.form-select {
		width: 100%;
		padding: 14px 18px;
		font-size: 16px;
		background-color: #333;
		border: 2px solid #444;
		border-radius: 10px;
		color: #fff;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.form-select:focus {
		outline: none;
		border-color: #ff9000;
		background-color: #3a3a3a;
	}

	.drop-zone {
		border: 3px dashed #444;
		border-radius: 15px;
		padding: 60px 20px;
		text-align: center;
		background-color: #222;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.drop-zone:hover,
	.drop-zone.dragover {
		border-color: #ff9000;
		background-color: #2a2a2a;
		transform: scale(1.02);
	}

	.drop-zone-icon {
		font-size: 60px;
		margin-bottom: 15px;
	}

	.drop-zone-text {
		font-size: 18px;
		color: #bbb;
		margin-bottom: 10px;
	}

	.drop-zone-hint {
		font-size: 14px;
		color: #999;
	}

	.file-input {
		display: none;
	}

	.preview-container {
		margin-top: 20px;
	}

	.preview-image {
		width: 100%;
		max-height: 300px;
		object-fit: cover;
		border-radius: 15px;
		border: 3px solid #ff9000;
	}

	.file-name {
		margin-top: 15px;
		padding: 12px 18px;
		background-color: #333;
		border-radius: 10px;
		color: #ff9000;
		font-weight: 600;
		text-align: center;
	}

	.btn-remove {
		margin-top: 15px;
		width: 100%;
		padding: 12px;
		background-color: #ff3333;
		color: #fff;
		border: none;
		border-radius: 10px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-remove:hover {
		background-color: #cc0000;
		transform: translateY(-2px);
	}

	.btn-submit {
		background-color: #ff9000;
		border: none;
		color: #000;
		padding: 16px 40px;
		font-weight: bold;
		font-size: 18px;
		border-radius: 30px;
		cursor: pointer;
		width: 100%;
		transition: all 0.3s ease;
		margin-top: 20px;
	}

	.btn-submit:hover {
		background-color: #e07e00;
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(255, 144, 0, 0.4);
	}

	.btn-submit:active {
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		.upload-container {
			padding: 0 15px;
		}

		.upload-form {
			padding: 25px;
		}

		.page-title {
			font-size: 26px;
		}
	}
</style>