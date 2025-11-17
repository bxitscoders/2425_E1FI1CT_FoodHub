<script lang="ts">
	import { createPost } from "../post.remote";


</script>

<form {...createPost} enctype="multipart/form-data">
    <label>
        <h2>Title</h2>
        <input {...createPost.fields.title.as("text")}>
    </label>

    <label>
        <h2>Content</h2>
        <textarea {...createPost.fields.content.as("text")}></textarea>
    </label>

    <input {...createPost.fields.image.as("file")}>

    <button>Post!</button>
</form>