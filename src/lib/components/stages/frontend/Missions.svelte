<script lang="ts">
	// A short checklist of missions, the current one outlined, finished ones ticked green.
	let {
		label,
		items
	}: {
		label: string;
		items: { id: string; text: string; done: boolean }[];
	} = $props();
	const current = $derived(items.find((i) => !i.done)?.id);
</script>

<div class="missions">
	<p class="cap">{label}</p>
	<ul aria-label={label}>
		{#each items as m (m.id)}
			<li class:ok={m.done} class:cur={current === m.id}>
				<span class="dot" aria-hidden="true">
					{#if m.done}
						<svg viewBox="0 0 16 16"
							><path
								d="M3.5 8.5l3 3 6-6.5"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						>
					{/if}
				</span>
				<span>{m.text}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.missions {
		width: 100%;
		max-width: 520px;
	}
	.cap {
		margin: 0 0 6px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		padding: 6px 9px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.3;
		transition:
			border-color 0.25s ease,
			background 0.25s ease,
			color 0.25s ease;
	}
	li.cur {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	li.ok {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.dot {
		flex: none;
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
	}
	.cur .dot {
		border-color: var(--color-brand);
	}
	.ok .dot {
		border-color: var(--color-grass);
		background: var(--color-grass);
		color: #fff;
	}
	.dot svg {
		width: 11px;
		height: 11px;
	}
	@media (prefers-reduced-motion: reduce) {
		li {
			transition: none;
		}
	}
</style>
