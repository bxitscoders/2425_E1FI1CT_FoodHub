<script lang="ts">
	import { page } from "$app/state";
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="flex flex-col items-center justify-center text-center md:flex-row md:gap-x-4 md:text-left">
		<span class="text-text/85 text-[8rem] font-extrabold">
			{page.status}
		</span>
		<div class="flex flex-col md:gap-y-2">
			<span class="text-lg font-semibold md:text-2xl">Something went wrong</span>
			<span class="text-text/65">{page.error?.message}</span>
		</div>
	</div>
</div>
