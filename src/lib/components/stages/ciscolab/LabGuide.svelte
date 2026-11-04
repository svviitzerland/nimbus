<!--
	The layout every Cisco Lab stage uses, built on the shared Guide: the office drawing and the
	IOS console on one side, the calm explanation of the current step on the other. The console
	types by itself during the guided beats and takes the learner's input on the last one.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import IosTerminal from './IosTerminal.svelte';
	import type { IosShell } from './shell.svelte';
	import type { LabStep } from './text';

	let {
		steps,
		active,
		shell,
		live,
		inputLabel,
		done = false,
		doneNote = '',
		termHeight = 170,
		art
	}: {
		steps: LabStep[];
		active: number;
		shell: IosShell;
		live: boolean;
		inputLabel: string;
		done?: boolean;
		doneNote?: string;
		termHeight?: number;
		art: Snippet;
	} = $props();

	// once the learner's task is done, the last step's tag turns into the done note
	const shownSteps = $derived(
		steps.map((s, i) => (i === steps.length - 1 && done && doneNote ? { ...s, tag: doneNote } : s))
	);
</script>

<div class="lab">
	<Guide steps={shownSteps} {active} accent={done ? 'var(--color-grass)' : 'var(--color-brand)'}>
		{#snippet visual(_i: number)}
			<div class="side">
				{@render art()}
				<IosTerminal {shell} {live} {inputLabel} height={termHeight} />
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.lab {
		display: flex;
		justify-content: center;
		width: min(96vw, 900px);
		max-height: 100%;
		overflow-y: auto;
		padding: 2px 2px 9rem;
	}
	.side {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 100%;
		max-width: 430px;
	}
	@media (min-width: 768px) {
		.lab {
			padding-bottom: 9rem;
		}
	}
</style>
