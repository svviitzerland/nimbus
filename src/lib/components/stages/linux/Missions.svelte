<!--
	Mission checklist shared by the Linux stages. Each mission may carry a help action, usually
	typing its command out for you.
-->
<script lang="ts">
	import type { Mission } from './text';

	let {
		label,
		items,
		hintBtn,
		doneNote,
		disabled = false
	}: {
		label: string;
		items: Mission[];
		hintBtn: string;
		doneNote: string;
		disabled?: boolean;
	} = $props();

	const count = $derived(items.filter((m) => m.done).length);
</script>

<div class="missions">
	<div class="mhead">
		<span>{label}</span>
		<span class="count">{count}/{items.length}</span>
	</div>
	{#each items as ms, i (i)}
		<div class="mrow" class:ok={ms.done}>
			<span class="box" aria-hidden="true">
				{#if ms.done}<svg viewBox="0 0 16 16"
						><path
							d="M3.5 8.5l3 3 6-7"
							fill="none"
							stroke="currentColor"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/></svg
					>{/if}
			</span>
			<span class="mlabel">{ms.label}</span>
			{#if !ms.done && ms.help}
				<button type="button" class="chip" {disabled} onclick={ms.help}>
					<svg viewBox="0 0 12 12" aria-hidden="true"
						><path d="M3 2l6 4-6 4z" fill="currentColor" /></svg
					>{hintBtn}
				</button>
			{/if}
		</div>
	{/each}
	{#if count === items.length}<p class="mdone">{doneNote}</p>{/if}
</div>

<style>
	.missions {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 8px 10px 6px;
	}
	.mhead {
		display: flex;
		justify-content: space-between;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
		padding: 0 2px 4px;
	}
	.count {
		font-variant-numeric: tabular-nums;
	}
	.mrow {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 27px;
		font-size: 12.5px;
		font-weight: 650;
		color: var(--color-ink);
	}
	.mrow.ok {
		color: var(--color-grass);
	}
	.box {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 16px;
		height: 16px;
		border-radius: 5px;
		border: 1.5px solid var(--color-line);
	}
	.mrow.ok .box {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.box svg {
		width: 12px;
		height: 12px;
	}
	.mlabel {
		flex: 1;
		min-width: 0;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		flex: none;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
		padding: 3px 10px 3px 8px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}
	.chip svg {
		width: 9px;
		height: 9px;
		color: var(--color-brand);
	}
	.chip:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-ink);
	}
	.chip:disabled {
		opacity: 0.5;
	}
	.mdone {
		margin: 4px 0 2px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-grass);
		text-align: center;
	}
	@media (min-width: 768px) {
		.mrow {
			font-size: 13px;
		}
	}
</style>
