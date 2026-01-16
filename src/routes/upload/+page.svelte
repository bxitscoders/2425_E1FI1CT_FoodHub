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
	<title>Foodhub - Post erstellen</title>
	<meta name="description" content="Teile deine kulinarischen Erlebnisse mit der FoodHub Community" />
</svelte:head>

<div class="upload-container">
	<div class="header-section">
		<h1 class="page-title">📸 Neuen Post erstellen</h1>
		<p class="page-subtitle">Teile deine kulinarischen Erlebnisse mit der Community</p>
		<div class="tips-banner">
			<span class="tip-icon">💡</span>
			<span class="tip-text">
				<strong>Tipp:</strong> Gute Beleuchtung und ein nahes Foto machen dein Gericht noch appetitlicher!
			</span>
		</div>
	</div>

	<form {...createPost} class="upload-form" enctype="multipart/form-data">
		<!-- Progress Indicator -->
		<div class="progress-steps">
			<div class="step" class:active={titleContent || textContent || categoryContent !== 'Pizza'} class:completed={titleContent && textContent}>
				<div class="step-number">1</div>
				<div class="step-label">Details</div>
			</div>
			<div class="step-divider"></div>
			<div class="step" class:active={previewUrl} class:completed={previewUrl}>
				<div class="step-number">2</div>
				<div class="step-label">Bild</div>
			</div>
			<div class="step-divider"></div>
			<div class="step" class:active={titleContent && textContent && previewUrl}>
				<div class="step-number">3</div>
				<div class="step-label">Veröffentlichen</div>
			</div>
		</div>

		<!-- Title -->
		<div class="form-group">
			<label for="title" class="form-label">
				<span class="label-icon">🍽️</span>
				Gericht-Name <span class="required">*</span>
			</label>
			<input
				{...createPost.fields.title.as("text")}
				type="text"
				id="title"
				bind:value={titleContent}
				class="form-input"
				placeholder="z.B. Lasagne Bolognese, Sushi Platter, Tiramisu..."
				required
				maxlength="100"
			/>
			<div class="input-hint">
				{titleContent.length}/100 Zeichen
			</div>
		</div>

		<!-- Description -->
		<div class="form-group">
			<label for="content" class="form-label">
				<span class="label-icon">📝</span>
				Beschreibung <span class="required">*</span>
			</label>
			<textarea
				{...createPost.fields.content.as("text")}
				id="content"
				bind:value={textContent}
				class="form-input form-textarea"
				placeholder="Erzähle uns von deinem Gericht... Was hat dir besonders gut geschmeckt? Welches Restaurant? Besondere Zutaten?"
				required
				maxlength="500"
				rows="5"
			></textarea>
			<div class="input-hint">
				{textContent.length}/500 Zeichen
			</div>
		</div>

		<!-- Category -->
		<div class="form-group">
			<label for="category" class="form-label">
				<span class="label-icon">🏷️</span>
				Kategorie
			</label>
			<select id="category" name="category" bind:value={categoryContent} class="form-select">
				<option value="Pizza">🍕 Pizza</option>
				<option value="Burger">🍔 Burger</option>
				<option value="Vegan">🥗 Vegan</option>
				<option value="Asiatisch">🍜 Asiatisch</option>
				<option value="Desserts">🍰 Desserts</option>
				<option value="Italienisch">🍝 Italienisch</option>
				<option value="Mexikanisch">🌮 Mexikanisch</option>
				<option value="Andere">📋 Andere</option>
			</select>
			<div class="input-hint">
				Wähle die passende Kategorie für bessere Auffindbarkeit
			</div>
		</div>

		<!-- Image Upload -->
		<div class="form-group">
			<label class="form-label" for="drop-zone-area">
				<span class="label-icon">📷</span>
				Bild hochladen
				<span class="optional-badge">Optional</span>
			</label>

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
					aria-label="Bild hochladen"
				>
					<div class="drop-zone-icon">📸</div>
					<div class="drop-zone-text">Klicke hier oder ziehe ein Bild hierher</div>
					<div class="drop-zone-hint">PNG, JPG oder WEBP • max. 10MB</div>
					<div class="drop-zone-subhint">Bilder bekommen mehr Aufmerksamkeit! 🎯</div>
				</div>
			{:else}
				<div class="preview-container">
					<div class="preview-wrapper">
						<img src={previewUrl} alt="Vorschau deines Gerichts" class="preview-image" />
						<div class="preview-overlay">
							<span class="preview-check">✓</span>
						</div>
					</div>
					{#if imageFile}
						<div class="file-info">
							<span class="file-icon">📄</span>
							<span class="file-name">{imageFile.name}</span>
							<span class="file-size">
								({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
							</span>
						</div>
					{/if}
					<button type="button" class="btn-remove" onclick={removeImage}>
						<span class="remove-icon">🗑️</span>
						Bild entfernen
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
		<div class="submit-section">
			<div class="submit-info">
				<p class="submit-hint">
					✨ Dein Post wird sofort für alle sichtbar sein!
				</p>
			</div>
			<button 
				type="submit" 
				class="btn-submit"
				disabled={!titleContent || !textContent}
				title={!titleContent || !textContent ? 'Bitte fülle alle Pflichtfelder aus' : 'Post veröffentlichen'}
			>
				<span class="submit-icon">🚀</span>
				<span class="submit-text">Post veröffentlichen</span>
			</button>
		</div>
	</form>
</div>

<style>
	:global(body) {
		background-color: #181818;
		color: #fff;
	}

	.upload-container {
		max-width: 900px;
		margin: 40px auto 80px auto;
		padding: 0 20px;
	}

	/* Header Section */
	.header-section {
		text-align: center;
		margin-bottom: 40px;
	}

	.page-title {
		font-size: 42px;
		font-weight: bold;
		margin-bottom: 15px;
		background: linear-gradient(135deg, #ff9000, #ffb347);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.page-subtitle {
		font-size: 18px;
		color: #bbb;
		margin-bottom: 25px;
	}

	.tips-banner {
		background: rgba(255, 144, 0, 0.1);
		border: 1px solid rgba(255, 144, 0, 0.3);
		border-radius: 12px;
		padding: 15px 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		max-width: 600px;
		margin: 0 auto;
	}

	.tip-icon {
		font-size: 24px;
		flex-shrink: 0;
	}

	.tip-text {
		text-align: left;
		color: #ddd;
		font-size: 14px;
	}

	.tip-text strong {
		color: #ff9000;
	}

	/* Progress Steps */
	.progress-steps {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40px;
		padding: 0 20px;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		flex: 0 0 auto;
	}

	.step-number {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #333;
		border: 3px solid #444;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 20px;
		color: #666;
		transition: all 0.3s ease;
	}

	.step.active .step-number {
		background: rgba(255, 144, 0, 0.2);
		border-color: #ff9000;
		color: #ff9000;
	}

	.step.completed .step-number {
		background: linear-gradient(135deg, #ff9000, #e07e00);
		border-color: #ff9000;
		color: #000;
	}

	.step-label {
		font-size: 13px;
		color: #666;
		font-weight: 600;
		transition: color 0.3s ease;
	}

	.step.active .step-label,
	.step.completed .step-label {
		color: #ff9000;
	}

	.step-divider {
		flex: 1;
		height: 3px;
		background: #444;
		margin: 0 10px;
		position: relative;
		top: -20px;
	}

	.upload-form {
		background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
		border-radius: 20px;
		padding: 50px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(255, 144, 0, 0.2);
	}

	.form-group {
		margin-bottom: 30px;
	}

	.form-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		font-weight: 600;
		color: #fff;
		margin-bottom: 12px;
	}

	.label-icon {
		font-size: 20px;
	}

	.form-label .required {
		color: #ff9000;
		font-size: 18px;
	}

	.optional-badge {
		background: rgba(255, 255, 255, 0.1);
		padding: 2px 10px;
		border-radius: 12px;
		font-size: 12px;
		color: #888;
		font-weight: 500;
		margin-left: auto;
	}

	.form-input {
		width: 100%;
		padding: 16px 20px;
		font-size: 16px;
		background-color: #222;
		border: 2px solid #333;
		border-radius: 12px;
		color: #fff;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.form-input:focus {
		outline: none;
		border-color: #ff9000;
		background-color: #2a2a2a;
		box-shadow: 0 0 0 3px rgba(255, 144, 0, 0.1);
	}

	.form-textarea {
		resize: vertical;
		min-height: 120px;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		line-height: 1.6;
	}

	.input-hint {
		font-size: 13px;
		color: #888;
		margin-top: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.form-select {
		width: 100%;
		padding: 16px 20px;
		font-size: 16px;
		background-color: #222;
		border: 2px solid #333;
		border-radius: 12px;
		color: #fff;
		cursor: pointer;
		transition: all 0.3s ease;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff9000' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 20px center;
		padding-right: 50px;
	}

	.form-select:focus {
		outline: none;
		border-color: #ff9000;
		background-color: #2a2a2a;
		box-shadow: 0 0 0 3px rgba(255, 144, 0, 0.1);
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

	.drop-zone:hover {
		border-color: #ff9000;
		background-color: rgba(255, 144, 0, 0.05);
	}

	.drop-zone.dragover {
		border-color: #ff9000;
		background-color: rgba(255, 144, 0, 0.15);
		transform: scale(1.02);
	}

	.drop-zone-icon {
		font-size: 64px;
		margin-bottom: 20px;
		animation: float 3s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.drop-zone-text {
		font-size: 18px;
		font-weight: 600;
		color: #fff;
		margin-bottom: 8px;
	}

	.drop-zone-hint {
		font-size: 14px;
		color: #888;
		margin-bottom: 5px;
	}

	.drop-zone-subhint {
		font-size: 13px;
		color: #ff9000;
		margin-top: 10px;
	}

	/* Preview Container */
	.preview-container {
		background: #222;
		border-radius: 15px;
		padding: 25px;
		border: 2px solid #333;
	}

	.preview-wrapper {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 20px;
	}

	.preview-image {
		width: 100%;
		height: auto;
		max-height: 500px;
		object-fit: cover;
		display: block;
		border-radius: 12px;
	}

	.preview-overlay {
		position: absolute;
		top: 15px;
		right: 15px;
		background: rgba(0, 255, 0, 0.9);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: checkPop 0.4s ease;
	}

	@keyframes checkPop {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	.preview-check {
		color: #fff;
		font-size: 24px;
		font-weight: bold;
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		margin-bottom: 15px;
	}

	.file-icon {
		font-size: 20px;
	}

	.file-name {
		flex: 1;
		color: #fff;
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.file-size {
		color: #888;
		font-size: 13px;
	}

	.btn-remove {
		width: 100%;
		padding: 12px;
		background: rgba(255, 51, 51, 0.1);
		border: 2px solid rgba(255, 51, 51, 0.3);
		color: #ff6666;
		border-radius: 10px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.btn-remove:hover {
		background: rgba(255, 51, 51, 0.2);
		border-color: #ff3333;
		transform: translateY(-2px);
	}

	.remove-icon {
		font-size: 18px;
	}

	.file-input {
		display: none;
	}

	/* Submit Section */
	.submit-section {
		margin-top: 40px;
		padding-top: 30px;
		border-top: 2px solid #333;
	}

	.submit-info {
		text-align: center;
		margin-bottom: 20px;
	}

	.submit-hint {
		color: #aaa;
		font-size: 14px;
		margin: 0;
	}

	.btn-submit {
		width: 100%;
		padding: 18px;
		background: linear-gradient(135deg, #ff9000, #e07e00);
		border: none;
		color: #000;
		font-size: 18px;
		font-weight: bold;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		box-shadow: 0 5px 20px rgba(255, 144, 0, 0.4);
	}

	.btn-submit:hover:not(:disabled) {
		background: linear-gradient(135deg, #e07e00, #ff9000);
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(255, 144, 0, 0.6);
	}

	.btn-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	.submit-icon {
		font-size: 24px;
	}

	.submit-text {
		font-size: 18px;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.upload-form {
			padding: 30px 20px;
		}

		.page-title {
			font-size: 32px;
		}

		.progress-steps {
			padding: 0 10px;
		}

		.step-number {
			width: 40px;
			height: 40px;
			font-size: 16px;
		}

		.step-label {
			font-size: 11px;
		}

		.step-divider {
			margin: 0 5px;
		}

		.drop-zone {
			padding: 40px 15px;
		}

		.drop-zone-icon {
			font-size: 48px;
		}

		.tips-banner {
			flex-direction: column;
			text-align: center;
		}

		.tip-text {
			text-align: center;
		}
	}
</style>
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