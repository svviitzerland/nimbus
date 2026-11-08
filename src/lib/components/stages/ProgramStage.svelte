<script lang="ts">
	import { onDestroy } from 'svelte';
	import Nim from '$lib/components/Nim.svelte';
	import type { LessonText, Mood } from '$lib/chapters/types';
	import type { ProgramText, TeaStepId } from '$lib/chapters/basics/program/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as ProgramText);

	type Outcome = 'spill' | 'empty' | 'plain' | 'cold' | 'tea';
	type Kitchen = {
		cup: boolean;
		hot: boolean;
		bagIn: boolean;
		bagTable: boolean;
		water: 'none' | 'cold' | 'hot';
		spilled: boolean;
		stirring: boolean;
	};

	const ALL: TeaStepId[] = ['cup', 'boil', 'bag', 'pour', 'stir'];
	// Nim's first try forgets to boil the water, so the very first run makes cold tea.
	const STARTER: TeaStepId[] = ['cup', 'bag', 'pour', 'stir'];

	const fresh = (): Kitchen => ({
		cup: false,
		hot: false,
		bagIn: false,
		bagTable: false,
		water: 'none',
		spilled: false,
		stirring: false
	});

	let steps = $state<TeaStepId[]>([...STARTER]);
	let k = $state<Kitchen>(fresh());
	let line = $state(-1); // the line being run right now
	let running = $state(false);
	let outcome = $state<Outcome | null>(null);
	let timers: ReturnType<typeof setTimeout>[] = [];
	let completed = false;

	const palette = $derived(ALL.filter((s) => !steps.includes(s)));

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	/** Do exactly what one line says, nothing more. Returns false if the run has to stop. */
	function apply(s: TeaStepId): boolean {
		if (s === 'cup') k.cup = true;
		else if (s === 'boil') k.hot = true;
		else if (s === 'bag') {
			if (k.cup) k.bagIn = true;
			else k.bagTable = true;
		} else if (s === 'pour') {
			if (!k.cup) {
				k.spilled = true;
				return false;
			}
			k.water = k.hot ? 'hot' : 'cold';
		} else if (s === 'stir') {
			k.stirring = true;
			timers.push(setTimeout(() => (k.stirring = false), 600));
		}
		return true;
	}

	function judge(): Outcome {
		if (k.spilled) return 'spill';
		if (k.water === 'none') return 'empty';
		if (!k.bagIn) return 'plain';
		if (k.water === 'cold') return 'cold';
		return 'tea';
	}

	function run() {
		if (running || steps.length === 0) return;
		clearTimers();
		k = fresh();
		outcome = null;
		running = true;
		const gap = reduced() ? 320 : 820;
		const program = [...steps];
		let i = 0;
		const tick = () => {
			line = i;
			const ok = apply(program[i]);
			i += 1;
			if (ok && i < program.length) {
				timers.push(setTimeout(tick, gap));
				return;
			}
			timers.push(
				setTimeout(() => {
					finish();
				}, gap)
			);
		};
		timers.push(setTimeout(tick, 200));
	}

	function finish() {
		running = false;
		line = -1;
		const o = judge();
		outcome = o;
		onstate?.(o);
		if (o === 'tea' && !completed) {
			completed = true;
			oncomplete?.();
		}
	}

	function edited() {
		// Any change to the steps clears the last result, the kitchen waits for a new run.
		outcome = null;
		k = fresh();
	}
	function add(s: TeaStepId) {
		if (running) return;
		steps.push(s);
		edited();
	}
	function remove(i: number) {
		if (running) return;
		steps.splice(i, 1);
		edited();
	}
	function move(i: number, d: -1 | 1) {
		const j = i + d;
		if (running || j < 0 || j >= steps.length) return;
		const t = steps[i];
		steps[i] = steps[j];
		steps[j] = t;
		edited();
	}
	function reset() {
		clearTimers();
		running = false;
		line = -1;
		steps = [...STARTER];
		edited();
	}

	const note = $derived(
		running && line >= 0
			? tx.noteLine.replace('{n}', String(line + 1))
			: outcome
				? tx.notes[outcome]
				: tx.noteIdle
	);
	const nimMood = $derived<Mood>(
		running
			? 'thinking'
			: outcome === 'tea'
				? 'excited'
				: outcome === 'spill'
					? 'surprised'
					: outcome
						? 'worried'
						: 'calm'
	);
	// The drink in the cup: tea gets darker when hot, plain water is a pale blue.
	const liquid = $derived(
		k.water === 'none' ? '' : k.bagIn ? (k.water === 'hot' ? 'tea' : 'weak') : 'water'
	);

	onDestroy(clearTimers);
</script>

