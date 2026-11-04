<script lang="ts">
	// A guided "watch" stage. The same tiny job writes itself in machine code, then C, then
	// Python, stacked from the machine at the bottom to people at the top, next to a CPU chip
	// that only eats 0 and 1. Then a toolbox shows which language fits which job. The only
	// optional play is on the last beat, tapping a version to watch it write itself again.
	import { untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { JobId, LangId, LanguagesText } from '$lib/chapters/basics/languages/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as LanguagesText);

	// Which scene each beat shows (ten beats, seven scenes).
	const SCENE_OF_BEAT = [0, 0, 1, 1, 2, 3, 4, 4, 5, 6];
	// Top to bottom, people first and the machine last.
	const STACK: LangId[] = ['python', 'c', 'machine'];
	// The scene where each version first appears.
	const APPEAR: Record<LangId, number> = { machine: 0, c: 1, python: 2 };
	// Real code. Machine code is the x86 bytes for "put 2 in a register, add 3, return".
	const CODE: Record<LangId, string[]> = {
		machine: [
			'10111000 00000010 00000000',
			'00000000 00000000 10000011',
			'11000000 00000011 11000011'
		],
		c: [
			'#include <stdio.h>',
			'',
			'int main(void) {',
			'    printf("%d\\n", 2 + 3);',
			'    return 0;',
			'}'
		],
		python: ['print(2 + 3)']
	};
	const TOTAL: Record<LangId, number> = {
		machine: CODE.machine.join('\n').length,
		c: CODE.c.join('\n').length,
		python: CODE.python.join('\n').length
	};
	const JOBS: { id: JobId; color: string }[] = [
		{ id: 'data', color: 'var(--color-grass)' },
		{ id: 'web', color: 'var(--color-brand)' },
		{ id: 'speed', color: 'var(--color-amber)' },
		{ id: 'phone', color: 'var(--color-ink)' }
	];

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let typed = $state<Record<LangId, number>>({ machine: 0, c: 0, python: 0 });
	const timers: Partial<Record<LangId, ReturnType<typeof setInterval>>> = {};
	const started = new Set<LangId>();

	const sceneFromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(peek ?? sceneFromBeat);
	const codeView = $derived(scene <= 3 || scene === 6);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});
	$effect(() => () => Object.values(timers).forEach((t) => clearInterval(t)));

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	/** Write one version out, a few characters at a time. */
	function write(l: LangId) {
		clearInterval(timers[l]);
		if (reduced) {
			typed[l] = TOTAL[l];
			return;
		}
		typed[l] = 0;
		const step = Math.max(1, Math.ceil(TOTAL[l] / 40));
		timers[l] = setInterval(() => {
			typed[l] = Math.min(TOTAL[l], typed[l] + step);
			if (typed[l] >= TOTAL[l]) clearInterval(timers[l]);
		}, 45);
	}

	// Each version writes itself the first time its scene comes up.
	$effect(() => {
		const sc = scene;
		untrack(() => {
			for (const l of STACK) {
				if (APPEAR[l] <= sc && !started.has(l)) {
					started.add(l);
					write(l);
				}
			}
		});
	});

	/** The visible part of each line while a version is still being written. */
	function visibleLines(l: LangId): string[] {
		let left = typed[l];
		return CODE[l].map((line) => {
			const part = line.slice(0, Math.max(0, left));
			left -= line.length + 1;
			return part;
		});
	}

	function replay(l: LangId) {
		write(l);
		onstate?.(l);
	}
</script>

