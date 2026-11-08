<!--
	The layout every guided Linux lesson shares. The lesson's own picture sits on top, the Ubuntu
	terminal under it, and the Guide panel explains the step in focus. While Nim narrates, the
	terminal types the commands by itself. On the last step it turns live and asks for one short
	command (tapping the chip types it, never required).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import LinuxTerminal from './LinuxTerminal.svelte';
	import type { LinuxShell } from './shell.svelte';
	import type { LinuxGuideText } from './text';

	let {
		tx,
		shell,
		active,
		live,
		tryCmd,
		onselect,
		art,
		accent
	}: {
		tx: LinuxGuideText;
		shell: LinuxShell;
		active: number;
		live: boolean;
		tryCmd: string;
		onselect?: (i: number) => void;
		art: Snippet<[number]>;
		accent?: string;
	} = $props();
</script>

<div class="stage">
	<Guide steps={tx.panels} {active} {onselect} {accent}>
		{#snippet visual(i: number)}
			<div class="lab">
				<div class="art">{@render art(i)}</div>
				<div class="bar">
					{#if live}
						<span class="you">{tx.tryLabel}</span>
						<button
							type="button"
							class="cmd"
							title={tx.tryTip}
							disabled={shell.typing || shell.busy}
							onclick={() => shell.typeFor(tryCmd)}>{tryCmd}</button
						>
					{:else}
						<span class="watch"><i></i>{tx.watchLabel}</span>
						<button class="cmd" type="button" onclick={() => onselect?.(tx.panels.length - 1)}
							>{tx.tryLabel}</button
						>
					{/if}
				</div>
				<LinuxTerminal {shell} {live} inputLabel={tx.inputLabel} short />
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.lab {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		gap: 8px;
	}
	.art {
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px;
	}
	.bar {
		display: flex;
		min-height: 30px;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.watch {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}
	.watch i {
		height: 7px;
		width: 7px;
		border-radius: 999px;
		background: var(--color-brand);
		animation: blink 1.4s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.25;
		}
	}
	.you {
		color: var(--color-ink);
	}
	.cmd {
		border: 1.5px solid var(--color-grass);
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 3px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
		transition: transform 0.15s;
	}
	.cmd:hover:not(:disabled) {
		transform: translateY(-1px);
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.watch i {
			animation: none;
		}
		.cmd {
			transition: none;
		}
	}
</style>
