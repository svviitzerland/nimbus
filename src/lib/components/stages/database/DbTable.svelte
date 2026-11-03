<script lang="ts" module>
	export type Tone = '' | 'brand' | 'amber' | 'grass' | 'danger' | 'dim';
</script>

<script lang="ts">
	// A small database table card shared by the database lessons. Rows and headers can be
	// tappable (they render as buttons then), and each row or column can carry a colour tone.

	let {
		name,
		cols,
		rows,
		widths = '',
		num = [],
		empty = '',
		rowTone,
		colTone,
		onrow,
		onheader,
		headerLabel = ''
	}: {
		name: string;
		cols: string[];
		rows: (string | number)[][];
		/** CSS grid template for the columns, equal widths when empty. */
		widths?: string;
		/** Which columns hold numbers (right aligned, tabular figures). */
		num?: boolean[];
		/** Shown in place of rows when there are none. */
		empty?: string;
		rowTone?: (i: number) => Tone;
		colTone?: (j: number) => Tone;
		onrow?: (i: number) => void;
		onheader?: (j: number) => void;
		/** Accessible hint for tappable headers. */
		headerLabel?: string;
	} = $props();

	const tpl = $derived(widths || `repeat(${cols.length}, minmax(0, 1fr))`);
</script>

<div class="tbl" style="--tpl:{tpl}">
	<div class="name">{name}</div>
	<div class="row head">
		{#each cols as c, j (j)}
			{#if onheader}
				<button
					type="button"
					class="cell hbtn tone-{colTone?.(j) ?? ''}"
					class:num={num[j]}
					aria-label={headerLabel ? `${headerLabel} ${c}` : c}
					onclick={() => onheader?.(j)}>{c}</button
				>
			{:else}
				<span class="cell tone-{colTone?.(j) ?? ''}" class:num={num[j]}>{c}</span>
			{/if}
		{/each}
	</div>
	{#each rows as r, i (i)}
		{#if onrow}
			<button
				type="button"
				class="row body rbtn tone-{rowTone?.(i) ?? ''}"
				onclick={() => onrow?.(i)}
			>
				{#each r as v, j (j)}
					<span class="cell ctone-{colTone?.(j) ?? ''}" class:num={num[j]}>{v}</span>
				{/each}
			</button>
		{:else}
			<div class="row body tone-{rowTone?.(i) ?? ''}">
				{#each r as v, j (j)}
					<span class="cell ctone-{colTone?.(j) ?? ''}" class:num={num[j]}>{v}</span>
				{/each}
			</div>
		{/if}
	{/each}
	{#if !rows.length && empty}
		<p class="empty">{empty}</p>
	{/if}
</div>

<style>
	.tbl {
		width: 100%;
		min-width: 0;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 6px 18px rgba(22, 40, 60, 0.06);
		font-size: 12px;
	}
	.name {
		padding: 6px 10px;
		border-bottom: 1px solid var(--color-line);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
		background: var(--color-paper);
	}
	.row {
		display: grid;
		grid-template-columns: var(--tpl);
		width: 100%;
		text-align: left;
		transition:
			background 0.25s ease,
			opacity 0.25s ease;
	}
	.row + .row {
		border-top: 1px solid var(--color-line);
	}
	.head {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
		text-transform: lowercase;
	}
	.cell {
		min-width: 0;
		padding: 5px 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: inherit;
	}
	.body {
		color: var(--color-ink);
	}
	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.hbtn {
		font: inherit;
		text-align: inherit;
		border-radius: 0;
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.hbtn:hover {
		color: var(--color-ink);
		background: var(--color-paper);
	}
	.rbtn {
		font: inherit;
		cursor: pointer;
	}
	.rbtn:hover {
		background: var(--color-paper);
	}

	/* tones for whole rows and for header cells */
	.tone-brand {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.tone-amber {
		background: var(--color-amber-soft);
		color: var(--color-ink);
	}
	.tone-grass {
		background: var(--color-grass-soft);
		color: var(--color-ink);
	}
	.tone-danger {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.tone-dim {
		opacity: 0.35;
	}
	.head .tone-amber {
		color: var(--color-amber);
	}
	.head .tone-grass {
		color: var(--color-grass);
	}
	/* tones for body cells in a coloured column */
	.ctone-brand {
		color: var(--color-brand);
		font-weight: 700;
	}
	.ctone-amber {
		color: var(--color-amber);
		font-weight: 700;
	}
	.ctone-grass {
		color: var(--color-grass);
		font-weight: 700;
	}
	.empty {
		margin: 0;
		padding: 10px;
		text-align: center;
		color: var(--color-faint);
		font-size: 11.5px;
	}

	@media (min-width: 768px) {
		.tbl {
			font-size: 13px;
		}
		.head {
			font-size: 11.5px;
		}
		.cell {
			padding: 6px 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.row,
		.hbtn {
			transition: none;
		}
	}
</style>