{#snippet jobIcon(id: JobId)}
	<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" class="icon">
		{#if id === 'data'}
			<path d="M6 6 V34 H35" class="ln" />
			<rect x="10" y="22" width="5" height="10" rx="1" class="fill" />
			<rect x="18" y="15" width="5" height="17" rx="1" class="fill" />
			<rect x="26" y="9" width="5" height="23" rx="1" class="fill" />
		{:else if id === 'web'}
			<rect x="4" y="7" width="32" height="26" rx="4" class="ln" />
			<path d="M4 13 H36" class="ln" />
			<circle cx="8.5" cy="10" r="1.2" class="fill" />
			<circle cx="12.5" cy="10" r="1.2" class="fill" />
			<rect x="12" y="20" width="16" height="7" rx="3.5" class="fill" />
		{:else if id === 'speed'}
			<path d="M7 28 A13 13 0 0 1 33 28" class="ln" />
			<path d="M20 28 L28 17" class="ln" />
			<circle cx="20" cy="28" r="2.4" class="fill" />
		{:else}
			<rect x="11" y="4" width="18" height="32" rx="4" class="ln" />
			<path d="M17 8 H23" class="ln" />
			<circle cx="20" cy="31" r="1.4" class="fill" />
		{/if}
	</svg>
{/snippet}

{#snippet cpu()}
	<div class="cpu-wrap">
		<svg viewBox="0 0 160 70" class="cpu" aria-hidden="true">
			{#if !reduced}
				<g class="bits">
					<text x="66" y="12">1</text>
					<text x="80" y="12">0</text>
					<text x="94" y="12">1</text>
				</g>
			{/if}
			{#each [0, 1, 2, 3, 4] as p (p)}
				<rect x={56 + p * 10} y="16" width="3" height="6" class="pin" />
				<rect x={56 + p * 10} y="62" width="3" height="6" class="pin" />
			{/each}
			<rect x="48" y="22" width="64" height="40" rx="6" class="chip" />
			<rect x="58" y="30" width="44" height="24" rx="3" class="die" />
			<text x="80" y="46" class="cpu-label">{tx.cpu}</text>
		</svg>
	</div>
{/snippet}

{#snippet codeStack(i: number)}
	<div class="code-view">
		<p class="task">{tx.taskLabel}</p>
		<div class="ladder" class:meter={i >= 3}>
			{#if i >= 3}
				<div class="bar" in:fade={{ duration: 400 }} aria-hidden="true"></div>
				<p class="end top" in:fade={{ duration: 400 }}>{tx.people}</p>
			{/if}
			{#each STACK as l (l)}
				{#if APPEAR[l] <= i}
					<button
						type="button"
						class="win {l}"
						class:tap={i === 6}
						disabled={i !== 6}
						onclick={() => replay(l)}
						in:fly={{ y: -10, duration: reduced ? 0 : 450 }}
					>
						<span class="head">
							<b>{tx.langs[l].name}</b>
							<span>{tx.langs[l].sub}</span>
						</span>
						<span class="body">
							{#each visibleLines(l) as line, n (n)}
								<span class="line">{line}</span>
							{/each}
						</span>
					</button>
				{/if}
			{/each}
			{#if i >= 3}
				<p class="end bottom" in:fade={{ duration: 400 }}>{tx.machine}</p>
			{/if}
		</div>
		{@render cpu()}
	</div>
{/snippet}

{#snippet toolbox(i: number)}
	<div class="toolbox">
		<div class="grid">
			{#each JOBS as j, n (j.id)}
				<div
					class="job"
					style="--c:{j.color}"
					in:fly={{ y: 10, duration: reduced ? 0 : 400, delay: reduced ? 0 : n * 450 }}
				>
					{@render jobIcon(j.id)}
					<b>{tx.jobs[j.id].lang}</b>
					<span>{tx.jobs[j.id].job}</span>
				</div>
			{/each}
		</div>
		{#if i === 5}
			<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(k) => (peek = k)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if codeView}
					<div class="fill-w" in:fade={{ duration: 300 }}>{@render codeStack(i)}</div>
				{:else}
					<div class="fill-w" in:fade={{ duration: 300 }}>{@render toolbox(i)}</div>
				{/if}
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
	.visual,
	.fill-w {
		width: 100%;
		max-width: 440px;
	}
	.code-view {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 8px;
	}
	.task {
		margin: 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.ladder {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.ladder.meter {
		padding-left: 18px;
	}
	.bar {
		position: absolute;
		top: 4px;
		bottom: 4px;
		left: 4px;
		width: 4px;
		border-radius: 999px;
		background: linear-gradient(var(--color-grass), var(--color-amber));
	}
	.end {
		margin: 0;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.end.top {
		color: var(--color-grass);
	}
	.end.bottom {
		color: var(--color-amber);
	}
	.win {
		display: flex;
		flex-direction: column;
		gap: 6px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 10px 12px;
		text-align: left;
		transition:
			border-color 0.2s,
			transform 0.15s;
	}
	.win:disabled {
		cursor: default;
		opacity: 1;
	}
	.win.tap:hover {
		border-color: var(--color-brand);
		transform: translateY(-1px);
	}
	.head {
		display: flex;
		align-items: baseline;
		gap: 8px;
		font-size: 13px;
		color: var(--color-ink);
	}
	.head span {
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.body {
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		background: var(--color-paper);
		padding: 8px 10px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-ink);
	}
	.machine .body {
		font-size: 11px;
		letter-spacing: 0.02em;
		color: var(--color-muted);
	}
	.line {
		min-height: 1.5em;
		white-space: pre;
		overflow: hidden;
	}
	.cpu-wrap {
		display: flex;
		justify-content: center;
	}
	.cpu {
		width: 160px;
		height: auto;
	}
	.chip {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.die {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.2;
	}
	.pin {
		fill: var(--color-faint);
	}
	.cpu-label {
		fill: var(--color-paper);
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-anchor: middle;
	}
	.bits text {
		fill: var(--color-amber);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
		animation: drop 1.8s ease-in infinite;
	}
	.bits text:nth-child(2) {
		animation-delay: 0.6s;
	}
	.bits text:nth-child(3) {
		animation-delay: 1.2s;
	}
	@keyframes drop {
		0% {
			opacity: 0;
			transform: translateY(-6px);
		}
		40% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	/* toolbox */
	.toolbox {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.job {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 14px;
	}
	.job b {
		margin-top: 4px;
		font-size: 15px;
		color: var(--color-ink);
	}
	.job span {
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--color-muted);
	}
	.icon .ln {
		fill: none;
		stroke: var(--c);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.icon .fill {
		fill: var(--c);
		opacity: 0.8;
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.win {
			transition: none;
		}
	}
</style>
