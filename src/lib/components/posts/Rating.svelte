<script lang="ts">
	interface Props {
		max?: number;
		step?: number;
		value?: number;
		changable?: boolean;
		onchange?: (value: number) => void;
	}
	let { max = 5, step = 0.5, value = $bindable(0), changable = true, onchange }: Props = $props();

	let hoverValue: number | null = $state(null);
	let displayValue: number = $derived(hoverValue ?? value);

	const calculateRating = (event: MouseEvent & { currentTarget: EventTarget | HTMLDivElement }): number => {
		if (event.currentTarget == null) return value;

		const { left, width } = (event.currentTarget as Element).getBoundingClientRect();
		const x = event.clientX - left;

		const percent = Math.max(0, Math.min(1, x / width));

		const rawValue = percent * max;
		const snappedValue = Math.ceil(rawValue / step) * step;

		return Math.min(Math.max(snappedValue, 0), max);
	};

	const getStarFill = (index: number, currentVal: number): number => {
		const starValue = index + 1;
		if (currentVal >= starValue) return 100;
		if (currentVal < index) return 0;
		return (currentVal - index) * 100;
	};
</script>

<button
	class={["inline-flex gap-1 select-none", { "cursor-pointer": changable }]}
	role="slider"
	aria-valuemin="0"
	aria-valuemax={max}
	aria-valuenow={value}
	tabindex="0"
	onmousemove={(event) => {
		if (!changable) return;
		hoverValue = calculateRating(event);
	}}
	onmouseleave={() => {
		if (!changable) return;
		hoverValue = null;
	}}
	onclick={(event) => {
		if (!changable) return;

		const newValue = calculateRating(event);
		value = newValue;

		if (onchange) onchange(newValue);
	}}
>
	{#each Array(max) as _, i}
		<div class="relative h-[25px] w-[25px] text-gray-200">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-full w-full"
			>
				<polygon
					points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
				/>
			</svg>

			<div
				class="pointer-events-none absolute top-0 left-0 h-full overflow-hidden text-yellow-400"
				style="width: {getStarFill(i, displayValue)}%"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="none"
					class="block h-[25px] w-[25px] flex-shrink-0"
				>
					<polygon
						points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
					/>
				</svg>
			</div>
		</div>
	{/each}
</button>

<style>
	button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