{#snippet icon(kind: 'up' | 'down' | 'x')}
	<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
		{#if kind === 'x'}
			<path
				d="M4.5 4.5l7 7M11.5 4.5l-7 7"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
			/>
		{:else}
			<path
				d={kind === 'up' ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'}
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{/if}
	</svg>
{/snippet}

<div class="wrap">
	<div class="acts">
		<button type="button" class="cta" onclick={run} disabled={running || steps.length === 0}>
			{running ? tx.running : tx.run}
		</button>
		<button type="button" class="line-btn" onclick={reset} disabled={running}>{tx.reset}</button>
	</div>

	<div class="grid">
		<!-- The kitchen, where Nim follows the program literally -->
		<div
			class="kitchen"
			class:good={outcome === 'tea'}
			class:bad={outcome !== null && outcome !== 'tea'}
		>
			<div class="nim"><Nim mood={nimMood} size={42} /></div>
			<svg viewBox="0 0 240 120" class="scene" aria-hidden="true">
				<!-- shelf where the cup waits -->
				<rect x="150" y="30" width="70" height="4" rx="2" class="shelf" />
				<!-- table -->
				<rect x="8" y="98" width="224" height="6" rx="3" class="table" />

				<!-- kettle -->
				<g transform="translate(40 58)">
					<path d="M4 40 L8 12 Q20 4 32 12 L36 40 Z" class="kettle" class:hot={k.hot} />
					<path d="M36 18 Q48 20 46 32" fill="none" class="kettle-line" stroke-width="3" />
					<path d="M4 18 L-8 10" class="kettle-line" stroke-width="3" stroke-linecap="round" />
					<rect x="14" y="4" width="12" height="4" rx="2" class="kettle" class:hot={k.hot} />
					{#if k.hot}
						<g class="steam">
							<path d="M-10 4 Q-14 -4 -10 -12" />
							<path d="M-4 2 Q-8 -8 -4 -16" />
						</g>
					{/if}
				</g>

				<!-- puddle and stray teabag on the table -->
				{#if k.spilled}
					<ellipse cx="170" cy="98" rx="38" ry="5" class="puddle" />
					<circle cx="128" cy="92" r="2.5" class="drop" />
					<circle cx="206" cy="90" r="2" class="drop" />
				{/if}
				{#if k.bagTable}
					<g transform="translate(108 86)">
						<rect width="12" height="12" rx="2" class="bag" />
						<path d="M6 0 L4 -8" class="string" />
					</g>
				{/if}

				<!-- the cup, on the shelf until a line takes it down -->
				<g class="cup" class:down={k.cup}>
					<g class:stir={k.stirring}>
						{#if liquid}
							<path d="M3.5 10 L32.5 10 L31 35 L5 35 Z" class="drink {liquid}" />
						{/if}
						{#if k.bagIn}
							<rect x="20" y="14" width="10" height="11" rx="2" class="bag" />
							<path d="M25 14 L28 -4" class="string" />
						{/if}
					</g>
					<path d="M2 2 L34 2 L31 36 L5 36 Z" class="cup-body" />
					<path d="M34 8 Q46 10 44 20 Q42 28 32 26" fill="none" class="cup-body" />
					{#if k.water === 'hot'}
						<g class="steam small">
							<path d="M12 -4 Q9 -10 12 -16" />
							<path d="M22 -4 Q19 -12 22 -18" />
						</g>
					{/if}
				</g>
				<text x="185" y="44" class="tag" text-anchor="middle">{k.cup ? '' : tx.cupTag}</text>
				<text x="120" y="116" class="tag" text-anchor="middle">{tx.tableTag}</text>
			</svg>
			<p class="note" role="status">{note}</p>
		</div>

		<div class="code">
			<p class="cap">{tx.programLabel}</p>
			<ol class="prog">
				{#each steps as s, i (s)}
					<li class:cur={line === i} class:dimmed={running && line !== i}>
						<span class="num">{i + 1}</span>
						<span class="txt">{tx.steps[s]}</span>
						<span class="tools">
							<button
								type="button"
								aria-label={tx.moveUp}
								title={tx.moveUp}
								disabled={running || i === 0}
								onclick={() => move(i, -1)}>{@render icon('up')}</button
							>
							<button
								type="button"
								aria-label={tx.moveDown}
								title={tx.moveDown}
								disabled={running || i === steps.length - 1}
								onclick={() => move(i, 1)}>{@render icon('down')}</button
							>
							<button
								type="button"
								aria-label={tx.remove}
								title={tx.remove}
								disabled={running}
								onclick={() => remove(i)}>{@render icon('x')}</button
							>
						</span>
					</li>
				{:else}
					<li class="empty">{tx.emptyProgram}</li>
				{/each}
			</ol>

			{#if palette.length}
				<p class="cap sub">{tx.paletteLabel}</p>
				<div class="chips">
					{#each palette as s (s)}
						<button type="button" class="chip" disabled={running} onclick={() => add(s)}>
							+ {tx.steps[s]}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 680px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 18px;
		font-size: 13px;
		font-weight: 600;
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line-btn {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 9px 16px;
		font-size: 13px;
		font-weight: 600;
	}
	.line-btn:enabled:hover {
		border-color: var(--color-ink);
	}
	.cta:disabled,
	.line-btn:disabled {
		opacity: 0.55;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		width: 100%;
		max-width: 400px;
	}
	@media (min-width: 768px) {
		.grid {
			grid-template-columns: 1fr 1fr;
			max-width: 680px;
		}
	}

	.kitchen {
		position: relative;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 10px 8px;
		transition: border-color 0.3s ease;
	}
	.kitchen.good {
		border-color: var(--color-grass);
	}
	.kitchen.bad {
		border-color: var(--color-amber);
	}
	.nim {
		position: absolute;
		top: 8px;
		left: 10px;
	}
	.scene {
		display: block;
		width: 100%;
		height: auto;
	}
	.shelf,
	.table {
		fill: var(--color-line);
	}
	.kettle {
		fill: var(--color-faint);
		transition: fill 0.4s ease;
	}
	.kettle.hot {
		fill: var(--color-danger);
	}
	.kettle-line {
		stroke: var(--color-faint);
	}
	.steam path {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		animation: rise 1.6s ease-in-out infinite;
	}
	.steam path:nth-child(2) {
		animation-delay: 0.5s;
	}
	@keyframes rise {
		0% {
			opacity: 0;
			transform: translateY(4px);
		}
		50% {
			opacity: 0.9;
		}
		100% {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
	.cup {
		transform: translate(169px, 5px) scale(0.7);
		transition: transform 0.55s cubic-bezier(0.3, 0.8, 0.3, 1);
	}
	.cup.down {
		transform: translate(150px, 62px) scale(1);
	}
	.cup-body {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2.4;
		stroke-linejoin: round;
	}
	.drink {
		transition: fill 0.4s ease;
	}
	.drink.water {
		fill: color-mix(in srgb, var(--color-brand) 28%, transparent);
	}
	.drink.weak {
		fill: color-mix(in srgb, var(--color-amber) 40%, transparent);
	}
	.drink.tea {
		fill: color-mix(in srgb, var(--color-amber) 80%, var(--color-danger));
	}
	.bag {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.string {
		stroke: var(--color-faint);
		stroke-width: 1.2;
		fill: none;
	}
	.puddle {
		fill: color-mix(in srgb, var(--color-brand) 30%, transparent);
	}
	.drop {
		fill: color-mix(in srgb, var(--color-brand) 45%, transparent);
	}
	.stir {
		animation: swirl 0.6s ease-in-out;
		transform-origin: 18px 20px;
	}
	@keyframes swirl {
		0%,
		100% {
			transform: rotate(0deg);
		}
		33% {
			transform: rotate(-6deg);
		}
		66% {
			transform: rotate(6deg);
		}
	}
	.tag {
		font-size: 9px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.note {
		margin: 4px 0 0;
		min-height: 1.4em;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.good .note {
		color: var(--color-grass);
	}

	.code {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.cap {
		margin: 0;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.cap.sub {
		margin-top: 6px;
	}
	.prog {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.prog li {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 6px 6px 8px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 13px;
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			opacity 0.2s ease;
	}
	.prog li.cur {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.prog li.dimmed {
		opacity: 0.55;
	}
	.prog li.empty {
		justify-content: center;
		color: var(--color-faint);
		font-size: 12px;
	}
	.num {
		flex: none;
		width: 20px;
		text-align: right;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		color: var(--color-faint);
	}
	.txt {
		flex: 1;
		min-width: 0;
	}
	.tools {
		display: flex;
		gap: 2px;
	}
	.tools button {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 7px;
		color: var(--color-muted);
	}
	.tools button:enabled:hover {
		background: var(--color-paper);
		color: var(--color-ink);
	}
	.tools button:disabled {
		opacity: 0.3;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip {
		border-radius: 999px;
		border: 1px solid var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
		padding: 6px 12px;
		font-size: 12.5px;
		font-weight: 600;
		transition: transform 0.15s ease;
	}
	.chip:active {
		transform: scale(0.96);
	}
	.chip:disabled {
		opacity: 0.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.cup,
		.drink,
		.kettle,
		.prog li {
			transition: none;
		}
		.steam path,
		.stir {
			animation: none;
		}
	}
</style>
