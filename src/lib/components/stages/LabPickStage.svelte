<script lang="ts">
	// The door into the network lab. The learner picks MikroTik or Cisco, which sets the `lab`
	// choice, so the track plays that vendor's lab next. The other lab stays in the menu.
	import { path } from '$lib/path.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { LabOption, LabPickText } from '$lib/chapters/netlab/lab-pick/types';

	let { text, oncomplete, onstate }: StageProps = $props();
	const tx = $derived(text as LabPickText);
	const order: LabOption[] = ['mikrotik', 'cisco'];

	// Only a pick made here counts; the stored choice may be the silent default.
	let picked = $state<LabOption | null>(null);
	let done = false;

	function pick(o: LabOption) {
		picked = o;
		path.choose('lab', o);
		onstate?.(o);
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
</script>

<div
	class="flex h-full w-full flex-col items-center justify-center-safe gap-4 overflow-y-auto pb-28 md:pb-6"
>
	<div class="cards">
		{#each order as o (o)}
			{@const opt = tx.options[o]}
			<button type="button" class="card" class:on={picked === o} onclick={() => pick(o)}>
				{#if picked === o}<span class="tag">{tx.pickedTag}</span>{/if}
				<!-- a small router, in the shape the lab lessons draw -->
				<svg class="dev" viewBox="0 0 120 46" aria-hidden="true">
					<rect x="2" y="8" width="116" height="34" rx="6" class="body" />
					{#each [0, 1, 2, 3, 4] as i (i)}
						<rect x={14 + i * 16} y="22" width="11" height="9" rx="1.5" class="port" />
						<circle cx={19.5 + i * 16} cy="17" r="1.6" class={i < 2 ? 'led on' : 'led'} />
					{/each}
					<rect x="98" y="18" width="12" height="16" rx="2" class="port" />
					{#if o === 'cisco'}
						{#each [0, 1, 2, 3, 4, 5, 6] as i (i)}
							<rect x={36 + i * 7} y="3" width="2.4" height={5 + (i % 3) * 2} rx="1" class="bars" />
						{/each}
					{:else}
						<rect x="20" y="1" width="2.4" height="8" rx="1" class="bars" />
						<rect x="98" y="1" width="2.4" height="8" rx="1" class="bars" />
					{/if}
				</svg>
				<b class="name">{opt.name}</b>
				<span class="os">{opt.os}</span>
				<ul>
					{#each opt.points as pt (pt)}
						<li>{pt}</li>
					{/each}
				</ul>
			</button>
		{/each}
	</div>
	<p class="text-center text-[12.5px] text-faint">{picked ? tx.note : tx.hint}</p>
</div>

<style>
	.cards {
		display: grid;
		width: min(94vw, 560px);
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	@media (max-width: 460px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border: 1.5px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 20px 16px 16px;
		text-align: center;
		box-shadow: 0 6px 18px rgba(22, 40, 60, 0.06);
		transition:
			border-color 0.18s,
			transform 0.18s;
	}
	.card:hover {
		transform: translateY(-2px);
	}
	.card.on {
		border-color: var(--color-grass);
	}
	.tag {
		position: absolute;
		top: -9px;
		border-radius: 999px;
		background: var(--color-grass);
		padding: 2px 10px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #fff;
	}
	.dev {
		width: 132px;
		margin-bottom: 6px;
	}
	.body {
		fill: var(--color-paper);
		stroke: var(--color-ink);
		stroke-width: 1.6;
	}
	.port {
		fill: var(--color-line);
		stroke: var(--color-muted);
		stroke-width: 1;
	}
	.led {
		fill: var(--color-line);
	}
	.led.on {
		fill: var(--color-grass);
	}
	.bars {
		fill: var(--color-muted);
	}
	.name {
		font-family: var(--font-display);
		font-size: 19px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.os {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-grass);
	}
	ul {
		margin: 8px 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--color-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>
