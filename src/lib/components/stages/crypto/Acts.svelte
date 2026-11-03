<script lang="ts">
	// The numbered row of acts at the top of a cryptography stage (same look as KeysStage).
	let {
		names,
		current,
		done,
		label
	}: { names: string[]; current: number; done: boolean[]; label: string } = $props();
</script>

<ol class="acts" aria-label={label}>
	{#each names as name, i (i)}
		<li class:on={current === i} class:done={done[i]}>
			<span class="num">{done[i] ? '✓' : i + 1}</span>
			<span class="aname">{name}</span>
		</li>
	{/each}
</ol>

<style>
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.acts li {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 10px 3px 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		transition:
			color 0.2s,
			border-color 0.2s;
	}
	.acts li.on {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.num {
		display: inline-grid;
		place-items: center;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: var(--color-line);
		color: var(--color-muted);
		font-size: 9.5px;
		font-weight: 800;
	}
	.acts li.on .num {
		background: var(--color-brand);
		color: #fff;
	}
	.acts li.done .num {
		background: var(--color-grass);
		color: #fff;
	}
	@media (min-width: 768px) {
		.acts li {
			font-size: 12.5px;
		}
	}
</style>
