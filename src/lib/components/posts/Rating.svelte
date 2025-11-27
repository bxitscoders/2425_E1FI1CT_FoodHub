<script lang="ts">
	import Star from "@lucide/svelte/icons/star";

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
			<Star size={25} strokeWidth={2} class="h-full w-full" />

			<div
				class="pointer-events-none absolute top-0 left-0 h-full overflow-hidden text-yellow-400"
				style="width: {getStarFill(i, displayValue)}%"
			>
				<Star size={25} fill="currentColor" strokeWidth={0} class="block h-[25px] w-[25px] flex-shrink-0" />
			</div>
		</div>
	{/each}
</button>
